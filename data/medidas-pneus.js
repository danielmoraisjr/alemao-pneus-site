// Medidas de pneu de fábrica (originais) por marca, modelo e ano — usadas no "Descubra o pneu ideal".
//
// Como editar:
//   • Cada modelo tem 'faixas' de ano (de/ate). Em cada faixa:
//       medidas:  medidas CONFIRMADAS em duas fontes independentes — aparecem normalmente no site;
//       conferir: medidas encontradas em só uma fonte — aparecem com o aviso "a confirmar".
//   • Depois de conferir uma medida (manual, etiqueta da porta ou nota da montadora), mova-a de 'conferir' para 'medidas'.
//   • Para incluir um carro novo, copie um bloco e ajuste marca, modelo e faixas. Formato da medida: '185/65 R15'.
//   • Medidas variam conforme a versão (aro 14, 15, 16…); por isso o site mostra todas as possíveis do ano.
//
// Fontes cruzadas: pneus.org (medidas originais por ano) × catálogo por ano/versão da Pneufree. Pesquisa feita em 10/2026.
window.MEDIDAS_PNEUS = [
  { marca: 'Chevrolet', modelo: 'Onix', faixas: [
    { de: 2013, ate: 2015, medidas: ['185/70 R14', '185/65 R15'], conferir: ['175/70 R14'] },
    { de: 2016, ate: 2017, medidas: ['185/70 R14', '185/65 R15', '195/65 R15'], conferir: ['175/70 R14'] },
    { de: 2018, ate: 2018, medidas: ['185/70 R14', '185/65 R15', '195/65 R15'], conferir: [] },
    { de: 2019, ate: 2019, medidas: ['185/70 R14', '185/65 R15', '195/65 R15', '195/55 R16'], conferir: [] },
    { de: 2020, ate: 2020, medidas: ['185/65 R15', '195/65 R15', '195/55 R16'], conferir: ['185/70 R14'] },
    { de: 2021, ate: 2025, medidas: ['185/70 R14', '185/65 R15', '195/55 R16'], conferir: [] },
  ] },
  { marca: 'Chevrolet', modelo: 'Onix Plus', faixas: [
    { de: 2020, ate: 2020, medidas: ['185/65 R15', '195/55 R16'], conferir: ['195/65 R15'] },
    { de: 2021, ate: 2025, medidas: ['185/65 R15', '195/55 R16'], conferir: ['185/70 R14'] },
  ] },
  { marca: 'Chevrolet', modelo: 'Prisma', faixas: [
    { de: 2013, ate: 2013, medidas: ['175/65 R14', '185/70 R14', '185/65 R15'], conferir: [] },
    { de: 2014, ate: 2019, medidas: ['185/70 R14', '185/65 R15'], conferir: [] },
  ] },
  { marca: 'Chevrolet', modelo: 'Cruze', faixas: [
    { de: 2017, ate: 2023, medidas: ['215/50 R17', '225/50 R17'], conferir: [] },
  ] },
  { marca: 'Chevrolet', modelo: 'Tracker', faixas: [
    { de: 2021, ate: 2025, medidas: ['215/60 R16', '215/55 R17'], conferir: ['215/55 R18'] },
  ] },
  { marca: 'Chevrolet', modelo: 'S10', faixas: [
    { de: 2013, ate: 2013, medidas: ['245/70 R16'], conferir: ['225/75 R15', '235/70 R16', '255/65 R17', '265/60 R18'] },
    { de: 2014, ate: 2014, medidas: ['245/70 R16'], conferir: ['255/65 R17', '265/60 R18'] },
    { de: 2015, ate: 2017, medidas: ['245/70 R16', '265/60 R18'], conferir: ['255/65 R17'] },
    { de: 2018, ate: 2024, medidas: ['245/70 R16', '265/60 R18'], conferir: [] },
  ] },
  { marca: 'Fiat', modelo: 'Argo', faixas: [
    { de: 2018, ate: 2018, medidas: ['175/65 R14', '185/60 R15', '195/55 R16', '205/50 R17'], conferir: [] },
    { de: 2019, ate: 2021, medidas: ['175/65 R14', '185/60 R15', '205/60 R15', '195/55 R16', '205/50 R17'], conferir: [] },
    { de: 2022, ate: 2022, medidas: ['175/65 R14', '205/60 R15', '195/55 R16', '205/50 R17'], conferir: ['185/60 R15'] },
    { de: 2023, ate: 2025, medidas: ['175/65 R14', '205/60 R15'], conferir: ['185/60 R15', '195/55 R16', '205/50 R17'] },
  ] },
  { marca: 'Fiat', modelo: 'Cronos', faixas: [
    { de: 2018, ate: 2021, medidas: ['185/60 R15', '195/55 R16', '205/45 R17'], conferir: [] },
    { de: 2022, ate: 2023, medidas: ['195/55 R16', '205/45 R17'], conferir: ['185/60 R15'] },
    { de: 2024, ate: 2025, medidas: [], conferir: ['185/60 R15', '195/55 R16', '205/45 R17'] },
  ] },
  { marca: 'Fiat', modelo: 'Mobi', faixas: [
    { de: 2017, ate: 2025, medidas: ['175/65 R14'], conferir: ['165/70 R13'] },
  ] },
  { marca: 'Fiat', modelo: 'Palio', faixas: [
    { de: 2012, ate: 2013, medidas: ['175/65 R14', '175/70 R14', '185/65 R14', '205/70 R15', '195/55 R16'], conferir: ['165/70 R13', '185/60 R15'] },
    { de: 2014, ate: 2016, medidas: ['175/65 R14', '175/70 R14', '185/65 R14', '195/55 R16'], conferir: ['165/70 R13', '185/60 R15'] },
    { de: 2017, ate: 2017, medidas: ['175/65 R14', '195/55 R16'], conferir: ['165/70 R13', '175/70 R14', '185/60 R15'] },
  ] },
  { marca: 'Fiat', modelo: 'Strada', faixas: [
    { de: 2014, ate: 2019, medidas: ['175/70 R14', '205/70 R15'], conferir: ['205/60 R16'] },
    { de: 2020, ate: 2020, medidas: ['175/70 R14', '205/60 R15', '205/70 R15'], conferir: ['195/65 R15', '205/60 R16'] },
    { de: 2021, ate: 2021, medidas: ['175/70 R14', '205/60 R15', '205/60 R16'], conferir: ['195/65 R15', '205/70 R15', '205/55 R16'] },
    { de: 2022, ate: 2022, medidas: ['205/60 R15', '205/60 R16'], conferir: ['175/70 R14', '195/65 R15', '205/70 R15', '205/55 R16'] },
    { de: 2023, ate: 2024, medidas: [], conferir: ['175/70 R14', '195/65 R15', '205/60 R15', '205/55 R16', '205/60 R16'] },
    { de: 2025, ate: 2025, medidas: [], conferir: ['195/65 R15', '205/60 R15', '205/55 R16', '205/60 R16'] },
  ] },
  { marca: 'Fiat', modelo: 'Toro', faixas: [
    { de: 2016, ate: 2019, medidas: ['215/65 R16', '225/70 R16', '225/60 R17', '225/65 R17', '225/60 R18'], conferir: [] },
    { de: 2020, ate: 2020, medidas: ['215/65 R16', '225/70 R16', '225/65 R17', '225/60 R18'], conferir: ['225/60 R17'] },
    { de: 2021, ate: 2021, medidas: ['215/65 R16', '225/65 R17', '225/60 R18'], conferir: ['225/70 R16'] },
    { de: 2022, ate: 2025, medidas: ['215/65 R16', '225/65 R17', '225/60 R18'], conferir: [] },
  ] },
  { marca: 'Fiat', modelo: 'Uno', faixas: [
    { de: 2011, ate: 2015, medidas: ['175/65 R14', '175/70 R14', '185/60 R15'], conferir: ['165/70 R13', '175/70 R13'] },
    { de: 2016, ate: 2019, medidas: ['175/65 R14', '185/60 R15'], conferir: ['165/70 R13', '175/70 R14'] },
    { de: 2020, ate: 2020, medidas: ['175/65 R14'], conferir: ['165/70 R13', '175/70 R14', '185/60 R15'] },
    { de: 2021, ate: 2021, medidas: ['175/65 R14'], conferir: ['165/70 R13', '175/70 R14'] },
  ] },
  { marca: 'Ford', modelo: 'Ka', faixas: [
    { de: 2015, ate: 2015, medidas: ['175/65 R14', '195/55 R15'], conferir: ['165/70 R13'] },
    { de: 2016, ate: 2017, medidas: ['175/65 R14', '195/55 R15'], conferir: ['165/70 R14'] },
    { de: 2018, ate: 2020, medidas: ['175/65 R14', '195/55 R15'], conferir: ['165/70 R14', '185/60 R15'] },
    { de: 2021, ate: 2021, medidas: ['175/65 R14', '195/55 R15'], conferir: ['185/60 R15'] },
  ] },
  { marca: 'Ford', modelo: 'Ranger', faixas: [
    { de: 2013, ate: 2013, medidas: ['245/70 R16', '255/70 R16', '265/65 R17'], conferir: ['235/75 R15'] },
    { de: 2014, ate: 2015, medidas: ['255/70 R16', '265/65 R17'], conferir: ['235/75 R15', '245/70 R16'] },
    { de: 2016, ate: 2022, medidas: ['255/70 R16', '265/65 R17', '265/60 R18'], conferir: [] },
    { de: 2023, ate: 2023, medidas: ['255/70 R16', '265/65 R17', '265/60 R18'], conferir: ['255/55 R20'] },
  ] },
  { marca: 'Honda', modelo: 'Civic', faixas: [
    { de: 2017, ate: 2017, medidas: ['205/55 R16', '205/50 R17', '215/50 R17', '225/40 R18'], conferir: [] },
    { de: 2018, ate: 2021, medidas: ['215/50 R17', '235/40 R18'], conferir: [] },
  ] },
  { marca: 'Hyundai', modelo: 'HB20', faixas: [
    { de: 2013, ate: 2019, medidas: ['175/70 R14', '185/60 R15'], conferir: [] },
    { de: 2020, ate: 2020, medidas: ['175/70 R14', '185/60 R15'], conferir: ['195/55 R16'] },
    { de: 2021, ate: 2025, medidas: ['175/70 R14', '185/60 R15', '195/55 R16'], conferir: ['195/60 R16'] },
  ] },
  { marca: 'Hyundai', modelo: 'Creta', faixas: [
    { de: 2017, ate: 2020, medidas: ['205/65 R16', '215/60 R17'], conferir: [] },
    { de: 2021, ate: 2025, medidas: ['205/65 R16', '215/60 R17'], conferir: ['215/55 R18'] },
  ] },
  { marca: 'Jeep', modelo: 'Compass', faixas: [
    { de: 2017, ate: 2017, medidas: ['225/60 R17', '215/55 R18', '225/55 R18', '235/45 R19'], conferir: [] },
    { de: 2018, ate: 2025, medidas: ['225/60 R17', '225/55 R18', '235/45 R19'], conferir: [] },
  ] },
  { marca: 'Jeep', modelo: 'Renegade', faixas: [
    { de: 2016, ate: 2019, medidas: ['215/65 R16', '215/60 R17', '225/55 R18'], conferir: ['235/45 R19'] },
    { de: 2020, ate: 2020, medidas: ['215/65 R16', '215/60 R17', '225/55 R18', '235/45 R19'], conferir: [] },
    { de: 2021, ate: 2022, medidas: ['215/60 R17', '225/55 R18', '235/45 R19'], conferir: ['215/65 R16'] },
    { de: 2023, ate: 2023, medidas: ['215/60 R17', '225/55 R18', '235/45 R19'], conferir: [] },
    { de: 2024, ate: 2024, medidas: ['215/60 R17', '225/55 R18', '235/45 R19'], conferir: ['225/65 R17'] },
    { de: 2025, ate: 2025, medidas: ['215/60 R17', '225/65 R17', '225/55 R18', '235/45 R19'], conferir: [] },
  ] },
  { marca: 'Nissan', modelo: 'Kicks', faixas: [
    { de: 2017, ate: 2025, medidas: ['205/60 R16', '205/55 R17'], conferir: [] },
  ] },
  { marca: 'Nissan', modelo: 'Versa', faixas: [
    { de: 2021, ate: 2024, medidas: ['185/65 R15', '195/65 R15', '195/55 R16', '205/55 R16', '205/50 R17'], conferir: [] },
    { de: 2025, ate: 2025, medidas: ['195/65 R15', '195/55 R16', '205/55 R16', '205/50 R17'], conferir: ['185/65 R15'] },
  ] },
  { marca: 'Renault', modelo: 'Kwid', faixas: [
    { de: 2018, ate: 2025, medidas: ['165/70 R14'], conferir: [] },
  ] },
  { marca: 'Renault', modelo: 'Logan', faixas: [
    { de: 2015, ate: 2015, medidas: ['185/70 R14', '185/65 R15'], conferir: [] },
    { de: 2016, ate: 2017, medidas: ['185/65 R15'], conferir: ['185/70 R14'] },
    { de: 2018, ate: 2018, medidas: ['185/65 R15'], conferir: ['205/55 R16'] },
    { de: 2019, ate: 2023, medidas: ['185/65 R15', '205/55 R16'], conferir: [] },
  ] },
  { marca: 'Renault', modelo: 'Sandero', faixas: [
    { de: 2015, ate: 2015, medidas: ['185/70 R14', '185/65 R15', '195/55 R16', '205/45 R17'], conferir: [] },
    { de: 2016, ate: 2018, medidas: ['185/65 R15', '195/55 R16', '205/45 R17'], conferir: ['185/70 R14'] },
    { de: 2019, ate: 2020, medidas: ['185/65 R15', '195/55 R16', '205/55 R16', '205/45 R17'], conferir: ['185/70 R14'] },
    { de: 2021, ate: 2022, medidas: ['185/65 R15', '205/55 R16', '205/45 R17'], conferir: ['195/55 R16'] },
  ] },
  { marca: 'Toyota', modelo: 'Corolla', faixas: [
    { de: 2015, ate: 2015, medidas: ['195/65 R15', '205/55 R16'], conferir: [] },
    { de: 2016, ate: 2016, medidas: ['205/55 R16'], conferir: ['195/65 R15'] },
    { de: 2017, ate: 2018, medidas: ['205/55 R16', '215/50 R17'], conferir: [] },
    { de: 2019, ate: 2020, medidas: ['205/55 R16', '215/50 R17', '225/45 R17'], conferir: [] },
    { de: 2021, ate: 2021, medidas: ['205/55 R16', '215/50 R17'], conferir: ['225/45 R17'] },
    { de: 2022, ate: 2022, medidas: ['205/55 R16'], conferir: ['215/50 R17', '225/45 R17'] },
    { de: 2023, ate: 2025, medidas: ['205/55 R16'], conferir: ['215/50 R17', '225/45 R17', '235/40 R18'] },
  ] },
  { marca: 'Toyota', modelo: 'Hilux', faixas: [
    { de: 2016, ate: 2017, medidas: ['265/70 R16', '265/65 R17', '265/60 R18'], conferir: [] },
    { de: 2018, ate: 2025, medidas: ['265/65 R17', '265/60 R18'], conferir: [] },
  ] },
  { marca: 'Volkswagen', modelo: 'Fox', faixas: [
    { de: 2010, ate: 2010, medidas: ['175/65 R14', '195/55 R15'], conferir: ['185/60 R14'] },
    { de: 2011, ate: 2011, medidas: ['195/55 R15'], conferir: ['175/65 R14', '185/60 R14'] },
    { de: 2012, ate: 2013, medidas: ['175/70 R14', '195/55 R15'], conferir: [] },
    { de: 2014, ate: 2018, medidas: ['175/70 R14', '195/55 R15'], conferir: ['195/50 R16'] },
    { de: 2019, ate: 2021, medidas: ['195/55 R15'], conferir: ['195/50 R16'] },
  ] },
  { marca: 'Volkswagen', modelo: 'Gol', faixas: [
    { de: 2013, ate: 2013, medidas: ['175/70 R14', '185/60 R14', '185/65 R14', '195/55 R15'], conferir: ['165/70 R13', '175/70 R13', '205/55 R15', '195/50 R16'] },
    { de: 2014, ate: 2014, medidas: ['175/70 R14', '185/60 R14', '185/65 R14', '195/55 R15'], conferir: ['165/70 R13', '175/70 R13', '195/50 R16'] },
    { de: 2015, ate: 2015, medidas: ['175/70 R14', '185/65 R14', '195/55 R15', '195/50 R16'], conferir: ['175/70 R13'] },
    { de: 2016, ate: 2018, medidas: ['175/70 R14', '185/65 R14', '195/55 R15', '195/50 R16'], conferir: [] },
    { de: 2019, ate: 2020, medidas: ['175/70 R14', '185/65 R14', '195/55 R15'], conferir: ['195/50 R16'] },
    { de: 2021, ate: 2023, medidas: ['185/65 R14', '195/55 R15'], conferir: ['185/65 R15'] },
  ] },
  { marca: 'Volkswagen', modelo: 'Polo', faixas: [
    { de: 2018, ate: 2019, medidas: ['185/65 R15', '195/55 R16', '205/50 R17'], conferir: [] },
    { de: 2020, ate: 2025, medidas: ['185/65 R15', '195/55 R16', '205/50 R17'], conferir: ['205/45 R18'] },
  ] },
  { marca: 'Volkswagen', modelo: 'Saveiro', faixas: [
    { de: 2014, ate: 2014, medidas: ['175/70 R14', '205/60 R15'], conferir: ['195/55 R15'] },
    { de: 2015, ate: 2016, medidas: ['175/70 R14', '195/55 R15', '205/60 R15'], conferir: [] },
    { de: 2017, ate: 2019, medidas: ['175/70 R14', '205/60 R15'], conferir: [] },
    { de: 2020, ate: 2025, medidas: ['205/60 R15'], conferir: ['175/70 R14'] },
  ] },
  { marca: 'Volkswagen', modelo: 'T-Cross', faixas: [
    { de: 2020, ate: 2025, medidas: ['205/60 R16', '205/55 R17'], conferir: [] },
  ] },
  { marca: 'Volkswagen', modelo: 'Virtus', faixas: [
    { de: 2018, ate: 2023, medidas: ['195/65 R15', '205/55 R16', '205/50 R17'], conferir: [] },
    { de: 2024, ate: 2025, medidas: ['195/65 R15', '205/55 R16', '205/50 R17'], conferir: ['205/45 R18'] },
  ] },
];
