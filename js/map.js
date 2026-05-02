/* ============ Leaflet map — West-Vlaanderen werfgebied ============ */
window.addEventListener('load', () => {
  if (!window.L || !document.getElementById('map')) return;

  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false, attributionControl: true })
    .setView([51.20, 3.18], 10);
  L.control.zoom({ position: 'topright' }).addTo(map);

  // CartoDB Dark Matter — keyless premium dark editorial tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', {
    maxZoom: 18, subdomains: 'abcd',
    attribution: '© <a href="https://carto.com/">CARTO</a> · OSM'
  }).addTo(map);

  const projects = [
    { name: 'Sint-Anna ommuurde stadstuin', city: 'Brugge', date: 'Week 17 / 2026', size: '125 m²', price: '€ 42 000', img: 'img/project-sint-anna.jpg', coords: [51.211, 3.230] },
    { name: 'Pastorij Lissewege — borders & kasseien', city: 'Lissewege', date: '2025', size: '850 m² tuindeel', price: '€ 78 000', img: 'img/project-pastorij.jpg', coords: [51.301, 3.181] },
    { name: 'Sint-Michiels — minimaal', city: 'Brugge', date: '2024', size: '480 m²', price: '€ 68 000', img: 'img/project-modernist.jpg', coords: [51.181, 3.197] },
    { name: 'Polderhuis Zeebrugge', city: 'Zeebrugge', date: '2025', size: '650 m²', price: '€ 92 000', img: 'img/style-wild.jpg', coords: [51.336, 3.205] },
    { name: 'Kasteeltuin Beernem', city: 'Beernem', date: '2024', size: '4 100 m²', price: '€ 285 000', img: 'img/style-kasteel.jpg', coords: [51.131, 3.343] },
    { name: 'Villa Knokke-Het Zoute', city: 'Knokke', date: '2023', size: '1 250 m²', price: '€ 220 000', img: 'img/style-mediterranean.jpg', coords: [51.350, 3.296] },
    { name: 'Loft Oostende — dakterras', city: 'Oostende', date: '2023', size: '95 m²', price: '€ 28 000', img: 'img/aerial-terrace.jpg', coords: [51.230, 2.918] },
    { name: 'Boerderijtuin Torhout', city: 'Torhout', date: '2023', size: '3 600 m²', price: '€ 240 000', img: 'img/style-romantic.jpg', coords: [51.067, 3.106] },
    { name: 'Stadshuis Damme', city: 'Damme', date: '2022', size: '180 m²', price: '€ 52 000', img: 'img/g-formal.jpg', coords: [51.250, 3.288] },
    { name: 'Villa Damme', city: 'Damme', date: '2025', size: '1 800 m²', price: '€ 185 000', img: 'img/style-romantic.jpg', coords: [51.252, 3.286] },
    { name: 'Rijwoning Jabbeke', city: 'Jabbeke', date: '2022', size: '320 m²', price: '€ 48 000', img: 'img/project-sint-anna.jpg', coords: [51.182, 3.099] }
  ];

  const goldIcon = L.divIcon({
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#9d4423;border:2px solid #f4efe5;box-shadow:0 0 0 4px rgba(157,68,35,.25)"></div>',
    className: '', iconSize: [14, 14], iconAnchor: [7, 7]
  });

  projects.forEach(p => {
    const popupHtml = `
      <div style="width:260px">
        <div style="aspect-ratio:4/3;overflow:hidden;background:#222;margin:-14px -18px 12px">
          <img src="${p.img}" style="width:100%;height:100%;object-fit:cover;display:block" alt="${p.name}" />
        </div>
        <div style="font-family:'Newsreader',serif;font-size:18px;font-weight:500;line-height:1.2;margin-bottom:6px">${p.name}</div>
        <div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#9d4423;margin-bottom:6px">${p.city} · ${p.date}</div>
        <div style="font-size:12px;color:#bbb;margin-bottom:10px">${p.size} · richtprijs ${p.price}</div>
        <a href="realisaties.html" style="display:inline-block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#f4efe5;border-bottom:1px solid #9d4423;padding-bottom:2px">Bekijk werf →</a>
      </div>`;
    L.marker(p.coords, { icon: goldIcon })
      .addTo(map)
      .bindPopup(popupHtml, { minWidth: 260, maxWidth: 280, closeButton: true });
  });

  // Werkgebied circle
  L.circle([51.20, 3.18], {
    radius: 35000, color: '#9d4423', weight: 1, fillColor: '#9d4423', fillOpacity: 0.05, dashArray: '4 6'
  }).addTo(map);
});
