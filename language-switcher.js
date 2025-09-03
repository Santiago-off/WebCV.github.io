// language-switcher.js - Sistema de banderas de idiomas

// ===== CONFIGURACIÓN DE IDIOMAS =====
const translations = {
    'es': {
        // Header
        'tagline': 'Especialista en Programación, Cloud Computing, Ciberseguridad y Pilotaje de Drones',
        'birthdate': 'Fecha de nacimiento: 27/04/2007 | Nacionalidad: Española | Género: Masculino',
        
        // Secciones
        'about-title': 'Sobre Mí',
        'about-content-1': 'Estudiante de informática con habilidades en programación y análisis de datos. Con experiencia en proyectos de desarrollo en Cloud y capacidad para trabajar en equipo de manera eficiente y colaborativa.',
        'about-content-2': 'Mi pasión por la tecnología me ha llevado a formarme en diversas áreas como programación, inteligencia artificial, ciberseguridad, cloud computing y pilotaje de drones. Busco oportunidades para aplicar mis conocimientos y continuar desarrollándome profesionalmente.',
        
        'experience-title': 'Experiencia Laboral',
        'education-title': 'Educación y Formación',
        'certificates-title': 'Certificados',
        'certificates-click': 'Haz clic en cualquier certificado para verlo en tamaño completo',
        
        'languages-title': 'Competencias Lingüísticas',
        'mother-tongue': 'Lengua materna: Español',
        'foreign-languages': 'Idiomas Extranjeros',
        'language-levels': 'Niveles: A1 y A2 (usuario básico), B1 y B2 (usuario independiente), C1 y C2 (usuario competente)',
        
        'projects-title': 'Proyectos',
        'project-desc-1': 'File Integrity Monitor es una herramienta desarrollada en Python para la monitorización de integridad de archivos.',
        'project-desc-2': 'Encryptador es una aplicación en React + Vite que permite encriptar y desencriptar información de manera local',
        'project-desc-3': 'Proyectos de fotogrametría y mapeo con drones para diferentes aplicaciones.',
        'project-link': 'Ver detalles',
        
        'contact-title': 'Contacto',
        
        // Formulario de contacto
        'name-label': 'Nombre',
        'email-label': 'Email',
        'message-label': 'Mensaje',
        'send-button': 'Enviar Mensaje',
        
        // Footer
        'rights-reserved': 'Todos los derechos reservados.',
        'visits': 'Visitas:',
        
        // Mensaje de confirmación
        'message-sent': '¡Mensaje Enviado!',
        'confirmation-text': 'Su mensaje ha sido enviado correctamente. Dentro de poco recibirá una respuesta. ¡Muchas gracias!',
        'accept-button': 'Aceptar',
        
        // Textos de experiencia laboral
        'armonia-title': 'ARMONIA – SALERNO, ITALIA',
        'armonia-position': 'Programador',
        'armonia-date': '18/03/2025 – 16/06/2025',
        'hosting-title': 'SOPORTE DE HOSTING (ONLINE)',
        'hosting-location': 'Madrid, España',
        'hosting-date': '05/2022 – 09/2023'
    },
    
    'en': {
        // Header
        'tagline': 'Specialist in Programming, Cloud Computing, Cybersecurity and Drone Piloting',
        'birthdate': 'Date of birth: 04/27/2007 | Nationality: Spanish | Gender: Male',
        
        // Secciones
        'about-title': 'About Me',
        'about-content-1': 'Computer science student with skills in programming and data analysis. Experienced in Cloud development projects and able to work efficiently and collaboratively in a team.',
        'about-content-2': 'My passion for technology has led me to train in various areas such as programming, artificial intelligence, cybersecurity, cloud computing and drone piloting. I am looking for opportunities to apply my knowledge and continue my professional development.',
        
        'experience-title': 'Work Experience',
        'education-title': 'Education and Training',
        'certificates-title': 'Certificates',
        'certificates-click': 'Click on any certificate to view it in full size',
        
        'languages-title': 'Language Skills',
        'mother-tongue': 'Mother tongue: Spanish',
        'foreign-languages': 'Foreign Languages',
        'language-levels': 'Levels: A1 and A2 (basic user), B1 and B2 (independent user), C1 and C2 (proficient user)',
        
        'projects-title': 'Projects',
        'project-desc-1': 'File Integrity Monitor is a tool developed in Python for file integrity monitoring.',
        'project-desc-2': 'Encryptador is a React + Vite application that allows you to encrypt and decrypt information locally.',
        'project-desc-3': 'Photogrammetry and mapping projects with drones for various applications.',
        'project-link': 'View details',
        
        'contact-title': 'Contact',
        
        // Formulario de contacto
        'name-label': 'Name',
        'email-label': 'Email',
        'message-label': 'Message',
        'send-button': 'Send Message',
        
        // Footer
        'rights-reserved': 'All rights reserved.',
        'visits': 'Visits:',
        
        // Mensaje de confirmación
        'message-sent': 'Message Sent!',
        'confirmation-text': 'Your message has been sent successfully. You will receive a response shortly. Thank you very much!',
        'accept-button': 'Accept',
        
        // Textos de experiencia laboral
        'armonia-title': 'ARMONIA – SALERNO, ITALY',
        'armonia-position': 'Programmer',
        'armonia-date': '03/18/2025 – 06/16/2025',
        'hosting-title': 'HOSTING SUPPORT (ONLINE)',
        'hosting-location': 'Madrid, Spain',
        'hosting-date': '05/2022 – 09/2023'
    }
};

// ===== VARIABLES GLOBALES =====
let currentLanguage = 'es';

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSwitcher();
});

// ===== FUNCIONES PRINCIPALES =====
function initLanguageSwitcher() {
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('portfolioLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // Detectar idioma del navegador
        const browserLang = navigator.language.substring(0, 2);
        if (translations[browserLang]) {
            currentLanguage = browserLang;
        } else {
            currentLanguage = 'es'; // Español por defecto
        }
    }
    
    // Crear selector de banderas
    createFlagSelector();
    
    // Aplicar idioma actual
    applyLanguage(currentLanguage);
}

function createFlagSelector() {
    const header = document.querySelector('header .container');
    
    const flagContainer = document.createElement('div');
    flagContainer.className = 'flag-container';
    flagContainer.innerHTML = `
        <div class="flags">
            <button class="flag-btn ${currentLanguage === 'es' ? 'active' : ''}" onclick="changeLanguage('es')" title="Español">
                🇪🇸
            </button>
            <button class="flag-btn ${currentLanguage === 'en' ? 'active' : ''}" onclick="changeLanguage('en')" title="English">
                🇺🇸
            </button>
        </div>
    `;
    
    // Insertar al inicio del header
    header.insertBefore(flagContainer, header.firstChild);
    
    // Añadir estilos
    addFlagStyles();
}

function addFlagStyles() {
    const styleId = 'flag-selector-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .flag-container {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1000;
        }
        
        .flags {
            display: flex;
            gap: 10px;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .flag-btn {
            background: none;
            border: 2px solid transparent;
            border-radius: 6px;
            padding: 5px 10px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 50px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .flag-btn:hover {
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.1);
        }
        
        .flag-btn.active {
            border-color: #3498db;
            background: rgba(52, 152, 219, 0.2);
            transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
            .flag-container {
                top: 10px;
                left: 10px;
            }
            
            .flags {
                padding: 8px;
                gap: 8px;
            }
            
            .flag-btn {
                font-size: 1.3rem;
                width: 45px;
                height: 35px;
                padding: 4px 8px;
            }
        }
        
        @media (max-width: 480px) {
            .flag-container {
                top: 5px;
                left: 5px;
            }
            
            .flags {
                padding: 6px;
                gap: 6px;
            }
            
            .flag-btn {
                font-size: 1.2rem;
                width: 40px;
                height: 30px;
                padding: 3px 6px;
            }
        }
    `;
    document.head.appendChild(style);
}

function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('portfolioLanguage', lang);
        applyLanguage(lang);
        updateActiveFlag(lang);
        showLanguageNotification(lang);
    }
}

function updateActiveFlag(lang) {
    // Remover clase active de todas las banderas
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Añadir clase active a la bandera correspondiente
    const activeFlag = document.querySelector(`.flag-btn[onclick="changeLanguage('${lang}')"]`);
    if (activeFlag) {
        activeFlag.classList.add('active');
    }
}

function applyLanguage(lang) {
    const langData = translations[lang];
    
    // Actualizar todos los textos con data attributes
    for (const [key, value] of Object.entries(langData)) {
        // Textos normales
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            element.textContent = value;
        });
        
        // Placeholders
        const placeholderElements = document.querySelectorAll(`[data-translate-placeholder="${key}"]`);
        placeholderElements.forEach(element => {
            element.placeholder = value;
        });
        
        // Valores de inputs
        const valueElements = document.querySelectorAll(`[data-translate-value="${key}"]`);
        valueElements.forEach(element => {
            element.value = value;
        });
    }
    
    // Actualizar mensaje de confirmación si existe
    updateConfirmationMessage(lang);
}

function updateConfirmationMessage(lang) {
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    if (confirmationOverlay) {
        const langData = translations[lang];
        const messageSent = confirmationOverlay.querySelector('[data-translate="message-sent"]');
        const confirmationText = confirmationOverlay.querySelector('[data-translate="confirmation-text"]');
        const acceptButton = confirmationOverlay.querySelector('[data-translate="accept-button"]');
        
        if (messageSent) messageSent.textContent = langData['message-sent'];
        if (confirmationText) confirmationText.textContent = langData['confirmation-text'];
        if (acceptButton) acceptButton.textContent = langData['accept-button'];
    }
}

function showLanguageNotification(lang) {
    const languages = {
        'es': 'Español',
        'en': 'English'
    };
    
    showNotification(`Idioma cambiado a ${languages[lang]}`, 'success');
}

// ===== FUNCIÓN DE NOTIFICACIÓN =====
function showNotification(message, type = 'info') {
    // Eliminar notificaciones existentes
    document.querySelectorAll('.language-notification').forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = 'language-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        animation: slideInLeft 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Añadir animación
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideInLeft {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutLeft 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}