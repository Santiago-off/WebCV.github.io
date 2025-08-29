// script.js

// ===== CONFIGURACIÓN DE SEGURIDAD =====
const SECURITY_CONFIG = {
    maxFormLength: 1000,
    maxMessageLength: 500,
    allowedEmailDomains: ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'],
    rateLimit: {
        visits: 100,
        messages: 5,
        timeWindow: 3600000
    }
};

// ===== SISTEMA DE SEGURIDAD =====
class SecuritySystem {
    constructor() {
        this.attempts = new Map();
        this.setupSecurityHeaders();
    }

    setupSecurityHeaders() {
        console.log('Sistema de seguridad inicializado');
    }

    checkRateLimit(key, limit) {
        const now = Date.now();
        const userAttempts = this.attempts.get(key) || [];
        
        const recentAttempts = userAttempts.filter(time => now - time < SECURITY_CONFIG.rateLimit.timeWindow);
        
        if (recentAttempts.length >= limit) {
            return false;
        }
        
        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);
        return true;
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:\s*[^"']*/gi, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim()
            .substring(0, SECURITY_CONFIG.maxFormLength);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        const domain = email.split('@')[1];
        return SECURITY_CONFIG.allowedEmailDomains.includes(domain);
    }

    detectXSS(input) {
        const xssPatterns = [
            /<script/i, /javascript:/i, /onerror=/i, /onload=/i,
            /onclick=/i, /eval\(/i, /alert\(/i, /document\.cookie/i
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }
}

// ===== SISTEMA PRINCIPAL =====
const securitySystem = new SecuritySystem();

document.addEventListener('DOMContentLoaded', function() {
    if (!checkBrowserCompatibility()) {
        showCompatibilityWarning();
        return;
    }

    initSecurityMonitoring();
    initVisitTracking();
    setupEventListeners();
    initAnimations();
});

// ===== COMPROBACIÓN DE COMPATIBILIDAD =====
function checkBrowserCompatibility() {
    const features = {
        'localStorage': 'localStorage' in window,
        'fetch': 'fetch' in window,
        'IntersectionObserver': 'IntersectionObserver' in window
    };

    return Object.values(features).every(feature => feature);
}

function showCompatibilityWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #e74c3c;
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 10000;
        font-weight: bold;
    `;
    warning.textContent = '⚠️ Tu navegador no es compatible con todas las funcionalidades. Por favor, actualízalo.';
    document.body.appendChild(warning);
}

// ===== SISTEMA DE VISITAS =====
function initVisitTracking() {
    const visitorKey = getVisitorFingerprint();
    
    if (!securitySystem.checkRateLimit(visitorKey, SECURITY_CONFIG.rateLimit.visits)) {
        console.warn('Límite de visitas excedido');
        return;
    }

    const visitData = {
        timestamp: new Date().toISOString(),
        page: window.location.href,
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ip: null
    };

    fetch('https://api.ipify.org?format=json', {
        mode: 'cors',
        credentials: 'omit'
    })
    .then(response => response.json())
    .then(data => {
        visitData.ip = data.ip;
        storeVisit(visitData);
    })
    .catch(error => {
        visitData.ip = 'unknown';
        storeVisit(visitData);
    });
}

function getVisitorFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        window.screen.width,
        window.screen.height,
        new Date().getTimezoneOffset()
    ];
    
    return components.join('|');
}

function storeVisit(visitData) {
    try {
        let visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
        
        if (visits.length > 1000) {
            visits = visits.slice(-500);
        }
        
        visits.push(visitData);
        localStorage.setItem('pageVisits', JSON.stringify(visits));
        
        updateVisitCounter(visits.length);
    } catch (error) {
        console.error('Error almacenando visita:', error);
    }
}

function updateVisitCounter(count) {
    const counterElement = document.getElementById('visitCount');
    if (counterElement) {
        counterElement.textContent = count.toLocaleString();
    }
}

// ===== MANEJO DE FORMULARIO =====
function setupEventListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', validateRealTime);
            input.addEventListener('blur', validateRealTime);
        });
    }

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showNotification('El menú contextual está deshabilitado por seguridad.', 'warning');
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showNotification('La inspección de elementos está deshabilitada.', 'warning');
        }
        if (e.key === 'F12') {
            e.preventDefault();
            showNotification('El acceso a herramientas de desarrollo está deshabilitado.', 'warning');
        }
    });
}

function validateRealTime(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (securitySystem.detectXSS(value)) {
        input.style.borderColor = '#e74c3c';
        showTooltip(input, '⚠️ Contenido no permitido detectado');
        return false;
    }
    
    if (input.id === 'email' && value && !securitySystem.validateEmail(value)) {
        input.style.borderColor = '#e74c3c';
        showTooltip(input, '⚠️ Por favor, introduce un email válido');
        return false;
    }
    
    input.style.borderColor = '#2ecc71';
    hideTooltip(input);
    return true;
}

function showTooltip(element, message) {
    hideTooltip(element);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'input-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: #e74c3c;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        margin-top: 5px;
        max-width: 200px;
    `;
    
    element.parentNode.style.position = 'relative';
    element.parentNode.appendChild(tooltip);
}

function hideTooltip(element) {
    const existingTooltip = element.parentNode.querySelector('.input-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

async function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: securitySystem.sanitizeInput(document.getElementById('name').value),
        email: securitySystem.sanitizeInput(document.getElementById('email').value),
        message: securitySystem.sanitizeInput(document.getElementById('message').value),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: await getIPAddress()
    };

    if (!validateFormData(formData)) {
        return;
    }

    const messageKey = `message_${getVisitorFingerprint()}`;
    if (!securitySystem.checkRateLimit(messageKey, SECURITY_CONFIG.rateLimit.messages)) {
        showNotification('⚠️ Has enviado demasiados mensajes. Por favor, espera un momento.', 'error');
        return;
    }

    saveMessage(formData);
    showConfirmationMessage();
    form.reset();
}

function validateFormData(formData) {
    if (formData.message.length > SECURITY_CONFIG.maxMessageLength) {
        showNotification(`El mensaje no puede exceder ${SECURITY_CONFIG.maxMessageLength} caracteres.`, 'error');
        return false;
    }

    if (!securitySystem.validateEmail(formData.email)) {
        showNotification('Por favor, introduce un email válido de un dominio permitido.', 'error');
        return false;
    }

    if (securitySystem.detectXSS(formData.name) || 
        securitySystem.detectXSS(formData.email) || 
        securitySystem.detectXSS(formData.message)) {
        showNotification('⚠️ Se detectó contenido no permitido. Por favor, revisa tu mensaje.', 'error');
        return false;
    }

    return true;
}

async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            credentials: 'omit',
            mode: 'cors'
        });
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

function saveMessage(formData) {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        if (messages.length > 100) {
            messages = messages.slice(-50);
        }
        
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        showNotification('Mensaje guardado correctamente', 'success');
    } catch (error) {
        console.error('Error guardando mensaje:', error);
        showNotification('Error al guardar el mensaje', 'error');
    }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;

    const styles = {
        success: 'background: rgba(46, 204, 113, 0.95);',
        error: 'background: rgba(231, 76, 60, 0.95);',
        warning: 'background: rgba(243, 156, 18, 0.95);',
        info: 'background: rgba(52, 152, 219, 0.95);'
    };

    notification.style.cssText += styles[type] || styles.info;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== CONFIRMACIÓN DE MENSAJE =====
function showConfirmationMessage() {
    const confirmation = document.createElement('div');
    confirmation.id = 'confirmationOverlay';
    confirmation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

    confirmation.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: popIn 0.3s ease;
        ">
            <div style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: var(--primary); margin-bottom: 1rem;" data-translate="message-sent">¡Mensaje Enviado!</h3>
            <p style="color: var(--dark); line-height: 1.5; margin-bottom: 1.5rem;" data-translate="confirmation-text">
                Su mensaje ha sido enviado correctamente. 
                Dentro de poco recibirá una respuesta. 
                ¡Muchas gracias!
            </p>
            <button onclick="closeConfirmation()" style="
                background: var(--secondary);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                width: 100%;
            " onmouseover="this.style.background='var(--primary)'" 
            onmouseout="this.style.background='var(--secondary)'" data-translate="accept-button">
                Aceptar
            </button>
        </div>
    `;

    document.body.appendChild(confirmation);
    document.body.style.overflow = 'hidden';

    if (window.LanguageSwitcher) {
        window.LanguageSwitcher.applyLanguage(window.LanguageSwitcher.getCurrentLanguage());
    }
}

function closeConfirmation() {
    const overlay = document.getElementById('confirmationOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// ===== ANIMACIONES =====
function initAnimations() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('visible');
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200);
    });

    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });

    animateTitle();
}

function animateTitle() {
    const title = document.querySelector('h1');
    if (!title) return;

    const originalText = title.textContent;
    title.textContent = '';
    title.style.visibility = 'visible';

    let i = 0;
    const typeWriter = setInterval(() => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeWriter);
        }
    }, 100);
}

// ===== SEGURIDAD Y MONITOREO =====
function initSecurityMonitoring() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        checkNodeSecurity(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
}

function checkNodeSecurity(node) {
    if (node.tagName === 'SCRIPT' && !node.src) {
        node.remove();
        showNotification('⚠️ Actividad sospechosa detectada y bloqueada', 'warning');
    }

    if (node.tagName === 'IFRAME') {
        node.remove();
        showNotification('⚠️ Iframes no permitidos por seguridad', 'warning');
    }
}

// ===== FUNCIONES PARA MODALES =====
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleModalEscape);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleModalEscape);
    }
}

function handleModalEscape(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            closeModal(modal.id);
        });
    }
}

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    }
}

// ===== SCROLL ANIMATIONS =====
function checkScroll() {
    const elements = document.querySelectorAll('.timeline-item, .certificate-card, .project-card');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        if (position.top < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// ===== SIMULACIÓN DE EMAIL =====
function simulateEmailNotification(formData) {
    console.log('Simulando envío de email:', {
        to: 'santiagorfernandezcv@gmail.com',
        subject: 'Nuevo mensaje del portfolio',
        from: formData.email,
        message: formData.message,
        timestamp: new Date().toLocaleString()
    });
}

// Event listeners globales
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);

// Exportar funciones globales
window.openModal = openModal;
window.closeModal = closeModal;
window.closeConfirmation = closeConfirmation;

// Inicialización final
setTimeout(() => {
    console.log('Portfolio cargado completamente ✅');
    showNotification('Bienvenido al portfolio de Santiago', 'success');
}, 1000);

// ===== POLYFILLS PARA COMPATIBILIDAD =====
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

// ===== MANEJO DE ERRORES GLOBAL =====
window.addEventListener('error', function(e) {
    console.error('Error global capturado:', e.error);
    showNotification('Se produjo un error inesperado. Por favor, recarga la página.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada:', e.reason);
    e.preventDefault();
});