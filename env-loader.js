// Este archivo carga las variables de entorno desde .env y las hace disponibles en window.env
// Debe ser incluido antes que cualquier otro script que use las variables de entorno

(function() {
  window.env = {
    FIREBASE_API_KEY: 'AIzaSyD_zLhYz4fJaqA93EEcAy5rTj03x3rpOYg',
    FIREBASE_AUTH_DOMAIN: 'aplicacion-85493.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'aplicacion-85493',
    FIREBASE_STORAGE_BUCKET: 'aplicacion-85493.firebasestorage.app',
    FIREBASE_MESSAGING_SENDER_ID: '978332522962',
    FIREBASE_APP_ID: '1:978332522962:web:c2fd2710dad09b77d6900b',
    FIREBASE_MEASUREMENT_ID: 'G-64WYRVRDKS'
  };
})();