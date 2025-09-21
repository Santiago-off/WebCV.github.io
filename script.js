document.addEventListener('DOMContentLoaded', () => {

    // --- Comprobación de Modo Mantenimiento ---
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    if (siteSettings.maintenanceMode === 'on') {
        document.body.innerHTML = `
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; background-color: #222831; color: #EEEEEE; font-family: 'Segoe UI', sans-serif; }
                .maintenance-box { padding: 2rem; border: 2px solid #00ADB5; border-radius: 8px; }
                h1 { color: #00ADB5; }
            </style>
            <div class="maintenance-box">
                <h1>Sitio en Mantenimiento</h1>
                <p>Estamos realizando algunas actualizaciones. Volveremos pronto.</p>
            </div>
        `;
        // Detiene la ejecución del resto del script
        return;
    }


    // --- Inicialización de Datos y Contenido (si no está en mantenimiento) ---
    const initialTranslations = {
        // Textos fijos de la interfaz
        ui: {
            es: {
                'nav-about': 'Sobre mí', 'nav-services': 'Servicios', 'nav-experience': 'Experiencia', 'nav-projects': 'Proyectos', 'nav-contact': 'Contacto',
                'fiverr-btn': 'Contrátame en Fiverr',
                'title-about': 'Sobre Mí', 'title-services': 'Mis Servicios', 'title-experience': 'Experiencia Laboral', 'title-education': 'Educación y Formación', 'title-languages': 'Competencias Lingüísticas', 'title-projects': 'Proyectos Destacados', 'title-contact': 'Contacto',
                'contact-lets-talk': 'Hablemos', 'contact-send-message': 'Envíame un mensaje',
                'form-placeholder-name': 'Tu Nombre', 'form-placeholder-email': 'Tu Correo Electrónico', 'form-placeholder-message': 'Tu Mensaje',
                'form-send-button': 'Enviar Mensaje',
                'project-link': 'Ver en GitHub →',
                'services-button': 'Ver todos los servicios →'
            },
            en: {
                'nav-about': 'About Me', 'nav-services': 'Services', 'nav-experience': 'Experience', 'nav-projects': 'Projects', 'nav-contact': 'Contact',
                'fiverr-btn': 'Hire me on Fiverr',
                'title-about': 'About Me', 'title-services': 'My Services', 'title-experience': 'Work Experience', 'title-education': 'Education & Training', 'title-languages': 'Language Skills', 'title-projects': 'Featured Projects', 'title-contact': 'Contact',
                'contact-lets-talk': "Let's Talk", 'contact-send-message': 'Send me a message',
                'form-placeholder-name': 'Your Name', 'form-placeholder-email': 'Your Email', 'form-placeholder-message': 'Your Message',
                'form-send-button': 'Send Message',
                'project-link': 'View on GitHub →'
            }
        },
        // Contenido editable
        content: {
            es: {
                'page-title': 'Santiago Fernandez - Programador y Experto en Ciberseguridad',
                'header-name': 'Santiago Fernandez',
                'fiverr-link': 'https://www.fiverr.com/s/NNyovjR',
                'hero-title': 'Desarrollador de Software y Experto en Ciberseguridad',
                'hero-subtitle': 'Creando soluciones digitales seguras, eficientes y escalables en la nube.',
                'about-me-text': 'Soy un técnico en sistemas microinformáticos y redes, actualmente especializándome en ciberseguridad y cloud computing (AWS y Azure). Mi pasión por la tecnología me impulsa a aprender y aplicar constantemente nuevos conocimientos en programación, seguridad de sistemas y administración de infraestructuras. Busco oportunidades para desarrollar soluciones seguras y eficientes, y contribuir con mi entusiasmo y habilidades a proyectos innovadores.',
                'services-intro': 'Ofrezco una variedad de servicios para ayudarte a construir y asegurar tus proyectos digitales. Desde desarrollo web a medida hasta configuraciones de seguridad robustas.',
                'contact-intro': 'Estoy disponible para oportunidades freelance o para discutir sobre tecnología y seguridad. No dudes en contactarme.',
                'contact-email': 'santiagorfernandezcv@gmail.com',
                'contact-phone': '+34 640365047',
                'contact-location': '28939 Arroyomolinos, España',
                'footer-text': 'Santiago Fernandez. Todos los derechos reservados.',
                'github-link': 'https://github.com/Santiago-off',
                'linkedin-link': 'https://www.linkedin.com/in/tu-usuario/', // TODO: Añade tu URL de LinkedIn
                'experience-list': [
                    { title: 'Realizando tareas de Programador', company: 'Armonia (18/03/2025 – 16/06/2025) Salerno, Italia', description: '' },
                    { title: 'Soporte de hosting (online)', company: '(05/2022 – 09/2023) Madrid, España', description: '' }
                ],
                'education-list': [
                    { title: 'Grado Medio Sistemas Microinformáticos y Redes', company: 'Santa Gema FP, Galgani (09/2023 – 06/2025) Madrid, España', description: '' },
                    { title: 'Experto Universitario en Cloud Computing. Arquitectura y Soluciones (AWS y Azure)', company: 'UNIR (10/2023 – 01/2024) Madrid, España', description: '' },
                    { title: 'Introducción a Ciberseguridad', company: 'Cisco Networking Academy (04/2024 – Actual) Madrid, España', description: '' },
                    { title: 'Fundamentos de IA con IBM SkillsBuild', company: 'Cisco Networking Academy (11/2024 – Actual) Madrid, España', description: '' },
                    { title: 'Fundamentos de Python 1', company: 'Cisco Networking Academy (03/2024 – 11/2024) Madrid, España', description: '' },
                    { title: 'CIBERSEGURIDAD PERSONAL', company: 'BACKTRACK ACADEMY (12/2020 – 01/2021) Madrid, España', description: '' },
                    { title: 'Google: Inteligencia Artificial y Productividad', company: 'Santander Academy (04/05/2025) Madrid, España', description: '' },
                    { title: 'Piloto De Drones (A1/A3, A2, STS01-STS02)', company: 'AESA & Bai Escuela de drones (2025) Madrid, España', description: '' }
                ],
                'languages-list': [
                    { title: 'Español', company: 'Nativo', description: '' },
                    { title: 'Inglés', company: 'Profesional (C1)', description: '' }
                ],
                'projects-list': [
                    { title: '🛡️ File Integrity Monitor', description: 'Herramienta de ciberseguridad en Python que supervisa directorios, calcula hashes SHA-256 y registra cambios en archivos.', link: 'https://github.com/Santiago-off/File-Integrity-Monitor' },
                    { title: '🔐 Encryptador Web', description: 'Aplicación en React + Vite para encriptar y desencriptar texto localmente usando el cifrado de Vigenère.', link: 'https://github.com/Santiago-off/Encryptator' },
                    { title: '🏦 Banco Simulado', description: 'Simulador de una aplicación bancaria web con funcionalidades de registro, login y transferencias, usando Firebase para la gestión de datos.', link: 'https://github.com/Santiago-off/Banco-Simulado' }
                ]
            },
            en: {
                'page-title': 'Santiago Fernandez - Programmer & Cybersecurity Expert',
                'header-name': 'Santiago Fernandez',
                'fiverr-link': 'https://www.fiverr.com/s/NNyovjR',
                'hero-title': 'Software Developer & Cybersecurity Expert',
                'hero-subtitle': 'Creating secure, efficient, and scalable digital solutions in the cloud.',
                'about-me-text': 'I am a microcomputer systems and networks technician, currently specializing in cybersecurity and cloud computing (AWS and Azure). My passion for technology drives me to constantly learn and apply new knowledge in programming, system security, and infrastructure administration. I am looking for opportunities to develop secure and efficient solutions, and to contribute my enthusiasm and skills to innovative projects.',
                'services-intro': 'I offer a variety of services to help you build and secure your digital projects. From custom web development to robust security configurations.',
                'contact-intro': 'I am available for freelance opportunities or to discuss technology and security. Feel free to contact me.',
                'contact-email': 'santiagorfernandezcv@gmail.com',
                'contact-phone': '+34 640365047',
                'contact-location': '28939 Arroyomolinos, Spain',
                'footer-text': 'Santiago Fernandez. All rights reserved.',
                'github-link': 'https://github.com/Santiago-off',
                'linkedin-link': 'https://www.linkedin.com/in/tu-usuario/', // TODO: Añade tu URL de LinkedIn
                'experience-list': [
                    { title: 'Performing Programmer tasks', company: 'Armonia (Mar 2025 – Jun 2025) Salerno, Italy', description: '' },
                    { title: 'Hosting support (online)', company: '(May 2022 – Sep 2023) Madrid, Spain', description: '' }
                ],
                'education-list': [
                    { title: 'Vocational Training in Microcomputer Systems and Networks', company: 'Santa Gema FP, Galgani (Sep 2023 – Jun 2025) Madrid, Spain', description: '' },
                    { title: 'University Expert in Cloud Computing. Architecture and Solutions (AWS and Azure)', company: 'UNIR (Oct 2023 – Jan 2024) Madrid, Spain', description: '' },
                    { title: 'Introduction to Cybersecurity', company: 'Cisco Networking Academy (Apr 2024 – Present) Madrid, Spain', description: '' },
                    { title: 'AI Fundamentals with IBM SkillsBuild', company: 'Cisco Networking Academy (Nov 2024 – Present) Madrid, Spain', description: '' },
                    { title: 'Python Essentials 1', company: 'Cisco Networking Academy (Mar 2024 – Nov 2024) Madrid, Spain', description: '' },
                    { title: 'PERSONAL CYBERSECURITY', company: 'BACKTRACK ACADEMY (Dec 2020 – Jan 2021) Madrid, Spain', description: '' },
                    { title: 'Google: Artificial Intelligence and Productivity', company: 'Santander Academy (May 4, 2025) Madrid, Spain', description: '' },
                    { title: 'Drone Pilot (A1/A3, A2, STS01-STS02)', company: 'AESA & Bai Drone School (2025) Madrid, Spain', description: '' }
                ],
                'languages-list': [
                    { title: 'Spanish', company: 'Native', description: '' },
                    { title: 'English', company: 'Professional (C1)', description: '' }
                ],
                'projects-list': [
                    { title: '🛡️ File Integrity Monitor', description: 'A cybersecurity tool in Python that monitors directories, calculates SHA-256 hashes, and logs file changes.', link: 'https://github.com/Santiago-off/File-Integrity-Monitor' },
                    { title: '🔐 Web Encryptor', description: 'A React + Vite application to encrypt and decrypt text locally using the Vigenère cipher.', link: 'https://github.com/Santiago-off/Encryptator' },
                    { title: '🏦 Simulated Bank', description: 'A web application simulator for a bank with registration, login, and transfer functionalities, using Firebase for data management.', link: 'https://github.com/Santiago-off/Banco-Simulado' }
                ]
            }
        }
    };

    function getTranslations() {
        const savedData = localStorage.getItem('portfolioContent');
        if (savedData) {
            // Combina los datos guardados con los textos fijos de la UI
            return { ...initialTranslations, content: JSON.parse(savedData) };
        } else {
            localStorage.setItem('portfolioContent', JSON.stringify(initialTranslations.content));
            return initialTranslations;
        }
    }

    const allTranslations = getTranslations();
    let currentLang = localStorage.getItem('language') || 'es';

    // --- Renderizado de Contenido ---
    function renderContent(lang) {
        const content = allTranslations.content[lang];
        const ui = allTranslations.ui[lang];

        // Renderizar textos simples
        document.querySelectorAll('[data-editable]').forEach(el => {
            const key = el.dataset.editable;
            if (content[key]) {
                if (el.tagName === 'A') {
                    el.href = content[key];
                } else {
                    el.textContent = content[key];
                }
            }
        });

        // Renderizar textos fijos de la UI
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (ui[key]) el.textContent = ui[key];
        });

        // Renderizar placeholders
        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.dataset.keyPlaceholder;
            if (ui[key]) el.placeholder = ui[key];
        });

        // Renderizar enlaces de redes sociales
        const socialContainer = document.querySelector('.social-links');
        if (socialContainer) {
            socialContainer.innerHTML = `
                <a href="${content['github-link']}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <img src="https://img.icons8.com/ios-filled/50/eeeeee/github.png" alt="GitHub" style="width:24px; height:24px;">
                </a>
                <a href="${content['linkedin-link']}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <img src="https://img.icons8.com/ios-filled/50/eeeeee/linkedin.png" alt="LinkedIn" style="width:24px; height:24px;">
                </a>`;
        }

        // Renderizar listas (Experiencia, Educación, etc.)
        renderList('experience-list', content, (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
                <p>${item.description}</p>
            </div>
        `);

        renderList('education-list', content, (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
                <p>${item.description}</p>
            </div>
        `);

        renderList('languages-list', content, (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
            </div>
        `);

        renderList('projects-list', content, (item) => `
            <div class="project-card">
                <div class="project-card-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="project-card-footer">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">${ui['project-link']}</a>
                </div>
            </div>
        `);

        // Actualizar año en el footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    function renderList(key, content, templateFn) {
        const container = document.querySelector(`[data-editable-list="${key}"]`);
        if (container && content[key]) {
            container.innerHTML = content[key].map(templateFn).join('');
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang; // Actualiza el atributo lang del HTML
        renderContent(lang);

        // Actualiza el botón activo
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        if (contactForm) {
            contactForm.reset();
        }
    }

    // --- Botón Volver Arriba ---
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // --- Contador de Visitas ---
    function updateVisitCounter() {
        let visits = localStorage.getItem('visitCounter') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('visitCounter', visits);
        document.getElementById('visit-counter').textContent = visits;
    }

    // --- Cursor Personalizado ---
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', e => {
        // Usamos clientX/clientY que son relativos a la ventana,
        // lo cual es correcto para un elemento con 'position: fixed'.
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

    // --- Animaciones al hacer Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // --- Formulario de Contacto ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = contactForm.querySelector('.btn-submit');

    // NOTA: El envío de formularios en un sitio estático requiere un servicio externo.
    // El siguiente código simula el envío y guarda una copia en localStorage como respaldo,
    // pero no envía un correo electrónico real. Para ello, configura el 'action' del formulario
    // a un servicio como Formspree, Netlify Forms, etc.
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario a través de AJAX a tu servicio.
        // Por ahora, solo mostraremos un mensaje de éxito y lo guardaremos localmente.
        // Para una implementación real, reemplaza este bloque.
        alert("Funcionalidad de formulario en desarrollo. ¡Gracias por tu interés!");
        contactForm.reset();
    });

    // --- Comprobación de modo Admin ---
    function checkAdminMode() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true') {
            // En un escenario real, esto debería estar protegido.
            // Simplemente redirigimos al login. No es necesario el parámetro.
            window.location.href = 'login.html';
        }
    }

    // --- Ejecución Inicial ---
    setLanguage(currentLang); // Renderiza con el idioma actual
    updateVisitCounter();

    // Event Listeners para el selector de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});
