import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";


document.addEventListener('DOMContentLoaded', () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const plan = params.get('plan');
    let currentLang = localStorage.getItem('language') || 'es';
    let vantaEffect = null; // Mover vantaEffect aquí
    let currentUser = null;

    const translations = {
        es: {
            'quote-title': 'Solicitar Presupuesto', 'nav-home': 'Inicio', 'nav-services': 'Servicios',
            'quote-main-title': 'Finalizar Solicitud de Presupuesto', 'contact-details-title': 'Tus Datos de Contacto',
            'form-label-name': 'Nombre Completo', 'form-label-email': 'Correo Electrónico',
            'payment-method-title': 'Método de Pago Preferido',
            'payment-method-note': 'Esto no es un pago real. Es para saber tu preferencia y agilizar el proceso.',
            'payment-transfer': 'Transferencia Bancaria',
            'payment-paypal': 'PayPal',
            'payment-other': 'Otro / A discutir',
            'notes-title': 'Notas Adicionales', 'notes-placeholder': '¿Algún detalle específico que debamos saber?',
            'submit-quote-btn': 'Enviar Solicitud', 'summary-title': 'Resumen del Pedido', 'summary-details': 'Detalles del Plan',
            'loading-summary': 'Cargando...', 'summary-footer-note': 'Recibirás una respuesta con el presupuesto detallado y los siguientes pasos en menos de 24 horas.',
            'summary-service': 'Servicio', 'summary-plan': 'Plan Seleccionado', 'summary-price': 'Precio Estimado',
            'success-msg': '¡Solicitud enviada! Nos pondremos en contacto contigo pronto.', 'error-msg': 'Por favor, completa todos los campos.'
        },
        en: {
            'quote-title': 'Request a Quote', 'nav-home': 'Home', 'nav-services': 'Services',
            'quote-main-title': 'Finalize Quote Request', 'contact-details-title': 'Your Contact Details',
            'form-label-name': 'Full Name', 'form-label-email': 'Email Address',
            'payment-method-title': 'Preferred Payment Method',
            'payment-method-note': 'This is not a real payment. It is to know your preference and speed up the process.',
            'payment-transfer': 'Bank Transfer',
            'payment-paypal': 'PayPal',
            'payment-other': 'Other / To be discussed',
            'notes-title': 'Additional Notes', 'notes-placeholder': 'Any specific details we should know?',
            'submit-quote-btn': 'Send Request', 'summary-title': 'Order Summary', 'summary-details': 'Plan Details',
            'loading-summary': 'Loading...', 'summary-footer-note': 'You will receive a response with a detailed quote and the next steps in less than 24 hours.',
            'summary-service': 'Service', 'summary-plan': 'Selected Plan', 'summary-price': 'Estimated Price',
            'success-msg': 'Request sent! We will contact you soon.', 'error-msg': 'Please fill in all fields.'
        }
    };

    function renderSummary() {
        const summaryContainer = document.getElementById('summary-content');
        const allServiceData = (window.serviceTranslations && window.serviceTranslations[currentLang]) || {};

        const planMap = {
            'basic': '1', 'professional': '2', 'premium': '3',
            'audit': '1', 'pentesting': '2',
            'deploy': '1', 'automation': '2',
            'advanced': '2'
        };
        if (service === 'maintenance' && plan === 'basic') planMap['basic'] = '1';

        const planNumber = planMap[plan];
        const serviceKey = service === 'cyber' ? 'ciber' : service;

        if (planNumber && allServiceData[`${serviceKey}-plan${planNumber}-title`]) {
            const serviceTitle = allServiceData[`${serviceKey}-title`];
            const planTitle = allServiceData[`${serviceKey}-plan${planNumber}-title`];
            const planPrice = allServiceData[`${serviceKey}-plan${planNumber}-price`];
            const planDetails = allServiceData[`${serviceKey}-plan${planNumber}-details`];

            const detailsHtml = planDetails 
                ? `<ul class="summary-details-list">${planDetails.map(detail => `<li>${detail}</li>`).join('')}</ul>` 
                : '';

            summaryContainer.innerHTML = `
                <div class="summary-item">
                    <strong data-translate="summary-service">${translations[currentLang]['summary-service']}</strong>
                    <span>${serviceTitle}</span>
                </div>
                <div class="summary-item">
                    <strong data-translate="summary-plan">${translations[currentLang]['summary-plan']}</strong>
                    <span>${planTitle}</span>
                </div>
                <div class="summary-item">
                    <strong data-translate="summary-price">${translations[currentLang]['summary-price']}</strong>
                    <span>${planPrice}</span>
                </div>
                <div class="summary-item">
                    <strong data-translate="summary-details">${translations[currentLang]['summary-details']}</strong>
                    ${detailsHtml}
                </div>
            `;
        } else {
            summaryContainer.innerHTML = `<p>Error: Servicio (${service}) o plan (${plan}) no válido.</p>`;
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-translate], [data-translate-placeholder]').forEach(el => {
            const key = el.dataset.translate || el.dataset.translatePlaceholder;
            if (translations[lang][key]) {
                if (el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        renderSummary();
    }

    function initializeVanta(theme) {
        if (vantaEffect) {
            vantaEffect.destroy();
        }
        if (window.VANTA) {
            vantaEffect = VANTA.GLOBE({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x00adb5, // Accent color
                color2: theme === 'dark' ? 0xeeeeee : 0x333333,
                backgroundColor: theme === 'dark' ? 0x222831 : 0xf4f4f9,
                size: 1.20
            });
        }
    }

    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
        });

        document.querySelectorAll('a, button, input, textarea, label').forEach(el => {
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

    const quoteForm = document.getElementById('quote-form');
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formStatus = document.getElementById('form-status');
        const submitButton = quoteForm.querySelector('.btn-submit');

        if (!currentUser) {
            formStatus.textContent = translations[currentLang]['error-signin-required'];
            formStatus.style.color = '#ff6b6b';
            return;
        }

        const newQuote = {
            name: currentUser.displayName, email: currentUser.email,
            uid: currentUser.uid,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            message: document.getElementById('message').value,
            service: (window.serviceTranslations && window.serviceTranslations[currentLang][`${service === 'cyber' ? 'ciber' : service}-title`]) || service,
            plan: (window.serviceTranslations && window.serviceTranslations[currentLang][`${service === 'cyber' ? 'ciber' : service}-plan${
                plan === 'basic' ? '1' : 
                plan === 'professional' ? '2' : 
                plan === 'premium' ? '3' : 
                plan === 'audit' ? '1' : 
                plan === 'pentesting' ? '2' : 
                plan === 'deploy' ? '1' : 
                plan === 'automation' ? '2' : '2'}-title`]) || plan,
            timestamp: serverTimestamp(), // Usar serverTimestamp para consistencia
            date: new Date().toLocaleString('es-ES'), // Añadir formato legible como respaldo
            lang: currentLang
        };

        submitButton.disabled = true;

        // Guardar en Firestore en lugar de localStorage
        addDoc(collection(db, "quotes"), newQuote)
            .then(() => {
                formStatus.textContent = translations[currentLang]['success-msg'];
                formStatus.style.color = 'var(--accent-color)';
                quoteForm.reset();
                setTimeout(() => window.location.href = 'services.html', 3000);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                formStatus.textContent = 'Error al enviar la solicitud. Inténtalo de nuevo.';
                formStatus.style.color = '#ff6b6b';
                submitButton.disabled = false;
            });
    });

    const getVisitorInfo = async () => {
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
    };

    const saveVisit = async (user) => {
        if (!sessionStorage.getItem('visit_recorded')) {
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
    };

    function handleSignIn() {
        const provider = new GoogleAuthProvider();
        const statusElem = document.getElementById('login-wall-status');
        if (statusElem) {
            statusElem.textContent = 'Redirigiendo a Google...';
        }
        // Inicia el proceso de redirección. No necesita un .catch aquí.
        signInWithPopup(auth, provider);
    }

    function updateUIForUser(user) {
        const loginWall = document.getElementById('login-wall');
        const mainContent = document.getElementById('main-content');

        if (user) {
            loginWall.style.display = 'none';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = 1;
            document.getElementById('user-info-display-quote').textContent = `${user.displayName} (${user.email})`;
            const userInfoDisplay = document.getElementById('user-info-display-quote');
            if (userInfoDisplay) {
                userInfoDisplay.textContent = `${user.displayName} (${user.email})`;
            }
            saveVisit(user); // Registrar visita CON datos de usuario
        } else {
            loginWall.style.display = 'flex';
            mainContent.style.visibility = 'hidden';
            mainContent.style.opacity = 0;
            saveVisit(null); // Registrar visita ANÓNIMA
        }
    }

    // --- Lógica de Autenticación Principal ---
    const wallStatus = document.getElementById('login-wall-status');
    if (wallStatus) wallStatus.textContent = 'Verificando sesión...';

    // Primero, intenta obtener el resultado de la redirección.
    getRedirectResult(auth)
        .then((result) => {
            if (result && result.user) {
                // El usuario acaba de iniciar sesión. onAuthStateChanged se activará.
                if (wallStatus) wallStatus.textContent = '¡Sesión iniciada!';
            } else {
                // No venimos de una redirección, así que comprobamos el estado actual.
                onAuthStateChanged(auth, (user) => {
                    currentUser = user;
                    updateUIForUser(user);
                    if (!user && wallStatus) wallStatus.textContent = ''; // Limpiar mensaje si no hay usuario
                });
            }
        }).catch((error) => {
            console.error("Error durante el resultado de la redirección de Google: ", error);
            if (wallStatus) wallStatus.textContent = 'Error al verificar la cuenta. Inténtalo de nuevo.';
        });

    document.getElementById('google-signin-btn-wall').addEventListener('click', handleSignIn);

    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Cargar nombre desde localStorage si existe (para consistencia con index.html)
    const savedDataJSON = localStorage.getItem('portfolioContent');
    if (savedDataJSON) {
        try {
            const savedData = JSON.parse(savedDataJSON);
            const headerName = document.querySelector('[data-editable="header-name"]');
            if (headerName && savedData[currentLang]?.['header-name']) {
                headerName.textContent = savedData[currentLang]['header-name'];
            }
        } catch (e) {
            console.error("Error al cargar datos del portafolio", e);
        }
    }

    // Inicializar Vanta con el tema por defecto (oscuro)
    initializeVanta('dark');

    setLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});