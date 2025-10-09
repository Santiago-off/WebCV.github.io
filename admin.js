import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Lista de UUIDs autorizados para acceder al panel de administración
const authorizedUIDs = [
    'hldarKhx2wUSXsV5AV9h7XgX8Wi2',
    'Eqya6AUi0ahVGCi5CPhfcR0TWCg1'
];

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Verificar si el usuario está autorizado
        if (authorizedUIDs.includes(user.uid)) {
            main();
        } else {
            // Si no está autorizado, cerrar sesión y redirigir al login
            alert('No tienes autorización para acceder al panel de administración.');
            signOut(auth).then(() => {
                window.location.href = 'login.html';
            });
        }
    } else {
        window.location.href = 'login.html';
    }
});

function main() {
    setupTabs();
    setupLogout();
    loadEditTab();
    loadMessagesTab();
    loadQuotesTab();
    loadInfoTab();
    loadConfigTab();
}

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

function getPortfolioData() {
    try {
        const savedDataJSON = localStorage.getItem('portfolioContent');
        if (savedDataJSON) {
            const savedData = JSON.parse(savedDataJSON);
            if (savedData.es && savedData.en) return savedData;
        }
        return { es: {}, en: {} };
    } catch (error) {
        console.error("Error al leer los datos del portafolio:", error);
        return { es: {}, en: {} };
    }
}

function loadEditTab() {
    const data = getPortfolioData();
    const formContainer = document.getElementById('form-content-container');
    formContainer.innerHTML = '';

    const formStructure = {
        general: {
            legend: 'Configuración General',
            fields: {
                'page-title': { type: 'text' },
                'header-name': { type: 'text' },
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

    form.querySelectorAll('input[name], textarea[name]').forEach(input => {
        const nameParts = input.name.split('-');
        const lang = nameParts.pop();
        const key = nameParts.join('-');
        if (newData[lang] && key) {
            newData[lang][key] = input.value;
        }
    });

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
                else {
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
        const successMessage = '¡Cambios guardados con éxito!';
        // Proporciona un enlace útil si se está ejecutando en un servidor local
        const localDevLink = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
            ? `<br><a href="${window.location.origin}/index.html" target="_blank" style="color: var(--accent-color);">Ver la página principal</a>`
            : '';
        statusDiv.innerHTML = successMessage + localDevLink;
        statusDiv.style.color = 'var(--accent-color)';
        saveButton.disabled = false;
        setTimeout(() => statusDiv.textContent = '', 5000);
    }, 500);
}

async function loadMessagesTab() {
    const container = document.getElementById('messages-container');
    container.innerHTML = '<p>Cargando mensajes...</p>';
    try {
        console.log("Intentando cargar mensajes...");
        
        // Añadir controles para mensajes
        let messagesHTML = `
            <div class="messages-controls">
                <button id="mark-all-read" class="admin-button">Marcar todos como leídos</button>
            </div>
        `;
        
        // Buscar en todas las colecciones posibles donde podrían estar los mensajes
        const colecciones = ["messages", "contactMessages", "contactos", "mensajes", "formularios"];
        let mensajesEncontrados = false;
        let allMessages = [];
        
        for (const nombreColeccion of colecciones) {
            try {
                console.log(`Buscando mensajes en colección: ${nombreColeccion}`);
                const coleccionRef = collection(db, nombreColeccion);
                // Intentar ordenar por timestamp si existe
                let q;
                try {
                    q = query(coleccionRef, orderBy("timestamp", "desc"));
                    const snapshot = await getDocs(q);
                    console.log(`Colección ${nombreColeccion} (ordenada): ${snapshot.size} documentos encontrados`);
                    
                    if (!snapshot.empty) {
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data) {
                                allMessages.push({
                                    ...data,
                                    id: doc.id,
                                    collection: nombreColeccion
                                });
                                mensajesEncontrados = true;
                            }
                        });
                    }
                } catch (orderErr) {
                    console.warn(`No se pudo ordenar la colección ${nombreColeccion}:`, orderErr);
                    // Si no se puede ordenar, obtener sin ordenar
                    const snapshot = await getDocs(coleccionRef);
                    console.log(`Colección ${nombreColeccion} (sin ordenar): ${snapshot.size} documentos encontrados`);
                    
                    if (!snapshot.empty) {
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data) {
                                allMessages.push({
                                    ...data,
                                    id: doc.id,
                                    collection: nombreColeccion
                                });
                                mensajesEncontrados = true;
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn(`Error al buscar en colección ${nombreColeccion}:`, err);
            }
        }
        
        if (!mensajesEncontrados) {
            console.warn("No se encontraron mensajes en ninguna colección");
            container.innerHTML = '<p>No se han recibido mensajes. Verifica la estructura de la base de datos.</p>';
            return;
        }
        
        console.log("Total de mensajes encontrados:", allMessages.length);

        if (allMessages.length === 0) {
            container.innerHTML = '<p>No se han recibido mensajes. Verifica la estructura de la base de datos.</p>';
            console.log("No hay mensajes para mostrar");
        } else {
            // Ordenar mensajes por fecha (más recientes primero)
            allMessages.sort((a, b) => {
                // Extraer timestamps para comparación
                const getTimestamp = (msg) => {
                    if (!msg.timestamp) return 0;
                    
                    if (typeof msg.timestamp.toDate === 'function') {
                        return msg.timestamp.toDate().getTime();
                    } else if (typeof msg.timestamp === 'object' && msg.timestamp.seconds !== undefined) {
                        return msg.timestamp.seconds * 1000;
                    } else if (typeof msg.timestamp === 'string') {
                        if (msg.timestamp.startsWith("Timestamp(")) {
                            const match = msg.timestamp.match(/seconds=(\d+)/);
                            if (match && match[1]) {
                                return parseInt(match[1]) * 1000;
                            }
                        } else {
                            const date = new Date(msg.timestamp);
                            if (!isNaN(date.getTime())) {
                                return date.getTime();
                            }
                        }
                    }
                    return 0;
                };
                
                return getTimestamp(b) - getTimestamp(a); // Orden descendente (más recientes primero)
            });
            
            // Inicializar messagesHTML con los controles para mensajes
            let messagesHTML = '<div class="messages-controls"><button id="mark-all-read" class="admin-button">Marcar todos como leídos</button></div>';
            
            // Procesar cada mensaje individualmente para evitar que un mensaje mal formateado rompa todo el renderizado
            
            // Procesar cada mensaje individualmente para evitar que un mensaje mal formateado rompa todo el renderizado
            for (const msg of allMessages) {
                try {
                    // Manejar diferentes formatos de fecha
                     let dateString = 'Fecha no disponible';
                     let timestamp = 0;
                     
                     if (msg.timestamp) {
                         console.log("Procesando timestamp:", msg.timestamp);
                         if (typeof msg.timestamp.toDate === 'function') {
                             // Firebase Timestamp
                             dateString = msg.timestamp.toDate().toLocaleString('es-ES');
                             timestamp = msg.timestamp.toDate().getTime();
                             console.log("Timestamp convertido con toDate():", dateString);
                         } else if (typeof msg.timestamp === 'object' && msg.timestamp.seconds !== undefined) {
                             // Timestamp en formato objeto {seconds, nanoseconds}
                             try {
                                 const date = new Date(msg.timestamp.seconds * 1000);
                                 dateString = date.toLocaleString('es-ES');
                                 timestamp = date.getTime();
                                 console.log("Timestamp convertido desde seconds:", dateString);
                             } catch (err) {
                                 console.warn("Error al convertir timestamp desde seconds:", err);
                                 // Formatear manualmente el objeto Timestamp para que sea legible
                                 dateString = `${new Date(msg.timestamp.seconds * 1000).toLocaleString('es-ES')}`;
                                 timestamp = msg.timestamp.seconds * 1000;
                             }
                         } else if (typeof msg.timestamp === 'string') {
                             // String de fecha ISO
                             if (msg.timestamp.startsWith("Timestamp(")) {
                                 // Es un string que representa un objeto Timestamp
                                 console.log("Detectado string de Timestamp:", msg.timestamp);
                                 // Extraer seconds del formato "Timestamp(seconds=1759757247, nanoseconds=856000000)"
                                 const match = msg.timestamp.match(/seconds=(\d+)/);
                                 if (match && match[1]) {
                                     const seconds = parseInt(match[1]);
                                     const date = new Date(seconds * 1000);
                                     dateString = date.toLocaleString('es-ES');
                                     timestamp = date.getTime();
                                     console.log("Timestamp extraído de string:", dateString);
                                 } else {
                                     dateString = "Fecha en formato incorrecto";
                                 }
                             } else {
                                 const date = new Date(msg.timestamp);
                                 if (!isNaN(date.getTime())) {
                                     dateString = date.toLocaleString('es-ES');
                                 }
                             }
                         } else if (typeof msg.timestamp === 'number') {
                             // Timestamp numérico
                             const date = new Date(msg.timestamp);
                             if (!isNaN(date.getTime())) {
                                 dateString = date.toLocaleString('es-ES');
                             }
                         }
                     } else if (msg.date) {
                         // Alternativa: campo date
                         console.log("Procesando campo date:", msg.date);
                         
                         if (typeof msg.date === 'string') {
                             if (msg.date.startsWith("Timestamp(")) {
                                 // Es un string que representa un objeto Timestamp
                                 console.log("Detectado string de Timestamp en date:", msg.date);
                                 // Extraer seconds del formato "Timestamp(seconds=1759757247, nanoseconds=856000000)"
                                 const match = msg.date.match(/seconds=(\d+)/);
                                 if (match && match[1]) {
                                     const seconds = parseInt(match[1]);
                                     const date = new Date(seconds * 1000);
                                     dateString = date.toLocaleString('es-ES');
                                     console.log("Timestamp extraído de string en date:", dateString);
                                 } else {
                                     dateString = "Fecha en formato incorrecto";
                                 }
                             } else if (msg.date.includes('de ') && (msg.date.includes('p.m.') || msg.date.includes('a.m.'))) {
                                 // Usar directamente el string formateado en español
                                 dateString = msg.date;
                                 console.log("Usando formato de fecha español directamente:", dateString);
                             } else {
                                 // Intentar parsear como fecha ISO
                                 const date = new Date(msg.date);
                                 if (!isNaN(date.getTime())) {
                                     dateString = date.toLocaleString('es-ES');
                                     console.log("Fecha parseada correctamente:", dateString);
                                 } else {
                                     console.warn("No se pudo parsear la fecha:", msg.date);
                                     dateString = msg.date; // Usar el valor original como fallback
                                 }
                             }
                         }
                     } else if (msg.createdAt) {
                         // Alternativa: campo createdAt
                         if (typeof msg.createdAt.toDate === 'function') {
                             dateString = msg.createdAt.toDate().toLocaleString('es-ES');
                         } else {
                             const date = new Date(msg.createdAt);
                             if (!isNaN(date.getTime())) {
                                 dateString = date.toLocaleString('es-ES');
                             }
                         }
                     }

                    // Extraer información del remitente con múltiples alternativas
                    const userName = msg.userName || msg.name || msg.sender || msg.from || 'Usuario desconocido';
                    const userEmail = msg.userEmail || msg.email || msg.senderEmail || 'Email no disponible';
                    const userUid = msg.userUid || msg.uid || msg.userId || 'No disponible';
                    
                    // Extraer el contenido del mensaje
                    let messageContent = 'Sin contenido';
                    if (msg.message) {
                        messageContent = msg.message.replace(/\n/g, '<br>');
                    } else if (msg.content) {
                        messageContent = msg.content.replace(/\n/g, '<br>');
                    } else if (msg.text) {
                        messageContent = msg.text.replace(/\n/g, '<br>');
                    }

                    // Crear HTML para este mensaje con clase unread por defecto
                    messagesHTML += `
                        <div class="message-item message-card unread">
                            <h4>De: ${userName} (${userEmail})</h4>
                            <p><strong>Fecha:</strong> ${dateString}</p>
                            <p><strong>UID:</strong> ${userUid}</p>
                            <p><strong>Mensaje:</strong></p>
                            <p>${messageContent}</p>
                            <div class="message-actions">
                                <button class="admin-button small toggle-read-btn">Marcar como leído</button>
                            </div>
                        </div>
                    `;
                } catch (msgError) {
                    console.error("Error procesando mensaje individual:", msgError, msg);
                    messagesHTML += `
                        <div class="message-item error">
                            <h4>Error al procesar mensaje</h4>
                            <p>ID: ${msg.id || 'No disponible'}</p>
                            <p>Error: ${msgError.message}</p>
                        </div>
                    `;
                }
            }
            
            container.innerHTML = messagesHTML;
            console.log("Mensajes renderizados en el contenedor");
            
            // Añadir event listeners para los botones de leído/no leído
            document.querySelectorAll('.toggle-read-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const messageCard = this.closest('.message-card');
                    const isCurrentlyRead = messageCard.classList.contains('read');
                    
                    // Cambiar la clase y el texto del botón
                    if (isCurrentlyRead) {
                        messageCard.classList.remove('read');
                        messageCard.classList.add('unread');
                        this.textContent = 'Marcar como leído';
                    } else {
                        messageCard.classList.remove('unread');
                        messageCard.classList.add('read');
                        this.textContent = 'Marcar como no leído';
                    }
                });
            });
            
            // Añadir event listener para el botón de marcar todos como leídos
            const markAllReadBtn = document.getElementById('mark-all-read');
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', function() {
                    document.querySelectorAll('.message-card.unread').forEach(card => {
                        card.classList.remove('unread');
                        card.classList.add('read');
                        const btn = card.querySelector('.toggle-read-btn');
                        if (btn) btn.textContent = 'Marcar como no leído';
                    });
                });
            }
        }
    } catch (error) {
        console.error("Error cargando mensajes: ", error);
        container.innerHTML = `
            <p>Error al cargar los mensajes: ${error.message}</p>
            <p>Detalles: ${error.stack || 'No disponible'}</p>
            <p>Intenta revisar la consola para más información.</p>
        `;
    }
}

async function loadQuotesTab() {
    const container = document.getElementById('quotes-container');
    container.innerHTML = '<p>Cargando presupuestos...</p>';
    try {
        // Añadir controles para presupuestos
        let quotesHTML = `
            <div class="messages-controls">
                <button id="mark-all-quotes-read" class="admin-button">Marcar todos como leídos</button>
            </div>
        `;
        console.log("Intentando cargar presupuestos...");
        
        // Buscar en todas las colecciones posibles donde podrían estar los presupuestos
        const colecciones = ["quotes", "presupuestos", "cotizaciones", "solicitudes"];
        let presupuestosEncontrados = false;
        let querySnapshot;
        
        for (const nombreColeccion of colecciones) {
            try {
                console.log(`Buscando presupuestos en colección: ${nombreColeccion}`);
                const coleccionRef = collection(db, nombreColeccion);
                const snapshot = await getDocs(coleccionRef);
                
                console.log(`Colección ${nombreColeccion}: ${snapshot.size} documentos encontrados`);
                
                if (!snapshot.empty) {
                    querySnapshot = snapshot;
                    presupuestosEncontrados = true;
                    console.log(`Presupuestos encontrados en colección: ${nombreColeccion}`);
                    // No salimos del bucle para combinar presupuestos de todas las colecciones
                }
            } catch (err) {
                console.warn(`Error al buscar en colección ${nombreColeccion}:`, err);
            }
        }
        
        if (!presupuestosEncontrados) {
            console.warn("No se encontraron presupuestos en ninguna colección");
            querySnapshot = await getDocs(collection(db, "quotes")); // Colección por defecto
        }
        
        const quotes = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Documento encontrado:", doc.id, data);
            
            // Verificar que el documento tenga datos válidos
            if (data) {
                quotes.push({
                    ...data,
                    id: doc.id
                });
            } else {
                console.warn("Documento sin datos:", doc.id);
            }
        });
        
        console.log("Total de presupuestos encontrados:", quotes.length);

        if (quotes.length === 0) {
            container.innerHTML = '<p>No se han recibido solicitudes de presupuesto.</p>';
            console.log("No hay presupuestos para mostrar");
        } else {
            let quotesHTML = '';
            
            // Procesar cada presupuesto individualmente para evitar que uno mal formateado rompa todo el renderizado
            for (const quote of quotes) {
                try {
                    // Manejar diferentes formatos de fecha
                    let dateString = 'Fecha no disponible';
                    if (quote.timestamp) {
                        console.log("Procesando timestamp:", quote.timestamp);
                        if (typeof quote.timestamp.toDate === 'function') {
                            // Firebase Timestamp
                            dateString = quote.timestamp.toDate().toLocaleString('es-ES');
                            console.log("Timestamp convertido con toDate():", dateString);
                        } else if (typeof quote.timestamp === 'object' && quote.timestamp.seconds !== undefined) {
                            // Timestamp en formato objeto {seconds, nanoseconds}
                            try {
                                const date = new Date(quote.timestamp.seconds * 1000);
                                dateString = date.toLocaleString('es-ES');
                                console.log("Timestamp convertido desde seconds:", dateString);
                            } catch (err) {
                                console.warn("Error al convertir timestamp desde seconds:", err);
                                // Formatear manualmente el objeto Timestamp para que sea legible
                                dateString = `${new Date(quote.timestamp.seconds * 1000).toLocaleString('es-ES')}`;
                            }
                        } else if (typeof quote.timestamp === 'string') {
                            // String de fecha ISO
                            if (quote.timestamp.startsWith("Timestamp(")) {
                                // Es un string que representa un objeto Timestamp
                                console.log("Detectado string de Timestamp:", quote.timestamp);
                                // Extraer seconds del formato "Timestamp(seconds=1759757247, nanoseconds=856000000)"
                                const match = quote.timestamp.match(/seconds=(\d+)/);
                                if (match && match[1]) {
                                    const seconds = parseInt(match[1]);
                                    const date = new Date(seconds * 1000);
                                    dateString = date.toLocaleString('es-ES');
                                    console.log("Timestamp extraído de string:", dateString);
                                } else {
                                    dateString = "Fecha en formato incorrecto";
                                }
                            } else {
                                const date = new Date(quote.timestamp);
                                if (!isNaN(date.getTime())) {
                                    dateString = date.toLocaleString('es-ES');
                                }
                            }
                        } else if (typeof quote.timestamp === 'number') {
                            // Timestamp numérico
                            const date = new Date(quote.timestamp);
                            if (!isNaN(date.getTime())) {
                                dateString = date.toLocaleString('es-ES');
                            }
                        }
                    } else if (quote.date) {
                        // Alternativa: campo date
                        console.log("Procesando campo date:", quote.date);
                        
                        if (typeof quote.date === 'string') {
                            if (quote.date.startsWith("Timestamp(")) {
                                // Es un string que representa un objeto Timestamp
                                console.log("Detectado string de Timestamp en date:", quote.date);
                                // Extraer seconds del formato "Timestamp(seconds=1759757247, nanoseconds=856000000)"
                                const match = quote.date.match(/seconds=(\d+)/);
                                if (match && match[1]) {
                                    const seconds = parseInt(match[1]);
                                    const date = new Date(seconds * 1000);
                                    dateString = date.toLocaleString('es-ES');
                                    console.log("Timestamp extraído de string en date:", dateString);
                                } else {
                                    dateString = "Fecha en formato incorrecto";
                                }
                            } else if (quote.date.includes('de ') && (quote.date.includes('p.m.') || quote.date.includes('a.m.'))) {
                                // Usar directamente el string formateado en español
                                dateString = quote.date;
                                console.log("Usando formato de fecha español directamente:", dateString);
                            } else {
                                // Intentar parsear como fecha ISO
                                const date = new Date(quote.date);
                                if (!isNaN(date.getTime())) {
                                    dateString = date.toLocaleString('es-ES');
                                    console.log("Fecha parseada correctamente:", dateString);
                                } else {
                                    console.warn("No se pudo parsear la fecha:", quote.date);
                                    dateString = quote.date; // Usar el valor original como fallback
                                }
                            }
                        }
                    } else if (quote.createdAt) {
                        // Alternativa: campo createdAt
                        if (typeof quote.createdAt.toDate === 'function') {
                            dateString = quote.createdAt.toDate().toLocaleString('es-ES');
                        } else {
                            const date = new Date(quote.createdAt);
                            if (!isNaN(date.getTime())) {
                                dateString = date.toLocaleString('es-ES');
                            }
                        }
                    }

                    // Extraer información del remitente con múltiples alternativas
                    const userName = quote.name || quote.userName || quote.sender || quote.from || 'Usuario desconocido';
                    const userEmail = quote.email || quote.userEmail || quote.senderEmail || 'Email no disponible';
                    const userPhone = quote.phone || quote.telefono || quote.tel || quote.phoneNumber || 'No proporcionado';
                    const serviceType = quote.service || quote.servicio || quote.tipo || quote.serviceType || 'No especificado';
                    
                    // Extraer el contenido del mensaje
                    let messageContent = 'Sin contenido';
                    if (quote.message) {
                        messageContent = quote.message.replace(/\n/g, '<br>');
                    } else if (quote.content) {
                        messageContent = quote.content.replace(/\n/g, '<br>');
                    } else if (quote.text) {
                        messageContent = quote.text.replace(/\n/g, '<br>');
                    } else if (quote.descripcion) {
                        messageContent = quote.descripcion.replace(/\n/g, '<br>');
                    }

                    // Crear HTML para este presupuesto con clase unread por defecto
                    quotesHTML += `
                        <div class="quote-item message-card unread">
                            <h4>De: ${userName} (${userEmail})</h4>
                            <p><strong>Fecha:</strong> ${dateString}</p>
                            <p><strong>Teléfono:</strong> ${userPhone}</p>
                            <p><strong>Servicio:</strong> ${serviceType}</p>
                            <p><strong>Mensaje:</strong></p>
                            <p>${messageContent}</p>
                            <div class="message-actions">
                                <button class="admin-button small toggle-read-btn">Marcar como leído</button>
                            </div>
                        </div>
                    `;
                } catch (quoteError) {
                    console.error("Error procesando presupuesto individual:", quoteError, quote);
                    quotesHTML += `
                        <div class="quote-item error">
                            <h4>Error al procesar presupuesto</h4>
                            <p>ID: ${quote.id || 'No disponible'}</p>
                            <p>Error: ${quoteError.message}</p>
                        </div>
                    `;
                }
            }
            
            container.innerHTML = quotesHTML;
            console.log("Presupuestos renderizados en el contenedor");
            
            // Añadir event listeners para los botones de leído/no leído
            document.querySelectorAll('.quote-item .toggle-read-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const quoteCard = this.closest('.message-card');
                    const isCurrentlyRead = quoteCard.classList.contains('read');
                    
                    // Cambiar la clase y el texto del botón
                    if (isCurrentlyRead) {
                        quoteCard.classList.remove('read');
                        quoteCard.classList.add('unread');
                        this.textContent = 'Marcar como leído';
                    } else {
                        quoteCard.classList.remove('unread');
                        quoteCard.classList.add('read');
                        this.textContent = 'Marcar como no leído';
                    }
                });
            });
            
            // Añadir event listener para el botón de marcar todos como leídos
            const markAllReadBtn = document.getElementById('mark-all-quotes-read');
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', function() {
                    document.querySelectorAll('.quote-item.unread').forEach(card => {
                        card.classList.remove('unread');
                        card.classList.add('read');
                        const btn = card.querySelector('.toggle-read-btn');
                        if (btn) btn.textContent = 'Marcar como no leído';
                    });
                });
            }
        }
    } catch (error) {
        console.error("Error cargando presupuestos: ", error);
        container.innerHTML = `<p>Error al cargar los presupuestos: ${error.message}</p>`;
    }
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
        <div class="setting-item danger-zone">
            <div>
                <p>Restablecer Contenido</p>
                <small>Elimina los datos guardados en el navegador y carga los valores por defecto del código. Útil si la web no refleja los últimos cambios. <strong>Esta acción no se puede deshacer.</strong></small>
            </div>
            <button id="reset-content-btn" class="btn-danger">Restablecer Contenido</button>
        </div>
    `;

    document.getElementById('maintenance-toggle').addEventListener('change', (e) => {
        const newSettings = { ...settings, maintenanceMode: e.target.checked ? 'on' : 'off' };
        localStorage.setItem('siteSettings', JSON.stringify(newSettings));
        alert(`Modo mantenimiento ${e.target.checked ? 'ACTIVADO' : 'DESACTIVADO'}.`);
    });

    document.getElementById('export-btn').addEventListener('click', exportDataToXML);

    document.getElementById('reset-content-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres restablecer todo el contenido a los valores por defecto? Se perderán todos los cambios que hayas guardado desde el panel.')) {
            localStorage.removeItem('portfolioContent');
            alert('Contenido restablecido. Recarga la página principal (Ctrl+F5) para ver los cambios.');
            location.reload();
        }
    });
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