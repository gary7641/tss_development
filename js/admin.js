/**
 * admin.js
 * Admin Console - Signal Helper DEV
 * Version: 0.1.1
 *
 * Handles:
 * - Admin login via Firebase Auth
 * - Admin permission check (ADMIN_EMAILS whitelist)
 * - Dashboard data loading (users, signals, stats)
 * - Navigation and logout
 */

import { db, auth, COLLECTIONS, isAdmin } from './firebase-config.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
    collection,
    getDocs,
    query,
    orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ─── App State ────────────────────────────────────────────────────────────────
const AdminState = {
    currentUser: null,
    isAdmin: false,
    currentSection: 'overview',
    usersData: [],
    signalsData: []
};

// ─── DOM References ───────────────────────────────────────────────────────────
const DOM = {
    loginView: document.getElementById('login-view'),
    dashboardView: document.getElementById('dashboard-view'),
    // Nav links
    navLinks: document.querySelectorAll('.admin-nav-link'),
    // Sections
    sections: {
        overview: document.getElementById('section-overview'),
        users: document.getElementById('section-users'),
        signals: document.getElementById('section-signals'),
        system: document.getElementById('section-system'),             inventory: document.getElementById('section-inventory')
    },
    // Stats
    statTotalUsers: document.getElementById('stat-total-users'),
    statTotalSignals: document.getElementById('stat-total-signals'),
    statAdminUsers: document.getElementById('stat-admin-users'),
    statActiveToday: document.getElementById('stat-active-today'),
    // Tables
    usersTableBody: document.getElementById('users-table-body'),
    usersCount: document.getElementById('users-count'),
    signalsTableBody: document.getElementById('signals-table-body'),
    signalsCount: document.getElementById('signals-count'),
    // System
    systemProject: document.getElementById('system-project'),
    systemUpdated: document.getElementById('system-updated')
};

// ─── Login Flow ───────────────────────────────────────────────────────────────
function initLogin() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                // Check if user is admin
                if (!isAdmin(user)) {
                    await signOut(auth);
                    alert('Access denied. Admin privileges required.');
                    return;
                }
                
                console.log('[Admin] Google login successful:', user.email);
                // Auth state change will handle UI transition
            } catch (err) {
                console.error('[Admin] Google login error:', err);
                alert(`Login failed: ${err.message}`);
            }
        });
    }
}
// ─── Auth State ───────────────────────────────────────────────────────────────
function initAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user && isAdmin(user)) {
            AdminState.currentUser = user;
            AdminState.isAdmin = true;
            showDashboard();
            if (DOM.adminEmailDisplay) {
                DOM.adminEmailDisplay.textContent = user.email;
            }
            await loadDashboardData();
        } else {
            AdminState.currentUser = null;
            AdminState.isAdmin = false;
            showLogin();
        }
    });
}

function showLogin() {
    if (DOM.loginView) DOM.loginView.classList.remove('d-none');
    if (DOM.dashboardView) DOM.dashboardView.classList.add('d-none');
}

function showDashboard() {
    if (DOM.loginView) DOM.loginView.classList.add('d-none');
    if (DOM.dashboardView) DOM.dashboardView.classList.remove('d-none');
    updateClock();
    setInterval(updateClock, 60000); // Update every minute
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function initNavigation() {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionName) {
    // Update nav active state
    DOM.navLinks.forEach(link => {
        if (link.dataset.section === sectionName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show target section
    Object.keys(DOM.sections).forEach(key => {
        const section = DOM.sections[key];
        if (section) {
            if (key === sectionName) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        }
    });
    
    // Update title
    const titles = {
        overview: 'Overview',
        users: 'User Management',
        signals: 'Signals Library',
        system: 'System Status',             inventory: 'Project Inventory'
    };
    if (DOM.dashboardTitle) {
        DOM.dashboardTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    AdminState.currentSection = sectionName;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
function initLogout() {
    if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('[Admin] Logged out');
            } catch (err) {
                console.error('[Admin] Logout error:', err);
            }
        });
    }
}

// ─── Data Loading ─────────────────────────────────────────────────────────────
async function loadDashboardData() {
    await Promise.all([
        loadUsers(),
        loadSignals(),
        loadSystemInfo()
    ]);
    updateStats();
}

async function loadUsers() {
    try {
        const colRef = collection(db, COLLECTIONS.USERS);
        const snapshot = await getDocs(colRef);
        AdminState.usersData = [];
        snapshot.forEach(docSnap => {
            AdminState.usersData.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderUsersTable();
    } catch (err) {
        console.error('[Admin] Failed to load users:', err);
    }
}

async function loadSignals() {
    try {
        const colRef = collection(db, COLLECTIONS.SIGNALS_LIBRARY);
        const q = query(colRef, orderBy('_updatedAt', 'desc'));
        const snapshot = await getDocs(q);
        AdminState.signalsData = [];
        snapshot.forEach(docSnap => {
            AdminState.signalsData.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderSignalsTable();
    } catch (err) {
        console.error('[Admin] Failed to load signals:', err);
    }
}

function loadSystemInfo() {
    if (DOM.systemProject) {
        DOM.systemProject.textContent = 'shenxu-signal-helper';
    }
    if (DOM.systemUpdated) {
        DOM.systemUpdated.textContent = new Date().toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
    }
}

// ─── Rendering ────────────────────────────────────────────────────────────────
function updateStats() {
    const totalUsers = AdminState.usersData.length;
    const totalSignals = AdminState.signalsData.length;
    // Placeholder: Count admins based on ADMIN_EMAILS match
    const adminUsers = AdminState.usersData.filter(u => u.email && isAdminEmail(u.email)).length;
    const activeToday = 0; // Placeholder
    
    setText(DOM.statTotalUsers, totalUsers);
    setText(DOM.statTotalSignals, totalSignals);
    setText(DOM.statAdminUsers, adminUsers);
    setText(DOM.statActiveToday, activeToday);
}

function renderUsersTable() {
    if (!DOM.usersTableBody) return;
    if (AdminState.usersData.length === 0) {
        DOM.usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No users found.</td></tr>';
        if (DOM.usersCount) DOM.usersCount.textContent = '0 users';
        return;
    }
    
    const rows = AdminState.usersData.map(user => {
        const role = isAdminEmail(user.email) ? '<span class="badge bg-warning text-dark">Admin</span>' : '<span class="badge bg-secondary">User</span>';
        return `
            <tr>
                <td>${escapeHTML(user.email || '-')}</td>
                <td>${escapeHTML(user.displayName || '-')}</td>
                <td>${role}</td>
                <td>${formatDateTime(user.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary" disabled>Actions</button>
                </td>
            </tr>
        `;
    }).join('');
    
    DOM.usersTableBody.innerHTML = rows;
    if (DOM.usersCount) DOM.usersCount.textContent = `${AdminState.usersData.length} users`;
}

function renderSignalsTable() {
    if (!DOM.signalsTableBody) return;
    if (AdminState.signalsData.length === 0) {
        DOM.signalsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No signals found.</td></tr>';
        if (DOM.signalsCount) DOM.signalsCount.textContent = '0 signals';
        return;
    }
    
    const rows = AdminState.signalsData.slice(0, 50).map(signal => {
        const profit = getProfit(signal['Net Profit']);
        const profitClass = profit >= 0 ? 'text-success' : 'text-danger';
        return `
            <tr>
                <td>${escapeHTML(signal['Symbol'] || '-')}</td>
                <td><span class="badge bg-${signal['Type'] === 'buy' ? 'success' : 'danger'}">${escapeHTML(signal['Type'] || '-')}</span></td>
                <td class="${profitClass}">${formatCurrency(profit)}</td>
                <td>${escapeHTML(signal['Comment'] || '-')}</td>
                <td class="small text-muted">${formatDateTime(signal['_updatedAt'])}</td>
            </tr>
        `;
    }).join('');
    
    DOM.signalsTableBody.innerHTML = rows;
    if (DOM.signalsCount) DOM.signalsCount.textContent = `${AdminState.signalsData.length} signals`;
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────
function updateClock() {
    if (DOM.currentTime) {
        const now = new Date();
        DOM.currentTime.textContent = now.toLocaleString('en-HK', { 
            timeZone: 'Asia/Hong_Kong',
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }
}

function isAdminEmail(email) {
    // Reuse the isAdmin check logic from firebase-config
    return ['gary7641@gmail.com', 'shenxu.gary@gmail.com'].includes(email);
}

function setText(el, value) {
    if (el) el.textContent = value;
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDateTime(val) {
    if (!val) return '-';
    if (val instanceof Date) {
        return val.toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
    }
    if (typeof val === 'string') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
            return d.toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
        }
    }
    return String(val);
}

function formatCurrency(val) {
    const n = parseFloat(val);
    return isNaN(n) ? '-' : (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
}

function getProfit(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    initLogin();
    initAuth();
    initNavigation();
    initLogout();
    console.log('[Admin Console] Initialized - DEV v0.1.1');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
