import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
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
        return;
    }

    // Inicializamos Firebase aquí
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const initialTranslations = {
        ui: {
            es: {
                'nav-about': 'Sobre mí', 'nav-services': 'Servicios', 'nav-experience': 'Experiencia', 'nav-projects': 'Proyectos', 'nav-contact': 'Contacto', 'title-about': 'Sobre Mí', 'title-services': 'Mis Servicios', 'title-experience': 'Experiencia Laboral', 'title-education': 'Educación y Formación', 'title-languages': 'Competencias Lingüísticas', 'title-projects': 'Proyectos Destacados', 'title-testimonials': 'Lo que dicen de mí', 'title-contact': 'Contacto',
                'contact-lets-talk': 'Hablemos', 'contact-send-message': 'Envíame un mensaje',
                'form-placeholder-name': 'Tu Nombre', 'form-placeholder-email': 'Tu Correo Electrónico', 'form-placeholder-message': 'Tu Mensaje',
                'form-send-button': 'Enviar Mensaje',
                'project-link': 'Ver en GitHub →',
                'services-button': 'Ver todos los servicios →',
                'form-signin-button': 'Iniciar sesión con Google para enviar'
            },
            en: {
                'nav-about': 'About Me', 'nav-services': 'Services', 'nav-experience': 'Experience', 'nav-projects': 'Projects', 'nav-contact': 'Contact', 'title-about': 'About Me', 'title-services': 'My Services', 'title-experience': 'Work Experience', 'title-education': 'Education & Training', 'title-languages': 'Language Skills', 'title-projects': 'Featured Projects', 'title-testimonials': 'What They Say', 'title-contact': 'Contact',
                'contact-lets-talk': "Let's Talk", 'contact-send-message': 'Send me a message',
                'form-placeholder-name': 'Your Name', 'form-placeholder-email': 'Your Email', 'form-placeholder-message': 'Your Message',
                'form-send-button': 'Send Message',
                'project-link': 'View on GitHub →',
                'services-button': 'View all services →',
                'form-signin-button': 'Sign in with Google to send'
            }
        },
        content: {
            es: {
                'page-title': 'Santiago Fernandez - Programador y Experto en Ciberseguridad',
                'header-name': 'Santiago Fernandez',
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
                'instagram-link': 'https://www.instagram.com/santiagorfer',
                'linkedin-link': 'https://www.linkedin.com/in/tu-usuario/',
                'experience-list': [
                    { title: 'Realizando tareas de Programador', company: 'Armonia (18/03/2025 – 16/06/2025) Salerno, Italia', description: '' },
                    { title: 'Soporte de hosting (online)', company: '(05/2022 – Actual) Madrid, España', description: '' }
                ],
                'education-list': [
                    { title: 'Grado Medio Sistemas Microinformáticos y Redes', company: 'Santa Gema FP, Galgani (09/2023 – 06/2025) Madrid, España', description: '' },
                    { title: 'Curso Avanzado de Arquitectura de Soluciones Cloud', company: 'Plataforma de Formación Online (2024)', description: 'Diseño de arquitecturas escalables, seguras y de alta disponibilidad en AWS y Azure.' },
                    { title: 'Especialización en Cloud Computing con AWS y Azure', company: 'Plataforma de Formación Online (2024)', description: 'Administración de servicios IaaS, PaaS y SaaS, redes virtuales, almacenamiento y computación en la nube.' },
                    { title: 'Curso de Introducción al Big Data', company: 'Plataforma de Formación Online (2024)', description: 'Fundamentos de ecosistemas de Big Data, procesamiento de datos a gran escala y herramientas clave.' },
                    { title: 'Introducción a Ciberseguridad', company: 'Cisco Networking Academy (2025)', description: '' },
                    { title: 'Fundamentos de Python 1', company: 'Cisco Networking Academy (03/2024 – 11/2024) Madrid, España', description: '' },
                    { title: 'CIBERSEGURIDAD PERSONAL', company: 'BACKTRACK ACADEMY (12/2020 – 01/2021) Madrid, España', description: '' },
                    { title: 'Google: Inteligencia Artificial y Productividad', company: 'Santander Academy (04/05/2025) Madrid, España', description: '' },
                    { title: 'Piloto De Drones (A1/A3, A2, STS01-STS02)', company: 'AESA & Bai Escuela de drones (2025) Madrid, España', description: '' }
                ],
                'languages-list': [
                    { title: 'Español', company: 'Nativo', description: '' },
                    { title: 'Inglés', company: 'A2', description: '' }
                ],
                'projects-list': [
                    { title: '🛡️ File Integrity Monitor', description: 'Herramienta de ciberseguridad en Python que supervisa directorios, calcula hashes SHA-256 y registra cambios en archivos.', link: 'https://github.com/Santiago-off/File-Integrity-Monitor' },
                    { title: '🔐 Encryptador Web', description: 'Aplicación en React + Vite para encriptar y desencriptar texto localmente usando el cifrado de Vigenère.', link: 'https://github.com/Santiago-off/Encryptator' },
                    { title: '🏦 Banco Bankinter', description: 'Simulador de una aplicación bancaria web con funcionalidades de registro, login y transferencias, usando Firebase para la gestión de datos.', link: 'https://github.com/Santiago-off/Banquinter' },
                    { title: '   Play-To-Win', description: 'Paguina web de torneos funcional y operativa donde ganar por jugar', link: 'https://play-to-win.netlify.app'}
                ],
                'testimonials-list': [
                    { quote: 'Trabajar con Santiago fue un acierto. Su capacidad para entender nuestras necesidades y traducirlas en una solución cloud robusta y escalable fue impresionante. Optimizó nuestra infraestructura en AWS, resultando en una reducción de costes del 20%.', author: 'Marcos Vega', role: 'Director de Tecnología' },
                    { quote: 'Necesitábamos una prueba de concepto rápida para una idea de Big Data y Santiago entregó un prototipo funcional en tiempo récord. Su conocimiento de Azure y su proactividad fueron clave para validar nuestro proyecto.', author: 'Elena Ríos', role: 'Jefa de Producto' },
                    { quote: 'Santiago no solo es un programador con talento, sino también un gran comunicador. Nos ayudó a migrar nuestra aplicación a la nube sin problemas, explicando cada paso del proceso. Su profesionalidad es excepcional.', author: 'Javier Soler', role: 'CEO y Fundador' }
                ]
            },
            en: {
                'page-title': 'Santiago Fernandez - Programmer & Cybersecurity Expert',
                'header-name': 'Santiago Fernandez',
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
                'instagram-link': 'https://www.instagram.com/santiagorfer',
                'linkedin-link': 'https://www.linkedin.com/in/tu-usuario/',
                'experience-list': [
                    { title: 'Performing Programmer tasks', company: 'Armonia (Mar 2025 – Jun 2025) Salerno, Italy', description: '' },
                    { title: 'Hosting support (online)', company: '(May 2022 – Present) Madrid, Spain', description: '' }
                ],
                'education-list': [
                    { title: 'Vocational Training in Microcomputer Systems and Networks', company: 'Santa Gema FP, Galgani (Sep 2023 – Jun 2025) Madrid, Spain', description: '' },
                    { title: 'Advanced Course on Cloud Solutions Architecture', company: 'Online Training Platform (2024)', description: 'Designing scalable, secure, and high-availability architectures on AWS and Azure.' },
                    { title: 'Specialization in Cloud Computing with AWS and Azure', company: 'Online Training Platform (2024)', description: 'Management of IaaS, PaaS, and SaaS services, virtual networks, storage, and cloud computing.' },
                    { title: 'Introduction to Big Data Course', company: 'Online Training Platform (2024)', description: 'Fundamentals of Big Data ecosystems, large-scale data processing, and key tools.' },
                    { title: 'Introduction to Cybersecurity', company: 'Cisco Networking Academy (2025)', description: '' },
                    { title: 'Python Essentials 1', company: 'Cisco Networking Academy (Mar 2024 – Nov 2024) Madrid, Spain', description: '' },
                    { title: 'PERSONAL CYBERSECURITY', company: 'BACKTRACK ACADEMY (Dec 2020 – Jan 2021) Madrid, Spain', description: '' },
                    { title: 'Google: Artificial Intelligence and Productivity', company: 'Santander Academy (May 4, 2025) Madrid, Spain', description: '' },
                    { title: 'Drone Pilot (A1/A3, A2, STS01-STS02)', company: 'AESA & Bai Drone School (2025) Madrid, Spain', description: '' }
                ],
                'languages-list': [
                    { title: 'Spanish', company: 'Native', description: '' },
                    { title: 'English', company: 'A2', description: '' }
                ],
                'projects-list': [
                    { title: '🛡️ File Integrity Monitor', description: 'A cybersecurity tool in Python that monitors directories, calculates SHA-256 hashes, and logs file changes.', link: 'https://github.com/Santiago-off/File-Integrity-Monitor' },
                    { title: '🔐 Web Encryptor', description: 'A React + Vite application to encrypt and decrypt text locally using the Vigenère cipher.', link: 'https://github.com/Santiago-off/Encryptator' },
                    { title: '🏦 Bankinter Bank', description: 'A web application simulator for a bank with registration, login, and transfer functionalities, using Firebase for data management.', link: 'https://github.com/Santiago-off/Banquinter' },
                    { title: '   Play-To-Win', description: 'Functional and operational tournament website where you can win by playing', link: 'https://play-to-win.netlify.app'}
                ],
                'testimonials-list': [
                    { quote: 'Working with Santiago was the right move. His ability to understand our needs and translate them into a robust and scalable cloud solution was impressive. He optimized our AWS infrastructure, resulting in a 20% cost reduction.', author: 'Marcos Vega', role: 'Chief Technology Officer' },
                    { quote: 'We needed a quick proof of concept for a Big Data idea, and Santiago delivered a functional prototype in record time. His knowledge of Azure and his proactivity were key to validating our project.', author: 'Elena Ríos', role: 'Product Manager' },
                    { quote: 'Santiago is not only a talented programmer but also a great communicator. He helped us migrate our application to the cloud seamlessly, explaining every step of the process. His professionalism is outstanding.', author: 'Javier Soler', role: 'CEO & Founder' }
                ]
            }
        }
    };

    // Función para obtener las traducciones, fusionando datos guardados con los por defecto.
    // Esto asegura que la página refleje los últimos cambios del código, incluso si hay datos viejos en localStorage.
    function getTranslations() {
        // 1. Empezamos con una copia de los datos por defecto como base.
        const finalContent = JSON.parse(JSON.stringify(initialTranslations.content));
        const savedDataJSON = localStorage.getItem('portfolioContent');

        if (savedDataJSON) {
            try {
                const savedData = JSON.parse(savedDataJSON);
                // 2. Recorremos los idiomas ('es', 'en') para fusionar.
                for (const lang in finalContent) {
                    if (savedData[lang]) {
                        // 3. Recorremos las claves de los datos por defecto.
                        for (const key in finalContent[lang]) {
                            // 4. Si hay un valor guardado para una clave, lo usamos.
                            // Si no (porque es una sección nueva o modificada), se mantendrá el valor por defecto del código.
                            if (savedData[lang].hasOwnProperty(key)) {
                                finalContent[lang][key] = savedData[lang][key];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error al procesar datos de localStorage. Se usarán los datos por defecto.", error);
                // Si hay un error, devolvemos los datos iniciales sin modificar.
                return initialTranslations;
            }
        }

        // 5. Devolvemos el contenido fusionado.
        // No guardamos de vuelta aquí para evitar un bucle si el admin panel está abierto.

        return { ui: initialTranslations.ui, content: finalContent };
    }

    const allTranslations = getTranslations();
    let currentLang = localStorage.getItem('language') || 'es';

    function renderContent(lang) {
        const content = allTranslations.content[lang];
        const ui = allTranslations.ui[lang];

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

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (ui[key]) el.textContent = ui[key];
        });

        // Actualiza el enlace de Instagram en el footer, si existe
        const footerInsta = document.getElementById('footer-instagram');
        if (footerInsta && content['instagram-link']) {
            footerInsta.href = content['instagram-link'];
        }

        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.dataset.keyPlaceholder;
            if (ui[key]) el.placeholder = ui[key];
        });

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (ui[key]) el.textContent = ui[key];
        });


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

        renderList('testimonials-list', content, (item) => `
            <div class="testimonial-card">
                <p class="testimonial-quote">“${item.quote}”</p>
                <div class="testimonial-author">
                    <strong>${item.author}</strong>
                    <span>${item.role}</span>
                </div>
            </div>
        `);

        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Duplicar testimonios para el efecto de scroll infinito
        const scroller = document.querySelector('.testimonials-scroller');
        if (scroller && scroller.children.length > 0) {
            const items = Array.from(scroller.children);
            items.forEach(item => scroller.appendChild(item.cloneNode(true)));
        }
    }

    function renderList(key, content, templateFn) {
        const container = document.querySelector(`[data-editable-list="${key}"]`);
        if (container && content[key] && Array.isArray(content[key])) {
            container.innerHTML = content[key].map(templateFn).join('');
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        renderContent(lang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        if (contactForm) {
            contactForm.reset();
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
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    function updateVisitCounter() {
        let visits = localStorage.getItem('visitCounter') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('visitCounter', visits);
        document.getElementById('visit-counter').textContent = visits;
    }

    const cursor = document.querySelector('.custom-cursor');
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

    // Configuración de autenticación con Google y formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const googleSignInBtn = document.getElementById('google-signin-btn');
    const loginRequired = document.getElementById('login-required');
    const userInfoContact = document.getElementById('user-info-contact');
    let currentUser = null;

    // Comprobar el estado de autenticación al cargar la página
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // Usuario autenticado
            if (contactForm) contactForm.style.display = 'block';
            if (loginRequired) loginRequired.style.display = 'none';
            if (userInfoContact) userInfoContact.textContent = user.email;
        } else {
            // Usuario no autenticado
            if (contactForm) contactForm.style.display = 'none';
            if (loginRequired) loginRequired.style.display = 'block';
            if (userInfoContact) userInfoContact.textContent = 'No autenticado';
        }
    });

    // Configurar el botón de inicio de sesión con Google
     if (googleSignInBtn) {
         googleSignInBtn.addEventListener('click', async () => {
             try {
                 const provider = new GoogleAuthProvider();
                 await signInWithPopup(auth, provider);
                 // No es necesario hacer nada más aquí, el listener onAuthStateChanged se encargará de actualizar la UI
             } catch (error) {
                 console.error("Error al iniciar sesión con Google:", error);
                 
                 let errorMessage = '';
                 // Mensajes de error específicos según el código de error
                 if (error.code === 'auth/operation-not-allowed') {
                     errorMessage = currentLanguage === 'es' ? 
                         'El inicio de sesión con Google no está habilitado en Firebase. Contacta al administrador.' : 
                         'Google sign-in is not enabled in Firebase. Contact the administrator.';
                 } else if (error.code === 'auth/popup-closed-by-user') {
                     errorMessage = currentLanguage === 'es' ? 
                         'Has cerrado la ventana de inicio de sesión. Inténtalo de nuevo.' : 
                         'You closed the sign-in window. Please try again.';
                 } else if (error.code === 'auth/cancelled-popup-request') {
                     // Este error es común y no necesita alerta
                     return;
                 } else if (error.code === 'auth/popup-blocked') {
                     errorMessage = currentLanguage === 'es' ? 
                         'El navegador ha bloqueado la ventana emergente. Permite ventanas emergentes e inténtalo de nuevo.' : 
                         'The browser blocked the popup. Allow popups and try again.';
                 } else {
                     errorMessage = currentLanguage === 'es' ? 
                         'Error al iniciar sesión con Google: ' + error.message : 
                         'Error signing in with Google: ' + error.message;
                 }
                 
                 if (errorMessage) {
                     alert(errorMessage);
                 }
             }
         });
     }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) {
            formStatus.textContent = 'Error: No se ha detectado un usuario. Por favor, recarga la página.';
            formStatus.style.color = '#ff6b6b';
            return;
        }

        const message = document.getElementById('message').value.trim();
        const submitButton = contactForm.querySelector('.btn-submit');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const newMessage = {
            name: currentUser.displayName,
            email: currentUser.email,
            uid: currentUser.uid,
            message,
            timestamp: serverTimestamp(),
            date: new Date().toLocaleString('es-ES') // Añadimos un campo date legible como respaldo
        };

        // Guardar en Firestore en lugar de localStorage
        addDoc(collection(db, "messages"), newMessage)
            .then(() => {
                formStatus.textContent = '¡Mensaje enviado con éxito! Gracias por contactarme.';
                formStatus.style.color = '#00ADB5';
                contactForm.reset();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                formStatus.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                formStatus.style.color = '#ff6b6b';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = allTranslations.ui[currentLang]['form-send-button'];
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
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
        // Inicia el proceso de autenticación con popup en lugar de redirección
        signInWithPopup(auth, provider);
    }

    function updateUIForUser(user) {
        const loginWall = document.getElementById('login-wall');
        const mainContent = document.getElementById('main-content');

        if (user) {
            loginWall.style.display = 'none';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = 1;
            const userInfoContact = document.getElementById('user-info-contact');
            if (userInfoContact) {
                userInfoContact.textContent = `${user.displayName} (${user.email})`;
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

    const preferredTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(preferredTheme);

    updateVisitCounter();

    setLanguage(currentLang);

    // Copiar la tarjeta al portapapeles
    const copyBtn = document.getElementById('share-card-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const content = allTranslations.content[currentLang];
            const name = document.querySelector('.share-name')?.textContent?.trim() || content['header-name'] || 'Santiago Fernandez';
            const insta = document.querySelector('.share-link.instagram')?.href || content['instagram-link'] || 'https://www.instagram.com/santiagorfer';
            const github = document.querySelector('.share-link.github')?.href || content['github-link'] || '';
            const email = document.querySelector('.share-link.email')?.textContent?.trim() || content['contact-email'] || '';
            const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

            const text = `${name} — Perfil\nInstagram: ${insta}\nGitHub: ${github}\nEmail: ${email}\nWeb: ${canonical}`;

            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = 'Copiado ✓';
                setTimeout(() => copyBtn.textContent = 'Copiar tarjeta', 2000);
            }).catch(() => {
                alert('Copia fallida. Copia manual:\n\n' + text);
            });
        });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});
