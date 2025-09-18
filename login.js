import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

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
            loginError.textContent = "Error: Credenciales incorrectas.";
        });
});