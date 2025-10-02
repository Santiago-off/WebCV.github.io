document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        es: {
            'nav-home': 'Inicio',
            'services-title': 'Mis Servicios',
            'services-page-intro': 'Soluciones tecnológicas a medida para impulsar tus proyectos. Explora los planes y descubre cómo puedo ayudarte a alcanzar tus objetivos.',
            'services-page-note': 'Nota: Los precios son estimaciones. ¡Empresas, entidades y proyectos a largo plazo pueden optar a descuentos especiales! Contáctame para un presupuesto personalizado.',
            'quote-btn': 'Solicitar Presupuesto',
            'details-btn': 'Ver detalles',
            'featured-tag': 'Recomendado',

            'web-dev-title': 'Desarrollo Web Completo',
            'web-dev-plan1-title': 'Básico (Landing Page)',
            'web-dev-plan1-price': 'Desde 300€',
            'web-dev-plan1-feat1': '✓ 1 Página única',
            'web-dev-plan1-feat2': '✓ Diseño responsive',
            'web-dev-plan1-details': [
                'Ideal para presentar un producto, evento o perfil profesional. Una página única y directa.',
                'Diseño limpio y moderno basado en una estructura predefinida y adaptada a tu marca.',
                'Optimización para móviles, tablets y ordenadores.',
                'Formulario de contacto funcional.',
                'Optimización SEO inicial para mejorar la visibilidad en buscadores.'
            ],
            'web-dev-plan2-title': 'Profesional (Sitio Corporativo)',
            'web-dev-plan2-price': 'Desde 850€',
            'web-dev-plan2-feat1': '✓ Hasta 5 páginas',
            'web-dev-plan2-feat2': '✓ Diseño personalizado',
            'web-dev-plan2-feat3': '✓ Integración CMS (Opcional)',
            'web-dev-plan2-details': [
                'Perfecto para empresas y profesionales que necesitan una presencia online completa (Inicio, Sobre nosotros, Servicios, Blog, Contacto).',
                'Diseño 100% a medida para reflejar la identidad única de tu marca.',
                'Posibilidad de integrar un Sistema de Gestión de Contenidos (como WordPress o uno a medida) para que puedas actualizar el contenido tú mismo.',
                'Incluye el registro de dominio (.com, .es) y el alojamiento web durante el primer año.'
            ],
            'web-dev-plan3-title': 'Premium (Aplicación Web)',
            'web-dev-plan3-price': 'Desde 2,200€',
            'web-dev-plan3-feat1': '✓ Páginas y funciones ilimitadas',
            'web-dev-plan3-feat2': '✓ Diseño UX/UI avanzado',
            'web-dev-plan3-feat3': '✓ Panel de administración a medida',
            'web-dev-plan3-details': [
                'Para proyectos complejos que requieren lógica de negocio, bases de datos y funcionalidades interactivas (plataformas, SaaS, áreas de clientes).',
                'Proceso completo de diseño de experiencia de usuario (UX) e interfaz de usuario (UI) para garantizar la máxima usabilidad.',
                'Desarrollo de un backend robusto y una base de datos escalable.',
                'Creación de un panel de control a medida para gestionar todos los aspectos de la aplicación.'
            ],
            'web-dev-feat-backend': '✓ Backend y Base de Datos',
            'web-dev-feat-seo': 'SEO Básico',
            'web-dev-feat-hosting': 'Dominio y Hosting (1er año)',

            'ciber-title': 'Servicios de Ciberseguridad',
            'ciber-plan1-title': 'Auditoría de Seguridad',
            'ciber-plan1-price': 'Desde 400€',
            'ciber-plan1-details': [
                'Análisis exhaustivo de tu sitio web o aplicación en busca de vulnerabilidades conocidas y malas configuraciones de seguridad.',
                'Se entrega un informe detallado con los hallazgos clasificados por nivel de riesgo.',
                'Ideal para tener una visión clara del estado de seguridad actual de tu proyecto.'
            ],
            'ciber-plan2-title': 'Pentesting Web',
            'ciber-plan2-price': 'Desde 1,100€',
            'ciber-plan2-details': [
                'Simulación de un ataque real contra tu aplicación web para identificar y explotar vulnerabilidades de forma controlada.',
                'Se cubren las principales categorías de riesgo, como las del OWASP Top 10 (Inyección SQL, XSS, etc.).',
                'El informe final incluye no solo los hallazgos, sino también pruebas de concepto y un plan de remediación detallado para solucionar cada problema.'
            ],
            'ciber-feat-scan': '✓ Análisis de vulnerabilidades',
            'ciber-feat-config': '✓ Revisión de configuración',
            'ciber-feat-exploit': '✓ Intento de explotación (OWASP Top 10)',
            'ciber-feat-report': '✓ Informe técnico detallado',
            'ciber-feat-remediation': '✓ Plan de remediación',

            'cloud-title': 'Cloud & DevOps',
            'cloud-plan1-title': 'Despliegue de Infraestructura',
            'cloud-plan1-price': 'Desde 450€',
            'cloud-plan1-details': [
                'Diseño y despliegue de tu infraestructura en la nube (AWS, Azure) utilizando plantillas de Infraestructura como Código (Terraform, CloudFormation).',
                'Configuración de redes, servidores virtuales, bases de datos y almacenamiento.',
                'Implementación de un sistema básico de monitorización y alertas para vigilar la salud de la infraestructura.'
            ],
            'cloud-plan2-title': 'Automatización CI/CD',
            'cloud-plan2-price': 'Desde 750€',
            'cloud-plan2-details': [
                'Creación de pipelines de Integración Continua (CI) y Despliegue Continuo (CD) usando herramientas como GitHub Actions o Jenkins.',
                'Automatiza las pruebas, la construcción y el despliegue de tu aplicación, reduciendo errores y acelerando la entrega de nuevas funcionalidades.',
                'Configuración de un sistema de monitorización avanzado con dashboards y alertas proactivas.'
            ],
            'cloud-feat-infra': '✓ Infraestructura como Código (IaC)',
            'cloud-feat-container': '✓ Gestión de Contenedores (Docker)',
            'cloud-feat-pipeline': '✓ Pipeline de Integración Continua',
            'cloud-feat-deploy': '✓ Pipeline de Despliegue Continuo',
            'cloud-feat-monitoring': '✓ Monitorización y Alertas',

            'maintenance-title': 'Mantenimiento Web (Suscripción)',
            'maintenance-plan1-title': 'Básico',
            'maintenance-plan1-price': '50€ / mes',
            'maintenance-plan1-details': [
                'Servicio mensual para mantener tu web segura y actualizada.',
                'Incluye actualizaciones de seguridad del core y plugins.',
                'Realización de una copia de seguridad completa de tu sitio cada mes.',
                'Escaneo periódico en busca de malware y vulnerabilidades.'
            ],
            'maintenance-plan2-title': 'Avanzado',
            'maintenance-plan2-price': '100€ / mes',
            'maintenance-plan2-details': [
                'Todo lo incluido en el plan Básico, más:',
                'Copias de seguridad más frecuentes (semanales) para mayor tranquilidad.',
                'Monitorización 24/7 del estado de tu web. Si se cae, soy el primero en saberlo y actuar.',
                'Bolsa de 3 horas mensuales para soporte técnico, pequeñas modificaciones o consultoría.'
            ],
            'maintenance-feat-updates': '✓ Actualizaciones de seguridad',
            'maintenance-plan1-feat-backups': '✓ Copias de seguridad mensuales',
            'maintenance-plan2-feat-backups': '✓ Copias de seguridad semanales',
            'maintenance-feat-security': '✓ Escaneo de seguridad',
            'maintenance-feat-uptime': '✓ Monitorización Uptime 24/7',
            'maintenance-plan2-feat-support': '✓ 3h de soporte técnico',
        },
        en: {
            'nav-home': 'Home',
            'services-title': 'My Services',
            'services-page-intro': 'Custom tech solutions to boost your projects. Explore the plans and discover how I can help you achieve your goals.',
            'services-page-note': 'Note: Prices are estimates. Companies, entities, and long-term projects may be eligible for special discounts! Contact me for a custom quote.',
            'quote-btn': 'Request Quote',
            'details-btn': 'View details',
            'featured-tag': 'Recommended',

            'web-dev-title': 'Full Web Development',
            'web-dev-plan1-title': 'Basic (Landing Page)',
            'web-dev-plan1-price': 'From €300',
            'web-dev-plan1-feat1': '✓ 1 Single Page',
            'web-dev-plan1-feat2': '✓ Responsive Design',
            'web-dev-plan1-details': [
                'Ideal for showcasing a product, event, or professional profile. A single, direct page.',
                'Clean and modern design based on a predefined structure adapted to your brand.',
                'Optimization for mobile, tablets, and desktops.',
                'Functional contact form.',
                'Initial SEO optimization to improve search engine visibility.'
            ],
            'web-dev-plan2-title': 'Professional (Corporate Site)',
            'web-dev-plan2-price': 'From €850',
            'web-dev-plan2-feat1': '✓ Up to 5 pages',
            'web-dev-plan2-feat2': '✓ Custom Design',
            'web-dev-plan2-feat3': '✓ CMS Integration (Optional)',
            'web-dev-plan2-details': [
                'Perfect for businesses and professionals needing a complete online presence (Home, About, Services, Blog, Contact).',
                '100% custom design to reflect your brand\'s unique identity.',
                'Option to integrate a Content Management System (like WordPress or a custom one) so you can update the content yourself.',
                'Includes domain registration (.com, .es) and web hosting for the first year.'
            ],
            'web-dev-plan3-title': 'Premium (Web Application)',
            'web-dev-plan3-price': 'From €2,200',
            'web-dev-plan3-feat1': '✓ Unlimited pages & features',
            'web-dev-plan3-feat2': '✓ Advanced UX/UI Design',
            'web-dev-plan3-feat3': '✓ Custom Admin Panel',
            'web-dev-plan3-details': [
                'For complex projects requiring business logic, databases, and interactive features (platforms, SaaS, client areas).',
                'Complete User Experience (UX) and User Interface (UI) design process to ensure maximum usability.',
                'Development of a robust backend and a scalable database.',
                'Creation of a custom control panel to manage all aspects of the application.'
            ],
            'web-dev-feat-backend': '✓ Backend & Database',
            'web-dev-feat-seo': 'Basic SEO',
            'web-dev-feat-hosting': 'Domain & Hosting (1st year)',

            'ciber-title': 'Cybersecurity Services',
            'ciber-plan1-title': 'Security Audit',
            'ciber-plan1-price': 'From €400',
            'ciber-plan1-details': [
                'Exhaustive analysis of your website or application for known vulnerabilities and security misconfigurations.',
                'A detailed report is delivered with findings classified by risk level.',
                'Ideal for getting a clear picture of your project\'s current security status.'
            ],
            'ciber-plan2-title': 'Web Pentesting',
            'ciber-plan2-price': 'From €1,100',
            'ciber-plan2-details': [
                'Simulation of a real attack against your web application to identify and exploit vulnerabilities in a controlled manner.',
                'Covers major risk categories, such as the OWASP Top 10 (SQL Injection, XSS, etc.).',
                'The final report includes not only the findings but also proofs of concept and a detailed remediation plan to fix each issue.'
            ],
            'ciber-feat-scan': '✓ Vulnerability scanning',
            'ciber-feat-config': '✓ Configuration review',
            'ciber-feat-exploit': '✓ Exploitation attempt (OWASP Top 10)',
            'ciber-feat-report': '✓ Detailed technical report',
            'ciber-feat-remediation': '✓ Remediation plan',

            'cloud-title': 'Cloud & DevOps',
            'cloud-plan1-title': 'Infrastructure Deployment',
            'cloud-plan1-price': 'From €450',
            'cloud-plan1-details': [
                'Design and deployment of your cloud infrastructure (AWS, Azure) using Infrastructure as Code (IaC) templates (Terraform, CloudFormation).',
                'Configuration of networks, virtual servers, databases, and storage.',
                'Implementation of a basic monitoring and alert system to watch over the infrastructure\'s health.'
            ],
            'cloud-plan2-title': 'CI/CD Automation',
            'cloud-plan2-price': 'From €750',
            'cloud-plan2-details': [
                'Creation of Continuous Integration (CI) and Continuous Deployment (CD) pipelines using tools like GitHub Actions or Jenkins.',
                'Automates testing, building, and deploying your application, reducing errors and speeding up the delivery of new features.',
                'Setup of an advanced monitoring system with dashboards and proactive alerts.'
            ],
            'cloud-feat-infra': '✓ Infrastructure as Code (IaC)',
            'cloud-feat-container': '✓ Container Management (Docker)',
            'cloud-feat-pipeline': '✓ Continuous Integration Pipeline',
            'cloud-feat-deploy': '✓ Continuous Deployment Pipeline',
            'cloud-feat-monitoring': '✓ Monitoring & Alerts',

            'maintenance-title': 'Web Maintenance (Subscription)',
            'maintenance-plan1-title': 'Basic',
            'maintenance-plan1-price': '€50 / month',
            'maintenance-plan1-details': [
                'Monthly service to keep your website secure and up-to-date.',
                'Includes core and plugin security updates.',
                'Performs a full backup of your site every month.',
                'Periodic scanning for malware and vulnerabilities.'
            ],
            'maintenance-plan2-title': 'Advanced',
            'maintenance-plan2-price': '€100 / month',
            'maintenance-plan2-details': [
                'Everything in the Basic plan, plus:',
                'More frequent backups (weekly) for greater peace of mind.',
                '24/7 uptime monitoring. If your site goes down, I\'m the first to know and act.',
                'A bucket of 3 hours per month for technical support, minor changes, or consulting.'
            ],
            'maintenance-feat-updates': '✓ Security Updates',
            'maintenance-plan1-feat-backups': '✓ Monthly Backups',
            'maintenance-plan2-feat-backups': '✓ Weekly Backups',
            'maintenance-feat-security': '✓ Security Scan',
            'maintenance-feat-uptime': '✓ 24/7 Uptime Monitoring',
            'maintenance-plan2-feat-support': '✓ 3h of tech support',
        }
    };

    let currentLang = localStorage.getItem('language') || 'es';
    let vantaEffect = null;
    const modal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-category').forEach(card => {
        observer.observe(card);
    });

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

    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        if (theme === 'dark') {
            themeToggle.classList.add('dark');
        } else {
            themeToggle.classList.remove('dark');
        }
        initializeVanta(theme);
    }

    function setup3dTiltEffect() {
        const cards = document.querySelectorAll('.pricing-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                const rotateX = (y / height - 0.5) * -20; // Invertido para que sea más intuitivo
                const rotateY = (x / width - 0.5) * 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                // Si es la tarjeta destacada, vuelve a su escala normal, si no, resetea completamente.
                if (card.classList.contains('featured')) {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1.05)';
                } else {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                }
            });
        });
    }

    function openModal(service, plan) {
        const titleKey = `${service.replace('-', '_')}-plan${plan.slice(-1)}-title`;
        const detailsKey = `${service.replace('-', '_')}-plan${plan.slice(-1)}-details`;
        
        const planTitle = translations[currentLang][titleKey] || 'Detalles del Plan';
        const planDetails = translations[currentLang][detailsKey] || ['No hay detalles disponibles.'];

        modalTitle.textContent = planTitle;
        modalBody.innerHTML = planDetails.map(p => `<p>${p}</p>`).join('');
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    // --- Inicialización ---

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

    // Configurar el tema
    const preferredTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(preferredTheme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Restaurar animación del cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
        });

        document.querySelectorAll('a, button, input, textarea').forEach(el => {
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

    // Event Listeners para el Modal
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', () => openModal(button.dataset.service, button.dataset.plan));
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    setup3dTiltEffect();
});