// Função para redirecionar para o login
function redirectToLogin() {
    window.location.href = "../../index.html"
}

// Mostra um loading simples no console (ou pode trocar por spinner real)
function showLoading() {
    console.log("Carregando...");
}

// Esconde o loading
function hideLoading() {
    console.log("Carregamento finalizado.");
}

// Validação do campo de e-mail
function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";

    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
    
    toggleRegisterButtonsDisable(); 
}

// Validação do campo de senha
function onChangePassword() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
    
    form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block";
    
    validatePasswordsMatch();
    toggleRegisterButtonsDisable(); 
}

// Validação do campo confirmar senha
function onChangeConfirmPassword() {
    validatePasswordsMatch();
    toggleRegisterButtonsDisable(); 
}

// Função principal de registro
function register() {
    showLoading();

    const email = form.email().value;
    const password = form.password().value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            return firebase.firestore().collection("users").add({
                uid: user.uid,
                email: user.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            hideLoading();
            window.location.href = "../../pages/home/home.html"
        })
        .catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

// Tratamento de mensagens de erro
function getErrorMessage(error) {
    if (error.code == "auth/email-already-in-use") {
        return "email já está em uso";
    }
    return error.message;
}

// Confirma se as senhas coincidem.
function validatePasswordsMatch() {
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;
    
    form.confirmPasswordDoesntMatchError().style.display = 
        password === confirmPassword ? "none" : "block";
}

// Ativa/Desativa o botão de registrar 
function toggleRegisterButtonsDisable() {
    form.registerButton().disabled = !isFormValid(); 
}

// Valida o formulário completo
function isFormValid() {
    const email = form.email().value;
    if (!email || !validateEmail(email)) {
        return false;
    }

    const password = form.password().value;
    if (!password || password.length < 6) {
        return false;
    }

    const confirmPassword = form.confirmPassword().value;
    if (password != confirmPassword) {
        return false;
    }

    return true;
}

// Mapeia os elementos do formulário
const form = {
    confirmPassword: () => document.getElementById('confirmPassword'),
    confirmPasswordDoesntMatchError: () => document.getElementById('password-doesnt-match-error'),
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    password: () => document.getElementById('password'),
    passwordMinLengthError: () => document.getElementById('password-min-length-error'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    registerButton: () => document.getElementById('register-button')
}

// Garante que os eventos funcionem se definidos inline no HTML
window.onChangeEmail = onChangeEmail;
window.onChangePassword = onChangePassword;
window.onChangeConfirmPassword = onChangeConfirmPassword;
window.register = register;
window.redirectToLogin = redirectToLogin;

// Eventos via JavaScript (alternativa aos inline no HTML)
window.onload = () => {
    form.email().addEventListener("input", onChangeEmail);
    form.password().addEventListener("input", onChangePassword);
    form.confirmPassword().addEventListener("input", onChangeConfirmPassword);
    form.registerButton().addEventListener("click", register);
}
