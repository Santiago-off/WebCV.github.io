// admin.js

// Credenciales de administrador
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin"
};

// Elementos del DOM
let loginContainer, adminContainer, loginForm, errorMessage;
let visitsTableBody, messagesTableBody;
let totalVisitsElement, totalMessagesElement, lastVisitElement, visitsTodayElement, lastAccessElement;

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    checkAuthentication();
    setupEventListeners();
});

// Inicializar elementos del DOM
function initializeElements() {
    loginContainer = document.getElementById('loginContainer');
    adminContainer = document.getElementById('adminContainer');
    loginForm = document.getElementById('adminLoginForm');
    errorMessage = document.getElementById('errorMessage');
    
    visitsTableBody = document.getElementById('visitsTableBody');
    messagesTableBody = document.getElementById('messagesTableBody');
    
    totalVisitsElement = document.getElementById('totalVisits');
    totalMessagesElement = document.getElementById('totalMessages');
    lastVisitElement = document.getElementById('lastVisit');
    visitsTodayElement = document.getElementById('visitsToday');
    lastAccessElement = document.getElementById('lastAccess');
}

// Configurar event listeners
function setupEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Verificar si el usuario ya está autenticado
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const authExpiry = localStorage.getItem('authExpiry');
    
    // Verificar si la autenticación ha expirado
    if (isAuthenticated && authExpiry && new Date().getTime() < parseInt(authExpiry)) {
        showAdminPanel();
        loadAdminData();
    } else {
        // Limpiar autenticación expirada
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('authExpiry');
        showLoginForm();
    }
}

// Manejar el inicio de sesión
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Autenticación exitosa
        const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 horas
        
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('authExpiry', expiryTime.toString());
        
        showAdminPanel();
        loadAdminData();
        showNotification('Inicio de sesión exitoso', 'success');
    } else {
        // Credenciales incorrectas
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        showNotification('Credenciales incorrectas', 'error');
    }
}

// Mostrar formulario de login
function showLoginForm() {
    if (loginContainer) loginContainer.style.display = 'flex';
    if (adminContainer) adminContainer.style.display = 'none';
}

// Mostrar panel de administración
function showAdminPanel() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (adminContainer) adminContainer.style.display = 'block';
    
    // Actualizar última conexión
    const now = new Date();
    lastAccessElement.textContent = `Última conexión: ${now.toLocaleString()}`;
    localStorage.setItem('lastAdminAccess', now.toISOString());
}

// Cargar datos de administración
function loadAdminData() {
    loadVisitsData();
    loadMessagesData();
    updateStats();
}

// Cargar datos de visitas
function loadVisitsData() {
    const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    
    // Limpiar tabla
    visitsTableBody.innerHTML = '';
    
    // Ordenar visitas por fecha (más recientes primero)
    const sortedVisits = visits.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Llenar tabla
    sortedVisits.forEach(visit => {
        const row = document.createElement('tr');
        
        const date = new Date(visit.timestamp);
        const browser = getBrowserName(visit.userAgent);
        
        row.innerHTML = `
            <td>${date.toLocaleString()}</td>
            <td>${visit.ip || 'No disponible'}</td>
            <td>${browser}</td>
            <td>${visit.page}</td>
            <td>${visit.referrer || 'Directo'}</td>
        `;
        
        visitsTableBody.appendChild(row);
    });
}

// Cargar datos de mensajes
function loadMessagesData() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Limpiar tabla
    messagesTableBody.innerHTML = '';
    
    // Ordenar mensajes por fecha (más recientes primero)
    const sortedMessages = messages.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Llenar tabla
    sortedMessages.forEach(message => {
        const row = document.createElement('tr');
        const date = new Date(message.timestamp);
        
        row.innerHTML = `
            <td>${date.toLocaleString()}</td>
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${truncateText(message.message, 50)}</td>
        `;
        
        messagesTableBody.appendChild(row);
    });
}

// Actualizar estadísticas
function updateStats() {
    const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Estadísticas generales
    totalVisitsElement.textContent = visits.length;
    totalMessagesElement.textContent = messages.length;
    
    // Última visita
    if (visits.length > 0) {
        const lastVisit = new Date(visits[visits.length - 1].timestamp);
        lastVisitElement.textContent = lastVisit.toLocaleString();
    } else {
        lastVisitElement.textContent = '-';
    }
    
    // Visitas hoy
    const today = new Date().toDateString();
    const visitsToday = visits.filter(visit => 
        new Date(visit.timestamp).toDateString() === today
    ).length;
    
    visitsTodayElement.textContent = visitsToday;
}

// Mostrar/ocultar pestañas
function showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Activar botón seleccionado
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('authExpiry');
    showLoginForm();
    showNotification('Sesión cerrada correctamente', 'success');
}

// Exportar datos
function exportData() {
    const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    const data = {
        visits: visits,
        messages: messages,
        exportedAt: new Date().toISOString(),
        totalVisits: visits.length,
        totalMessages: messages.length
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio_data_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Datos exportados correctamente', 'success');
}

// Limpiar datos
function clearData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('pageVisits');
        localStorage.removeItem('contactMessages');
        
        // Recargar datos
        loadVisitsData();
        loadMessagesData();
        updateStats();
        
        showNotification('Datos eliminados correctamente', 'success');
    }
}

// Utilidad: Obtener nombre del navegador
function getBrowserName(userAgent) {
    if (!userAgent) return 'Desconocido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    
    return 'Desconocido';
}

// Utilidad: Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Sistema de notificaciones
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
        font-weight: 500;
    `;
    
    // Estilo según tipo
    if (type === 'success') {
        notification.style.background = 'var(--success)';
    } else if (type === 'error') {
        notification.style.background = 'var(--danger)';
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
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Verificar autenticación automáticamente cada minuto
setInterval(() => {
    const authExpiry = localStorage.getItem('authExpiry');
    if (authExpiry && new Date().getTime() > parseInt(authExpiry)) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('authExpiry');
        showLoginForm();
        showNotification('Sesión expirada por inactividad', 'error');
    }
}, 60000); // Verificar cada minuto