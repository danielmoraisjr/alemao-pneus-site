# Israel Impermeabilizações — site

Site institucional da **Israel Impermeabilizações** (Botucatu – SP): manta asfáltica e argamassa impermeabilizante.

Site estático (HTML + CSS + JS puro), sem build na Vercel. A cena 3D do topo usa [three.js](https://threejs.org) e já vem compilada em `assets/js/hero3d.js`.

## Estrutura

```
index.html                 página única (SEO, JSON-LD, seções)
assets/css/site.css        estilos
assets/js/site.js          comportamento (menu, abas, formulário → WhatsApp, etc.)
assets/js/hero3d.js        cena 3D compilada (gerada de tools/hero3d)
assets/fonts/              Bricolage Grotesque + Manrope (hospedadas aqui)
assets/img/                logo vetorial, favicon, ícones e imagem de compartilhamento (og.jpg)
tools/hero3d/              código-fonte da cena 3D
vercel.json                cabeçalhos de segurança (CSP) e cache
```

## Trocar o telefone / WhatsApp

O número está em poucos lugares. Para trocar tudo de uma vez (use DDI + DDD + número, só dígitos):

```sh
grep -rl 5514997340000 index.html assets/js/site.js | xargs sed -i 's/5514997340000/55SEUNUMERO/g'
```

Depois ajuste o número **escrito** (`(14) 99734-0000`) em `index.html` (busque por `99734-0000`), inclusive no JSON-LD (`+55 14 99734-0000`).

## Domínio

`index.html`, `robots.txt` e `sitemap.xml` usam `https://israel-impermeabilizacoes.vercel.app/`. Ao ligar um domínio próprio, troque essa URL nos três arquivos.

## Rodar localmente

```sh
npx serve .
```

## Recompilar a cena 3D

```sh
cd tools/hero3d
npm install
npm run build   # gera ../../assets/js/hero3d.js
```

## Deploy

Cada push na branch `main` publica automaticamente na Vercel (framework: *Other*, sem build command, diretório raiz).
