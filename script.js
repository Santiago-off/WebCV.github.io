// script.js

// ===== SISTEMA DE TRACKING DE VISITAS =====
document.addEventListener('DOMContentLoaded', function() {
    // Registrar visita
    const visitData = {
        timestamp: new Date().toISOString(),
        page: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        ip: null // Se obtendrá mediante una API externa
    };
    
    // Obtener la IP pública
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            visitData.ip = data.ip;
            storeVisit(visitData);
        })
        .catch(() => {
            visitData.ip = 'No disponible';
            storeVisit(visitData);
        });
    
    // Manejar el formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactForm(this);
    });
    
    // Inicializar animaciones
    initAnimations();
    
    // Inicializar panel de administración
    initAdminPanel();
});

// Almacenar visita
function storeVisit(visitData) {
    let visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    visits.push(visitData);
    localStorage.setItem('pageVisits', JSON.stringify(visits));
    
    // Mostrar contador de visitas
    const visitCount = visits.length;
    document.getElementById('visitCount').textContent = visitCount;
    document.getElementById('adminVisitCount').textContent = visitCount;
    
    // Mostrar última visita
    if (visits.length > 0) {
        const lastVisit = new Date(visits[visits.length - 1].timestamp);
        document.getElementById('lastVisit').textContent = lastVisit.toLocaleString();
    }
}

// ===== MANEJO DEL FORMULARIO DE CONTACTO =====
function handleContactForm(form) {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Guardar mensaje
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push(formData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Actualizar contador de mensajes
    document.getElementById('messageCount').textContent = messages.length;
    
    // Mostrar confirmación
    showNotification('¡Gracias por tu mensaje! Te responderé pronto.', 'success');
    
    // Reiniciar formulario
    form.reset();
    
    // NOTA: Para que los mensajes lleguen a tu correo, necesitas:
    // 1. Un backend que procese el formulario (PHP, Node.js, etc.)
    // 2. Un servicio de email como SendGrid, Mailgun o SMTP
    // 3. Configurar el formulario para enviar los datos al backend
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
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
    `;
    
    // Estilo según tipo
    if (type === 'success') {
        notification.style.background = 'var(--success)';
    } else if (type === 'error') {
        notification.style.background = 'var(--accent)';
    } else {
        notification.style.background = 'var(--secondary)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animación de salida después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== ANIMACIONES =====
function initAnimations() {
    // Hacer visibles todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('visible');
    });
    
    // Animación para elementos de la línea de tiempo
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200);
    });
    
    // Animación para tarjetas de certificados
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
    
    // Animación para tarjetas de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
    
    // Efecto de escritura para el título
    const title = document.querySelector('h1');
    const originalText = title.textContent;
    title.textContent = '';
    
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

// ===== PANEL DE ADMINISTRACIÓN =====
function initAdminPanel() {
    // Cargar estadísticas
    const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    document.getElementById('adminVisitCount').textContent = visits.length;
    document.getElementById('messageCount').textContent = messages.length;
    
    if (visits.length > 0) {
        const lastVisit = new Date(visits[visits.length - 1].timestamp);
        document.getElementById('lastVisit').textContent = lastVisit.toLocaleString();
    }
}

function toggleAdmin() {
    const adminContent = document.getElementById('adminContent');
    adminContent.classList.toggle('show');
}

function exportData() {
    const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    const data = {
        visits: visits,
        messages: messages,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'portfolio_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Datos exportados correctamente', 'success');
}

function clearData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('pageVisits');
        localStorage.removeItem('contactMessages');
        
        document.getElementById('visitCount').textContent = '0';
        document.getElementById('adminVisitCount').textContent = '0';
        document.getElementById('messageCount').textContent = '0';
        document.getElementById('lastVisit').textContent = '-';
        
        showNotification('Datos eliminados correctamente', 'success');
    }
}

// Event listener para el botón de administración
document.getElementById('adminBtn').addEventListener('click', toggleAdmin);

// ===== FUNCIONES PARA LOS MODALES DE CERTIFICADOS =====
function openModal(id) {
    document.getElementById(id).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
}

// Cerrar con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            if (modals[i].classList.contains('show')) {
                modals[i].classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    }
});

// ===== SCROLL ANIMATIONS =====
// Detecta cuando los elementos entran en el viewport
function checkScroll() {
    const elements = document.querySelectorAll('.timeline-item, .certificate-card, .project-card');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // Si el elemento está en el viewport
        if(position.top < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Ejecutar checkScroll al cargar y al hacer scroll
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);