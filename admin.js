import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        loadAdminPanel();
    }
});

function setupTabs() {
    const tabsContainer = document.querySelector('.admin-tabs');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabsContainer.addEventListener('click', (e) => {
        const clickedTab = e.target.closest('.admin-tab-link');
        if (!clickedTab) return;

        const tabId = clickedTab.dataset.tab;

        // Actualizar botones de pestañas
        tabsContainer.querySelector('.active').classList.remove('active');
        clickedTab.classList.add('active');

        // Actualizar contenido de pestañas
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    });
}


function getPortfolioData() {
    try {
        const savedDataJSON = localStorage.getItem('portfolioContent');
        if (savedDataJSON) {
            const savedData = JSON.parse(savedDataJSON);
            // Comprueba si los datos están en el nuevo formato bilingüe
            if (savedData.es && savedData.en) {
                return savedData;
            }
        }
        // Si no hay datos o están en formato antiguo, crea un objeto vacío con la estructura correcta.
        // La página principal (script.js) se encargará de rellenarlo con valores por defecto si es necesario.
        console.warn("No se encontraron datos válidos en localStorage. Se creará una estructura de datos por defecto.");
        return { es: {}, en: {} };
    } catch (error) {
        console.error("Error al leer los datos del portafolio:", error);
        return { es: {}, en: {} };
    }
}

function loadAdminPanel() {
    setupTabs();
    loadEditTab();
    loadMessagesTab();
    loadQuotesTab();
    loadInfoTab();
    loadConfigTab();

    // Configurar el botón de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        });
    });

    // Configurar el formulario de guardado
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', handleFormSubmit);
    }
}

function loadEditTab() {
    const portfolioData = getPortfolioData();
    if (!portfolioData) return;

    // Generar campos simples
    generateSimpleFields(portfolioData, ['page-title', 'header-name', 'fiverr-link', 'github-link', 'linkedin-link'], 'general-fields', { 'page-title': 'area' });
    generateSimpleFields(portfolioData, ['hero-title', 'hero-subtitle'], 'hero-fields');
    generateSimpleFields(portfolioData, ['about-me-text'], 'about-me-fields', { 'about-me-text': 'area' });
    generateSimpleFields(portfolioData, ['services-intro'], 'services-fields', { 'services-intro': 'area' });
    generateSimpleFields(portfolioData, ['contact-intro', 'contact-email', 'contact-phone', 'contact-location', 'footer-text'], 'contact-fields', { 'contact-intro': 'area' });

    // Generar campos de listas
    const listContainer = document.getElementById('list-fields');
    if (!listContainer) return; // Salir si el contenedor no existe
    listContainer.innerHTML = `
        <div class="list-section" data-list-key="experience-list">
            <h3>Experiencia Laboral</h3>
            <div class="list-items-container"></div>
            <button type="button" class="btn-add">Añadir Experiencia</button>
        </div>
        <div class="list-section" data-list-key="education-list">
            <h3>Educación</h3>
            <div class="list-items-container"></div>
            <button type="button" class="btn-add">Añadir Educación</button>
        </div>
        <div class="list-section" data-list-key="languages-list">
            <h3>Idiomas</h3>
            <div class="list-items-container"></div>
            <button type="button" class="btn-add">Añadir Idioma</button>
        </div>
        <div class="list-section" data-list-key="projects-list">
            <h3>Proyectos</h3>
            <div class="list-items-container"></div>
            <button type="button" class="btn-add">Añadir Proyecto</button>
        </div>
    `;

    generateListFields(portfolioData, 'experience-list', { title: 'texto', company: 'texto', description: 'area' });
    generateListFields(portfolioData, 'education-list', { title: 'texto', company: 'texto', description: 'area' });
    generateListFields(portfolioData, 'languages-list', { title: 'texto', company: 'texto' });
    generateListFields(portfolioData, 'projects-list', { title: 'texto', description: 'area', link: 'texto' });

}

function createBilingualField(key, values, isTextarea = false) {
    const label = document.createElement('label');
    label.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const group = document.createElement('div');
    group.className = 'field-group';
    group.appendChild(label);

    const inputsContainer = document.createElement('div');
    inputsContainer.className = 'bilingual-inputs';

    ['es', 'en'].forEach(lang => {
        const inputType = isTextarea ? 'textarea' : 'input';
        const input = document.createElement(inputType);
        input.name = `${key}-${lang}`;
        input.placeholder = lang.toUpperCase();
        input.value = values[lang]?.[key] || '';
        if (!isTextarea) input.type = 'text';
        inputsContainer.appendChild(input);
    });

    group.appendChild(inputsContainer);
    return group;
}

function generateSimpleFields(data, keys, containerId, textareaKeys = {}) {
    const container = document.getElementById(containerId);
    keys.forEach(key => {
        const isTextarea = textareaKeys[key] === 'area';
        // Para campos no traducibles como email, teléfono, etc.
        // Todos los campos editables están dentro de 'es' o 'en', así que pasamos 'data' directamente.
        // createBilingualField ya maneja si el valor existe o no para cada idioma.
        container.appendChild(createBilingualField(key, data, isTextarea));
    });
}

function generateListFields(data, listKey, fieldConfig) {
    const section = document.querySelector(`.list-section[data-list-key="${listKey}"]`);
    if (!section) return; // Si la sección no existe, no continuamos.

    const container = section.querySelector('.list-items-container');
    
    const renderList = () => {
        container.innerHTML = '';
        // Aseguramos que ambas listas existan para evitar errores
        const listES = data.es[listKey] || [];
        const listEN = data.en[listKey] || [];
        const maxLength = Math.max(listES.length, listEN.length);

        for (let index = 0; index < maxLength; index++) {
            const itemDiv = document.createElement('div');

        let fieldsHtml = '<div class="bilingual-inputs-list">';
        ['es', 'en'].forEach(lang => {
            fieldsHtml += `<div class="lang-group"><h4>${lang.toUpperCase()}</h4>`;
            for (const key in fieldConfig) {
                if (key === 'link') continue;

                const isTextarea = fieldConfig[key] === 'area';
                const value = data[lang][listKey]?.[index]?.[key] || '';
                const escapedValue = value.replace(/"/g, '&quot;');

                if (isTextarea) {
                    fieldsHtml += `<div class="field-group-inner"><label>${key.replace(/\b\w/g, l => l.toUpperCase())}</label><textarea data-lang="${lang}" data-key="${key}">${value}</textarea></div>`;
                } else {
                    fieldsHtml += `<div class="field-group-inner"><label>${key.replace(/\b\w/g, l => l.toUpperCase())}</label><input type="text" data-lang="${lang}" data-key="${key}" value="${escapedValue}"></div>`;
                }
            }

            fieldsHtml += `</div>`;
        }
        fieldsHtml += '</div>';

        itemDiv.className = 'list-item';
        itemDiv.dataset.index = index;
        itemDiv.innerHTML = `
            <div class="list-item-header">
                <h4>${listES[index]?.title || listEN[index]?.title || `${listKey.replace('-list', '')} #${index + 1}`}</h4>
                <button type="button" class="btn-remove">Eliminar</button>
            </div>
            ${fieldsHtml}
            ${/* El link del proyecto es único, no bilingüe, lo añadimos fuera del bucle de idiomas */''}
            ${fieldConfig.link ? `
                <div class="field-group-inner single-field"><label>Link</label>
                <input type="text" data-key="link" value="${(data.es[listKey]?.[index]?.link || '').replace(/"/g, '&quot;')}">
                </div>` : ''}
        `;
        container.appendChild(itemDiv);
        }
    }

    section.querySelector('.btn-add').addEventListener('click', () => {
        if (!data.es[listKey]) data.es[listKey] = [];
        if (!data.en[listKey]) data.en[listKey] = [];
        data.es[listKey].push({});
        data.en[listKey].push({});
        renderList();
    });

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const itemDiv = e.target.closest('.list-item');
            const index = parseInt(itemDiv.dataset.index, 10);
            if (data.es[listKey]) data.es[listKey].splice(index, 1);
            if (data.en[listKey]) data.en[listKey].splice(index, 1);
            renderList();
        }
    });

    // Renderizado inicial
    renderList();
}

function handleFormSubmit(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('save-status');
    const form = document.getElementById('admin-form');

    if (form) {
        const saveButton = form.querySelector('.btn-save');
        const newData = { es: {}, en: {} };

        saveButton.disabled = true;
        statusDiv.textContent = 'Guardando...';
        statusDiv.style.color = 'var(--text-color)';

        // Guardar campos simples bilingües
        form.querySelectorAll('.fields-container input[name], .fields-container textarea[name]').forEach(input => {
            if (!input.closest('.list-item')) {
                // Corregir la división del nombre del campo.
                // El nombre es "key-lang", por lo que necesitamos dividir por el último guion.
                const nameParts = input.name.split('-');
                const lang = nameParts.pop(); // 'es' o 'en'
                const key = nameParts.join('-'); // 'page-title', 'header-name', etc.
                
                // Asegurarse de que el objeto de idioma y la clave existan
                if (newData[lang] && key) {
                    newData[lang][key] = input.value;
                }
            }
        });

        // Guardar listas
        form.querySelectorAll('.list-section').forEach(section => {
            const listKey = section.dataset.listKey;
            newData.es[listKey] = [];
            newData.en[listKey] = [];
            section.querySelectorAll('.list-item').forEach(itemDiv => {
                const itemES = {};
                const itemEN = {};
                // Procesar inputs y textareas por separado para asegurar la captura correcta
                itemDiv.querySelectorAll('input[data-key], textarea[data-key]').forEach(input => {
                    const lang = input.dataset.lang;
                    const key = input.dataset.key;
                    if (key) {
                        if (lang === 'es') itemES[key] = input.value;
                        else if (lang === 'en') itemEN[key] = input.value;
                        else if (!lang && key === 'link') { // Campo único como el link
                            itemES.link = itemEN.link = input.value; 
                        }
                    }
                });
                newData.es[listKey].push(itemES);
                newData.en[listKey].push(itemEN);
            });
        });

        localStorage.setItem('portfolioContent', JSON.stringify(newData));

        // Simular un pequeño retardo para que el usuario vea el mensaje "Guardando..."
        setTimeout(() => {
            statusDiv.textContent = '¡Cambios guardados con éxito!';
            statusDiv.style.color = 'var(--accent-color)';
            saveButton.disabled = false;
            setTimeout(() => statusDiv.textContent = '', 5000);
        }, 500);
    }
}

function loadMessagesTab() {
    const container = document.getElementById('messages-container');
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    container.innerHTML = '';

    if (messages.length === 0) {
        container.innerHTML = '<p>No se han recibido mensajes.</p>';
        return;
    }

    messages.reverse().forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-item';
        msgDiv.innerHTML = `
            <h4>De: ${msg.name} (${msg.email})</h4>
            <p><strong>Fecha:</strong> ${new Date(msg.date).toLocaleString()}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${msg.message.replace(/\n/g, '<br>')}</p>
        `;
        container.appendChild(msgDiv);
    });
}

function loadQuotesTab() {
    const container = document.getElementById('quotes-container');
    if (!container) return;

    const quotes = JSON.parse(localStorage.getItem('quoteRequests')) || [];
    container.innerHTML = '';

    if (quotes.length === 0) {
        container.innerHTML = '<p>No se han recibido solicitudes de presupuesto.</p>';
        return;
    }

    quotes.reverse().forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'message-item'; // Reutilizamos el estilo de los mensajes
        quoteDiv.innerHTML = `
            <div class="message-header">
                <h4>De: ${quote.name} (<a href="mailto:${quote.email}">${quote.email}</a>)</h4>
                <span>${new Date(quote.date).toLocaleString()}</span>
            </div>
            <p><strong>Servicio:</strong> ${quote.service}</p>
            <p><strong>Plan:</strong> ${quote.plan} (${quote.price})</p>
            <p><strong>Método de Pago:</strong> ${quote.paymentMethod}</p>
            <p><strong>Notas:</strong></p>
            <p>${quote.message ? quote.message.replace(/\n/g, '<br>') : '<em>Sin notas adicionales.</em>'}</p>
        `;
        container.appendChild(quoteDiv);
    });
}

function loadInfoTab() {
    const container = document.getElementById('info-container');
    const visits = localStorage.getItem('visitCounter') || 0;

    container.innerHTML = `
        <div class="message-item">
            <h3>Visitas Totales</h3>
            <p style="font-size: 2rem; font-weight: bold;">${visits}</p>
        </div>
        <div class="message-item">
            <h3>Seguimiento de Visitantes</h3>
            <p><strong>Nota importante:</strong> Este sitio es una página estática alojada en GitHub Pages. Por limitaciones técnicas y de privacidad, no es posible registrar direcciones IP o datos detallados de los visitantes sin un servidor backend.</p>
            <p>Para un análisis avanzado, se recomienda integrar herramientas externas como Google Analytics.</p>
        </div>
    `;
}

function loadConfigTab() {
    const container = document.getElementById('config-container');
    // Asegurarse de que el contenedor existe antes de continuar
    if (!container) return;

    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    const isMaintenance = settings.maintenanceMode === 'on';

    container.innerHTML = `
        <div class="setting-item">
            <div>
                <p>Modo Mantenimiento</p>
                <small>Pone el sitio fuera de línea y muestra una página de mantenimiento.</small>
            </div>
            <label class="switch">
                <input type="checkbox" id="maintenance-toggle" ${isMaintenance ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
        <div class="setting-item">
            <div>
                <p>Exportar Datos</p>
                <small>Guarda una copia de seguridad de todo el contenido editable en un archivo XML.</small>
            </div>
            <button id="export-btn" class="btn-action">Exportar a XML</button>
        </div>
    `;

    document.getElementById('maintenance-toggle').addEventListener('change', (e) => {
        const newSettings = { ...settings, maintenanceMode: e.target.checked ? 'on' : 'off' };
        localStorage.setItem('siteSettings', JSON.stringify(newSettings));
        alert(`Modo mantenimiento ${e.target.checked ? 'ACTIVADO' : 'DESACTIVADO'}.`);
    });

    document.getElementById('export-btn').addEventListener('click', exportDataToXML);
}

function exportDataToXML() {
    const data = getPortfolioData();
    if (!data) return;

    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<portfolio>\n';

    const toXML = (obj, name) => {
        if (Array.isArray(obj)) {
            return obj.map(item => toXML(item, name.slice(0, -1))).join('');
        }
        if (typeof obj === 'object' && obj !== null) {
            let content = Object.entries(obj).map(([key, val]) => toXML(val, key)).join('');
            return `<${name}>${content}</${name}>\n`;
        }
        return `<${name}>${obj}</${name}>\n`;
    };

    for (const key in data) {
        xmlString += toXML(data[key], key);
    }

    xmlString += '</portfolio>';

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_backup.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}