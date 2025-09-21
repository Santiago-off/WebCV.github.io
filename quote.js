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
                    'basic': { name: 'Básico (Landing Page)', price: 'Desde 350€' },
                    'professional': { name: 'Profesional (Sitio Corporativo)', price: 'Desde 900€' },
                    'premium': { name: 'Premium (Aplicación Web)', price: 'Desde 2,500€' }
                }
            },
            'maintenance': {
                title: 'Mantenimiento Web',
                plans: {
                    'basic': { name: 'Básico', price: '50€ / mes' },
                    'advanced': { name: 'Avanzado', price: '120€ / mes' }
                }
            },
            'db': {
                title: 'Servicios SQL y Bases de Datos',
                plans: {
                    'consultas': { name: 'Consultas y Scripts', price: 'Desde 80€' },
                    'diseno': { name: 'Diseño y Optimización', price: 'Desde 400€' }
                }
            }
        },
        en: {
            'web-dev': { 
                title: 'Full Web Development',
                plans: {
                    'basic': { name: 'Basic (Landing Page)', price: 'From €350' },
                    'professional': { name: 'Professional (Corporate Site)', price: 'From €900' },
                    'premium': { name: 'Premium (Web Application)', price: 'From €2,500' }
                }
            },
            'maintenance': {
                title: 'Web Maintenance',
                plans: {
                    'basic': { name: 'Basic', price: '€50 / month' },
                    'advanced': { name: 'Advanced', price: '€120 / month' }
                }
            },
            'db': {
                title: 'SQL & Database Services',
                plans: {
                    'consultas': { name: 'Queries & Scripts', price: 'From €80' },
                    'diseno': { name: 'Design & Optimization', price: 'From €400' }
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

        renderSummary(); // Re-render summary with new language
    }

    // Form submission
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

        let quotes = JSON.parse(localStorage.getItem('quoteRequests')) || [];
        quotes.push(newQuote);
        localStorage.setItem('quoteRequests', JSON.stringify(quotes));

        formStatus.textContent = translations[currentLang]['success-msg'];
        formStatus.style.color = 'var(--accent-color)';
        submitButton.disabled = true;
        quoteForm.reset();

        setTimeout(() => window.location.href = 'services.html', 3000);
    });

    // Initial Load
    document.getElementById('current-year').textContent = new Date().getFullYear();
    setLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});