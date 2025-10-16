// Este archivo carga la configuración de Firebase desde variables de entorno
// o utiliza valores de ejemplo para desarrollo local.
// Las credenciales reales deben estar en el archivo .env que NO se sube a GitHub.

// Función para cargar variables de entorno o usar valores por defecto
function getEnvVariable(name, defaultValue = '') {
  // Intenta obtener la variable del objeto window.env (que se cargará desde .env)
  if (window.env && window.env[name]) {
    return window.env[name];
  }
  // Si no está disponible, usa el valor por defecto
  return defaultValue;
}

export const firebaseConfig = {
  apiKey: getEnvVariable('FIREBASE_API_KEY'),
  authDomain: getEnvVariable('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVariable('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVariable('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVariable('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVariable('FIREBASE_APP_ID'),
  measurementId: getEnvVariable('FIREBASE_MEASUREMENT_ID')
};