document.addEventListener("DOMContentLoaded", () => {
  // === IDIOMA ===
  const esBtn = document.getElementById("es-btn");
  const enBtn = document.getElementById("en-btn");

  // Verificar que los botones existan
  if (!esBtn || !enBtn) {
    console.warn("⚠️ Botones de idioma no encontrados. Saltando funcionalidad de traducción.");
  } else {
    // Cargar idioma guardado
    const savedLang = localStorage.getItem("lang") || "es";
    if (savedLang === "en") {
      enBtn.classList.add("active");
      esBtn.classList.remove("active");
    }

    function setLanguage(lang) {
      // Cambiar textos
      document.querySelectorAll(".i18n").forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
      });

      // Cambiar placeholders
      document.querySelectorAll("input, textarea").forEach(el => {
        const placeholder = el.getAttribute(`data-${lang}`);
        if (placeholder) el.placeholder = placeholder;
      });

      // Cambiar menú
      document.querySelectorAll("nav a").forEach(a => {
        const text = a.getAttribute(`data-${lang}`);
        if (text) a.textContent = text;
      });

      // Cambiar título
      document.querySelector("title").textContent = 
        lang === "es" 
          ? "Santiago Reguero Fernández | Portafolio de Programación, Cloud y Drones"
          : "Santiago Reguero Fernández | Programming, Cloud & Drones Portfolio";

      // Cambiar texto animado
      const typingText = document.querySelector(".typing-text");
      if (typingText) {
        typingText.textContent = "";
        const text = lang === "es" 
          ? "Estudiante de Informática | Programador | Cloud & Drones" 
          : "Computer Science Student | Developer | Cloud & Drones";
        let i = 0;
        const type = () => {
          if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
          }
        };
        type();
      }

      localStorage.setItem("lang", lang);
    }

    esBtn.addEventListener("click", () => {
      setLanguage("es");
      esBtn.classList.add("active");
      enBtn.classList.remove("active");
    });

    enBtn.addEventListener("click", () => {
      setLanguage("en");
      enBtn.classList.add("active");
      esBtn.classList.remove("active");
    });

    // Aplicar idioma al cargar
    setLanguage(savedLang);
  }

  // === CURSOR PERSONALIZADO ===
  const cursor = document.querySelector(".cursor-follower");
  if (cursor) {
    document.body.style.cursor = "none";
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    const interactive = document.querySelectorAll("a, button, input, textarea, .project-card");
    interactive.forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "40px";
        cursor.style.height = "40px";
        cursor.style.background = "rgba(0, 245, 212, 0.3)";
        cursor.style.boxShadow = "0 0 30px 8px rgba(0, 245, 212, 0.6)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "24px";
        cursor.style.height = "24px";
        cursor.style.background = "rgba(0, 245, 212, 0.2)";
        cursor.style.boxShadow = "0 0 20px 5px rgba(0, 245, 212, 0.4)";
      });
    });
  }

  // === TEXTO ANIMADO (ya se maneja en setLanguage) ===

  // === WEBGL BACKGROUND ===
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById("webgl-background").appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 128, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00f5d4, 
      wireframe: true, 
      opacity: 0.3, 
      transparent: true,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.3
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const light = new THREE.DirectionalLight(0x00f5d4, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.005;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  } catch (err) {
    console.warn("⚠️ WebGL no disponible o Three.js no cargado:", err);
  }

  // === PROYECTOS 3D ===
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
    card.addEventListener("click", () => {
      const url = card.getAttribute("data-github");
      if (url) window.open(url, "_blank");
    });
  });

  // === CAMBIO DE COLOR POR SECCIÓN ===
  const colorBar = document.querySelector(".color-bar");
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const color = entry.target.querySelector("h2")?.dataset?.color || "#00f5d4";
        if (colorBar) {
          colorBar.style.background = color;
          colorBar.classList.add("active");
          setTimeout(() => colorBar.classList.remove("active"), 800);
        }

        navLinks.forEach(a => a.classList.remove("active"));
        navLinks.forEach(a => {
          if (a.getAttribute("href").includes(entry.target.id)) a.classList.add("active");
        });
      }
    });
  }, { threshold: 0.2 });
  sections.forEach(s => observer.observe(s));

  // === MOSTRAR SECCIONES ===
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.1 });
  sections.forEach(s => secObserver.observe(s));

  // === FORMULARIO ===
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      try {
        await firebase.firestore().collection("messages").add({
          name,
          email,
          message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          read: false
        });
        alert("✅ Mensaje enviado correctamente.");
        contactForm.reset();
      } catch (err) {
        alert("❌ Error al enviar el mensaje: " + err.message);
      }
    });
  }

  // === CONTADOR DE VISITAS EN FIRESTORE ===
  async function registerVisit() {
    if (typeof firebase === 'undefined') return;
    const db = firebase.firestore();
    const statsRef = db.collection("stats").doc("visits");
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json", { mode: 'cors' });
      const { ip } = await ipRes.json();
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(statsRef);
        if (!doc.exists) {
          transaction.set(statsRef, {
            count: 1,
            lastVisit: new Date(),
            ips: [ip]
          });
        } else {
          const data = doc.data();
          const newCount = (data.count || 0) + 1;
          const ips = Array.isArray(data.ips) ? [...data.ips, ip].slice(-50) : [ip];
          transaction.update(statsRef, {
            count: newCount,
            lastVisit: new Date(),
            ips
          });
        }
      });
    } catch (err) {
      console.warn("No se pudo registrar visita", err);
    }
  }
  registerVisit();

  // === PROTECCIÓN BÁSICA ===
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();
  });
});