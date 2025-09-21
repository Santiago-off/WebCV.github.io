document.addEventListener('DOMContentLoaded', () => {
    // --- Traducciones para la página de servicios ---
    const translations = {
        es: {
            'services-title': 'Mis Servicios',
            'services-page-intro': 'Soluciones tecnológicas a medida para construir, mantener y optimizar tus proyectos digitales. Explora los planes y descubre cómo puedo ayudarte.',
            'services-page-note': 'Nota: Los precios son estimaciones. ¡Contáctame para un presupuesto personalizado!',
            'quote-btn': 'Solicitar Presupuesto',
            'feature-header': 'Característica',
            'price-header': 'Precio',

            'web-dev-title': 'Desarrollo Web Completo',
            'web-dev-plan1-title': 'Básico (Landing Page)',
            'web-dev-plan1-price': 'Desde 400€',
            'web-dev-plan1-feat1': '1 (Página única)',
            'web-dev-plan1-feat2': 'Basado en plantilla',
            'web-dev-plan2-title': 'Profesional (Sitio Corporativo)',
            'web-dev-plan2-price': 'Desde 1,200€',
            'web-dev-plan2-feat1': 'Hasta 5 páginas',
            'web-dev-plan2-feat2': 'Diseño personalizado',
            'web-dev-plan2-feat3': 'Integración CMS (Opcional)',
            'web-dev-plan3-title': 'Premium (Aplicación Web)',
            'web-dev-plan3-price': 'Desde 3,000€',
            'web-dev-plan3-feat1': 'Páginas y funciones ilimitadas',
            'web-dev-plan3-feat2': 'Diseño UX/UI avanzado',
            'web-dev-plan3-feat3': 'Panel a medida',
            'web-dev-feat-pages': 'Páginas',
            'web-dev-feat-design': 'Diseño',
            'web-dev-feat-backend': 'Backend y BBDD',
            'web-dev-feat-admin': 'Panel de Administración',
            'web-dev-feat-seo': 'SEO Básico',
            'web-dev-feat-hosting': 'Dominio y Hosting (1er año)',

            'ciber-title': 'Servicios de Ciberseguridad',
            'ciber-plan1-title': 'Auditoría de Seguridad',
            'ciber-plan1-price': 'Desde 500€',
            'ciber-plan2-title': 'Pentesting Web',
            'ciber-plan2-price': 'Desde 1,500€',
            'ciber-feat-scan': 'Análisis de vulnerabilidades',
            'ciber-feat-config': 'Revisión de configuración',
            'ciber-feat-exploit': 'Intento de explotación (OWASP Top 10)',
            'ciber-feat-report': 'Informe de hallazgos',
            'ciber-feat-remediation': 'Plan de remediación',

            'cloud-title': 'Cloud & DevOps',
            'cloud-plan1-title': 'Despliegue de Infraestructura',
            'cloud-plan1-price': 'Desde 600€',
            'cloud-plan2-title': 'Automatización CI/CD',
            'cloud-plan2-price': 'Desde 950€',
            'cloud-feat-infra': 'Infraestructura como Código (IaC)',
            'cloud-feat-container': 'Gestión de Contenedores (Docker)',
            'cloud-feat-pipeline': 'Pipeline de Integración Continua',
            'cloud-feat-deploy': 'Pipeline de Despliegue Continuo',
            'cloud-feat-monitoring': 'Monitorización y Alertas',

            'maintenance-title': 'Mantenimiento Web (Suscripción)',
            'maintenance-plan1-title': 'Básico',
            'maintenance-plan1-price': '75€ / mes',
            'maintenance-plan2-title': 'Avanzado',
            'maintenance-plan2-price': '150€ / mes',
            'maintenance-feat-updates': 'Actualizaciones (Core, Plugins)',
            'maintenance-feat-backups': 'Copias de Seguridad',
            'maintenance-plan1-feat-backups': 'Mensuales',
            'maintenance-plan2-feat-backups': 'Semanales',
            'maintenance-feat-security': 'Escaneo de Seguridad',
            'maintenance-feat-uptime': 'Monitorización Uptime',
            'maintenance-feat-support': 'Horas de Soporte',
            'maintenance-plan1-feat-support': '1h / mes',
            'maintenance-plan2-feat-support': '3h / mes',

            'db-title': 'Servicios de Bases de Datos',
            'db-plan1-title': 'Diseño y Creación',
            'db-plan1-price': 'Desde 450€',
            'db-plan2-title': 'Gestión y Optimización',
            'db-plan2-price': 'Desde 250€',
            'db-feat-schema': 'Diseño de Esquema (SQL/NoSQL)',
            'db-feat-optimization': 'Optimización de Consultas',
            'db-feat-maintenance': 'Mantenimiento y Backups',
        },
        en: {
            'services-title': 'My Services',
            'services-page-intro': 'Custom tech solutions to build, maintain, and optimize your digital projects. Explore the plans and discover how I can help you.',
            'services-page-note': 'Note: Prices are estimates. Contact me for a custom quote!',
            'quote-btn': 'Request Quote',
            'feature-header': 'Feature',
            'price-header': 'Price',

            'web-dev-title': 'Full Web Development',
            'web-dev-plan1-title': 'Basic (Landing Page)',
            'web-dev-plan1-price': 'From €400',
            'web-dev-plan1-feat1': '1 (Single Page)',
            'web-dev-plan1-feat2': 'Template-based',
            'web-dev-plan2-title': 'Professional (Corporate Site)',
            'web-dev-plan2-price': 'From €1,200',
            'web-dev-plan2-feat1': 'Up to 5 pages',
            'web-dev-plan2-feat2': 'Custom Design',
            'web-dev-plan2-feat3': 'CMS Integration (Optional)',
            'web-dev-plan3-title': 'Premium (Web Application)',
            'web-dev-plan3-price': 'From €3,000',
            'web-dev-plan3-feat1': 'Unlimited pages & features',
            'web-dev-plan3-feat2': 'Advanced UX/UI Design',
            'web-dev-plan3-feat3': 'Custom Admin Panel',
            'web-dev-feat-pages': 'Pages',
            'web-dev-feat-design': 'Design',
            'web-dev-feat-backend': 'Backend & DB',
            'web-dev-feat-admin': 'Admin Panel',
            'web-dev-feat-seo': 'Basic SEO',
            'web-dev-feat-hosting': 'Domain & Hosting (1st year)',

            'ciber-title': 'Cybersecurity Services',
            'ciber-plan1-title': 'Security Audit',
            'ciber-plan1-price': 'From €500',
            'ciber-plan2-title': 'Web Pentesting',
            'ciber-plan2-price': 'From €1,500',
            'ciber-feat-scan': 'Vulnerability scanning',
            'ciber-feat-config': 'Configuration review',
            'ciber-feat-exploit': 'Exploitation attempt (OWASP Top 10)',
            'ciber-feat-report': 'Findings report',
            'ciber-feat-remediation': 'Remediation plan',

            'cloud-title': 'Cloud & DevOps',
            'cloud-plan1-title': 'Infrastructure Deployment',
            'cloud-plan1-price': 'From €600',
            'cloud-plan2-title': 'CI/CD Automation',
            'cloud-plan2-price': 'From €950',
            'cloud-feat-infra': 'Infrastructure as Code (IaC)',
            'cloud-feat-container': 'Container Management (Docker)',
            'cloud-feat-pipeline': 'Continuous Integration Pipeline',
            'cloud-feat-deploy': 'Continuous Deployment Pipeline',
            'cloud-feat-monitoring': 'Monitoring & Alerts',

            'maintenance-title': 'Web Maintenance (Subscription)',
            'maintenance-plan1-title': 'Basic',
            'maintenance-plan1-price': '€75 / month',
            'maintenance-plan2-title': 'Advanced',
            'maintenance-plan2-price': '€150 / month',
            'maintenance-feat-updates': 'Updates (Core, Plugins)',
            'maintenance-feat-backups': 'Backups',
            'maintenance-plan1-feat-backups': 'Monthly',
            'maintenance-plan2-feat-backups': 'Weekly',
            'maintenance-feat-security': 'Security Scan',
            'maintenance-feat-uptime': 'Uptime Monitoring',
            'maintenance-feat-support': 'Support Hours',
            'maintenance-plan1-feat-support': '1h / month',
            'maintenance-plan2-feat-support': '3h / month',

            'db-title': 'Database Services',
            'db-plan1-title': 'Design & Creation',
            'db-plan1-price': 'From €450',
            'db-plan2-title': 'Management & Optimization',
            'db-plan2-price': 'From €250',
            'db-feat-schema': 'Schema Design (SQL/NoSQL)',
            'db-feat-optimization': 'Query Optimization',
            'db-feat-maintenance': 'Maintenance & Backups',
        }
    };

    let currentLang = localStorage.getItem('language') || 'es';

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

    // --- Animación de fondo Vanta.js ---
    if (window.VANTA) {
        VANTA.GLOBE({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x00adb5,      // Color principal de los continentes
            color2: 0xffffff,     // No se usa en el efecto globo
            backgroundColor: 0x222831, // Color del océano
            size: 1.20
        });
    }

    // --- Cursor Personalizado ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            // Usamos clientX/clientY que son relativos a la ventana,
            // lo cual es correcto para un elemento con 'position: fixed'.
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
        });

        // Se unifican los selectores de ambos bloques de código duplicados
        document.querySelectorAll('a, button, .pricing-table .btn-cta').forEach(el => {
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

    // --- Animaciones al hacer Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-category').forEach(card => { // Reutilizamos la clase para la animación
        observer.observe(card);
    });


    // --- Ejecución Inicial ---
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});