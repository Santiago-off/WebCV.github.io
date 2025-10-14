// firebase-init.js
// Este archivo inicializa Firebase y exporta los servicios que se usarán en la aplicación.
// Importa la configuración desde firebase-config.js (que está ignorado por Git).

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

// Importa la configuración de Firebase desde el archivo local (ignorado por Git)
import { firebaseConfig } from "./firebase-config.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios de Firebase que se usarán
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Exporta los servicios para que puedan ser usados en otros módulos
export { app, auth, db, analytics };