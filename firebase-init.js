import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// 1. Inicializa Firebase UNA SOLA VEZ.
const app = initializeApp(firebaseConfig);

// 2. Obtiene los servicios que necesitas.
export const auth = getAuth(app);
export const db = getFirestore(app);

// 3. Exporta los servicios para que otros archivos los puedan usar.