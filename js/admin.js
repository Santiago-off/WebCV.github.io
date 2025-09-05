const db = firebase.firestore();
const auth = firebase.auth();

let PUBLIC_IP = "Desconocida";
let USER_ID = null;
let allMessages = []; // Almacenar todos los mensajes

// Manejo de pestañas
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    document.getElementById(`${tab}-pane`).classList.add("active");

    // Si entra en mensajes, aplica filtro
    if (tab === "messages") {
      filterMessages();
    }
  });
});

function showError(msg) {
  const error = document.getElementById("error");
  error.textContent = "⚠️ " + msg;
  error.style.display = "block";
  console.error(msg);
  setTimeout(() => error.style.display = "none", 5000);
}

async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json", { mode: 'cors' });
    const data = await response.json();
    return data.ip;
  } catch (err) {
    console.warn("No se pudo obtener IP:", err);
    return "IP no disponible";
  }
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) return showError("Completa todos los campos.");

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      USER_ID = userCredential.user.uid;
      PUBLIC_IP = await getPublicIP();
      await db.collection("accessLogs").add({
        userId: USER_ID,
        ip: PUBLIC_IP,
        success: true,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("adminPanel").style.display = "block";
      loadDashboard();
    })
    .catch(async (err) => {
      PUBLIC_IP = await getPublicIP();
      await db.collection("accessLogs").add({
        ip: PUBLIC_IP,
        success: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      let message = err.message;
      if (err.code === "auth/user-not-found") message = "Usuario no encontrado.";
      else if (err.code === "auth/wrong-password") message = "Contraseña incorrecta.";
      else if (err.code === "auth/network-request-failed") message = "Error de red.";
      showError(message);
    });
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }).catch(err => showError("Error: " + err.message));
}

async function loadDashboard() {
  try {
    const visitsSnap = await db.collection("stats").doc("visits").get();
    const data = visitsSnap.exists ? visitsSnap.data() : { count: 0 };
    document.getElementById("visitCount").textContent = data.count || 0;
    document.getElementById("lastVisit").textContent = data.lastVisit?.toDate 
      ? data.lastVisit.toDate().toLocaleString() : "Nunca";
  } catch (err) {
    document.getElementById("visitCount").textContent = "—";
    document.getElementById("lastVisit").textContent = "Error";
  }

  // === CARGAR MENSAJES ===
  try {
    const messagesSnap = await db.collection("messages").orderBy("timestamp", "desc").get();
    allMessages = messagesSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp
    }));

    // Añadir campo de búsqueda
    const messagesPane = document.getElementById("messages-pane");
    if (!document.getElementById("searchMessages")) {
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.id = "searchMessages";
      searchInput.placeholder = "Buscar mensajes por nombre, correo o mensaje...";
      searchInput.addEventListener("input", filterMessages);
      messagesPane.insertBefore(searchInput, messagesPane.firstChild);
    }

    filterMessages(); // Mostrar todos al cargar
  } catch (err) {
    console.error("Error al cargar mensajes:", err);
    document.getElementById("messagesList").innerHTML = "<em>Error al cargar mensajes.</em>";
  }

  // === REGISTROS IP ===
  try {
    const logsSnap = await db.collection("accessLogs").orderBy("timestamp", "desc").limit(100).get();
    const logEl = document.getElementById("ipLog");
    logEl.innerHTML = logsSnap.empty 
      ? "<em>No hay registros.</em>" 
      : logsSnap.docs.map(d => {
          const dt = d.data();
          return `[${dt.timestamp?.toDate().toLocaleString() || '—'}] ${dt.ip || '—'} - ${dt.success ? '✅ Éxito' : '❌ Fallido'}`;
        }).join("<br>");
  } catch (err) {
    document.getElementById("ipLog").innerHTML = "<em>Error al cargar logs.</em>";
  }

  // === INTENTOS DE ACCESO ===
  try {
    const logsSnap = await db.collection("accessLogs").get();
    const failed = logsSnap.docs.filter(d => !d.data().success).length;
    const success = logsSnap.docs.filter(d => d.data().success).length;
    document.getElementById("failedAttempts").textContent = failed;
    document.getElementById("successAttempts").textContent = success;
    document.getElementById("blockedIPs").textContent = failed > 10 ? "1" : "0";
  } catch (err) {
    document.getElementById("failedAttempts").textContent = "—";
    document.getElementById("successAttempts").textContent = "—";
    document.getElementById("blockedIPs").textContent = "—";
  }

  // === MANTENIMIENTO ===
  try {
    const maintSnap = await db.collection("config").doc("maintenance").get();
    const isMaint = maintSnap.exists ? maintSnap.data().active : false;
    const btn = document.getElementById("maintenanceBtn");
    const status = document.getElementById("maintenanceStatus");
    if (isMaint) {
      btn.classList.add("on");
      status.textContent = "🔴 En mantenimiento";
    } else {
      btn.classList.remove("on");
      status.textContent = "🟢 En línea";
    }
  } catch (err) {
    document.getElementById("maintenanceStatus").textContent = "Error";
  }
}

// === FILTRAR MENSAJES ===
function filterMessages() {
  const query = (document.getElementById("searchMessages")?.value || "").toLowerCase().trim();
  const filtered = allMessages.filter(msg =>
    msg.name.toLowerCase().includes(query) ||
    msg.email.toLowerCase().includes(query) ||
    msg.message.toLowerCase().includes(query)
  );

  const msgEl = document.getElementById("messagesList");
  msgEl.innerHTML = filtered.length === 0 
    ? "<em>No se encontraron mensajes.</em>"
    : filtered.map(msg => {
        const isUnread = !msg.read;
        return `
          <div class="message-item ${isUnread ? 'unread' : 'read'}">
            <h4>${msg.name}</h4>
            <small>${msg.email}</small>
            <p>${msg.message}</p>
            <div class="msg-footer">
              <span>${msg.timestamp?.toDate().toLocaleString()}</span>
              <button onclick="toggleRead('${msg.id}', ${isUnread})">
                ${isUnread ? 'Marcar como leído' : 'Marcar como no leído'}
              </button>
            </div>
          </div>`;
      }).join("");
}

// === MARCAR COMO LEÍDO/NO LEÍDO ===
window.toggleRead = async function(id, isNowUnread) {
  if (!id) {
    showError("ID de mensaje no válido");
    return;
  }

  try {
    await db.collection("messages").doc(id).update({
      read: !isNowUnread
    });

    // Actualizar en la lista local
    const msgIndex = allMessages.findIndex(m => m.id === id);
    if (msgIndex !== -1) {
      allMessages[msgIndex].read = !isNowUnread;
    }

    // Refrescar vista
    filterMessages();
    console.log(`Mensaje ${id} marcado como ${!isNowUnread ? 'leído' : 'no leído'}`);
  } catch (err) {
    console.error("Error al actualizar estado del mensaje:", err);
    showError("No se pudo actualizar: " + (err.message || "Error desconocido"));
  }
};

async function toggleMaintenance() {
  const btn = document.getElementById("maintenanceBtn");
  const isMaint = btn.classList.contains("on");
  const newStatus = !isMaint;
  try {
    await db.collection("config").doc("maintenance").set({
      active: newStatus,
      toggledBy: USER_ID,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    if (newStatus) {
      btn.classList.add("on");
      document.getElementById("maintenanceStatus").textContent = "🔴 En mantenimiento";
      showMessage("Sitio puesto en mantenimiento.", "warning");
    } else {
      btn.classList.remove("on");
      document.getElementById("maintenanceStatus").textContent = "🟢 En línea";
      showMessage("Sitio en línea.", "success");
    }
  } catch (err) {
    showError("Error: " + err.message);
  }
}

function showMessage(text, type) {
  const msg = document.getElementById("maintenanceMsg");
  msg.textContent = text;
  msg.style.color = type === "success" ? "#7ed957" : "#f05454";
  setTimeout(() => msg.textContent = "", 3000);
}

async function exportAllData() {
  try {
    const [visits, logs, config, messages] = await Promise.all([
      db.collection("stats").doc("visits").get(),
      db.collection("accessLogs").orderBy("timestamp", "desc").get(),
      db.collection("config").doc("maintenance").get(),
      db.collection("messages").orderBy("timestamp", "desc").get()
    ]);
    const data = {
      exportTime: new Date().toISOString(),
      stats: visits.exists ? { ...visits.data(), lastVisit: visits.data().lastVisit?.toDate().toISOString() } : {},
      accessLogs: logs.docs.map(d => ({ ...d.data(), timestamp: d.data().timestamp?.toDate().toISOString() })),
      maintenance: config.exists ? config.data() : {},
      messages: messages.docs.map(d => ({ ...d.data(), timestamp: d.data().timestamp?.toDate().toISOString() })),
      generatedBy: USER_ID
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  } catch (err) {
    showError("Error al exportar: " + err.message);
  }
}

auth.onAuthStateChanged(user => {
  if (user) {
    USER_ID = user.uid;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadDashboard();
  } else {
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }
});

getPublicIP().then(ip => PUBLIC_IP = ip).catch(() => {});