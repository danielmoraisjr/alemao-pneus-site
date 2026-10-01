// Hero 3D da Israel Impermeabilizações.
// A logo (casa + arco) vira um objeto 3D. Um domo de vidro representa a
// impermeabilização: a chuva bate nele, faz ondas e escorre para fora.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, ExtrudeGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, ShaderMaterial, SphereGeometry, PlaneGeometry,
  InstancedMesh, BufferGeometry, BufferAttribute, Points, Color, Vector3, AdditiveBlending,
  DoubleSide, BackSide, PMREMGenerator, DirectionalLight, PointLight, CatmullRomCurve3,
  CanvasTexture, Vector4, SRGBColorSpace, NeutralToneMapping, DynamicDrawUsage, TorusGeometry,
} from 'three';
import { PARTS, SWOOSH_A, SWOOSH_B } from './logo-data.js';

const host = document.querySelector('[data-hero3d]');
if (host) boot(host);

function boot(host) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = () => host.clientWidth < 560;

  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return; // sem WebGL: fica o poster em SVG
  }
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  const FOV_T = Math.tan((32 * Math.PI) / 360);

  // ---------- ambiente (reflexos do verniz) ----------
  scene.environment = makeEnv(renderer);

  // ---------- luzes ----------
  const key = new DirectionalLight(0xffffff, 1.5);
  key.position.set(3, 6, 8);
  scene.add(key);
  const rim = new PointLight(0x19b8ff, 60, 22, 1.6);
  rim.position.set(-5, 2, -3);
  scene.add(rim);
  const fill = new PointLight(0x7fe3ff, 28, 18, 1.6);
  fill.position.set(4, -2, 5);
  scene.add(fill);

  // ---------- a logo em 3D ----------
  const S = 0.032, CX = 113, CY = 90;
  const toW = ([x, y]) => [(x - CX) * S, -(y - CY) * S];
  const polyShape = (pts) => {
    const sh = new Shape();
    pts.forEach((p, i) => { const [a, b] = toW(p); i ? sh.lineTo(a, b) : sh.moveTo(a, b); });
    sh.closePath();
    return sh;
  };
  const smooth = (pts, n) => new CatmullRomCurve3(pts.map(([x, y]) => new Vector3(...toW([x, y]), 0)), false, 'centripetal').getPoints(n);
  const swooshShape = () => {
    const a = smooth(SWOOSH_A, 70), b = smooth(SWOOSH_B, 70);
    const sh = new Shape();
    a.forEach((p, i) => (i ? sh.lineTo(p.x, p.y) : sh.moveTo(p.x, p.y)));
    b.forEach((p) => sh.lineTo(p.x, p.y));
    sh.closePath();
    return sh;
  };

  const black = new MeshPhysicalMaterial({
    color: 0x080b10, metalness: 0.55, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.7,
  });
  const cyan = new MeshPhysicalMaterial({
    color: 0x00b0ec, emissive: 0x009ad6, emissiveIntensity: 0.45, metalness: 0.1, roughness: 0.3,
    clearcoat: 0.7, clearcoatRoughness: 0.12, envMapIntensity: 0.55,
  });

  const house = new Group();
  const addPart = (shape, mat, depth, z = 0, bevel = 0.035) => {
    const geo = new ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 4,
    });
    geo.translate(0, 0, -depth / 2 + z);
    const m = new Mesh(geo, mat);
    house.add(m);
    return m;
  };
  addPart(polyShape(PARTS.roof), black, 0.55, 0.0, 0.05);
  addPart(polyShape(PARTS.chimney), cyan, 0.34, -0.05);
  addPart(polyShape(PARTS.pillarL), cyan, 0.3, 0.0);
  addPart(polyShape(PARTS.pillarR), cyan, 0.3, 0.0);
  addPart(polyShape(PARTS.window), cyan, 0.26, 0.05);
  addPart(polyShape(PARTS.door), black, 0.34, 0.08);
  const swoosh = addPart(swooshShape(), black, 0.42, 0.18, 0.04);

  // brilho de chão
  const glow = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshBasicMaterial({ map: radialTex(), transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending, color: 0x1fb6ff }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -2.55;
  glow.scale.set(1, 0.78, 1);
  scene.add(glow);

  scene.add(house);

  // ---------- domo impermeável ----------
  const R = 3.5;
  const DC = new Vector3(0, 0.1, 0);
  const NR = 14;
  const rippleU = Array.from({ length: NR }, () => new Vector4(0, 0, 0, -99));
  let rippleI = 0;
  const domeMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
    uniforms: { uTime: { value: 0 }, uR: { value: rippleU }, uCol: { value: new Color(0x2bb8ff) } },
    vertexShader: `varying vec3 vW; varying vec3 vN;
      void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform float uTime; uniform vec4 uR[${NR}]; uniform vec3 uCol; varying vec3 vW; varying vec3 vN;
      void main(){
        vec3 N=normalize(vN); vec3 V=normalize(cameraPosition - vW);
        float f = pow(1.0 - abs(dot(N,V)), 2.4);
        float a = 0.03 + f*0.5;
        float h = (vW.y + 3.5)/7.5;
        a += 0.07 * f * smoothstep(0.55, 1.0, 1.0 - abs(fract(h*1.2 - uTime*0.07)*2.0 - 1.0));
        float rip = 0.0;
        for(int i=0;i<${NR};i++){
          float age = uTime - uR[i].w;
          if(age>0.0 && age<1.7){
            float d = distance(vW, uR[i].xyz);
            float ring = exp(-pow((d - age*1.9)*8.0, 2.0));
            float core = exp(-d*d*16.0)*exp(-age*7.0);
            rip += (ring*0.8 + core*1.0)*(1.0 - age/1.7);
          }
        }
        vec3 col = uCol*(0.55 + f*0.9) + vec3(0.65,0.95,1.0)*rip;
        gl_FragColor = vec4(col, clamp(a + rip*0.65, 0.0, 1.0));
      }`,
  });
  const dome = new Mesh(new SphereGeometry(R, 72, 48, 0, Math.PI * 2, 0, Math.PI * 0.64), domeMat);
  dome.position.copy(DC);
  dome.renderOrder = 2;
  scene.add(dome);

  // anel de base do domo (a "borda" do escudo)
  const base = new Mesh(
    new TorusGeometry(R * Math.sin(Math.PI * 0.64), 0.012, 8, 160),
    new MeshBasicMaterial({ color: 0x38c6ff, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }),
  );
  base.rotation.x = Math.PI / 2;
  base.position.y = DC.y + R * Math.cos(Math.PI * 0.64);
  scene.add(base);

  // ---------- chuva ----------
  const MAXN = 560;
  const rainGeo = new PlaneGeometry(0.02, 1);
  const rain = new InstancedMesh(
    rainGeo,
    new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      vertexShader: `varying float vA; void main(){ vA = 1.0 - uv.y; gl_Position = projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying float vA; void main(){ gl_FragColor = vec4(0.55,0.88,1.0, pow(vA,1.6)*0.75); }`,
    }),
    MAXN,
  );
  rain.instanceMatrix.setUsage(DynamicDrawUsage);
  rain.frustumCulled = false;
  rain.renderOrder = 3;
  scene.add(rain);

  const px = new Float32Array(MAXN), py = new Float32Array(MAXN), pz = new Float32Array(MAXN), pv = new Float32Array(MAXN), pl = new Float32Array(MAXN);
  const bounds = { halfW: 6, top: 5.2, bottom: -3.4 };
  const spawn = (i, initial) => {
    px[i] = (Math.random() * 2 - 1) * bounds.halfW;
    pz[i] = (Math.random() * 2 - 1) * 3.2;
    py[i] = initial ? bounds.bottom + Math.random() * (bounds.top - bounds.bottom) : bounds.top + Math.random() * 2.5;
    pv[i] = 6.5 + Math.random() * 4.5;
    pl[i] = 0.28 + Math.random() * 0.4;
    // nunca nasce dentro do domo: começa acima da superfície
    const rr = (px[i] - DC.x) ** 2 + (pz[i] - DC.z) ** 2;
    if (rr < R * R) {
      const ytop = DC.y + Math.sqrt(R * R - rr);
      if (py[i] < ytop + 0.05) py[i] = ytop + 0.1 + Math.random() * (bounds.top - ytop);
    }
  };
  for (let i = 0; i < MAXN; i++) spawn(i, true);

  // respingos
  const MAXS = 260;
  const sPos = new Float32Array(MAXS * 3), sVel = new Float32Array(MAXS * 3), sLife = new Float32Array(MAXS), sA = new Float32Array(MAXS);
  for (let i = 0; i < MAXS; i++) { sPos[i * 3 + 1] = -99; }
  const sGeo = new BufferGeometry();
  sGeo.setAttribute('position', new BufferAttribute(sPos, 3).setUsage(DynamicDrawUsage));
  sGeo.setAttribute('aA', new BufferAttribute(sA, 1).setUsage(DynamicDrawUsage));
  const splash = new Points(sGeo, new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uScale: { value: 400 } },
    vertexShader: `attribute float aA; varying float vA; uniform float uScale;
      void main(){ vA=aA; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize = uScale*0.075/(-mv.z); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-0.5); float m=smoothstep(0.5,0.1,d); gl_FragColor=vec4(0.7,0.95,1.0,m*vA); }`,
  }));
  splash.frustumCulled = false;
  splash.renderOrder = 4;
  scene.add(splash);
  let sI = 0;
  const _n = new Vector3(), _t = new Vector3(), _p = new Vector3();
  function hit(x, y, z, t) {
    _n.set(x - DC.x, y - DC.y, z - DC.z).normalize();
    _p.copy(_n).multiplyScalar(R).add(DC);
    const r = rippleU[rippleI++ % NR];
    r.set(_p.x, _p.y, _p.z, t);
    // sentido em que a água escorre pela superfície
    _t.set(0, -1, 0).addScaledVector(_n, _n.y).normalize();
    for (let k = 0; k < 3; k++) {
      const i = sI++ % MAXS;
      const j = (Math.random() - 0.5) * 1.6;
      sPos[i * 3] = _p.x + _n.x * 0.04; sPos[i * 3 + 1] = _p.y + _n.y * 0.04; sPos[i * 3 + 2] = _p.z + _n.z * 0.04;
      sVel[i * 3] = _n.x * (0.9 + Math.random()) + _t.x * (1.3 + Math.random() * 1.2) + j;
      sVel[i * 3 + 1] = _n.y * (0.9 + Math.random()) + _t.y * (1.3 + Math.random() * 1.2) + Math.random() * 1.1;
      sVel[i * 3 + 2] = _n.z * (0.9 + Math.random()) + _t.z * (1.3 + Math.random() * 1.2) + j * 0.5;
      sLife[i] = 0.45 + Math.random() * 0.45;
    }
  }

  // ---------- estado / interação ----------
  let level = 1; // 0 garoa, 1 chuva, 2 temporal
  const counts = [90, narrow() ? 190 : 270, narrow() ? 360 : 520];
  let activeN = counts[level];
  let quality = 1;
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  const area = host.closest('[data-hero]') || host;
  area.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
  });
  area.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });
  window.addEventListener('israel:rain', (e) => {
    level = Math.max(0, Math.min(2, e.detail ?? 1));
    activeN = Math.round(counts[level] * quality);
  });
  window.__hero3d = { setRain: (l) => window.dispatchEvent(new CustomEvent('israel:rain', { detail: l })) };

  // ---------- tamanho ----------
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, narrow() ? 1.75 : 2) * (quality < 1 ? 0.75 : 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // distância para o domo caber inteiro, na largura ou na altura
    const need = (R * 1.18) / (FOV_T * Math.min(1, camera.aspect));
    const dist = Math.max(need, 11.5);
    camera.position.set(0, 0.55, dist);
    camera.lookAt(0, 0.0, 0);
    camera.updateProjectionMatrix();
    bounds.halfW = FOV_T * dist * camera.aspect + 0.8;
    splash.material.uniforms.uScale.value = h * dpr * 1.1;
  }
  new ResizeObserver(resize).observe(host);
  resize();

  // ---------- laço ----------
  let running = false, visible = true, last = 0, t0 = performance.now(), shown = false, slow = 0, frames = 0;
  const m = rain.instanceMatrix.array;

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const time = (now - t0) / 1000;
    domeMat.uniforms.uTime.value = time;

    // adaptação à potência do aparelho
    if (++frames > 40 && frames < 160) {
      slow += dt > 0.032 ? 1 : 0;
      if (frames === 159 && slow > 55 && quality === 1) { quality = 0.6; activeN = Math.round(counts[level] * quality); resize(); }
    }

    // casa: entrada + balanço + inclinação do mouse
    const intro = Math.min(1, time / 1.6);
    const ease = 1 - Math.pow(1 - intro, 3);
    cur.x += (target.x - cur.x) * Math.min(1, dt * 4);
    cur.y += (target.y - cur.y) * Math.min(1, dt * 4);
    house.rotation.y = (1 - ease) * -1.1 + cur.x * 0.5 + Math.sin(time * 0.55) * 0.14;
    house.rotation.x = cur.y * 0.16 + Math.sin(time * 0.43) * 0.025;
    house.position.y = Math.sin(time * 0.9) * 0.05;
    const sc = 0.82 + ease * 0.18;
    house.scale.setScalar(sc);
    glow.material.opacity = 0.45 + Math.sin(time * 1.3) * 0.07;
    rim.position.x = -5 + cur.x * -2;

    // chuva
    for (let i = 0; i < activeN; i++) {
      const prevY = py[i];
      py[i] -= pv[i] * dt * (level === 2 ? 1.25 : 1);
      const dx = px[i] - DC.x, dy = py[i] - DC.y, dz = pz[i] - DC.z;
      if (py[i] > DC.y - 0.5 && dx * dx + dy * dy + dz * dz < R * R && prevY > py[i]) {
        const pdy = prevY - DC.y;
        if (dx * dx + pdy * pdy + dz * dz >= R * R) { hit(px[i], py[i], pz[i], time); spawn(i, false); }
      }
      if (py[i] < bounds.bottom) spawn(i, false);
      const len = pl[i] * (level === 2 ? 1.5 : 1);
      const o = i * 16;
      m[o] = 1; m[o + 1] = 0; m[o + 2] = 0; m[o + 3] = 0;
      m[o + 4] = 0; m[o + 5] = len; m[o + 6] = 0; m[o + 7] = 0;
      m[o + 8] = 0; m[o + 9] = 0; m[o + 10] = 1; m[o + 11] = 0;
      m[o + 12] = px[i]; m[o + 13] = py[i] + len * 0.5; m[o + 14] = pz[i]; m[o + 15] = 1;
    }
    rain.count = activeN;
    rain.instanceMatrix.needsUpdate = true;

    // respingos
    for (let i = 0; i < MAXS; i++) {
      if (sLife[i] > 0) {
        sLife[i] -= dt;
        sVel[i * 3 + 1] -= 8.5 * dt;
        sPos[i * 3] += sVel[i * 3] * dt; sPos[i * 3 + 1] += sVel[i * 3 + 1] * dt; sPos[i * 3 + 2] += sVel[i * 3 + 2] * dt;
        sA[i] = Math.max(0, Math.min(1, sLife[i] * 2.2));
      } else { sA[i] = 0; }
    }
    sGeo.attributes.position.needsUpdate = true;
    sGeo.attributes.aA.needsUpdate = true;

    renderer.render(scene, camera);
    if (!shown) { shown = true; host.classList.add('is-3d'); area.classList.add('is-3d'); }
  }

  function renderStill() {
    // sem movimento: um único quadro, com algumas ondas no domo para o escudo aparecer
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2, e = 0.55 + (i % 3) * 0.3;
      hit(DC.x + Math.sin(a) * R * Math.cos(e), DC.y + R * Math.sin(e), DC.z + Math.cos(a) * R * Math.cos(e), 0.5 - (0.1 + i * 0.07));
    }
    house.rotation.y = 0.2;
    domeMat.uniforms.uTime.value = 0.5;
    rain.count = 140;
    for (let i = 0; i < 140; i++) {
      const o = i * 16, len = pl[i];
      m.set([1, 0, 0, 0, 0, len, 0, 0, 0, 0, 1, 0, px[i], py[i], pz[i], 1], o);
    }
    rain.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
    host.classList.add('is-3d');
    area.classList.add('is-3d');
  }

  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  function stop() { running = false; }
  const sync = () => (visible && !document.hidden ? start() : stop());

  if (reduced) {
    renderStill();
    new ResizeObserver(() => { resize(); renderer.render(scene, camera); }).observe(host);
  } else {
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }, { threshold: 0.01 }).observe(host);
    document.addEventListener('visibilitychange', sync);
    start();
  }

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); host.classList.remove('is-3d'); area.classList.remove('is-3d'); });
}

// ---------- utilitários ----------
function makeEnv(renderer) {
  const pm = new PMREMGenerator(renderer);
  const s = new Scene();
  s.add(new Mesh(new SphereGeometry(10, 32, 16), new MeshBasicMaterial({ color: 0x0b1a2c, side: BackSide })));
  const panel = (w, h, c, k, x, y, z) => {
    const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(c).multiplyScalar(k), side: DoubleSide }));
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    s.add(mesh);
  };
  panel(9, 3, 0xffffff, 6, 0, 7, 3);
  panel(2, 9, 0x2ac4ff, 5, -6.5, 1, 2);
  panel(2, 9, 0xffffff, 4, 6.5, 2, 3);
  panel(12, 2, 0x00a8ff, 3, 0, -6, 4);
  panel(7, 3, 0xffffff, 2.5, 0, 1, -8);
  const tex = pm.fromScene(s, 0.04).texture;
  pm.dispose();
  return tex;
}

function radialTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}
