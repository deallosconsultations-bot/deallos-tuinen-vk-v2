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
    { name: 'Sint-Anna stadstuin', city: 'Brugge', date: 'Week 17 / 2026', size: '125 m²', coords: [51.211, 3.230] },
    { name: 'Villa Damme', city: 'Damme', date: '2025', size: '1 800 m²', coords: [51.252, 3.286] },
    { name: 'Polderhuis Zeebrugge', city: 'Zeebrugge', date: '2025', size: '650 m²', coords: [51.336, 3.205] },
    { name: 'Renaissance pastorij', city: 'Lissewege', date: '2024', size: '2 200 m²', coords: [51.301, 3.181] },
    { name: 'Modernist Sint-Michiels', city: 'Brugge', date: '2024', size: '480 m²', coords: [51.181, 3.197] },
    { name: 'Kasteeltuin Beernem', city: 'Beernem', date: '2024', size: '4 100 m²', coords: [51.131, 3.343] },
    { name: 'Villa Knokke-Het Zoute', city: 'Knokke', date: '2023', size: '1 250 m²', coords: [51.350, 3.296] },
    { name: 'Loft Oostende', city: 'Oostende', date: '2023', size: '95 m² (dakterras)', coords: [51.230, 2.918] },
    { name: 'Boerderijtuin Torhout', city: 'Torhout', date: '2023', size: '3 600 m²', coords: [51.067, 3.106] },
    { name: 'Stadshuis Damme', city: 'Damme', date: '2022', size: '180 m²', coords: [51.250, 3.288] },
    { name: 'Park De Haan', city: 'De Haan', date: '2022', size: '900 m²', coords: [51.282, 3.030] },
    { name: 'Rijwoning Jabbeke', city: 'Jabbeke', date: '2022', size: '320 m²', coords: [51.182, 3.099] }
  ];

  const goldIcon = L.divIcon({
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#c9a96a;border:2px solid #f3efe7;box-shadow:0 0 0 4px rgba(201,169,106,.25)"></div>',
    className: '', iconSize: [14, 14], iconAnchor: [7, 7]
  });

  projects.forEach(p => {
    L.marker(p.coords, { icon: goldIcon })
      .addTo(map)
      .bindPopup(`<div style="padding:6px 4px;min-width:200px"><div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;margin-bottom:4px">${p.name}</div><div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c9a96a;margin-bottom:8px">${p.city}</div><div style="font-size:12px;color:#bbb">${p.date} · ${p.size}</div></div>`);
  });

  // Werkgebied circle
  L.circle([51.20, 3.18], {
    radius: 35000, color: '#c9a96a', weight: 1, fillColor: '#c9a96a', fillOpacity: 0.05, dashArray: '4 6'
  }).addTo(map);
});
