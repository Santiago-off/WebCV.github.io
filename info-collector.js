import { db, auth } from './firebase-init.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Evitar que se ejecute en el panel de administración para no registrar las visitas del admin
    if (window.location.pathname.includes('admin.html')) {
        return;
    }

    const getVisitorInfo = async () => {
        try {
            // 1. Obtener IP pública
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;

            // 2. Analizar User Agent para Navegador, SO y Dispositivo
            const ua = navigator.userAgent;
            let browser = 'Desconocido';
            let os = 'Desconocido';
            let device = 'Escritorio';

            // Detectar Navegador
            if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
            else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
            else if (ua.includes('Edge')) browser = 'Edge';
            else if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Safari')) browser = 'Safari';

            // Detectar Sistema Operativo
            if (ua.includes('Windows')) os = 'Windows';
            else if (ua.includes('Macintosh')) os = 'macOS';
            else if (ua.includes('Linux')) os = 'Linux';
            else if (ua.includes('Android')) os = 'Android';
            else if (ua.includes('like Mac')) os = 'iOS'; // Para iPhone/iPad

            // Detectar Dispositivo
            if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
                device = 'Móvil/Tablet';
            }

            return { ip, browser, os, device };

        } catch (error) {
            console.error("Error obteniendo información del visitante:", error);
            return null;
        }
    };

    const saveVisit = async (user) => {
        // Ejecutar solo una vez por sesión para no sobrecargar la base de datos
        if (!sessionStorage.getItem('visit_recorded')) {
            sessionStorage.setItem('visit_recorded', 'true');

            const visitInfo = await getVisitorInfo();
            if (visitInfo) {
                try {
                    const dataToSave = {
                        ...visitInfo,
                        timestamp: serverTimestamp(),
                        page: window.location.pathname
                    };

                    // Si hay un usuario autenticado, añadir su información
                    if (user) {
                        dataToSave.userEmail = user.email;
                        dataToSave.userName = user.displayName;
                    }

                    await addDoc(collection(db, "visits"), dataToSave);
                    console.log("Visita registrada en Firestore.", dataToSave);
                } catch (error) {
                    console.error("Error al guardar la visita en Firestore:", error);
                }
            }
        }
    };

    // Esperar a que el estado de autenticación se resuelva antes de registrar la visita
    onAuthStateChanged(auth, (user) => {
        // 'user' será el objeto del usuario si está logueado, o null si no lo está.
        saveVisit(user);
    });
});