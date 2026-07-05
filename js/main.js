/* ============================================================
   TRUST-BASED SERVICES FOR STUDENTS
   js/main.js  —  All app logic
   NOTE: listings data lives in js/data.js (loaded before this)
   ============================================================ */

/* ============================================================
   HELPERS
   ============================================================ */

/** Render star icons based on a 0–5 count */
function starHTML(n) {
  return '★★★★★'.split('').map((s, i) =>
    `<span class="star" style="${i >= n ? 'color:var(--mu)' : ''}">${s}</span>`
  ).join('');
}

/** Build the full booking-style listing card HTML */
function cardHTML(d) {
  return `
  <div class="lst-card">
    <div class="lst-card-img ${d.bg}" style="width:220px;flex-shrink:0">
      <div class="lst-img-inner">${d.emoji}</div>
      <div class="lst-fav">♡</div>
    </div>
    <div class="lst-card-body">
      <div class="lst-card-top">
        <div class="lst-card-info">
          <h3>${d.title}</h3>
          <div class="stars">${starHTML(Math.round(d.score / 2))}</div>
          <div class="lst-meta">
            <span style="color:var(--g);cursor:pointer">${d.loc}</span>
            <span class="lst-meta-sep">|</span>
            <span>${d.dist}</span>
          </div>
          <div class="lst-type-row">
            <div class="lst-type-name">${d.type}</div>
            <div class="lst-type-detail">${d.detail}</div>
          </div>
          <div class="lst-perks">
            ${d.perks.map(p => `
              <div class="perk">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                ${p}
              </div>`).join('')}
          </div>
        </div>
        <div class="lst-score-box">
          <div>
            <span class="score-label">${d.label}</span><br>
            <span class="score-count">${d.reviews} reviews</span>
          </div>
          <div class="score-badge">${d.score}</div>
        </div>
      </div>
      <div class="lst-card-bottom">
        <div></div>
        <div style="text-align:right">
          <div class="lst-price-meta">Starting from</div>
          <div class="lst-price-main">
            ${d.price}<span style="font-size:.85rem;font-weight:500">${d.unit}</span>
          </div>
          <div class="lst-price-tax">+${d.tax}</div>
          <button class="btn-avail" style="margin-top:.6rem" onclick="showView('auth')">
            See availability ›
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/** Render home page listings (2 from each category) */
function renderHome() {
  const items = [
    listings.accommodation[0],
    listings.catering[0],
    listings.tutoring[0],
    listings.accommodation[1],
    listings.catering[1],
    listings.tutoring[2],
  ];
  document.getElementById('homeListings').innerHTML = items.map(cardHTML).join('');
}

/* ============================================================
   VIEW / SPA ROUTING
   ============================================================ */

/**
 * Show a top-level view and hide all others.
 * @param {string} v  - view name: 'home' | 'services' | 'auth' | 'userdash' | 'admindash'
 */
function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  window.scrollTo(0, 0);
}

/**
 * Navigate to Services view and pre-select a category tab.
 * @param {string} cat - 'accommodation' | 'catering' | 'tutoring'
 */
function showServices(cat) {
  showView('services');
  // Highlight correct tab
  const tabIndex = { accommodation: 0, catering: 1, tutoring: 2 };
  document.querySelectorAll('.sv-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sv-tab')[tabIndex[cat]].classList.add('active');
  switchTab(cat, null);
}

/* ============================================================
   SERVICES VIEW — TAB SWITCHING
   ============================================================ */

let activeTab = 'accommodation';

/**
 * Switch listing tab to a given category.
 * @param {string} cat - category key
 * @param {HTMLElement|null} btn - clicked button element (for styling)
 */
function switchTab(cat, btn) {
  activeTab = cat;

  const titles = {
    accommodation: 'Accommodation Listings',
    catering:      'Catering Services',
    tutoring:      'Tutoring &amp; Mentoring',
  };

  document.getElementById('svTitle').innerHTML = titles[cat];

  if (btn) {
    document.querySelectorAll('.sv-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  const data = listings[cat];
  document.getElementById('svResults').textContent = `Showing ${data.length} results`;
  document.getElementById('svListings').innerHTML = data.map(cardHTML).join('');
}

/* ============================================================
   AUTH — FORM SWITCHING
   ============================================================ */

/**
 * Toggle between Sign In and Create Account forms.
 * @param {string} tab - 'login' | 'register'
 * @param {HTMLElement|null} btn
 */
function switchAuth(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));

  if (btn) {
    btn.classList.add('active');
  } else {
    // Fallback: find the right tab by index
    document.querySelectorAll('.auth-tab')[tab === 'login' ? 0 : 1].classList.add('active');
  }

  document.getElementById('auth-login').classList.toggle('hidden',    tab !== 'login');
  document.getElementById('auth-register').classList.toggle('hidden', tab !== 'register');
}

/**
 * Toggle role selection card active state.
 * @param {HTMLElement} card
 */
function selectRole(card) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}

/* ============================================================
   AUTH — LOGIN / LOGOUT
   ============================================================ */

/**
 * Demo login — updates navbar and redirects to correct dashboard.
 * @param {string} role - 'user' | 'admin'
 */
function doLogin(role) {
  const nav = document.getElementById('navActions');

  if (role === 'admin') {
    nav.innerHTML = `
      <div class="nav-user" onclick="showView('admindash')">
        <div class="nav-avatar" style="background:var(--yw);color:var(--dn)">AD</div>
        <span style="font-size:13px">Admin</span>
        <span class="badge-admin">ADMIN</span>
      </div>`;
    showView('admindash');
  } else {
    nav.innerHTML = `
      <div class="nav-user" onclick="showView('userdash')">
        <div class="nav-avatar">MT</div>
        <span style="font-size:13px">Tousif</span>
        <span style="font-size:11px;color:var(--g)">✓</span>
      </div>`;
    showView('userdash');
  }
}

/** Log out — reset navbar and return to home */
function doLogout() {
  document.getElementById('navActions').innerHTML = `
    <button class="btn-ghost" onclick="showView('auth')">Sign In</button>
    <button class="btn-primary" onclick="showView('auth')">Get Started</button>`;
  showView('home');
}

/* ============================================================
   USER DASHBOARD — SECTION SWITCHING
   ============================================================ */

/**
 * Show a user dashboard section.
 * @param {string} id  - section id suffix: 'overview' | 'bookings' | 'saved' | 'profile' | 'reviews'
 * @param {HTMLElement} el - clicked nav item element
 */
function showDashSection(id, el) {
  document.querySelectorAll('#view-userdash .dash-section')
    .forEach(s => s.classList.remove('active'));
  document.getElementById('ds-' + id).classList.add('active');

  document.querySelectorAll('#view-userdash .dash-nav-item')
    .forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* ============================================================
   ADMIN DASHBOARD — SECTION SWITCHING
   ============================================================ */

/**
 * Show an admin dashboard section.
 * @param {string} id  - section id suffix: 'overview' | 'users' | 'listings' | 'verif' | 'reports'
 * @param {HTMLElement} el - clicked nav item element
 */
function showAdminSection(id, el) {
  document.querySelectorAll('#view-admindash .dash-section')
    .forEach(s => s.classList.remove('active'));
  document.getElementById('ads-' + id).classList.add('active');

  document.querySelectorAll('#view-admindash .dash-nav-item')
    .forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* ============================================================
   ADMIN CHART — Bar chart (registrations last 7 days)
   ============================================================ */
function renderChart() {
  const vals = [12, 18, 9, 22, 15, 27, 19];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max  = Math.max(...vals);

  document.getElementById('chartBars').innerHTML = vals.map(v =>
    `<div class="chart-bar" style="height:${(v / max) * 100}%">
       <span>${v}</span>
     </div>`
  ).join('');

  document.getElementById('chartLabels').innerHTML = days.map(d =>
    `<span>${d}</span>`
  ).join('');
}

/* ============================================================
   FILTER CHIPS — Toggle active state
   ============================================================ */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ============================================================
   INIT — Run on page load
   ============================================================ */
renderHome();
renderChart();
