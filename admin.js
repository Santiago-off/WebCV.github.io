import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// --- INICIALIZACIÓN DE FIREBASE Y AUTENTICACIÓN ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirige al login si el usuario no está autenticado.
onAuthStateChanged(auth, (user) => {
    if (user) {
        main(); // Inicia la lógica del panel si el usuario está logueado
    } else {
        window.location.href = 'login.html';
    }
});

// --- FUNCIÓN PRINCIPAL ---
function main() {
    setupTabs();
    setupLogout();
    loadEditTab();
    loadMessagesTab();
    loadQuotesTab();
    loadInfoTab();
    loadConfigTab();
}

// --- LÓGICA DE PESTAÑAS ---
function setupTabs() {
    const tabsContainer = document.querySelector('.admin-tabs');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabsContainer.addEventListener('click', (e) => {
        const clickedTab = e.target.closest('.admin-tab-link');
        if (!clickedTab) return;

        tabsContainer.querySelector('.active').classList.remove('active');
        clickedTab.classList.add('active');

        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === clickedTab.dataset.tab);
        });
    });
}

// --- LÓGICA DE DATOS (LocalStorage) ---
function getPortfolioData() {
    try {
        const savedDataJSON = localStorage.getItem('portfolioContent');
        if (savedDataJSON) {
            const savedData = JSON.parse(savedDataJSON);
            if (savedData.es && savedData.en) return savedData;
        }
        // Si no hay datos o el formato es incorrecto, devuelve una estructura vacía.
        // script.js se encargará de crear los datos por defecto si es necesario.
        return { es: {}, en: {} };
    } catch (error) {
        console.error("Error al leer los datos del portafolio:", error);
        return { es: {}, en: {} };
    }
}

// --- PESTAÑA DE EDICIÓN ---

function loadEditTab() {
    const data = getPortfolioData();
    const formContainer = document.getElementById('form-content-container');
    formContainer.innerHTML = ''; // Limpiar contenedor

    // Definir la estructura del formulario
    const formStructure = {
        general: {
            legend: 'Configuración General',
            fields: {
                'page-title': { type: 'text' },
                'header-name': { type: 'text' },
                'fiverr-link': { type: 'text' },
                'github-link': { type: 'text' },
                'linkedin-link': { type: 'text' }
            }
        },
        hero: {
            legend: 'Sección "Hero"',
            fields: {
                'hero-title': { type: 'text' },
                'hero-subtitle': { type: 'textarea' }
            }
        },
        about: {
            legend: 'Sección "Sobre Mí"',
            fields: { 'about-me-text': { type: 'textarea' } }
        },
        services: {
            legend: 'Sección "Servicios"',
            fields: { 'services-intro': { type: 'textarea' } }
        },
        contact: {
            legend: 'Sección "Contacto"',
            fields: {
                'contact-intro': { type: 'textarea' },
                'contact-email': { type: 'text' },
                'contact-phone': { type: 'text' },
                'contact-location': { type: 'text' },
                'footer-text': { type: 'text' }
            }
        },
        lists: {
            legend: 'Listas Editables',
            lists: {
                'experience-list': {
                    title: 'Experiencia Laboral',
                    fields: { title: { type: 'text' }, company: { type: 'text' }, description: { type: 'textarea' } }
                },
                'education-list': {
                    title: 'Educación',
                    fields: { title: { type: 'text' }, company: { type: 'text' }, description: { type: 'textarea' } }
                },
                'languages-list': {
                    title: 'Idiomas',
                    fields: { title: { type: 'text' }, company: { type: 'text' } }
                },
                'projects-list': {
                    title: 'Proyectos',
                    fields: { title: { type: 'text' }, description: { type: 'textarea' }, link: { type: 'text', isUnique: true } }
                }
            }
        }
    };

    // Generar el HTML del formulario a partir de la estructura
    for (const sectionKey in formStructure) {
        const section = formStructure[sectionKey];
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = section.legend;
        fieldset.appendChild(legend);

        if (section.fields) {
            for (const key in section.fields) {
                const fieldConfig = section.fields[key];
                const values = { es: data.es?.[key] || '', en: data.en?.[key] || '' };
                const fieldElement = createBilingualField(key, fieldConfig.type === 'textarea', values);
                fieldset.appendChild(fieldElement);
            }
        }

        if (section.lists) {
            for (const key in section.lists) {
                const listConfig = section.lists[key];
                const listElement = createListSection(key, listConfig.title, listConfig.fields, data);
                fieldset.appendChild(listElement);
            }
        }
        formContainer.appendChild(fieldset);
    }

    // Añadir el event listener al formulario para guardar
    document.getElementById('admin-form').addEventListener('submit', handleFormSubmit);
}

function createBilingualField(key, isTextarea, values) {
    const group = document.createElement('div');
    group.className = 'field-group';
    
    const label = document.createElement('label');
    label.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    group.appendChild(label);

    const inputsContainer = document.createElement('div');
    inputsContainer.className = 'bilingual-inputs';

    ['es', 'en'].forEach(lang => {
        const input = isTextarea ? document.createElement('textarea') : document.createElement('input');
        if (!isTextarea) input.type = 'text';
        input.name = `${key}-${lang}`;
        input.placeholder = lang.toUpperCase();
        input.value = values[lang] || '';
        inputsContainer.appendChild(input);
    });

    group.appendChild(inputsContainer);
    return group;
}

function createListSection(listKey, title, fieldConfig, data) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'list-section';
    sectionDiv.dataset.listKey = listKey;
    sectionDiv.innerHTML = `
        <h3>${title}</h3>
        <div class="list-items-container"></div>
        <button type="button" class="btn-add">Añadir Elemento</button>
    `;

    const container = sectionDiv.querySelector('.list-items-container');

    const renderList = () => {
        container.innerHTML = '';
        const listES = data.es?.[listKey] || [];
        const listEN = data.en?.[listKey] || [];
        const maxLength = Math.max(listES.length, listEN.length);

        for (let index = 0; index < maxLength; index++) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.dataset.index = index;

            let fieldsHtml = '<div class="bilingual-inputs-list">';
            let uniqueFieldHtml = '';

            // Renderizar campos bilingües
            ['es', 'en'].forEach(lang => {
                fieldsHtml += `<div class="lang-group"><h4>${lang.toUpperCase()}</h4>`;
                for (const key in fieldConfig) {
                    if (fieldConfig[key].isUnique) continue;
                    const value = data[lang]?.[listKey]?.[index]?.[key] || '';
                    const labelText = key.replace(/\b\w/g, l => l.toUpperCase());
                    if (fieldConfig[key].type === 'textarea') {
                        fieldsHtml += `<div class="field-group-inner"><label>${labelText}</label><textarea data-lang="${lang}" data-key="${key}">${value}</textarea></div>`;
                    } else {
                        fieldsHtml += `<div class="field-group-inner"><label>${labelText}</label><input type="text" data-lang="${lang}" data-key="${key}" value="${value.replace(/"/g, '&quot;')}"></div>`;
                    }
                }
                fieldsHtml += `</div>`;
            });
            fieldsHtml += '</div>';

            // Renderizar campos únicos (como 'link')
            for (const key in fieldConfig) {
                if (fieldConfig[key].isUnique) {
                    const value = listES[index]?.[key] || listEN[index]?.[key] || '';
                    const labelText = key.replace(/\b\w/g, l => l.toUpperCase());
                    uniqueFieldHtml += `<div class="field-group-inner single-field"><label>${labelText}</label><input type="text" data-key="${key}" value="${value.replace(/"/g, '&quot;')}"></div>`;
                }
            }

            itemDiv.innerHTML = `
                <div class="list-item-header">
                    <h4>${listES[index]?.title || listEN[index]?.title || `Elemento #${index + 1}`}</h4>
                    <button type="button" class="btn-remove">Eliminar</button>
                </div>
                ${fieldsHtml}
                ${uniqueFieldHtml}
            `;
            container.appendChild(itemDiv);
        }
    };

    sectionDiv.querySelector('.btn-add').addEventListener('click', () => {
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
            data.es[listKey]?.splice(index, 1);
            data.en[listKey]?.splice(index, 1);
            renderList();
        }
    });

    renderList();
    return sectionDiv;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const statusDiv = document.getElementById('save-status');
    const saveButton = form.querySelector('.btn-save');
    const newData = { es: {}, en: {} };

    saveButton.disabled = true;
    statusDiv.textContent = 'Guardando...';
    statusDiv.style.color = 'var(--text-color)';

    // Guardar campos simples
    form.querySelectorAll('input[name], textarea[name]').forEach(input => {
        const nameParts = input.name.split('-');
        const lang = nameParts.pop();
        const key = nameParts.join('-');
        if (newData[lang] && key) {
            newData[lang][key] = input.value;
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
            itemDiv.querySelectorAll('[data-key]').forEach(input => {
                const key = input.dataset.key;
                const lang = input.dataset.lang;
                if (lang === 'es') itemES[key] = input.value;
                else if (lang === 'en') itemEN[key] = input.value;
                else { // Campo único
                    itemES[key] = input.value;
                    itemEN[key] = input.value;
                }
            });
            newData.es[listKey].push(itemES);
            newData.en[listKey].push(itemEN);
        });
    });

    localStorage.setItem('portfolioContent', JSON.stringify(newData));

    setTimeout(() => {
        statusDiv.textContent = '¡Cambios guardados con éxito!';
        statusDiv.style.color = 'var(--accent-color)';
        saveButton.disabled = false;
        setTimeout(() => statusDiv.textContent = '', 5000);
    }, 500);
}


// --- OTRAS PESTAÑAS (Mensajes, Presupuestos, etc.) ---

function loadMessagesTab() {
    const container = document.getElementById('messages-container');
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    container.innerHTML = (messages.length === 0)
        ? '<p>No se han recibido mensajes.</p>'
        : messages.reverse().map(msg => `
            <div class="message-item">
                <h4>De: ${msg.name} (${msg.email})</h4>
                <p><strong>Fecha:</strong> ${new Date(msg.date).toLocaleString()}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${msg.message.replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
}

function loadQuotesTab() {
    const container = document.getElementById('quotes-container');
    const quotes = JSON.parse(localStorage.getItem('quoteRequests')) || [];
    container.innerHTML = (quotes.length === 0)
        ? '<p>No se han recibido solicitudes de presupuesto.</p>'
        : quotes.reverse().map(quote => `
            <div class="message-item">
                <h4>De: ${quote.name} (<a href="mailto:${quote.email}">${quote.email}</a>)</h4>
                <span>${new Date(quote.date).toLocaleString()}</span>
                <p><strong>Servicio:</strong> ${quote.service}</p>
                <p><strong>Plan:</strong> ${quote.plan} (${quote.price})</p>
                <p><strong>Método de Pago:</strong> ${quote.paymentMethod}</p>
                <p><strong>Notas:</strong> ${quote.message ? quote.message.replace(/\n/g, '<br>') : '<em>Sin notas.</em>'}</p>
            </div>
        `).join('');
}

function loadInfoTab() {
    const container = document.getElementById('info-container');
    const visits = localStorage.getItem('visitCounter') || 0;
    container.innerHTML = `
        <div class="message-item">
            <h3>Visitas Totales</h3>
            <p style="font-size: 2rem; font-weight: bold;">${visits}</p>
        </div>
    `;
}

function loadConfigTab() {
    const container = document.getElementById('config-container');
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
                <small>Guarda una copia de seguridad del contenido en un archivo XML.</small>
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
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<portfolio>\n';
    const toXML = (obj, name) => {
        if (Array.isArray(obj)) {
            return obj.map(item => toXML(item, name.slice(0, -1))).join('');
        }
        if (typeof obj === 'object' && obj !== null) {
            let content = Object.entries(obj).map(([key, val]) => toXML(val, key)).join('');
            return `<${name}>${content}</${name}>\n`;
        }
        return `<${name}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</${name}>\n`;
    };
    xmlString += toXML(data, 'content');
    xmlString += '</portfolio>';

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.xml`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth).catch(error => console.error('Error al cerrar sesión:', error));
    });
}