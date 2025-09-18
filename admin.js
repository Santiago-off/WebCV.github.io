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

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
});

function getPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    if (!savedData) {
        alert("No se encontraron datos del portafolio. Visita la página principal primero.");
        return null;
    }
    return JSON.parse(savedData);
}

function loadAdminPanel() {
    const portfolioData = getPortfolioData();
    if (!portfolioData) return;

    // Generar campos simples
    generateSimpleFields(portfolioData, ['page-title', 'header-name', 'fiverr-link'], 'general-fields');
    generateSimpleFields(portfolioData, ['hero-title', 'hero-subtitle'], 'hero-fields');
    generateSimpleFields(portfolioData, ['about-me-text'], 'about-me-fields', true);
    generateSimpleFields(portfolioData, ['contact-intro', 'contact-email', 'contact-phone', 'contact-location', 'footer-text'], 'contact-fields');

    // Generar campos de listas
    const listContainer = document.getElementById('list-fields');
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

    // Cargar mensajes de contacto
    loadContactMessages();
}

function createField(key, value, isTextarea = false) {
    const type = isTextarea ? 'textarea' : 'input';
    const input = document.createElement(type);
    input.id = `field-${key}`;
    input.name = key;
    input.value = value;
    if (!isTextarea) input.type = 'text';

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const group = document.createElement('div');
    group.className = 'field-group';
    group.appendChild(label);
    group.appendChild(input);
    return group;
}

function generateSimpleFields(data, keys, containerId, isTextarea = false) {
    const container = document.getElementById(containerId);
    keys.forEach(key => {
        container.appendChild(createField(key, data[key] || '', isTextarea));
    });
}

function generateListFields(data, listKey, fieldConfig) {
    const section = document.querySelector(`[data-list-key="${listKey}"]`);
    const container = section.querySelector('.list-items-container');
    container.innerHTML = '';

    const renderItem = (item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';
        itemDiv.dataset.index = index;

        let fieldsHtml = '';
        for (const key in fieldConfig) {
            const isTextarea = fieldConfig[key] === 'area';
            const inputType = isTextarea ? 'textarea' : 'input';
            fieldsHtml += `
                <div class="field-group">
                    <label>${key.replace(/\b\w/g, l => l.toUpperCase())}</label>
                    <${inputType} data-key="${key}" ${!isTextarea ? 'type="text"' : ''}>${item[key] || ''}</${inputType}>
                </div>
            `;
        }

        itemDiv.innerHTML = `
            <div class="list-item-header">
                <h4>${item.title || `${listKey.replace('-list', '')} #${index + 1}`}</h4>
                <button type="button" class="btn-remove">Eliminar</button>
            </div>
            ${fieldsHtml}
        `;
        container.appendChild(itemDiv);
    };

    (data[listKey] || []).forEach(renderItem);

    section.querySelector('.btn-add').addEventListener('click', () => {
        const newItem = {};
        for (const key in fieldConfig) newItem[key] = '';
        data[listKey].push(newItem);
        renderItem(newItem, data[listKey].length - 1);
    });

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const itemDiv = e.target.closest('.list-item');
            const index = parseInt(itemDiv.dataset.index, 10);
            data[listKey].splice(index, 1);
            itemDiv.remove();
            // Re-index remaining items
            Array.from(container.children).forEach((child, i) => {
                child.dataset.index = i;
            });
        }
    });
}

document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const statusDiv = document.getElementById('save-status');
    const saveButton = e.target.querySelector('.btn-save');
    const newData = {};
    const form = e.target;

    saveButton.disabled = true;
    statusDiv.textContent = 'Guardando...';
    statusDiv.style.color = 'var(--text-color)';

    // Guardar campos simples
    form.querySelectorAll('input[type="text"], textarea').forEach(input => {
        if (!input.closest('.list-item')) {
            newData[input.name] = input.value;
        }
    });

    // Guardar listas
    form.querySelectorAll('.list-section').forEach(section => {
        const listKey = section.dataset.listKey;
        newData[listKey] = [];
        section.querySelectorAll('.list-item').forEach(itemDiv => {
            const item = {};
            itemDiv.querySelectorAll('input, textarea').forEach(input => {
                item[input.dataset.key] = input.value;
            });
            newData[listKey].push(item);
        });
    });

    localStorage.setItem('portfolioData', JSON.stringify(newData));

    // Simular un pequeño retardo para que el usuario vea el mensaje "Guardando..."
    setTimeout(() => {
        statusDiv.textContent = '¡Cambios guardados con éxito!';
        statusDiv.style.color = 'var(--accent-color)';
        saveButton.disabled = false;
        setTimeout(() => statusDiv.textContent = '', 5000);
    }, 500);
});

function loadContactMessages() {
    const container = document.getElementById('messages-container');
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    container.innerHTML = '';

    if (messages.length === 0) {
        container.innerHTML = '<p>No hay mensajes nuevos.</p>';
        return;
    }

    messages.reverse().forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'list-item';
        msgDiv.innerHTML = `
            <h4>De: ${msg.name} (${msg.email})</h4>
            <p><strong>Fecha:</strong> ${new Date(msg.date).toLocaleString()}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${msg.message.replace(/\n/g, '<br>')}</p>
        `;
        container.appendChild(msgDiv);
    });
}