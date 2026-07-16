'use strict';
const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const TMPL = fs.readFileSync(path.join(BASE, 'communities', 'mission-hills-real-estate.html'), 'utf8').replace(/\r\n/g, '\n');

function r1(html, old, nw) {
  const i = html.indexOf(old);
  if (i === -1) { process.stderr.write('MISS: ' + JSON.stringify(old.slice(0, 80)) + '\n'); return html; }
  return html.slice(0, i) + nw + html.slice(i + old.length);
}

function replaceRange(html, start, end, content) {
  const si = html.indexOf(start);
  const ei = html.indexOf(end, si);
  if (si === -1) { process.stderr.write('MISS START: ' + JSON.stringify(start.slice(0, 60)) + '\n'); return html; }
  if (ei === -1) { process.stderr.write('MISS END: ' + JSON.stringify(end.slice(0, 60)) + '\n'); return html; }
  return html.slice(0, si) + content + html.slice(ei);
}

// New nav items for all 5 communities
const NEW_ITEMS = [
  ['north-park-real-estate.html',       'North Park'],
  ['pacific-beach-real-estate.html',    'Pacific Beach'],
  ['mission-beach-real-estate.html',    'Mission Beach'],
  ['rancho-penasquitos-real-estate.html','Rancho Peñasquitos'],
  ['scripps-ranch-real-estate.html',    'Scripps Ranch']
];

const NEW_NAV_D = NEW_ITEMS.map(([f, n]) =>
  `          <a class="nav-dropdown-item" href="${f}"><span class="nav-dropdown-dot"></span>${n}</a>`
).join('\n');

const NEW_NAV_M = NEW_ITEMS.map(([f, n]) =>
  `    <a href="${f}">${n}</a>`
).join('\n');

const COMMUNITIES = [
  {
    file: 'north-park-real-estate.html',
    title: 'North Park Homes For Sale | Palisade Realty — San Diego Real Estate',
    metaDesc: 'Explore homes for sale in North Park, San Diego CA. Craftsman bungalows, craft beer culture, and a vibrant arts scene steps from Balboa Park. Hedda Parashos — Palisade Realty.',
    heroImg:  'hero-3.jpg',
    communityName: 'North Park',
    heroTitle: 'North <em>Park</em>',
    listings: '150+', medianPrice: '$850K', estYear: '1910',
    whereIsTitle: 'North Park?',
    locationDesc: 'North Park sits in the geographic heart of San Diego, just east of Hillcrest and north of South Park. Its walkable streets, award-winning craft breweries, and Craftsman bungalows make it one of the city’s most sought-after urban neighborhoods — with quick I-15 access to all of San Diego County.',
    neighborhood: 'North Park', neighborhoodEncoded: 'North+Park',
    lng: -117.115, lat: 32.745, heroZoom: 14.0, lifestyleZoom: 13.6,
    boundary: [[-117.132,32.756],[-117.118,32.758],[-117.102,32.756],[-117.097,32.748],[-117.098,32.737],[-117.108,32.733],[-117.12,32.732],[-117.13,32.734],[-117.136,32.741],[-117.133,32.749],[-117.132,32.756]],
    pois: [
      { name: 'North Park Farmers Market', desc: 'Weekly outdoor market at Ray St — local produce, artisan goods, community hub', lng: -117.130, lat: 32.745, icon: '🛒' },
      { name: 'Balboa Park', desc: 'World-class museums, gardens, and the San Diego Zoo — just minutes away', lng: -117.150, lat: 32.732, icon: '🌿' },
      { name: 'North Park Main Street', desc: 'Vibrant strip of restaurants, coffee shops, and boutiques', lng: -117.129, lat: 32.743, icon: '☕' },
      { name: 'Morley Field Sports Complex', desc: 'Community park with tennis, disc golf, and open fields', lng: -117.142, lat: 32.748, icon: '🎾' }
    ],
    freewayComment: 'I-15 through central San Diego',
    freewayCoords: [[-117.130,32.703],[-117.128,32.745],[-117.122,32.800],[-117.108,32.855],[-117.087,32.910]],
    roadComment: 'El Cajon Blvd corridor',
    roadCoords: [[-117.098,32.742],[-117.108,32.742],[-117.118,32.741],[-117.128,32.740],[-117.138,32.739]]
  },
  {
    file: 'pacific-beach-real-estate.html',
    title: 'Pacific Beach Homes For Sale | Palisade Realty — San Diego Real Estate',
    metaDesc: 'Explore homes for sale in Pacific Beach, San Diego CA. Coastal lifestyle, surf culture, and ocean views near Crystal Pier. Hedda Parashos — Palisade Realty.',
    heroImg:  'hero-4.jpg',
    communityName: 'Pacific Beach',
    heroTitle: 'Pacific <em>Beach</em>',
    listings: '120+', medianPrice: '$1.2M', estYear: '1887',
    whereIsTitle: 'Pacific Beach?',
    locationDesc: 'Pacific Beach stretches along San Diego’s coastline between La Jolla and Mission Beach. The Crystal Pier, Garnet Avenue’s vibrant dining scene, and a year-round beach lifestyle make it one of the most desirable coastal neighborhoods in the county.',
    neighborhood: 'Pacific Beach', neighborhoodEncoded: 'Pacific+Beach',
    lng: -117.234, lat: 32.816, heroZoom: 13.8, lifestyleZoom: 13.4,
    boundary: [[-117.258,32.832],[-117.213,32.832],[-117.208,32.82],[-117.211,32.808],[-117.215,32.801],[-117.222,32.8],[-117.235,32.799],[-117.248,32.8],[-117.256,32.802],[-117.259,32.815],[-117.258,32.832]],
    pois: [
      { name: 'Crystal Pier', desc: 'Historic 1920s pier with cottages — a Pacific Beach landmark', lng: -117.257, lat: 32.800, icon: '🎣' },
      { name: 'Garnet Avenue', desc: 'PB’s main commercial strip — restaurants, bars, and surf shops', lng: -117.240, lat: 32.809, icon: '🍹' },
      { name: 'Kate Sessions Park', desc: 'Hilltop park with panoramic bay and ocean views', lng: -117.236, lat: 32.818, icon: '⛰️' },
      { name: 'Pacific Beach Boardwalk', desc: 'Miles of oceanfront path connecting Mission Beach to La Jolla', lng: -117.255, lat: 32.810, icon: '🏄' }
    ],
    freewayComment: 'I-5 coastal freeway',
    freewayCoords: [[-117.155,32.783],[-117.168,32.845],[-117.175,32.903],[-117.210,32.950],[-117.235,33.000]],
    roadComment: 'Garnet Ave corridor',
    roadCoords: [[-117.215,32.809],[-117.225,32.809],[-117.235,32.810],[-117.245,32.811],[-117.255,32.810]]
  },
  {
    file: 'mission-beach-real-estate.html',
    title: 'Mission Beach Homes For Sale | Palisade Realty — San Diego Real Estate',
    metaDesc: 'Explore homes for sale in Mission Beach, San Diego CA. Beachfront living on a narrow ocean peninsula with Belmont Park and a classic boardwalk. Hedda Parashos — Palisade Realty.',
    heroImg:  'hero-1.jpg',
    communityName: 'Mission Beach',
    heroTitle: 'Mission <em>Beach</em>',
    listings: '60+', medianPrice: '$1.1M', estYear: '1914',
    whereIsTitle: 'Mission Beach?',
    locationDesc: 'Mission Beach occupies a narrow ocean peninsula between Mission Bay and the Pacific Ocean. Home to Belmont Park’s historic Giant Dipper roller coaster and a beloved boardwalk, it offers true beachfront living just minutes from I-8 and downtown San Diego.',
    neighborhood: 'Mission Beach', neighborhoodEncoded: 'Mission+Beach',
    lng: -117.252, lat: 32.784, heroZoom: 14.5, lifestyleZoom: 14.0,
    boundary: [[-117.258,32.802],[-117.248,32.8],[-117.243,32.792],[-117.245,32.781],[-117.248,32.773],[-117.251,32.765],[-117.256,32.763],[-117.261,32.766],[-117.261,32.78],[-117.259,32.793],[-117.258,32.802]],
    pois: [
      { name: 'Belmont Park', desc: 'Historic amusement park featuring the 1925 Giant Dipper roller coaster', lng: -117.252, lat: 32.773, icon: '🎡' },
      { name: 'Mission Beach Boardwalk', desc: 'Classic oceanfront promenade perfect for biking and walking', lng: -117.259, lat: 32.785, icon: '🚴' },
      { name: 'Mission Bay Aquatic Center', desc: 'Watersports rentals and instruction on calm Mission Bay waters', lng: -117.242, lat: 32.780, icon: '⛵' },
      { name: 'Ocean Front Walk', desc: 'Sun-drenched beach path lined with vacation rentals and beach shops', lng: -117.258, lat: 32.790, icon: '🌊' }
    ],
    freewayComment: 'I-8 east-west corridor',
    freewayCoords: [[-117.268,32.762],[-117.240,32.762],[-117.210,32.762],[-117.180,32.763],[-117.150,32.764]],
    roadComment: 'Mission Blvd corridor',
    roadCoords: [[-117.252,32.773],[-117.253,32.782],[-117.254,32.791],[-117.256,32.800],[-117.258,32.808]]
  },
  {
    file: 'rancho-penasquitos-real-estate.html',
    title: 'Rancho Peñasquitos Homes For Sale | Palisade Realty — San Diego Real Estate',
    metaDesc: 'Explore homes for sale in Rancho Peñasquitos, San Diego CA. Family-friendly master-planned community with top Poway Unified schools and canyon views. Hedda Parashos — Palisade Realty.',
    heroImg:  'hero-5.jpg',
    communityName: 'Rancho Peñasquitos',
    heroTitle: 'Rancho <em>Peñasquitos</em>',
    listings: '80+', medianPrice: '$1.0M', estYear: '1968',
    whereIsTitle: 'Rancho Peñasquitos?',
    locationDesc: 'Rancho Peñasquitos is a master-planned community in northern San Diego, nestled between scenic canyons and open preserve land. Served by top-rated Poway Unified School District and just off I-15, it offers family-friendly suburban living with easy access to the entire county.',
    neighborhood: 'Rancho Penasquitos', neighborhoodEncoded: 'Rancho+Penasquitos',
    lng: -117.087, lat: 32.968, heroZoom: 13.5, lifestyleZoom: 13.0,
    boundary: [[-117.107,32.986],[-117.075,32.982],[-117.062,32.974],[-117.06,32.96],[-117.065,32.954],[-117.08,32.95],[-117.095,32.952],[-117.108,32.958],[-117.112,32.97],[-117.107,32.986]],
    pois: [
      { name: 'Los Peñasquitos Canyon Preserve', desc: '4,000-acre canyon with trails, a waterfall, and historic Adobe Ranch', lng: -117.092, lat: 32.957, icon: '🌿' },
      { name: 'Westview High School', desc: 'Top-rated Poway Unified high school serving Rancho Peñasquitos', lng: -117.095, lat: 32.975, icon: '🎓' },
      { name: 'Black Mountain Open Space Park', desc: 'Popular hiking destination with panoramic San Diego views', lng: -117.080, lat: 32.962, icon: '⛰️' },
      { name: 'Rancho Peñasquitos Town Center', desc: 'Community shopping center with grocery, dining, and services', lng: -117.088, lat: 32.968, icon: '🛒' }
    ],
    freewayComment: 'I-15 north-south corridor',
    freewayCoords: [[-117.108,32.856],[-117.087,32.910],[-117.078,32.955],[-117.070,32.985],[-117.065,33.020]],
    roadComment: 'Black Mountain Rd corridor',
    roadCoords: [[-117.095,32.952],[-117.090,32.960],[-117.088,32.968],[-117.087,32.976],[-117.085,32.984]]
  },
  {
    file: 'scripps-ranch-real-estate.html',
    title: 'Scripps Ranch Homes For Sale | Palisade Realty — San Diego Real Estate',
    metaDesc: 'Explore homes for sale in Scripps Ranch, San Diego CA. Established neighborhood with excellent schools, Lake Miramar, and eucalyptus-lined streets. Hedda Parashos — Palisade Realty.',
    heroImg:  'hero-3.jpg',
    communityName: 'Scripps Ranch',
    heroTitle: 'Scripps <em>Ranch</em>',
    listings: '90+', medianPrice: '$1.15M', estYear: '1972',
    whereIsTitle: 'Scripps Ranch?',
    locationDesc: 'Scripps Ranch is a well-established residential community in northern San Diego, surrounded by eucalyptus groves and canyon open space. Lake Miramar Reservoir, excellent SDUSD schools, and quick I-15 access make it a perennial favorite for families and professionals.',
    neighborhood: 'Scripps Ranch', neighborhoodEncoded: 'Scripps+Ranch',
    lng: -117.09, lat: 32.882, heroZoom: 13.5, lifestyleZoom: 13.0,
    boundary: [[-117.105,32.908],[-117.078,32.908],[-117.068,32.895],[-117.07,32.876],[-117.072,32.86],[-117.082,32.855],[-117.095,32.856],[-117.108,32.862],[-117.112,32.878],[-117.11,32.895],[-117.105,32.908]],
    pois: [
      { name: 'Lake Miramar Reservoir', desc: 'Popular recreation lake with fishing, a scenic running trail, and open space', lng: -117.095, lat: 32.895, icon: '🎣' },
      { name: 'Scripps Ranch Town Centre', desc: 'Community shopping district with Vons, dining, and services', lng: -117.092, lat: 32.878, icon: '🛒' },
      { name: 'Miramar Ranch Elementary', desc: 'Award-winning SDUSD elementary school serving Scripps Ranch', lng: -117.088, lat: 32.880, icon: '🎓' },
      { name: 'Miramar Ranch Park', desc: 'Multi-use park with sports fields, playgrounds, and open lawn', lng: -117.098, lat: 32.882, icon: '⛳' }
    ],
    freewayComment: 'I-15 north-south corridor',
    freewayCoords: [[-117.108,32.856],[-117.087,32.910],[-117.078,32.955],[-117.070,32.985]],
    roadComment: 'Scripps Ranch Blvd corridor',
    roadCoords: [[-117.108,32.862],[-117.100,32.870],[-117.092,32.878],[-117.083,32.884],[-117.075,32.890]]
  }
];

function buildPage(c) {
  let h = TMPL;

  // 1. Head
  h = r1(h,
    'Mission Hills Homes For Sale | Palisade Realty — San Diego Real Estate',
    c.title
  );
  h = r1(h,
    'Explore homes for sale in Mission Hills, San Diego CA. Historic Craftsman bungalows, Spanish Colonial Revival estates, and tree-lined streets. Hedda Parashos — Palisade Realty.',
    c.metaDesc
  );

  // 2. Desktop nav: add 5 new items after El Cajon, update is-active
  h = r1(h,
    '          <a class="nav-dropdown-item" href="el-cajon-real-estate.html"><span class="nav-dropdown-dot"></span>El Cajon</a>\n        </div>',
    '          <a class="nav-dropdown-item" href="el-cajon-real-estate.html"><span class="nav-dropdown-dot"></span>El Cajon</a>\n' + NEW_NAV_D + '\n        </div>'
  );
  h = r1(h,
    '<a class="nav-dropdown-item is-active" href="mission-hills-real-estate.html">',
    '<a class="nav-dropdown-item" href="mission-hills-real-estate.html">'
  );
  h = r1(h,
    `<a class="nav-dropdown-item" href="${c.file}">`,
    `<a class="nav-dropdown-item is-active" href="${c.file}">`
  );

  // 3. Mobile nav: add 5 new items after El Cajon
  h = r1(h,
    '    <a href="el-cajon-real-estate.html">El Cajon</a>\n  </div>',
    '    <a href="el-cajon-real-estate.html">El Cajon</a>\n' + NEW_NAV_M + '\n  </div>'
  );

  // 4. Hero section
  h = r1(h, 'aria-label="Mission Hills hero"', `aria-label="${c.communityName} hero"`);
  h = r1(h, 'hero-background/hero-2.jpg', `hero-background/${c.heroImg}`);
  h = r1(h, 'alt="Mission Hills San Diego neighborhood view"', `alt="${c.communityName} San Diego neighborhood view"`);
  h = r1(h, '<span aria-current="page">Mission Hills</span>', `<span aria-current="page">${c.communityName}</span>`);
  h = r1(h, '<h1 class="hero-title">Mission <em>Hills</em></h1>', `<h1 class="hero-title">${c.heroTitle}</h1>`);
  h = r1(h,
    '<span class="hero-stat-value">80+</span>\n        <span class="hero-stat-label">Active Listings</span>',
    `<span class="hero-stat-value">${c.listings}</span>\n        <span class="hero-stat-label">Active Listings</span>`
  );
  h = r1(h,
    '<span class="hero-stat-value">$1.3M</span>\n        <span class="hero-stat-label">Median Price</span>',
    `<span class="hero-stat-value">${c.medianPrice}</span>\n        <span class="hero-stat-label">Median Price</span>`
  );
  h = r1(h,
    '<span class="hero-stat-value">1910</span>\n        <span class="hero-stat-label">Est. Neighborhood</span>',
    `<span class="hero-stat-value">${c.estYear}</span>\n        <span class="hero-stat-label">Est. Neighborhood</span>`
  );

  // 5. Location section
  h = r1(h, 'Where is <em>Mission Hills?</em>', `Where is <em>${c.whereIsTitle}</em>`);
  h = r1(h,
    'Tucked just north of Downtown San Diego, Mission Hills occupies a verdant hillside overlooking Old Town and Mission Valley — a quiet, tree-canopied enclave of historic homes with easy access to the entire county.',
    c.locationDesc
  );
  h = r1(h,
    'aria-label="San Diego County orientation map showing Mission Hills location"',
    `aria-label="San Diego County orientation map showing ${c.communityName} location"`
  );

  // 6. Listings section
  h = r1(h,
    '<h2 class="section-title" style="margin-bottom:0;">Mission Hills Homes For Sale</h2>',
    `<h2 class="section-title" style="margin-bottom:0;">${c.communityName} Homes For Sale</h2>`
  );
  h = h.replaceAll(
    's[locations][0][neighborhood]=Mission+Hills',
    `s[locations][0][neighborhood]=${c.neighborhoodEncoded}`
  );
  h = r1(h, '"neighborhood":"Mission Hills"', `"neighborhood":"${c.neighborhood}"`);
  h = r1(h, 'View All Mission Hills Properties →', `View All ${c.communityName} Properties →`);

  // 7. SD_COMMUNITY_CONFIG (full replacement)
  const fmtBoundary = c.boundary.map(p => `    [${p[0]}, ${p[1]}]`).join(',\n');
  const fmtPois = c.pois.map(p =>
    `    { name: "${p.name}", desc: "${p.desc}", lng: ${p.lng}, lat: ${p.lat}, icon: "${p.icon}" }`
  ).join(',\n');
  const newConfig =
    `window.SD_COMMUNITY_CONFIG = {\n` +
    `  city:          "${c.communityName}",\n` +
    `  subtitle:      "San Diego County · California",\n` +
    `  lng:           ${c.lng},\n` +
    `  lat:            ${c.lat},\n` +
    `  heroZoom:       ${c.heroZoom},\n` +
    `  lifestyleZoom:  ${c.lifestyleZoom},\n\n` +
    `  boundary: [\n${fmtBoundary}\n  ],\n\n` +
    `  pois: [\n${fmtPois}\n  ]\n};\n`;
  h = replaceRange(h, 'window.SD_COMMUNITY_CONFIG = {', '\n</script>\n\n<script src="../community-map.js">', newConfig);

  // 8. Location map MH_BOUNDARY variable
  const fmtMH = c.boundary.map(p => `    [${p[0]}, ${p[1]}]`).join(',\n');
  h = r1(h,
    '  var MH_BOUNDARY = [\n    [-117.207, 32.748], [-117.163, 32.748],\n    [-117.161, 32.732], [-117.168, 32.725],\n    [-117.185, 32.722], [-117.203, 32.727],\n    [-117.208, 32.737], [-117.207, 32.748]\n  ];',
    `  var MH_BOUNDARY = [\n${fmtMH}\n  ];`
  );

  // 9. Freeway variable (reuse I5 var name, change comment + coords)
  const fmtFwy = c.freewayCoords.map(p => `[${p[0]},${p[1]}]`).join(',');
  h = r1(h,
    '  /* I-5 through San Diego */\n  var I5 = [[-117.107,32.671],[-117.130,32.703],[-117.136,32.718],[-117.143,32.735],[-117.155,32.783],[-117.168,32.845],[-117.175,32.903]];',
    `  /* ${c.freewayComment} */\n  var I5 = [${fmtFwy}];`
  );

  // 10. Road variable (reuse WASH_ST var name, change comment + coords)
  const fmtRoad = c.roadCoords.map(p => `[${p[0]},${p[1]}]`).join(',');
  h = r1(h,
    '  /* Washington St corridor */\n  var WASH_ST = [[-117.162,32.740],[-117.172,32.741],[-117.181,32.741],[-117.190,32.741],[-117.200,32.740],[-117.207,32.740]];',
    `  /* ${c.roadComment} */\n  var WASH_ST = [${fmtRoad}];`
  );

  // 11. Map highlight comment
  h = r1(h, '      /* Mission Hills highlight */\n', `      /* ${c.communityName} highlight */\n`);

  // 12. CSS comment in <style> block
  h = r1(h, '     Community Page — Mission Hills', `     Community Page — ${c.communityName}`);

  // 13. __cdTrans block: swap "Mission Hills" → community name within translations only
  const T_START = '\nwindow.__cdTrans = {';
  const T_END   = '\n};\n</script>';
  const tsi = h.indexOf(T_START);
  const tei = h.indexOf(T_END, tsi);
  if (tsi !== -1 && tei !== -1) {
    const block = h.slice(tsi, tei + T_END.length);
    const replaced = block
      .replaceAll('Mission Hills', c.communityName)
      .replace('"Mission <em>Hills</em>"', `"${c.heroTitle}"`);
    h = h.slice(0, tsi) + replaced + h.slice(tei + T_END.length);
  }

  fs.writeFileSync(path.join(BASE, 'communities', c.file), h, 'utf8');
  console.log('Wrote:', c.file);
}

COMMUNITIES.forEach(buildPage);
console.log('Done — 5 community pages generated.');
