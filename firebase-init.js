const firebaseConfig = {
    apiKey: "AIzaSyBNevMuDbCNj0nD_mjsJCJviyoiL2kYJPU",
    authDomain: "controle-de-gastos-6c883.firebaseapp.com",
    projectId: "controle-de-gastos-6c883",
    storageBucket: "controle-de-gastos-6c883.firebasestorage.app",
    messagingSenderId: "682262878637",
    appId: "1:682262878637:web:521d61c1f9914bd04ba924"
};

// Inicializa o Firebase SOMENTE se ainda não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} 

// Acesso aos serviços do Firebase ( IMPORTANTE! )
const auth = firebase.auth();
const firestore = firebase.firestore();

// torna acessível globalmente
window.auth = auth;
window.firestore = firestore;