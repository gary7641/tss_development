/**
 * firebase-config.js
 * Signal Helper - TSS Development
 * Version: 0.1.0
 *
 * Firebase initialization for the DEV environment (tss_development).
 * Replace the firebaseConfig values with actual credentials from
 * Firebase Console > Project Settings > Your apps.
 *
 * DO NOT commit real credentials. Use environment variables or
 * GitHub Secrets for production deployment.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ─── DEV Firebase Configuration ──────────────────────────────────────────────
// Replace with your actual tss_development Firebase project credentials.

const firebaseConfig = {
  apiKey:            "YOUR_DEV_API_KEY",
  authDomain:        "tss-development.firebaseapp.com",
  projectId:         "tss-development",
  storageBucket:     "tss-development.appspot.com",
  messagingSenderId: "YOUR_DEV_MESSAGING_SENDER_ID",
  appId:             "YOUR_DEV_APP_ID"
};

// ─── Initialize Firebase ──────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);

/**
 * Firestore database instance (DEV).
 * Collection: signals_library
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
  USERS:           'users'
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export { app, db, auth, ENV, COLLECTIONS };
