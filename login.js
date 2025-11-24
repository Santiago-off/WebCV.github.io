import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
import { initializeCustomCursor } from "./utils.js";

// --- Traducciones ---
const translations = {
    es: {
        'login-title': 'Acceso al Panel',
        'login-email-placeholder': 'Correo Electrónico',
        'login-password-placeholder': 'Contraseña',
        'login-button': 'Iniciar Sesión',
        'login-error-incorrect': 'Error: Credenciales incorrectas.'
    },
    en: {
        'login-title': 'Panel Access',
        'login-email-placeholder': 'Email Address',
        'login-password-placeholder': 'Password',
        'login-button': 'Log In',
        'login-error-incorrect': 'Error: Incorrect credentials.'
    }
};

let currentLang = localStorage.getItem('language') || 'es';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-translate], [data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translate || el.dataset.translatePlaceholder;
        if (translations[lang][key]) {
            el.dataset.translatePlaceholder ? (el.placeholder = translations[lang][key]) : (el.textContent = translations[lang][key]);
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Si el usuario ya ha iniciado sesión, lo redirige directamente al panel de administración.
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'admin.html';
    }
});

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Si el inicio de sesión es exitoso, redirige al panel.
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            // Si hay un error, muestra un mensaje al usuario.
            loginError.textContent = translations[currentLang]['login-error-incorrect'];
        });
});

// --- Ejecución Inicial ---
document.addEventListener('DOMContentLoaded', () => {
    const savedAccent = localStorage.getItem('accentColor');
    if (savedAccent) {
        const h = savedAccent.replace('#','');
        const r = parseInt(h.substring(0,2),16);
        const g = parseInt(h.substring(2,4),16);
        const b = parseInt(h.substring(4,6),16);
        document.documentElement.style.setProperty('--accent', savedAccent);
        document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    setLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    initializeCustomCursor();
});
