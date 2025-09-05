const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");
const error = document.getElementById("error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loginForm.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginForm.style.display = "block";
    adminPanel.style.display = "none";
  }
});
function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showError("Por favor, completa todos los campos.");
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {})
    .catch(err => showError("Error: " + err.message));
}
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("Sesión cerrada");
  }).catch(err => alert("Error: " + err.message));
}
function showError(msg) {
  error.textContent = msg;
  error.style.display = "block";
}