document.addEventListener('DOMContentLoaded', () => {
    // --- Traducciones para la página de servicios ---
    const translations = {
        es: {
            'services-title': 'Mis Servicios',
            'services-page-intro': 'Soluciones tecnológicas a medida. Explora mis planes y descubre cómo puedo ayudarte a construir, mantener y optimizar tus proyectos digitales.',
            'services-page-note': 'Nota: Los precios son estimaciones y pueden variar según la complejidad del proyecto. ¡Contáctame para un presupuesto personalizado!',
            'contact-btn': 'Contactar',
            'web-dev-title': 'Desarrollo Web Completo',
            'web-dev-plan1-title': 'Básico (Landing Page)',
            'web-dev-plan1-price': 'Desde 350€',
            'web-dev-plan1-feat1': '✓ Página única estática',
            'web-dev-plan1-feat2': '✓ Diseño responsivo',
            'web-dev-plan1-feat3': '✓ Formulario de contacto',
            'web-dev-plan1-feat4': '✗ Panel de administración',
            'web-dev-plan2-title': 'Profesional (Sitio Corporativo)',
            'web-dev-plan2-price': 'Desde 900€',
            'web-dev-plan2-feat1': '✓ Hasta 5 páginas',
            'web-dev-plan2-feat2': '✓ Diseño personalizado',
            'web-dev-plan2-feat3': '✓ Integración con CMS (opcional)',
            'web-dev-plan2-feat4': '✓ Optimización SEO básica',
            'web-dev-plan3-title': 'Premium (Aplicación Web)',
            'web-dev-plan3-price': 'Desde 2,500€',
            'web-dev-plan3-feat1': '✓ Funcionalidades a medida (JS/Python)',
            'web-dev-plan3-feat2': '✓ Backend y base de datos',
            'web-dev-plan3-feat3': '✓ Panel de administración completo',
            'web-dev-plan3-feat4': '✓ Despliegue en la nube',
            'maintenance-title': 'Mantenimiento Web (Suscripción)',
            'maintenance-plan1-title': 'Básico',
            'maintenance-plan1-price': '50€ / mes',
            'maintenance-plan1-feat1': '✓ Actualizaciones de seguridad',
            'maintenance-plan1-feat2': '✓ Copias de seguridad mensuales',
            'maintenance-plan1-feat3': '✓ Soporte por email',
            'maintenance-plan2-title': 'Avanzado',
            'maintenance-plan2-price': '120€ / mes',
            'maintenance-plan2-feat1': '✓ Todo lo del plan Básico',
            'maintenance-plan2-feat2': '✓ 2h/mes para cambios menores',
            'maintenance-plan2-feat3': '✓ Monitorización de rendimiento',
            'db-title': 'Servicios SQL y Bases de Datos',
            'db-plan1-title': 'Consultas y Scripts',
            'db-plan1-price': 'Desde 80€',
            'db-plan1-desc': 'Creación de scripts SQL para informes, migraciones o análisis de datos.',
            'db-plan2-title': 'Diseño y Optimización',
            'db-plan2-price': 'Desde 400€',
            'db-plan2-desc': 'Diseño de esquemas de bases de datos relacionales (SQL) y no relacionales (NoSQL) y optimización de rendimiento.',
        },
        en: {
            'services-title': 'My Services',
            'services-page-intro': 'Custom tech solutions. Explore my plans and discover how I can help you build, maintain, and optimize your digital projects.',
            'services-page-note': 'Note: Prices are estimates and may vary depending on project complexity. Contact me for a custom quote!',
            'contact-btn': 'Contact',
            'web-dev-title': 'Full Web Development',
            'web-dev-plan1-title': 'Basic (Landing Page)',
            'web-dev-plan1-price': 'From €350',
            'web-dev-plan1-feat1': '✓ Single static page',
            'web-dev-plan1-feat2': '✓ Responsive design',
            'web-dev-plan1-feat3': '✓ Contact form',
            'web-dev-plan1-feat4': '✗ Admin panel',
            'web-dev-plan2-title': 'Professional (Corporate Site)',
            'web-dev-plan2-price': 'From €900',
            'web-dev-plan2-feat1': '✓ Up to 5 pages',
            'web-dev-plan2-feat2': '✓ Custom design',
            'web-dev-plan2-feat3': '✓ CMS integration (optional)',
            'web-dev-plan2-feat4': '✓ Basic SEO optimization',
            'web-dev-plan3-title': 'Premium (Web Application)',
            'web-dev-plan3-price': 'From €2,500',
            'web-dev-plan3-feat1': '✓ Custom features (JS/Python)',
            'web-dev-plan3-feat2': '✓ Backend and database',
            'web-dev-plan3-feat3': '✓ Full admin panel',
            'web-dev-plan3-feat4': '✓ Cloud deployment',
            'maintenance-title': 'Web Maintenance (Subscription)',
            'maintenance-plan1-title': 'Basic',
            'maintenance-plan1-price': '€50 / month',
            'maintenance-plan1-feat1': '✓ Security updates',
            'maintenance-plan1-feat2': '✓ Monthly backups',
            'maintenance-plan1-feat3': '✓ Email support',
            'maintenance-plan2-title': 'Advanced',
            'maintenance-plan2-price': '€120 / month',
            'maintenance-plan2-feat1': '✓ All from Basic plan',
            'maintenance-plan2-feat2': '✓ 2h/month for minor changes',
            'maintenance-plan2-feat3': '✓ Performance monitoring',
            'db-title': 'SQL & Database Services',
            'db-plan1-title': 'Queries & Scripts',
            'db-plan1-price': 'From €80',
            'db-plan1-desc': 'Creation of SQL scripts for reports, migrations, or data analysis.',
            'db-plan2-title': 'Design & Optimization',
            'db-plan2-price': 'From €400',
            'db-plan2-desc': 'Design of relational (SQL) and non-relational (NoSQL) database schemas and performance optimization.',
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
    document.addEventListener('mousemove', e => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';
    });

    document.querySelectorAll('a, button, .pricing-card').forEach(el => {
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

    // --- Animaciones al hacer Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pricing-card').forEach(card => {
        observer.observe(card);
    });


    // --- Ejecución Inicial ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});