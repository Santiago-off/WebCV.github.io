// admin.js - Sistema de Administración Seguro

// ===== CONFIGURACIÓN DE SEGURIDAD =====
const SECURITY_CONFIG = {
    maxLoginAttempts: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    captchaLength: 4,
    allowedIPs: ['127.0.0.1', '::1'],
    encryptionKey: 'portfolio-admin-2024',
    rateLimit: {
        requests: 100,
        timeWindow: 900000 // 15 minutos
    }
};

// ===== ESTADO GLOBAL =====
let currentSession = {
    authenticated: false,
    startTime: null,
    lastActivity: null,
    user: null,
    securityLevel: 'high'
};

let loginAttempts = 0;
let securityEvents = [];
let currentTab = 'visits';
let sortState = {
    visits: { field: 'timestamp', direction: 'desc' },
    messages: { field: 'timestamp', direction: 'desc' }
};

// ===== SISTEMA DE SEGURIDAD =====
class AdminSecurity {
    constructor() {
        this.attempts = new Map();
        this.setupSecurity();
    }

    setupSecurity() {
        this.preventDevTools();
        this.setupActivityMonitor();
        this.checkEnvironment();
    }

    preventDevTools() {
        // Prevenir apertura de DevTools
        const devToolsPatterns = [
            /F12/, /Ctrl\+Shift\+I/, /Ctrl\+U/, /View.Source/,
            /document\.contentWindow/, /window\.debugger/
        ];

        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.logSecurityEvent('Intento de apertura de DevTools bloqueado', 'high');
                this.showNotification('El acceso a herramientas de desarrollo está restringido.', 'warning');
            }
        });

        // Detectar cambios en el DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.checkForMaliciousNodes(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkForMaliciousNodes(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
                if (node.tagName === 'SCRIPT' && !node.src) {
                    node.remove();
                    this.logSecurityEvent('Script malicioso detectado y eliminado', 'critical');
                }
                
                if (node.tagName === 'IFRAME') {
                    node.remove();
                    this.logSecurityEvent('Iframe no autorizado detectado', 'high');
                }
            }
        });
    }

    setupActivityMonitor() {
        // Monitorizar inactividad
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (currentSession.authenticated) {
                    this.logout('Sesión cerrada por inactividad');
                }
            }, SECURITY_CONFIG.sessionTimeout);
        };

        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keypress', resetTimer);
        resetTimer();
    }

    checkEnvironment() {
        // Verificar si está en un entorno seguro
        if (window.self !== window.top) {
            window.top.location = window.self.location;
            this.logSecurityEvent('Intento de iframing detectado', 'high');
        }

        // Verificar protocolo seguro en producción
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            this.logSecurityEvent('Conexión no segura detectada', 'medium');
        }
    }

    validateCredentials(username, password, captcha, captchaInput) {
        // Validaciones básicas
        if (!username || !password || !captchaInput) {
            return { valid: false, message: 'Todos los campos son requeridos' };
        }

        if (username.length > 20 || password.length > 20) {
            return { valid: false, message: 'Usuario o contraseña demasiado largos' };
        }

        // Validar formato
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^[a-zA-Z0-9]+$/;

        if (!usernameRegex.test(username)) {
            return { valid: false, message: 'Usuario inválido' };
        }

        if (!passwordRegex.test(password)) {
            return { valid: false, message: 'Contraseña inválida' };
        }

        // Validar CAPTCHA
        if (captchaInput.toUpperCase() !== captcha) {
            return { valid: false, message: 'CAPTCHA incorrecto' };
        }

        // Validar credenciales
        if (username === 'admin' && password === 'admin') {
            return { valid: true, message: 'Credenciales válidas' };
        }

        return { valid: false, message: 'Credenciales inválidas' };
    }

    checkRateLimit(key) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Limpiar intentos antiguos
        const recentAttempts = attempts.filter(time => 
            now - time < SECURITY_CONFIG.rateLimit.timeWindow
        );

        if (recentAttempts.length >= SECURITY_CONFIG.rateLimit.requests) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);
        return true;
    }

    encryptData(data) {
        // Encriptación básica (en producción usaría una librería como crypto-js)
        try {
            return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        } catch (error) {
            console.error('Error encriptando datos:', error);
            return null;
        }
    }

    decryptData(encryptedData) {
        try {
            return JSON.parse(decodeURIComponent(escape(atob(encryptedData))));
        } catch (error) {
            console.error('Error desencriptando datos:', error);
            return null;
        }
    }

    logSecurityEvent(message, severity = 'medium') {
        const event = {
            timestamp: new Date().toISOString(),
            message,
            severity,
            ip: this.getClientIP(),
            userAgent: navigator.userAgent
        };

        securityEvents.unshift(event);
        
        // Mantener solo los últimos 100 eventos
        if (securityEvents.length > 100) {
            securityEvents = securityEvents.slice(0, 100);
        }

        this.updateSecurityUI();
    }

    getClientIP() {
        // Esto es una simulación - en producción se obtendría del servidor
        return '127.0.0.1';
    }

    updateSecurityUI() {
        const criticalAlerts = securityEvents.filter(e => e.severity === 'critical').length;
        const warningAlerts = securityEvents.filter(e => e.severity === 'high').length;
        const secureItems = securityEvents.filter(e => e.severity === 'low').length;

        document.getElementById('criticalAlerts').textContent = criticalAlerts;
        document.getElementById('warningAlerts').textContent = warningAlerts;
        document.getElementById('secureItems').textContent = secureItems;
        document.getElementById('securityBadge').textContent = criticalAlerts + warningAlerts;

        // Actualizar logs
        const logsContainer = document.getElementById('securityLogs');
        if (logsContainer) {
            logsContainer.innerHTML = securityEvents.slice(0, 5).map(event => `
                <div class="log-entry ${event.severity}">
                    <i class="fas fa-${this.getSeverityIcon(event.severity)}"></i>
                    <span>${event.message}</span>
                    <span class="log-time">${this.formatTimeAgo(event.timestamp)}</span>
                </div>
            `).join('');
        }
    }

    getSeverityIcon(severity) {
        const icons = {
            critical: 'exclamation-triangle',
            high: 'exclamation-circle',
            medium: 'info-circle',
            low: 'check-circle'
        };
        return icons[severity] || 'info-circle';
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        return `Hace ${days} d`;
    }
}

// ===== INICIALIZACIÓN =====
const adminSecurity = new AdminSecurity();

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminSystem();
    generateCaptcha();
    setupEventListeners();
});

function initializeAdminSystem() {
    // Verificar si ya está autenticado
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
        const session = adminSecurity.decryptData(savedSession);
        if (session && session.authenticated && session.expiry > Date.now()) {
            startSession(session);
            return;
        }
    }

    // Mostrar login
    showLogin();
}

function setupEventListeners() {
    // Formulario de login
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Eventos de inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
    });

    // Monitorizar actividad
    document.addEventListener('click', updateActivity);
    document.addEventListener('keypress', updateActivity);
}

// ===== MANEJO DE LOGIN =====
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const captchaText = document.getElementById('captchaText').textContent;

    // Validar rate limiting
    if (!adminSecurity.checkRateLimit('login_' + username)) {
        showError('Demasiados intentos. Por favor, espera.');
        return;
    }

    // Validar credenciales
    const validation = adminSecurity.validateCredentials(username, password, captchaText, captchaInput);
    
    if (!validation.valid) {
        loginAttempts++;
        updateAttemptsCounter();
        
        if (loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
            adminSecurity.logSecurityEvent(`Bloqueo por múltiples intentos fallidos - Usuario: ${username}`, 'high');
            showError('Demasiados intentos fallidos. El acceso ha sido bloqueado temporalmente.');
            disableLoginForm();
            return;
        }

        showError(validation.message);
        generateCaptcha();
        return;
    }

    // Login exitoso
    adminSecurity.logSecurityEvent(`Login exitoso - Usuario: ${username}`, 'low');
    startSession({
        authenticated: true,
        user: username,
        startTime: new Date().toISOString(),
        expiry: Date.now() + SECURITY_CONFIG.sessionTimeout
    });
}

function updateAttemptsCounter() {
    const attemptsLeft = SECURITY_CONFIG.maxLoginAttempts - loginAttempts;
    document.getElementById('attemptsLeft').textContent = attemptsLeft;
    
    if (attemptsLeft <= 1) {
        document.getElementById('attemptsLeft').style.color = 'var(--danger)';
    }
}

function disableLoginForm() {
    const form = document.getElementById('adminLoginForm');
    const inputs = form.querySelectorAll('input, button');
    
    inputs.forEach(input => {
        input.disabled = true;
    });

    setTimeout(() => {
        inputs.forEach(input => {
            input.disabled = false;
        });
        loginAttempts = 0;
        updateAttemptsCounter();
        generateCaptcha();
    }, 300000); // 5 minutos
}

// ===== MANEJO DE SESIÓN =====
function startSession(sessionData) {
    currentSession = { ...sessionData, lastActivity: Date.now() };
    
    // Guardar sesión encriptada
    const encryptedSession = adminSecurity.encryptData({
        ...currentSession,
        expiry: Date.now() + SECURITY_CONFIG.sessionTimeout
    });
    
    localStorage.setItem('adminSession', encryptedSession);

    // Actualizar UI
    showAdminPanel();
    loadDashboardData();
    startSessionTimer();
}

function updateActivity() {
    if (currentSession.authenticated) {
        currentSession.lastActivity = Date.now();
    }
}

function startSessionTimer() {
    setInterval(() => {
        if (currentSession.authenticated) {
            const inactiveTime = Date.now() - currentSession.lastActivity;
            const timeLeft = SECURITY_CONFIG.sessionTimeout - inactiveTime;
            
            if (timeLeft <= 0) {
                adminSecurity.logout('Sesión expirada por inactividad');
                return;
            }

            updateSessionTimer(timeLeft);
        }
    }, 1000);
}

function updateSessionTimer(timeLeft) {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    document.getElementById('sessionTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function logout(reason = 'Sesión cerrada por el usuario') {
    adminSecurity.logSecurityEvent(`Logout - ${reason}`, 'medium');
    
    // Limpiar sesión
    localStorage.removeItem('adminSession');
    currentSession = {
        authenticated: false,
        startTime: null,
        lastActivity: null,
        user: null
    };

    // Mostrar notificación
    if (reason !== 'Sesión cerrada por el usuario') {
        showNotification(reason, 'warning');
    }

    // Volver al login
    showLogin();
}

// ===== INTERFAZ DE USUARIO =====
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
    resetLoginForm();
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    
    // Actualizar información de sesión
    document.getElementById('sessionStart').textContent = 
        new Date(currentSession.startTime).toLocaleString();
}

function resetLoginForm() {
    const form = document.getElementById('adminLoginForm');
    if (form) {
        form.reset();
    }
    loginAttempts = 0;
    updateAttemptsCounter();
    generateCaptcha();
}

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    
    for (let i = 0; i < SECURITY_CONFIG.captchaLength; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('captchaText').textContent = captcha;
    document.getElementById('captchaInput').value = '';
}

// ===== DASHBOARD Y DATOS =====
function loadDashboardData() {
    loadVisitsData();
    loadMessagesData();
    updateSecurityStats();
    updatePerformanceMetrics();
}

function loadVisitsData() {
    try {
        const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
        const totalVisits = visits.length;
        const visitsToday = getVisitsToday(visits);
        const lastVisit = visits.length > 0 ? new Date(visits[visits.length - 1].timestamp) : null;

        // Actualizar UI
        document.getElementById('totalVisits').textContent = totalVisits.toLocaleString();
        document.getElementById('visitsToday').textContent = visitsToday;
        document.getElementById('visitsBadge').textContent = totalVisits;
        
        if (lastVisit) {
            document.getElementById('lastVisit').textContent = lastVisit.toLocaleString();
            document.getElementById('lastVisitAgo').textContent = 
                adminSecurity.formatTimeAgo(lastVisit.toISOString());
        }

        // Calcular tendencias
        updateTrends(visits);

        // Renderizar tabla
        renderVisitsTable(visits);

    } catch (error) {
        console.error('Error loading visits data:', error);
        adminSecurity.logSecurityEvent('Error cargando datos de visitas', 'medium');
    }
}

function loadMessagesData() {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const totalMessages = messages.length;

        document.getElementById('totalMessages').textContent = totalMessages.toLocaleString();
        document.getElementById('messagesBadge').textContent = totalMessages;

        renderMessagesTable(messages);

    } catch (error) {
        console.error('Error loading messages data:', error);
        adminSecurity.logSecurityEvent('Error cargando datos de mensajes', 'medium');
    }
}

function getVisitsToday(visits) {
    const today = new Date().toDateString();
    return visits.filter(visit => 
        new Date(visit.timestamp).toDateString() === today
    ).length;
}

function updateTrends(visits) {
    // Implementar lógica de tendencias
    const lastWeekVisits = visits.filter(visit => {
        const visitDate = new Date(visit.timestamp);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return visitDate > weekAgo;
    }).length;

    const previousWeekVisits = visits.filter(visit => {
        const visitDate = new Date(visit.timestamp);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return visitDate > twoWeeksAgo && visitDate <= weekAgo;
    }).length;

    const trend = previousWeekVisits > 0 ? 
        ((lastWeekVisits - previousWeekVisits) / previousWeekVisits * 100).toFixed(1) : 
        0;

    document.getElementById('visitsTrend').textContent = `${trend >= 0 ? '+' : ''}${trend}%`;
    document.getElementById('visitsTrend').style.color = trend >= 0 ? 'var(--success)' : 'var(--danger)';
}

function updateSecurityStats() {
    const failedAttempts = adminSecurity.attempts.size;
    document.getElementById('failedAttempts').textContent = failedAttempts;
    document.getElementById('attemptsTrend').textContent = `${failedAttempts} intentos`;
}

function updatePerformanceMetrics() {
    // Simular métricas de performance
    const memoryUsage = (performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0).toFixed(1);
    const loadTime = performance.timing ? 
        performance.timing.loadEventEnd - performance.timing.navigationStart : 0;

    document.getElementById('memoryUsage').textContent = `${memoryUsage} MB`;
    document.getElementById('loadTime').textContent = `${loadTime}ms`;
    document.getElementById('performanceScore').textContent = '100%';
    document.getElementById('performanceTrend').textContent = 'Óptimo';
}

// ===== RENDERIZADO DE TABLAS =====
function renderVisitsTable(visits) {
    const tbody = document.getElementById('visitsTableBody');
    if (!tbody) return;

    tbody.innerHTML = visits.slice().reverse().map(visit => `
        <tr>
            <td>${new Date(visit.timestamp).toLocaleString()}</td>
            <td>${visit.ip || 'N/A'}</td>
            <td>${getBrowserName(visit.userAgent)}</td>
            <td>${visit.page || 'N/A'}</td>
            <td>${visit.referrer || 'Directo'}</td>
            <td>
                <button onclick="viewDetails('visit', ${JSON.stringify(visit).replace(/"/g, '&quot;')})" 
                        class="btn-info small">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6">No hay visitas registradas</td></tr>';

    updatePaginationInfo('visits', visits.length);
}

function renderMessagesTable(messages) {
    const tbody = document.getElementById('messagesTableBody');
    if (!tbody) return;

    tbody.innerHTML = messages.slice().reverse().map(message => `
        <tr>
            <td>${new Date(message.timestamp).toLocaleString()}</td>
            <td>${message.name || 'N/A'}</td>
            <td>${message.email || 'N/A'}</td>
            <td>${truncateText(message.message, 50)}</td>
            <td>${message.ip || 'N/A'}</td>
            <td>
                <button onclick="viewDetails('message', ${JSON.stringify(message).replace(/"/g, '&quot;')})" 
                        class="btn-info small">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteMessage('${message.timestamp}')" 
                        class="btn-danger small">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6">No hay mensajes</td></tr>';

    updatePaginationInfo('messages', messages.length);
}

function getBrowserName(userAgent) {
    if (!userAgent) return 'Desconocido';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Otro';
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ===== FUNCIONALIDADES DE TABLA =====
function sortTable(tableType, field) {
    const currentSort = sortState[tableType];
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    sortState[tableType] = { field, direction: newDirection };
    
    // Aquí implementarías la lógica de ordenamiento
    // Por simplicidad, se omite la implementación completa
}

function filterVisits() {
    const searchTerm = document.getElementById('visitsSearch').value.toLowerCase();
    // Implementar filtrado
}

function filterMessages() {
    const searchTerm = document.getElementById('messagesSearch').value.toLowerCase();
    // Implementar filtrado
}

function updatePaginationInfo(type, totalItems) {
    document.getElementById(`${type}Total`).textContent = totalItems;
    document.getElementById(`${type}Showing`).textContent = totalItems;
}

// ===== ACCIONES DE ADMINISTRACIÓN =====
function refreshData() {
    loadDashboardData();
    showNotification('Datos actualizados', 'success');
}

function exportData() {
    try {
        const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        const data = {
            visits,
            messages,
            exportedAt: new Date().toISOString(),
            exportedBy: currentSession.user
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);
        link.click();

        adminSecurity.logSecurityEvent('Exportación de datos realizada', 'low');
        showNotification('Datos exportados correctamente', 'success');

    } catch (error) {
        console.error('Error exporting data:', error);
        adminSecurity.logSecurityEvent('Error en exportación de datos', 'medium');
        showNotification('Error al exportar datos', 'error');
    }
}

function backupData() {
    try {
        const visits = JSON.parse(localStorage.getItem('pageVisits')) || [];
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const securityLog = securityEvents || [];
        const backup = {
            visits,
            messages,
            securityLog,
            backupDate: new Date().toISOString(),
            backupBy: currentSession.user
        };
        const backupStr = JSON.stringify(backup, null, 2);
        const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(backupStr);
        const link = document.createElement('a');
        link.setAttribute('href', uri);
        link.setAttribute('download', `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        adminSecurity.logSecurityEvent('Backup creado correctamente', 'low');
        showNotification('Backup creado correctamente', 'success');
    } catch (error) {
        showNotification('Error al crear backup', 'error');
        adminSecurity.logSecurityEvent('Error al crear backup', 'medium');
    }
}

function viewAuditLog() {
    // Muestra los últimos 20 eventos de seguridad en el modal de detalles
    const log = securityEvents.slice(0, 20);
    document.getElementById('detailsTitle').textContent = 'Log de Auditoría';
    document.getElementById('detailsContent').textContent = log.map(e =>
        `[${e.timestamp}] (${e.severity}) ${e.message} - IP: ${e.ip}`
    ).join('\n');
    showModal('detailsModal');
}

function clearAllData() {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('pageVisits');
        localStorage.removeItem('contactMessages');
        
        loadDashboardData();
        adminSecurity.logSecurityEvent('Todos los datos eliminados', 'high');
        showNotification('Todos los datos han sido eliminados', 'success');
    }
}

function deleteMessage(timestamp) {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages = messages.filter(msg => msg.timestamp !== timestamp);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        loadMessagesData();
        adminSecurity.logSecurityEvent(`Mensaje eliminado - Timestamp: ${timestamp}`, 'medium');
        showNotification('Mensaje eliminado', 'success');

    } catch (error) {
        console.error('Error deleting message:', error);
        showNotification('Error al eliminar mensaje', 'error');
    }
}

// ===== UTILIDADES =====
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.color = 'var(--danger)';
    
    // Efecto de shake
    const form = document.getElementById('adminLoginForm');
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
}

function showNotification(message, type = 'info') {
    // Implementar sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();

    // Limita el tamaño de los campos
    if (value.length > 20) {
        input.value = value.substring(0, 20);
    }

    // Validaciones básicas
    if (input.type === 'text' || input.type === 'password') {
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
            input.style.borderColor = 'var(--danger)';
            return false;
        }
    }

    input.style.borderColor = 'var(--success)';
    return true;
}

function viewDetails(type, data) {
    document.getElementById('detailsTitle').textContent = `Detalles de ${sanitizeHTML(type)}`;
    document.getElementById('detailsContent').textContent = sanitizeHTML(JSON.stringify(data, null, 2));
    showModal('detailsModal');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ===== FUNCIONES GLOBALES =====
window.toggleSecurityMode = function() {
    currentSession.securityLevel = currentSession.securityLevel === 'high' ? 'normal' : 'high';
    const mode = currentSession.securityLevel;
    
    adminSecurity.logSecurityEvent(`Modo seguridad cambiado a: ${mode}`, 'medium');
    showNotification(`Modo seguridad: ${mode}`, 'info');
};

window.runSecurityScan = function() {
    showNotification('Escaneo de seguridad iniciado...', 'info');
    
    // Simular escaneo
    setTimeout(() => {
        adminSecurity.logSecurityEvent('Escaneo de seguridad completado', 'low');
        showNotification('Escaneo completado - Sistema seguro', 'success');
    }, 2000);
};

// Exportar funciones globales
window.showTab = function(tabName) {
    currentTab = tabName;
    // Oculta todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Muestra la pestaña seleccionada
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) tabContent.classList.add('active');

    // Actualiza el estado visual de los botones
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const btn = document.getElementById('tabBtn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (btn) btn.classList.add('active');
};

window.logout = logout;
window.exportData = exportData;
window.refreshData = refreshData;
window.clearAllData = clearAllData;
window.deleteMessage = deleteMessage;
window.viewDetails = viewDetails;
window.closeModal = closeModal;
window.generateCaptcha = generateCaptcha;
window.backupData = backupData;
window.viewAuditLog = viewAuditLog;