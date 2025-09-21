document.addEventListener('DOMContentLoaded', () => {
    // --- Traducciones para la página de servicios ---
    const translations = {
        es: {
            'services-title': 'Mis Servicios',
            'services-page-intro': 'Soluciones a medida para tus necesidades tecnológicas. A continuación, detallo las áreas en las que puedo ayudarte a llevar tu proyecto al siguiente nivel.',
            'service-1-title': 'Desarrollo Web Frontend',
            'service-1-desc': 'Creación de interfaces de usuario interactivas y responsivas con tecnologías modernas como HTML5, CSS3 y JavaScript (React, Vite).',
            'service-2-title': 'Configuración Cloud (AWS/Azure)',
            'service-2-desc': 'Diseño y configuración de infraestructuras en la nube seguras, escalables y eficientes para alojar tus aplicaciones y servicios.',
            'service-3-title': 'Auditoría de Seguridad Básica',
            'service-3-desc': 'Análisis de vulnerabilidades y revisión de configuraciones para fortalecer la seguridad de tus sistemas y aplicaciones web.',
            'service-4-title': 'Scripts y Automatización con Python',
            'service-4-desc': 'Desarrollo de scripts personalizados para automatizar tareas repetitivas, monitorización de sistemas o procesamiento de datos.',
        },
        en: {
            'services-title': 'My Services',
            'services-page-intro': 'Custom solutions for your technological needs. Below, I detail the areas in which I can help you take your project to the next level.',
            'service-1-title': 'Frontend Web Development',
            'service-1-desc': 'Creation of interactive and responsive user interfaces with modern technologies like HTML5, CSS3, and JavaScript (React, Vite).',
            'service-2-title': 'Cloud Configuration (AWS/Azure)',
            'service-2-desc': 'Design and configuration of secure, scalable, and efficient cloud infrastructures to host your applications and services.',
            'service-3-title': 'Basic Security Audit',
            'service-3-desc': 'Vulnerability analysis and configuration reviews to strengthen the security of your web systems and applications.',
            'service-4-title': 'Scripting and Automation with Python',
            'service-4-desc': 'Development of custom scripts to automate repetitive tasks, system monitoring, or data processing.',
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

    // --- Cursor Personalizado ---
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
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

    // --- Ejecución Inicial ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});