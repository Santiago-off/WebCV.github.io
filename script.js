document.addEventListener('DOMContentLoaded', () => {
    // --- Inicialización de Datos y Contenido ---
    const initData = {
        'page-title': 'Santiago Fernandez - Programador y Experto en Ciberseguridad',
        'header-name': 'Santiago Fernandez',
        'fiverr-link': 'https://www.fiverr.com/s/NNyovjR',
        'hero-title': 'Desarrollador de Software y Experto en Ciberseguridad',
        'hero-subtitle': 'Creando soluciones digitales seguras, eficientes y escalables en la nube.',
        'about-me-text': 'Soy un técnico en sistemas microinformáticos y redes, actualmente especializándome en ciberseguridad y cloud computing (AWS y Azure). Mi pasión por la tecnología me impulsa a aprender y aplicar constantemente nuevos conocimientos en programación, seguridad de sistemas y administración de infraestructuras. Busco oportunidades para desarrollar soluciones seguras y eficientes, y contribuir con mi entusiasmo y habilidades a proyectos innovadores.',
        'contact-intro': 'Estoy disponible para oportunidades freelance o para discutir sobre tecnología y seguridad. No dudes en contactarme.',
        'contact-email': 'santiagorfernandezcv@gmail.com',
        'contact-phone': '+34 640365047',
        'contact-location': '28939 Arroyomolinos, España',
        'footer-text': 'Santiago Fernandez. Todos los derechos reservados.',
        'experience-list': [
            {
                title: 'Realizando tareas de Programador',
                company: 'Armonia (18/03/2025 – 16/06/2025) Salerno, Italia',
                description: ''
            },
            {
                title: 'Soporte de hosting (online)',
                company: '(05/2022 – 09/2023) Madrid, España',
                description: ''
            }
        ],
        'education-list': [
            {
                title: 'Grado Medio Sistemas Microinformáticos y Redes',
                company: 'Santa Gema FP, Galgani (09/2023 – 06/2025) Madrid, España',
                description: ''
            },
            {
                title: 'Experto Universitario en Cloud Computing. Arquitectura y Soluciones (AWS y Azure)',
                company: 'UNIR (10/2023 – 01/2024) Madrid, España',
                description: ''
            },
            {
                title: 'Introducción a Ciberseguridad',
                company: 'Cisco Networking Academy (04/2024 – Actual) Madrid, España',
                description: ''
            },
            {
                title: 'Fundamentos de IA con IBM SkillsBuild',
                company: 'Cisco Networking Academy (11/2024 – Actual) Madrid, España',
                description: ''
            },
            {
                title: 'Fundamentos de Python 1',
                company: 'Cisco Networking Academy (03/2024 – 11/2024) Madrid, España',
                description: ''
            },
            {
                title: 'CIBERSEGURIDAD PERSONAL',
                company: 'BACKTRACK ACADEMY (12/2020 – 01/2021) Madrid, España',
                description: ''
            },
            {
                title: 'Google: Inteligencia Artificial y Productividad',
                company: 'Santander Academy (04/05/2025) Madrid, España',
                description: ''
            },
            {
                title: 'Piloto De Drones (A1/A3, A2, STS01-STS02)',
                company: 'AESA & Bai Escuela de drones (2025) Madrid, España',
                description: ''
            }
        ],
        'languages-list': [
            { title: 'Español', company: 'Nativo', description: '' },
            { title: 'Inglés', company: 'Profesional (C1)', description: '' }
        ],
        'projects-list': [
            {
                title: '🛡️ File Integrity Monitor',
                description: 'Herramienta de ciberseguridad en Python que supervisa directorios, calcula hashes SHA-256 y registra cambios en archivos.',
                link: 'https://github.com/Santiago-off/File-Integrity-Monitor'
            },
            {
                title: '🔐 Encryptador Web',
                description: 'Aplicación en React + Vite para encriptar y desencriptar texto localmente usando el cifrado de Vigenère.',
                link: 'https://github.com/Santiago-off/Encryptator'
            },
            {
                title: '🏦 Banco Simulado',
                description: 'Simulador de una aplicación bancaria web con funcionalidades de registro, login y transferencias, usando Firebase para la gestión de datos.',
                link: 'https://github.com/Santiago-off/Banco-Simulado'
            }
        ]
    };

    // Función para cargar datos desde localStorage o usar los iniciales
    function getPortfolioData() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            localStorage.setItem('portfolioData', JSON.stringify(initData));
            return initData;
        }
    }

    const portfolioData = getPortfolioData();

    // --- Renderizado de Contenido ---
    function renderContent() {
        // Renderizar textos simples
        document.querySelectorAll('[data-editable]').forEach(el => {
            const key = el.dataset.editable;
            if (portfolioData[key]) {
                if (el.tagName === 'A') {
                    el.href = portfolioData[key];
                } else {
                    el.textContent = portfolioData[key];
                }
            }
        });

        // Renderizar listas (Experiencia, Educación, etc.)
        renderList('experience-list', (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
                <p>${item.description}</p>
            </div>
        `);

        renderList('education-list', (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
                <p>${item.description}</p>
            </div>
        `);

        renderList('languages-list', (item) => `
            <div class="timeline-item">
                <h3>${item.title}</h3>
                <h4>${item.company}</h4>
            </div>
        `);

        renderList('projects-list', (item) => `
            <div class="project-card">
                <div class="project-card-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="project-card-footer">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">Ver en GitHub &rarr;</a>
                </div>
            </div>
        `);

        // Actualizar año en el footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    function renderList(key, templateFn) {
        const container = document.querySelector(`[data-editable-list="${key}"]`);
        if (container && portfolioData[key]) {
            container.innerHTML = portfolioData[key].map(templateFn).join('');
        }
    }

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

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Por favor, completa todos los campos.';
            formStatus.style.color = '#ff6b6b';
            return;
        }

        const newMessage = {
            name,
            email,
            message,
            date: new Date().toISOString()
        };

        // Guardar mensaje en localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(newMessage);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        formStatus.textContent = '¡Mensaje enviado con éxito! Gracias por contactarme.';
        formStatus.style.color = '#00ADB5';
        contactForm.reset();

        setTimeout(() => {
            formStatus.textContent = '';
        }, 5000);
    });

    // --- Comprobación de modo Admin ---
    function checkAdminMode() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true') {
            // En un escenario real, esto debería estar protegido.
            // Para este caso, simplemente redirigimos al login.
            window.location.href = 'login.html';
        }
    }

    // --- Ejecución Inicial ---
    renderContent();
    updateVisitCounter();
    checkAdminMode();
});
