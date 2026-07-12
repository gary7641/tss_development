/**
 * firebase-config.js
 * Signal Helper - TSS Development
 * Version: 0.1.1
 *
 * Firebase initialization for the DEV environment.
 * Project: Shenxu-Signal-helper (shenxu-signal-helper)
 *
 * Time Zone: HKT (UTC+8), fixed, no DST
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ─── DEV Firebase Configuration ──────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            "AIzaSyAEKxqBSfBnTyHUQRPPGlietw6zlxWeoc0",
  authDomain:        "shenxu-signal-helper.firebaseapp.com",
  projectId:         "shenxu-signal-helper",
  storageBucket:     "shenxu-signal-helper.firebasestorage.app",
  messagingSenderId: "1038211644480",
  appId:             "1:1038211644480:web:d8fccc727294df4b1233a5",
  measurementId:     "G-K3FVLTNDEE"
};

// ─── Initialize Firebase ──────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);

/**
 * Firestore database instance (DEV).
 */
const db = getFirestore(app);

/**
 * Firebase Auth instance (DEV).
 */
const auth = getAuth(app);

// ─── Environment Flag ─────────────────────────────────────────────────────────

const ENV = 'development';

// ─── Firestore Collection Names ───────────────────────────────────────────────

const COLLECTIONS = {
  SIGNALS_LIBRARY: 'signals_library',
  USERS:           'users',
  ADMINS:          'admins'
};

// ─── Admin Whitelist (DEV) ────────────────────────────────────────────────────
// These emails are the only accounts allowed full admin access in DEV.

const ADMIN_EMAILS = [
  'gary7641@gmail.com',
  'shenxu.gary@gmail.com'
];

/**
 * Check if the currently logged-in user is an admin.
 * @param {import('firebase/auth').User} user
 * @returns {boolean}
 */
function isAdmin(user) {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { app, db, auth, ENV, COLLECTIONS, ADMIN_EMAILS, isAdmin };
