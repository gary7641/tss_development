/**
 * app.js
 * Signal Helper - TSS Development
 * Version: 0.1.0
 *
 * Main application entry point.
 * Handles:
 *   - UI initialization
 *   - CSV upload flow
 *   - Signals Library rendering
 *   - Sidebar navigation (P1 pages)
 *
 * Sidebar Priority (P1):
 *   Dashboard | My Signals | Register Signal | User Profile
 */

import { db, auth, COLLECTIONS } from './firebase-config.js';
import { processMultipleCSVFiles } from './csv-library.js';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ─── App State ────────────────────────────────────────────────────────────────

const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  signalsData:  []
};

// ─── DOM References ───────────────────────────────────────────────────────────

const DOM = {
  // Sidebar nav links
  navDashboard:       document.getElementById('nav-dashboard'),
  navMySignals:       document.getElementById('nav-my-signals'),
  navRegisterSignal:  document.getElementById('nav-register-signal'),
  navUserProfile:     document.getElementById('nav-user-profile'),

  // Page sections
  pageDashboard:      document.getElementById('page-dashboard'),
  pageMySignals:      document.getElementById('page-my-signals'),
  pageRegisterSignal: document.getElementById('page-register-signal'),
  pageUserProfile:    document.getElementById('page-user-profile'),

  // CSV upload
  csvUploadInput:     document.getElementById('csv-upload-input'),
  csvUploadBtn:       document.getElementById('csv-upload-btn'),
  csvUploadStatus:    document.getElementById('csv-upload-status'),

  // Signals table
  signalsTableBody:   document.getElementById('signals-table-body'),
  signalsCount:       document.getElementById('signals-count'),

  // User info
  userDisplayName:    document.getElementById('user-display-name'),
  userEmail:          document.getElementById('user-email')
};

// ─── Navigation ───────────────────────────────────────────────────────────────

const PAGES = ['dashboard', 'my-signals', 'register-signal', 'user-profile'];

/**
 * Show a page section and hide all others.
 * @param {string} pageId - e.g. 'dashboard'
 */
function navigateTo(pageId) {
  PAGES.forEach(id => {
    const pageEl = document.getElementById(`page-${id}`);
    const navEl  = document.getElementById(`nav-${id}`);
    if (pageEl) pageEl.classList.add('d-none');
    if (navEl)  navEl.classList.remove('active');
  });

  const target    = document.getElementById(`page-${pageId}`);
  const targetNav = document.getElementById(`nav-${pageId}`);
  if (target)    target.classList.remove('d-none');
  if (targetNav) targetNav.classList.add('active');

  AppState.currentPage = pageId;
}

/**
 * Bind sidebar navigation click events.
 */
function initNavigation() {
  PAGES.forEach(id => {
    const navEl = document.getElementById(`nav-${id}`);
    if (navEl) {
      navEl.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(id);
      });
    }
  });
}

// ─── Auth State ───────────────────────────────────────────────────────────────

function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      AppState.currentUser = user;
      if (DOM.userDisplayName) DOM.userDisplayName.textContent = user.displayName || 'Trader';
      if (DOM.userEmail)       DOM.userEmail.textContent = user.email || '';
      loadSignalsLibrary();
    } else {
      AppState.currentUser = null;
      // Redirect to login if not authenticated
      // window.location.href = '/login.html';
      console.warn('[Auth] No user logged in (DEV mode - auth check bypassed).');
      loadSignalsLibrary(); // Load data in DEV mode without auth gate
    }
  });
}

// ─── CSV Upload ───────────────────────────────────────────────────────────────

function initCSVUpload() {
  if (DOM.csvUploadBtn && DOM.csvUploadInput) {
    DOM.csvUploadBtn.addEventListener('click', () => {
      DOM.csvUploadInput.click();
    });

    DOM.csvUploadInput.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploadStatus('processing', `Processing ${files.length} file(s)...`);

      try {
        const { mergedRows, allErrors } = await processMultipleCSVFiles(files);

        if (allErrors.length > 0) {
          console.warn('[CSV Upload] Errors:', allErrors);
          const errSummary = allErrors.map(e => `${e.file}: ${e.errors.join('; ')}`).join('\n');
          setUploadStatus('warning', `Uploaded with warnings. Check console. ${mergedRows.length} records processed.`);
        } else {
          setUploadStatus('success', `Successfully processed ${mergedRows.length} records.`);
        }

        await saveSignalsToFirestore(mergedRows);
        await loadSignalsLibrary();

      } catch (err) {
        console.error('[CSV Upload] Fatal error:', err);
        setUploadStatus('error', `Upload failed: ${err.message}`);
      }

      // Reset file input
      DOM.csvUploadInput.value = '';
    });
  }
}

/**
 * Set the upload status message and style.
 * @param {'processing'|'success'|'warning'|'error'} type
 * @param {string} message
 */
function setUploadStatus(type, message) {
  if (!DOM.csvUploadStatus) return;
  const classMap = {
    processing: 'text-info',
    success:    'text-success',
    warning:    'text-warning',
    error:      'text-danger'
  };
  DOM.csvUploadStatus.className = classMap[type] || 'text-muted';
  DOM.csvUploadStatus.textContent = message;
}

// ─── Firestore Operations ─────────────────────────────────────────────────────

/**
 * Save merged signal rows to Firestore (signals_library collection).
 * Each document ID = `${eaName}_${signalId}` (Keep-Latest key).
 * @param {Object[]} rows
 */
async function saveSignalsToFirestore(rows) {
  const colRef = collection(db, COLLECTIONS.SIGNALS_LIBRARY);
  const writePromises = rows.map(row => {
    const eaName   = row['Comment'] || 'UNKNOWN';
    const signalId = row['Magic Number'] !== undefined
      ? String(row['Magic Number'])
      : 'MANUAL';
    const docId = `${eaName}_${signalId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(colRef, docId);
    return setDoc(docRef, {
      ...row,
      _updatedAt: new Date().toISOString(),
      _source: 'csv-upload'
    }, { merge: true });
  });

  await Promise.all(writePromises);
  console.log(`[Firestore] Saved ${rows.length} signal records.`);
}

/**
 * Load all signals from Firestore and render the table.
 */
async function loadSignalsLibrary() {
  try {
    const colRef = collection(db, COLLECTIONS.SIGNALS_LIBRARY);
    const q      = query(colRef, orderBy('_updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    AppState.signalsData = [];
    snapshot.forEach(docSnap => {
      AppState.signalsData.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderSignalsTable(AppState.signalsData);
    updateDashboardStats(AppState.signalsData);

  } catch (err) {
    console.error('[Firestore] Failed to load signals:', err);
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

/**
 * Render the signals table body.
 * @param {Object[]} signals
 */
function renderSignalsTable(signals) {
  if (!DOM.signalsTableBody) return;

  if (signals.length === 0) {
    DOM.signalsTableBody.innerHTML =
      '<tr><td colspan="10" class="text-center text-muted py-4">No signals found. Upload a CSV to get started.</td></tr>';
    if (DOM.signalsCount) DOM.signalsCount.textContent = '0';
    return;
  }

  const rows = signals.map(signal => `
    <tr>
      <td>${escapeHTML(signal['Symbol'] || '-')}</td>
      <td><span class="badge bg-${signal['Type'] === 'buy' ? 'success' : 'danger'}">${escapeHTML(signal['Type'] || '-')}</span></td>
      <td>${formatDateTime(signal['Open Time'])}</td>
      <td>${formatDateTime(signal['Close Time'])}</td>
      <td>${formatNumber(signal['Lots'])}</td>
      <td>${formatNumber(signal['Open Price'])}</td>
      <td>${formatNumber(signal['Close Price'])}</td>
      <td>${formatPips(signal['Net Pips'])}</td>
      <td class="${getProfit(signal['Net Profit']) >= 0 ? 'text-success' : 'text-danger'}">${formatCurrency(signal['Net Profit'])}</td>
      <td>${escapeHTML(signal['Comment'] || '-')}</td>
    </tr>
  `).join('');

  DOM.signalsTableBody.innerHTML = rows;
  if (DOM.signalsCount) DOM.signalsCount.textContent = signals.length;
}

/**
 * Update dashboard summary statistics.
 * @param {Object[]} signals
 */
function updateDashboardStats(signals) {
  const totalSignals = signals.length;
  const totalProfit  = signals.reduce((sum, s) => sum + getProfit(s['Net Profit']), 0);
  const winners      = signals.filter(s => getProfit(s['Net Profit']) > 0).length;
  const winRate      = totalSignals > 0 ? ((winners / totalSignals) * 100).toFixed(1) : '0.0';

  setStatEl('stat-total-signals', totalSignals);
  setStatEl('stat-total-profit',  formatCurrency(totalProfit));
  setStatEl('stat-win-rate',      `${winRate}%`);
  setStatEl('stat-winners',       winners);
}

function setStatEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '-' : n.toFixed(2);
}

function formatPips(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '-' : (n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
}

function formatCurrency(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '-' : (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
}

function formatDateTime(val) {
  if (!val) return '-';
  if (val instanceof Date) {
    return val.toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
  }
  return String(val);
}

function getProfit(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  initNavigation();
  initAuth();
  initCSVUpload();
  navigateTo('dashboard');
  console.log('[Signal Helper] App initialized - DEV v0.1.0');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
