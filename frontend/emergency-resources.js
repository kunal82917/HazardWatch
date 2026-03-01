// ========================================
// EMERGENCY RESOURCES — Final Corrected Version
// ========================================

// ----------------------------------------
// A) STATIC FALLBACK DATA
// ----------------------------------------
const nearbyServices = [
    {
        id: 'S-001', type: 'hospitals', name: 'Central City Hospital',
        address: '123 Medical Avenue, Downtown', distance: 0.8,
        phone: '108 (Ambulance)', emergencyServices: true,
        coordinates: { lat: 28.7041, lng: 77.1025 }
    },
    {
        id: 'S-002', type: 'police', name: 'Downtown Police Station',
        address: '456 Law Street, Central District', distance: 1.2,
        phone: '100 (Police)', emergencyServices: true,
        coordinates: { lat: 28.7050, lng: 77.1090 }
    },
    {
        id: 'S-003', type: 'fire', name: 'Central Fire Station',
        address: '789 Fire Lane, North District', distance: 1.5,
        phone: '101 (Fire)', emergencyServices: true,
        coordinates: { lat: 28.7150, lng: 77.1100 }
    },
    {
        id: 'S-004', type: 'hospitals', name: 'St. Mary Medical Center',
        address: '321 Health Road, East Side', distance: 2.1,
        phone: '108 (Ambulance)', emergencyServices: true,
        coordinates: { lat: 28.5921, lng: 77.2064 }
    },
    {
        id: 'S-005', type: 'ngos', name: 'Red Cross Relief Center',
        address: '654 Charity Road, West End', distance: 2.3,
        phone: 'N/A', emergencyServices: true,
        coordinates: { lat: 28.5494, lng: 77.0947 }
    },
    {
        id: 'S-006', type: 'shelters', name: 'Community Shelter 1',
        address: '987 Haven Street, South District', distance: 2.8,
        phone: 'N/A', emergencyServices: true,
        coordinates: { lat: 28.5355, lng: 77.0949 }
    }
];

// ----------------------------------------
// B) PREPAREDNESS GUIDES DATA
// ----------------------------------------
const preparednessGuides = [
    {
        id: 'G-001',
        title: '💧 Flood Safety Checklist',
        bullets: [
            'Move to higher ground immediately',
            "Don't walk/drive through flooded areas",
            'Turn off utilities to prevent hazards',
            'Store valuables and important documents safely',
            'Keep emergency kit ready',
            'Stay informed via emergency alerts',
            'Help neighbors and elderly persons'
        ]
    },
    {
        id: 'G-002',
        title: '🌍 Earthquake Safety Steps',
        bullets: [
            'DROP, COVER, HOLD ON during shaking',
            'Stay away from windows and heavy objects',
            'If outdoors, move to open ground',
            'If in vehicle, pull over and stay inside',
            'After quake, check for injuries and damage',
            'Use stairs, not elevators',
            'Expect aftershocks'
        ]
    },
    {
        id: 'G-003',
        title: '⛈️ Cyclone Preparation',
        bullets: [
            'Secure loose objects outdoors',
            'Trim tree branches near buildings',
            'Stock food, water, and medicines',
            'Charge all electronic devices',
            'Board up windows if necessary',
            'Move away from glass windows',
            'Listen to weather updates constantly',
            'Know your evacuation route'
        ]
    },
    {
        id: 'G-004',
        title: '🔥 Fire Safety Guide',
        bullets: [
            'Have fire extinguisher in kitchen',
            'Know location of fire exits',
            'Practice evacuation routes',
            "Don't panic - exit calmly and quickly",
            'Keep low to avoid smoke',
            'Close doors behind you',
            'Go to designated assembly point',
            'Call 101 when safe'
        ]
    }
];

// ----------------------------------------
// C) EMERGENCY KIT ITEMS DATA
// ----------------------------------------
const emergencyKitItems = [
    { id: 'K-001', name: 'Water', icon: '💧', essentialDays: 3 },
    { id: 'K-002', name: 'Torch', icon: '🔦', essentialDays: 1 },
    { id: 'K-003', name: 'Power Bank', icon: '🔋', essentialDays: 2 },
    { id: 'K-004', name: 'Medicines', icon: '💊', essentialDays: 7 },
    { id: 'K-005', name: 'First Aid Kit', icon: '🩹', essentialDays: 1 },
    { id: 'K-006', name: 'Food & Snacks', icon: '🍱', essentialDays: 3 },
    { id: 'K-007', name: 'ID Documents', icon: '📄', essentialDays: 1 },
    { id: 'K-008', name: 'Cash', icon: '💵', essentialDays: 1 },
    { id: 'K-009', name: 'Phone Charger', icon: '🔌', essentialDays: 1 },
    { id: 'K-010', name: 'Blanket', icon: '🛏️', essentialDays: 1 },
    { id: 'K-011', name: 'Rope', icon: '🪢', essentialDays: 1 },
    { id: 'K-012', name: 'Mask & Gloves', icon: '🧤', essentialDays: 1 }
];

// ----------------------------------------
// D) DEFAULT PHONES — shown when OSM has none
// ----------------------------------------
const DEFAULT_PHONES = {
    hospitals: '108 (Ambulance)',
    police: '100 (Police)',
    fire: '101 (Fire)',
    ngos: '112 (Emergency)',
    shelters: '112 (Emergency)'
};

// ----------------------------------------
// E) OVERPASS MIRROR LIST
// ----------------------------------------
const OVERPASS_MIRRORS = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter'
];

// ----------------------------------------
// F) OSM TYPE SELECTORS
// ----------------------------------------
const OSM_TYPE_MAP = {
    hospitals: [
        `node["amenity"="hospital"]`,
        `node["amenity"="clinic"]`,
        `node["healthcare"="hospital"]`
    ],
    police: [`node["amenity"="police"]`],
    fire: [`node["amenity"="fire_station"]`],
    ngos: [`node["amenity"="social_facility"]`, `node["office"="ngo"]`],
    shelters: [`node["amenity"="shelter"]`, `node["social_facility"="shelter"]`]
};

// ----------------------------------------
// G) GLOBAL STATE
// ----------------------------------------
let userLocation = null;
let currentServiceFilter = 'all';

// ========================================
// ENTRY POINT
// ========================================
function initializeEmergencyResources() {
    renderGuides();
    renderKitChecklist();
    initializeServiceFilters();
    initializeKitActions();
    detectUserLocation();
}

// ========================================
// SECTION 1: RENDER SERVICES
// ========================================

function renderServices(services) {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;

    servicesList.innerHTML = '';

    const filtered = currentServiceFilter === 'all'
        ? services
        : services.filter(s => s.type === currentServiceFilter);

    if (filtered.length === 0) {
        servicesList.innerHTML = `
            <div style="text-align:center; padding:2rem; color:var(--text-muted);">
                <div style="font-size:2rem;">🔍</div>
                <p>No services found for this category.</p>
            </div>`;
        return;
    }

    filtered.forEach(service => servicesList.appendChild(createServiceCard(service)));
}

// Store dataset on DOM node so filters always re-render the right data
function renderServicesAndStore(services) {
    const servicesList = document.getElementById('servicesList');
    if (servicesList) servicesList._currentData = services;
    renderServices(services);
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';

    const typeEmoji = {
        hospitals: '🏥',
        police: '🚨',
        fire: '🚒',
        ngos: '❤️',
        shelters: '🏠'
    };

    const emoji = typeEmoji[service.type] || '📍';
    const typeLabel = service.type.charAt(0).toUpperCase() + service.type.slice(1);
    const badge = service.emergencyServices ? '🚨 24/7' : '⏰ Regular';
    const safeName = service.name.replace(/'/g, "\\'");

    card.innerHTML = `
        <div class="service-header">
            <div class="service-type">${emoji} ${typeLabel}</div>
        </div>
        <div class="service-name">${service.name}</div>
        <div class="service-address">📍 ${service.address}</div>
        <div style="margin:var(--space-sm) 0;">
            <span class="service-distance">📏 ${service.distance} km away</span>
        </div>
        <div class="service-meta">
            <span>📞 ${service.phone}</span>
            <span>${badge}</span>
        </div>
        <button class="service-action"
            onclick="openServiceOnMap(${service.coordinates.lat}, ${service.coordinates.lng}, '${safeName}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            Open in Maps
        </button>
    `;

    return card;
}

function openServiceOnMap(lat, lng, name) {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},15z`;
    window.open(url, '_blank');
}

function initializeServiceFilters() {
    const filterBtns = document.querySelectorAll('.service-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentServiceFilter = this.dataset.filter;

            const servicesList = document.getElementById('servicesList');
            const stored = servicesList ? servicesList._currentData : null;
            if (stored) renderServices(stored);
        });
    });
}

// ========================================
// SECTION 2: GEOLOCATION
// ========================================

async function detectUserLocation() {
    const locationStatus = document.getElementById('locationStatus');
    const refreshBtn = document.getElementById('refreshLocationBtn');
    const servicesList = document.getElementById('servicesList');

    if (refreshBtn) {
        refreshBtn.onclick = () => detectUserLocation();
    }

    if (!navigator.geolocation) {
        locationStatus.innerHTML = `<p style="color:var(--warning);">📍 Geolocation not supported by your browser</p>`;
        renderServicesAndStore(nearbyServices);
        return;
    }

    // Loading state
    locationStatus.classList.add('active');
    locationStatus.innerHTML = `<p style="color:var(--warning);">⏳ Detecting your location...</p>`;
    if (servicesList) {
        servicesList.innerHTML = `
            <div style="text-align:center; padding:2rem; color:var(--text-muted);">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📡</div>
                <p>Fetching nearby emergency services...</p>
            </div>`;
    }

    navigator.geolocation.getCurrentPosition(

        // ✅ SUCCESS
        async (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            locationStatus.innerHTML = `
                <p style="color:var(--success);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2"
                        style="display:inline; vertical-align:middle; margin-right:0.4rem;">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Location detected — fetching nearby services...
                </p>`;

            const realServices = await fetchNearbyServicesFromOSM(userLocation.lat, userLocation.lng);

            if (realServices.length > 0) {
                // Show results immediately with whatever data we have
                renderServicesAndStore(realServices);

                locationStatus.innerHTML = `
                    <p style="color:var(--success);">
                        ✅ Found ${realServices.length} services — enriching addresses...
                    </p>`;

                // Enrich top 10 addresses via Nominatim in the background
                enrichWithAddress(realServices.slice(0, 10)).then(enriched => {
                    const final = [...enriched, ...realServices.slice(10)];
                    renderServicesAndStore(final);
                    locationStatus.innerHTML = `
                        <p style="color:var(--success);">
                            ✅ Showing ${final.length} real nearby services
                        </p>`;
                });

            } else {
                locationStatus.innerHTML = `
                    <p style="color:var(--warning);">
                        ⚠️ No services found nearby — showing sample data
                    </p>`;
                renderServicesAndStore(nearbyServices);
            }
        },

        // ❌ ERROR
        (error) => {
            const messages = {
                1: '🔒 Location access denied. Please allow permission.',
                2: '📡 Location signal unavailable. Try again.',
                3: '⏱️ Location request timed out. Try again.'
            };
            locationStatus.innerHTML = `
                <p style="color:var(--warning);">
                    ${messages[error.code] || '📍 Could not get location — showing sample data.'}
                </p>`;
            renderServicesAndStore(nearbyServices);
        },

        { timeout: 10000, enableHighAccuracy: true }
    );
}

// ========================================
// SECTION 3: OVERPASS API (mirror fallback)
// ========================================

async function fetchNearbyServicesFromOSM(lat, lng, radiusMeters = 5000) {
    const queries = Object.entries(OSM_TYPE_MAP)
        .flatMap(([, selectors]) =>
            selectors.map(sel => `${sel}(around:${radiusMeters},${lat},${lng});`)
        )
        .join('\n');

    const overpassQuery = `
        [out:json][timeout:15];
        (
            ${queries}
        );
        out body;
    `;

    for (const mirror of OVERPASS_MIRRORS) {
        try {
            console.log(`Trying: ${mirror}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(mirror, {
                method: 'POST',
                body: overpassQuery,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const results = parseOSMResults(data.elements, lat, lng);

            console.log(`✅ ${mirror} → ${results.length} results`);
            return results;

        } catch (err) {
            console.warn(`❌ Failed (${mirror}): ${err.message}`);
        }
    }

    console.error('All Overpass mirrors failed.');
    return [];
}

// ========================================
// SECTION 4: PARSE OSM RESULTS
// ========================================

function parseOSMResults(elements, userLat, userLng) {
    const typeDetector = (tags) => {
        if (tags.amenity === 'hospital' || tags.amenity === 'clinic' || tags.healthcare === 'hospital') return 'hospitals';
        if (tags.amenity === 'police') return 'police';
        if (tags.amenity === 'fire_station') return 'fire';
        if (tags.amenity === 'social_facility' || tags.office === 'ngo') return 'ngos';
        if (tags.amenity === 'shelter' || tags.social_facility === 'shelter') return 'shelters';
        return 'other';
    };

    return elements
        .filter(el => el.lat && el.lon && el.tags && el.tags.name)
        .map(el => {
            const type = typeDetector(el.tags);
            const distance = getDistanceKm(userLat, userLng, el.lat, el.lon);

            const tagParts = [
                el.tags['addr:housenumber'],
                el.tags['addr:street'],
                el.tags['addr:suburb'],
                el.tags['addr:city']
            ].filter(Boolean);

            return {
                id: `OSM-${el.id}`,
                type,
                name: el.tags.name,
                address: tagParts.length > 0 ? tagParts.join(', ') : 'Address not available',
                distance: parseFloat(distance.toFixed(2)),
                phone: el.tags.phone || el.tags['contact:phone'] || DEFAULT_PHONES[type] || 'N/A',
                emergencyServices: ['hospitals', 'police', 'fire'].includes(type),
                coordinates: { lat: el.lat, lng: el.lon }
            };
        })
        .filter(s => s.type !== 'other')
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20);
}

// ========================================
// SECTION 5: NOMINATIM ADDRESS ENRICHMENT
// ========================================

async function enrichWithAddress(services) {
    const enriched = [];

    for (const service of services) {
        if (service.address !== 'Address not available') {
            enriched.push(service);
            continue;
        }

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${service.coordinates.lat}&lon=${service.coordinates.lng}&format=json&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const a = data.address || {};

            const parts = [
                a.house_number,
                a.road || a.pedestrian || a.footway,
                a.suburb || a.neighbourhood || a.quarter,
                a.city || a.town || a.village,
                a.postcode
            ].filter(Boolean);

            service.address = parts.length > 0
                ? parts.join(', ')
                : (data.display_name || 'Address not available');

        } catch (e) {
            // Silently keep original — no crash
        }

        await new Promise(r => setTimeout(r, 1100)); // 1 req/sec rate limit
        enriched.push(service);
    }

    return enriched;
}

// ========================================
// SECTION 6: HAVERSINE DISTANCE
// ========================================

function getDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

// ========================================
// SECTION 7: PREPAREDNESS GUIDES
// ========================================

function renderGuides() {
    const container = document.getElementById('guidesContainer');
    if (!container) return;
    container.innerHTML = '';

    preparednessGuides.forEach(guide => container.appendChild(createGuideCard(guide)));

    container.addEventListener('click', function (e) {
        const card = e.target.closest('.guide-card');
        if (card) card.classList.toggle('expanded');
    });
}

function createGuideCard(guide) {
    const card = document.createElement('div');
    card.className = 'guide-card';

    card.innerHTML = `
        <div class="guide-header">
            <span class="guide-title">${guide.title}</span>
            <span class="guide-toggle">▼</span>
        </div>
        <div class="guide-content">
            <ul class="guide-bullets">
                ${guide.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
        </div>
    `;

    return card;
}

// ========================================
// SECTION 8: EMERGENCY KIT CHECKLIST
// ========================================

function renderKitChecklist() {
    const container = document.getElementById('kitChecklist');
    if (!container) return;
    container.innerHTML = '';

    emergencyKitItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'kit-item';

        if (localStorage.getItem(`kit-${item.id}`)) {
            div.classList.add('checked');
        }

        div.innerHTML = `
            <div class="kit-icon">${item.icon}</div>
            <div class="kit-label">${item.name}</div>
            <div class="kit-checkbox">✓</div>
        `;

        div.addEventListener('click', () => toggleKitItem(item.id, div));
        container.appendChild(div);
    });

    updateKitProgress();
}

function toggleKitItem(itemId, element) {
    if (element.classList.contains('checked')) {
        element.classList.remove('checked');
        localStorage.removeItem(`kit-${itemId}`);
    } else {
        element.classList.add('checked');
        localStorage.setItem(`kit-${itemId}`, 'true');
    }
    updateKitProgress();
}

function updateKitProgress() {
    const total = emergencyKitItems.length;
    const checked = Object.keys(localStorage).filter(k => k.startsWith('kit-')).length;
    const pct = Math.round((checked / total) * 100);

    const pctEl = document.getElementById('kitPercentage');
    const barEl = document.getElementById('kitProgressBar');

    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.style.width = pct + '%';
}

// ========================================
// SECTION 9: KIT ACTIONS
// ========================================

function initializeKitActions() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const resetBtn = document.getElementById('resetKitBtn');

    if (downloadBtn) downloadBtn.addEventListener('click', downloadKitPdf);
    if (resetBtn) resetBtn.addEventListener('click', resetKitChecklist);
}

function downloadKitPdf() {
    const checkedCount = Object.keys(localStorage).filter(k => k.startsWith('kit-')).length;
    const pct = Math.round((checkedCount / emergencyKitItems.length) * 100);

    const content = `
EMERGENCY PREPAREDNESS KIT CHECKLIST
Generated: ${new Date().toLocaleString()}
${'━'.repeat(40)}

ITEMS STATUS:

${emergencyKitItems.map(item => {
        const done = localStorage.getItem(`kit-${item.id}`) ? '✓' : '☐';
        return `  ${done}  ${item.icon}  ${item.name.padEnd(16)} (${item.essentialDays}-day supply)`;
    }).join('\n')}

${'━'.repeat(40)}
Preparation: ${pct}% complete

EMERGENCY NUMBERS (INDIA)
${'━'.repeat(40)}
  112 — General Emergency
  100 — Police
  101 — Fire Department
  108 — Ambulance

TIPS
${'━'.repeat(40)}
  • Keep this kit in an accessible location
  • Refresh supplies every 6 months
  • Share your plan with family members
  • Practice evacuation routes regularly

Stay Safe! 🛡️
`.trim();

    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    a.download = 'Emergency_Kit_Checklist.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert('✅ Checklist downloaded successfully!');
}

function resetKitChecklist() {
    if (!confirm('Reset the checklist? All progress will be lost.')) return;

    Object.keys(localStorage)
        .filter(k => k.startsWith('kit-'))
        .forEach(k => localStorage.removeItem(k));

    renderKitChecklist();
    alert('Checklist has been reset.');
}