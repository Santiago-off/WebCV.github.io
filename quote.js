import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const plan = params.get('plan');
    let currentLang = localStorage.getItem('language') || 'es';

    const serviceDetails = {
        es: {
            'web-dev': { 
                title: 'Desarrollo Web Completo',
                plans: {
                    'basic': { name: 'Básico (Landing Page)', price: 'Desde 300€' },
                    'professional': { name: 'Profesional (Sitio Corporativo)', price: 'Desde 850€' },
                    'premium': { name: 'Premium (Aplicación Web)', price: 'Desde 2,200€' }
                }
            },
            'cyber': {
                title: 'Servicios de Ciberseguridad',
                plans: {
                    'audit': { name: 'Auditoría de Seguridad', price: 'Desde 400€' },
                    'pentesting': { name: 'Pentesting Web', price: 'Desde 1,100€' }
                }
            },
            'cloud': {
                title: 'Cloud & DevOps',
                plans: {
                    'deploy': { name: 'Despliegue de Infraestructura', price: 'Desde 450€' },
                    'automation': { name: 'Automatización CI/CD', price: 'Desde 750€' }
                }
            },
            'maintenance': {
                title: 'Mantenimiento Web',
                plans: {
                    'basic': { name: 'Básico', price: '50€ / mes' },
                    'advanced': { name: 'Avanzado', price: '100€ / mes' }
                }
            }
        },
        en: {
            'web-dev': { 
                title: 'Full Web Development',
                plans: {
                    'basic': { name: 'Basic (Landing Page)', price: 'From €300' },
                    'professional': { name: 'Professional (Corporate Site)', price: 'From €850' },
                    'premium': { name: 'Premium (Web Application)', price: 'From €2,200' }
                }
            },
            'cyber': {
                title: 'Cybersecurity Services',
                plans: {
                    'audit': { name: 'Security Audit', price: 'From €400' },
                    'pentesting': { name: 'Web Pentesting', price: 'From €1,100' }
                }
            },
            'cloud': {
                title: 'Cloud & DevOps',
                plans: {
                    'deploy': { name: 'Infrastructure Deployment', price: 'From €450' },
                    'automation': { name: 'CI/CD Automation', price: 'From €750' }
                }
            },
            'maintenance': {
                title: 'Web Maintenance',
                plans: {
                    'basic': { name: 'Basic', price: '€50 / month' },
                    'advanced': { name: 'Advanced', price: '€100 / month' }
                }
            }
        }
    };

    const translations = {
        es: {
            'quote-title': 'Solicitar Presupuesto', 'nav-home': 'Inicio', 'nav-services': 'Servicios',
            'quote-main-title': 'Finalizar Solicitud de Presupuesto', 'contact-details-title': 'Tus Datos de Contacto',
            'form-label-name': 'Nombre Completo', 'form-label-email': 'Correo Electrónico',
            'payment-method-title': 'Método de Pago Preferido',
            'payment-method-note': 'Esto no es un pago real. Es para saber tu preferencia y agilizar el proceso.',
            'payment-transfer': 'Transferencia Bancaria', 'payment-paypal': 'PayPal', 'payment-other': 'Otro / A discutir',
            'notes-title': 'Notas Adicionales', 'notes-placeholder': '¿Algún detalle específico que debamos saber?',
            'submit-quote-btn': 'Enviar Solicitud', 'summary-title': 'Resumen del Pedido',
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
            'payment-transfer': 'Bank Transfer', 'payment-paypal': 'PayPal', 'payment-other': 'Other / To be discussed',
            'notes-title': 'Additional Notes', 'notes-placeholder': 'Any specific details we should know?',
            'submit-quote-btn': 'Send Request', 'summary-title': 'Order Summary',
            'loading-summary': 'Loading...', 'summary-footer-note': 'You will receive a response with a detailed quote and the next steps in less than 24 hours.',
            'summary-service': 'Service', 'summary-plan': 'Selected Plan', 'summary-price': 'Estimated Price',
            'success-msg': 'Request sent! We will contact you soon.', 'error-msg': 'Please fill in all fields.'
        }
    };

    function renderSummary() {
        const summaryContainer = document.getElementById('summary-content');
        const serviceData = serviceDetails[currentLang][service];
        const planData = serviceData?.plans[plan];

        if (serviceData && planData) {
            summaryContainer.innerHTML = `
                <div class="summary-item">
                    <strong data-translate="summary-service">${translations[currentLang]['summary-service']}</strong>
                    <span>${serviceData.title}</span>
                </div>
                <div class="summary-item">
                    <strong data-translate="summary-plan">${translations[currentLang]['summary-plan']}</strong>
                    <span>${planData.name}</span>
                </div>
                <div class="summary-item">
                    <strong data-translate="summary-price">${translations[currentLang]['summary-price']}</strong>
                    <span>${planData.price}</span>
                </div>
            `;
        } else {
            summaryContainer.innerHTML = `<p>Error: Servicio o plan no válido.</p>`;
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

    // Inicializar Firebase y Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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

        const newQuote = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            message: document.getElementById('message').value,
            service: serviceDetails[currentLang][service].title,
            plan: serviceDetails[currentLang][service].plans[plan].name,
            price: serviceDetails[currentLang][service].plans[plan].price,
            date: new Date().toISOString(),
            lang: currentLang
        };

        if (!newQuote.name || !newQuote.email) {
            formStatus.textContent = translations[currentLang]['error-msg'];
            formStatus.style.color = '#ff6b6b';
            return;
        }

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

    document.getElementById('current-year').textContent = new Date().getFullYear();
    setLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});