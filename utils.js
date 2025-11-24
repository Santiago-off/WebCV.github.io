// utils.js

/**
 * Inicializa la animación del cursor personalizado.
 */
export function initializeCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', e => {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    });

    const interactiveElements = 'a, button, input, textarea, label';
    document.querySelectorAll(interactiveElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(0, 173, 181, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

/**
 * Obtiene información del visitante (IP, navegador, SO, dispositivo).
 * @returns {Promise<object|null>}
 */
export async function getVisitorInfo() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        const ua = navigator.userAgent;
        let browser = 'Desconocido', os = 'Desconocido', device = 'Escritorio';

        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';

        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Macintosh')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('like Mac')) os = 'iOS';

        if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) device = 'Móvil/Tablet';

        return { ip, browser, os, device };
    } catch (error) {
        console.error("Error obteniendo información del visitante:", error);
        return null;
    }
}

/**
 * Guarda la información de la visita en Firestore.
 * @param {import("firebase/firestore").Firestore} db - Instancia de Firestore.
 * @param {import("firebase/auth").User | null} user - El usuario actual.
 * @param {import("firebase/firestore").serverTimestamp} serverTimestamp - Función de timestamp del servidor.
 * @param {Function} addDoc - Función addDoc de Firestore.
 * @param {Function} collection - Función collection de Firestore.
 */
export async function saveVisit(db, user, serverTimestamp, addDoc, collection) {
    if (sessionStorage.getItem('visit_recorded')) return;
    sessionStorage.setItem('visit_recorded', 'true');
    const visitInfo = await getVisitorInfo();
    if (visitInfo) {
        try {
            const dataToSave = { ...visitInfo, timestamp: serverTimestamp(), page: window.location.pathname };
            if (user) {
                dataToSave.userEmail = user.email;
                dataToSave.userName = user.displayName;
            }
            await addDoc(collection(db, "visits"), dataToSave);
        } catch (error) {
            console.error("Error al guardar la visita en Firestore:", error);
        }
    }
}