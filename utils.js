// utils.js

/**
 * Inicializa la animación del cursor personalizado.
 */
export function initializeCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cursor.style.display = 'none';
        return;
    }

    let targetX = 0, targetY = 0;
    let rafPending = false;

    function renderCursor() {
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
        rafPending = false;
    }

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(renderCursor);
        }
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
        const el = e.target;
        if (!(el instanceof Element)) return;
        if (el.matches('a, button, input, textarea, label')) {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(0, 173, 181, 0.5)';
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        const el = e.target;
        if (!(el instanceof Element)) return;
        if (el.matches('a, button, input, textarea, label')) {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        }
    }, { passive: true });
}

/**
 * Obtiene información del visitante (IP, navegador, SO, dispositivo).
 * @returns {Promise<object|null>}
 */
export async function getVisitorInfo() {
    try {
        let ip = 'N/A';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
            const ipData = await ipResponse.json();
            ip = ipData.ip || 'N/A';
        } catch (_) {}
        clearTimeout(timeoutId);

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
