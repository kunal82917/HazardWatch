// ========================================
// Dashboard JavaScript
// ========================================

const API_BASE = "http://localhost:5000/api"; // Change to your backend URL in production

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    checkAuth();

    // Initialize components
    initializeMap();
    loadNews();
    loadCases();
    updateLastUpdated();
    initializeModals();
    initializeNavigation();
    initializeMobileMenu();

    // Set up auto-refresh
    setInterval(updateLastUpdated, 60000); // Update every minute
});

// ========================================
// Mobile Menu
// ========================================

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (!menuToggle) return;

    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside (mobile only)
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Close sidebar when a nav item is clicked
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.id !== 'reportCaseBtn') {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
        }
    });
}

// ========================================
// Authentication
// ========================================

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Update user display
    const username = sessionStorage.getItem('username');
    if (username) {
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = username;
        }
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            window.location.href = 'index.html';
        }
    });
}

// ========================================
// Map Initialization
// ========================================

let map;
let markers = [];

function initializeMap() {
    // Create map (default center: Mumbai)
    map = L.map('map').setView([19.0760, 72.8777], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);

                L.marker([userLat, userLng])
                    .addTo(map)
                    .bindPopup("You are here")
                    .openPopup();
            },
            function (error) {
                console.log("Location access denied. Using default Mumbai.");
            }
        );
    }

    // Add sample incident markers
    const incidents = [
        {
            lat: 19.0596,
            lng: 72.8295,
            severity: 'critical',
            type: 'Fire',
            description: 'Building fire reported in Bandra area',
            caseId: 'DS-2024-001'
        },
        {
            lat: 19.0176,
            lng: 72.8562,
            severity: 'medium',
            type: 'Flood',
            description: 'Street flooding in Dadar',
            caseId: 'DS-2024-002'
        },
        {
            lat: 19.1197,
            lng: 72.8464,
            severity: 'low',
            type: 'Accident',
            description: 'Traffic accident near Andheri Metro',
            caseId: 'DS-2024-003'
        },
        {
            lat: 18.9067,
            lng: 72.8147,
            severity: 'critical',
            type: 'Storm',
            description: 'Storm damage reported in Colaba',
            caseId: 'DS-2024-004'
        },
        {
            lat: 19.1176,
            lng: 72.9060,
            severity: 'medium',
            type: 'Landslide',
            description: 'Minor landslide in Powai hills',
            caseId: 'DS-2024-005'
        }
    ];

    incidents.forEach(incident => {
        addMarker(incident);
    });

    // Map filter controls
    const filterBtns = document.querySelectorAll('.map-control-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterMarkers(filter);
        });
    });
}

function addMarker(incident) {
    const color = getMarkerColor(incident.severity);

    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            animation: pulse 2s ease-in-out infinite;
        "></div>`,
        iconSize: [24, 24]
    });

    const marker = L.marker([incident.lat, incident.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
            <div style="font-family: 'Barlow', sans-serif;">
                <strong style="font-size: 14px; color: #0F1419;">${incident.type}</strong><br>
                <span style="font-size: 12px; color: #6B7785;">${incident.caseId}</span><br>
                <p style="font-size: 12px; margin: 8px 0; color: #3A4556;">${incident.description}</p>
                <span style="
                    display: inline-block;
                    padding: 2px 8px;
                    background: ${color}20;
                    color: ${color};
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                ">${incident.severity}</span>
            </div>
        `);

    marker.incident = incident;
    markers.push(marker);
}

function getMarkerColor(severity) {
    switch (severity) {
        case 'critical': return '#EF233C';
        case 'medium': return '#FFB703';
        case 'low': return '#06D6A0';
        default: return '#6B7785';
    }
}

function filterMarkers(filter) {
    markers.forEach(marker => {
        if (filter === 'all' || marker.incident.severity === filter) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// ========================================
// News Updates
// ========================================

async function loadNews() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';

    try {
        const response = await fetch("/api/news");
        const data = await response.json();

        data.articles.forEach((article, index) => {
            const badge = getBadgeType(article.title);

            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.style.animationDelay = `${index * 0.1}s`;
            newsItem.style.animation = 'fadeIn 0.4s ease-out both';

            newsItem.innerHTML = `
                <div class="news-badge badge-${badge}">${badge}</div>
                <div class="news-title">${article.title}</div>
                <div class="news-time">${formatTime(article.publishedAt)}</div>
            `;

            newsItem.addEventListener('click', function () {
                window.open(article.url, "_blank");
            });

            newsList.appendChild(newsItem);
        });

    } catch (error) {
        newsList.innerHTML = "<p>Failed to load news.</p>";
        console.error(error);
    }
}

function getBadgeType(title) {
    const text = title.toLowerCase();
    if (text.includes("earthquake") || text.includes("cyclone") || text.includes("tsunami")) {
        return "breaking";
    }
    if (text.includes("warning") || text.includes("alert")) {
        return "alert";
    }
    return "update";
}

function formatTime(dateString) {
    const published = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - published) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return published.toLocaleDateString();
}

// Refresh news
document.getElementById('refreshNews').addEventListener('click', function () {
    this.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
        loadNews();
    }, 400);
});

document.addEventListener("DOMContentLoaded", loadNews);

// ========================================
// Cases Table — MongoDB Integration
// ========================================

let casesData = [];

async function loadCases() {
    try {
        const response = await fetch(`${API_BASE}/incidents`);
        if (response.ok) {
            casesData = await response.json();
            // Normalize MongoDB _id to id for compatibility
            casesData = casesData.map(c => ({
                ...c,
                id: c.id || c._id,
                reported: c.reported || new Date(c.createdAt).toLocaleString()
            }));
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.warn('MongoDB API not reachable, using fallback data:', error.message);
        casesData = getFallbackCasesData();
    }

    renderCases(casesData);
    updateStats();

    // Search functionality
    const searchInput = document.getElementById('searchCases');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = casesData.filter(c =>
                (c.id || '').toLowerCase().includes(searchTerm) ||
                (c.type || '').toLowerCase().includes(searchTerm) ||
                (c.location || '').toLowerCase().includes(searchTerm)
            );
            renderCases(filtered);
        });
    }

    // Filter functionality
    const filterSelect = document.getElementById('filterStatus');
    if (filterSelect) {
        filterSelect.addEventListener('change', function (e) {
            const filterValue = e.target.value;
            const filtered = filterValue === 'all'
                ? casesData
                : casesData.filter(c => c.severity === filterValue || c.status === filterValue);
            renderCases(filtered);
        });
    }
}

function getFallbackCasesData() {
    return [
        { id: 'DS-2024-001', type: 'Fire', location: 'Manhattan, NY', severity: 'critical', status: 'active', reported: '10 min ago' },
        { id: 'DS-2024-002', type: 'Flood', location: 'Central Park, NY', severity: 'medium', status: 'active', reported: '25 min ago' },
        { id: 'DS-2024-003', type: 'Accident', location: 'Queens, NY', severity: 'low', status: 'resolved', reported: '1 hour ago' },
        { id: 'DS-2024-004', type: 'Storm', location: 'Brooklyn, NY', severity: 'critical', status: 'active', reported: '1.5 hours ago' },
        { id: 'DS-2024-005', type: 'Landslide', location: 'Manhattan, NY', severity: 'medium', status: 'active', reported: '2 hours ago' },
        { id: 'DS-2024-006', type: 'Earthquake', location: 'Bronx, NY', severity: 'critical', status: 'resolved', reported: '3 hours ago' },
        { id: 'DS-2024-007', type: 'Fire', location: 'Staten Island, NY', severity: 'low', status: 'resolved', reported: '4 hours ago' },
        { id: 'DS-2024-008', type: 'Flood', location: 'Queens, NY', severity: 'medium', status: 'resolved', reported: '5 hours ago' }
    ];
}

function renderCases(cases) {
    const tbody = document.getElementById('casesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    cases.forEach(caseItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="case-id">${caseItem.id}</span></td>
            <td><span class="case-type">${caseItem.type}</span></td>
            <td>${caseItem.location}</td>
            <td>
                <span class="severity-badge severity-${caseItem.severity}">
                    ${caseItem.severity}
                </span>
            </td>
            <td>
                <span class="status-badge-table ${caseItem.status === 'resolved' ? 'status-resolved-table' : 'status-active-table'}">
                    ${caseItem.status}
                </span>
            </td>
            <td>${caseItem.reported}</td>
            <td>
                <button class="btn-view" onclick="viewCase('${caseItem.id}')">View</button>
                <button class="btn-edit" onclick="editCase('${caseItem.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteCase('${caseItem.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewCase(id) {
    const caseItem = casesData.find(c => c.id === id || c._id === id);
    if (caseItem) {
        alert(`Case Details:\nID: ${caseItem.id}\nType: ${caseItem.type}\nLocation: ${caseItem.location}\nSeverity: ${caseItem.severity}\nStatus: ${caseItem.status}\nReported: ${caseItem.reported}`);
    }
}

function editCase(id) {
    alert(`Edit functionality for case ${id} would be implemented here`);
}

async function deleteCase(id) {
    if (confirm(`Are you sure you want to delete case ${id}?`)) {
        try {
            const response = await fetch(`${API_BASE}/incidents/${id}`, { method: 'DELETE' });
            if (response.ok) {
                casesData = casesData.filter(c => c.id !== id && c._id !== id);
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.warn('Could not delete from MongoDB, removing locally:', error.message);
            casesData = casesData.filter(c => c.id !== id && c._id !== id);
        }
        renderCases(casesData);
        updateStats();
    }
}

// ========================================
// Modals
// ========================================

function initializeModals() {
    // Report Case Modal
    const reportModal = document.getElementById('reportModal');
    const reportBtn = document.getElementById('reportCaseBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelReport = document.getElementById('cancelReport');
    const reportForm = document.getElementById('reportForm');

    reportBtn.addEventListener('click', function (e) {
        e.preventDefault();
        reportModal.classList.add('active');
    });

    closeModal.addEventListener('click', function () {
        reportModal.classList.remove('active');
        reportForm.reset();
    });

    cancelReport.addEventListener('click', function () {
        reportModal.classList.remove('active');
        reportForm.reset();
    });

    reportModal.addEventListener('click', function (e) {
        if (e.target === reportModal) {
            reportModal.classList.remove('active');
            reportForm.reset();
        }
    });

    reportForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            type: document.getElementById('caseType').value,
            severity: document.getElementById('caseSeverity').value,
            location: document.getElementById('caseLocation').value,
            description: document.getElementById('caseDescription').value,
            contact: document.getElementById('caseContact').value,
            people: document.getElementById('casePeople').value,
            status: 'active',
            reportedBy: sessionStorage.getItem('username') || 'Unknown'
        };

        let newCase;

        try {
            // Try to save to MongoDB
            const response = await fetch(`${API_BASE}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                newCase = await response.json();
                newCase.id = newCase._id || newCase.id;
                newCase.reported = 'Just now';
            } else {
                throw new Error('API save failed');
            }
        } catch (error) {
            console.warn('MongoDB not reachable, saving locally:', error.message);
            // Fallback: generate ID locally
            const newId = `DS-2024-${String(casesData.length + 1).padStart(3, '0')}`;
            newCase = {
                id: newId,
                type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
                location: formData.location,
                severity: formData.severity,
                status: 'active',
                reported: 'Just now'
            };
        }

        casesData.unshift(newCase);
        updateStats();
        renderCases(casesData);

        alert(`Case ${newCase.id} has been successfully reported!\n\nType: ${newCase.type}\nLocation: ${newCase.location}\nSeverity: ${newCase.severity}`);

        reportModal.classList.remove('active');
        reportForm.reset();
    });

    // Profile Modal
    const profileModal = document.getElementById('profileModal');
    const profileBtn = document.getElementById('profileBtn');
    const closeProfileModal = document.getElementById('closeProfileModal');

    profileBtn.addEventListener('click', function (e) {
        e.preventDefault();
        profileModal.classList.add('active');
    });

    closeProfileModal.addEventListener('click', function () {
        profileModal.classList.remove('active');
    });

    profileModal.addEventListener('click', function (e) {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });
}

// ========================================
// Stats Update
// ========================================

function updateStats() {
    const activeCases = casesData.filter(c => c.status === 'active').length;
    const resolvedCases = casesData.filter(c => c.status === 'resolved').length;
    const criticalCases = casesData.filter(c => c.severity === 'critical' && c.status === 'active').length;

    const activeEl = document.getElementById('activeCases');
    const resolvedEl = document.getElementById('resolvedCases');
    const criticalEl = document.getElementById('criticalCases');

    if (activeEl) activeEl.textContent = activeCases;
    if (resolvedEl) resolvedEl.textContent = resolvedCases;
    if (criticalEl) criticalEl.textContent = criticalCases;
}

// ========================================
// Last Updated Time
// ========================================

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const el = document.getElementById('lastUpdated');
    if (el) el.textContent = timeString;
}

// ========================================
// Navigation
// ========================================

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (this.id !== 'reportCaseBtn') {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                const menuText = this.textContent.trim();
                console.log('Navigating to:', menuText);
                showSection(menuText);
            }
        });
    });
}

function showSection(sectionName) {
    const statsCards = document.querySelector('.stats-cards');
    const contentGrid = document.querySelector('.content-grid');
    const casesSection = document.getElementById('casesSection');
    const communitySection = document.getElementById('communitySection');
    const emergencyResourcesSection = document.getElementById('emergencyResourcesSection');
    const alertsSection = document.getElementById('alertsSection');
    const settingsSection = document.getElementById('settingsSection');

    // Hide all sections
    if (casesSection) casesSection.style.display = 'none';
    if (communitySection) communitySection.style.display = 'none';
    if (emergencyResourcesSection) emergencyResourcesSection.style.display = 'none';
    if (alertsSection) alertsSection.style.display = 'none';
    if (settingsSection) settingsSection.style.display = 'none';

    if (sectionName === 'Community') {
        statsCards.style.display = 'none';
        contentGrid.style.display = 'none';
        if (communitySection) communitySection.style.display = 'block';
        initializeCommunity();
    } else if (sectionName === 'Emergency Resources') {
        statsCards.style.display = 'none';
        contentGrid.style.display = 'none';
        if (emergencyResourcesSection) emergencyResourcesSection.style.display = 'block';
        initializeEmergencyResources();
    } else if (sectionName === 'Alerts') {
        statsCards.style.display = 'none';
        contentGrid.style.display = 'none';
        if (alertsSection) alertsSection.style.display = 'block';
        initializeAlerts();
    } else if (sectionName === 'Settings') {
        statsCards.style.display = 'none';
        contentGrid.style.display = 'none';
        if (settingsSection) settingsSection.style.display = 'block';
        initializeSettings();
    } else {
        // Dashboard (default)
        statsCards.style.display = 'grid';
        contentGrid.style.display = 'grid';
        if (casesSection) casesSection.style.display = 'block';
    }
}

// ========================================
// Pulse Animation for Map Markers
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

document.getElementById('fetchLocationBtn').addEventListener('click', function () {
    const btn = this;
    const input = document.getElementById('caseLocation');

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    // Show loading state
    btn.disabled = true;
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Fetching...
    `;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Reverse geocode using OpenStreetMap's free Nominatim API
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const data = await response.json();
                input.value = data.display_name || `${latitude}, ${longitude}`;
            } catch (error) {
                // Fallback to raw coordinates if reverse geocoding fails
                input.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            }

            // Restore button
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
                Fetch Location
            `;
        },
        (error) => {
            const messages = {
                1: 'Location access denied. Please allow location permission.',
                2: 'Location unavailable. Try again.',
                3: 'Location request timed out.'
            };
            alert(messages[error.code] || 'Unable to fetch location.');

            btn.disabled = false;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
                Fetch Location
            `;
        },
        { timeout: 10000 }
    );
});