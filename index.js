// Definição da variável form
const form = {
    email: () => document.getElementById("email"), 
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordMinLengthError: () => document.getElementById("password-min-length-error"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
    registerButton: () => document.getElementById("register-button")
};

// Função para adicionar um usuário ao Firestore
function addUserToFirestore() {
    firestore.collection("users").add({
        email: form.email().value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword(){
    toggleButtonsDisable();
    togglePasswordErrors();
}

// Função de login    
function login() {
        showLoading();
        firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value)       
            .then(() => {
            hideLoading();
            window.location.href = "pages/home/home.html";
        })
        .catch(error => {
            hideLoading();
            console.error("Erro de login", error.code, error.message); // Log detalhado
            handleAuthErrors(error);
        });
}

// Função de tratamento de erros
function handleAuthErrors(error) {
    // Limpa os erros antes de exibir novos
        resetErrorMessages(); 

        const email = form.email().value;
        const password = form.password().value;
        
        // Verifica erro de email
        if (!email) {
            form.emailRequiredError().style.display = "block";
        } else if (!validateEmail(email)) {
            form.emailInvalidError().style.display = "block";
        }
        
        // Verifica erro de senha
        if (!password) {
            form.passwordRequiredError().style.display = "block";
        } else if (password.length < 6) {
            form.passwordMinLengthError().style.display = "block";
        }

        // Exibe mensagem de erro específica
        if (error.code === "auth/user-not-found") {
            alert("Usuário não encontrado. Verifique o email e tente novamente.");
        } else if (error.code === "auth/wrong-pasword") {
            alert("Senha incorreta. Verifique a senha e tente novamente.");
        } else if (error.code === "auth/invalid-email") {
            alert("Email inválido. verifique o email e tente novamente.");
        } else {
            alert("Erro de autenticação: " + error.message);
        }

    
}

// Reseta todas as mensagens de erro antes de exibir novas
function resetErrorMessages() {
    form.emailRequiredError().style.display = "none";
    form.emailInvalidError().style.display = "none";
    form.passwordRequiredError().style.display = "none";
    form.passwordMinLengthError().style.display = "none";
}
        
function register() {
    window.location.href = "pages/register/register.html";
}

// Função para recuperar senha
function recoverPassword () {
        showLoading(); // Exibe a tela de caregamento
        firebase.auth().sendPasswordResetEmail(form.email().value)
        .then(() => {
            hideLoading(); // Esconde a tela de carregamento
            alert("Email enviado, se não tiver chegado ao destino, verifique as informações");
        })
        .catch(error => {
            hideLoading();
            alert(getErrorMessage(error)); // Exibe a mensagem de erro
        });
}

// Função para exibir as mensagens de erro
function getErrorMessage(error) {
    if (error.code == "auth/invalid-credential")  {
        const emailValid = isEmailValid();
        if (!emailValid) {
            return "Email não encontrado";
        } else {
            return "Senha inválida"
        }
    }
    return error.message;
}

// Funções para validação de erro
function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
    form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    
    
    // Desativa o botão de recuperação de senha
    form.recoverPasswordButton().disabled = !emailValid;
    
    //Desativa o botão de entrar
    form.loginButton().disabled = !emailValid || !isPasswordValid(); 
    
    const PasswordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !PasswordValid;
}

function isEmailValid() {
    const email = form.email().value;
    return email && validateEmail(email);
}

function isPasswordValid() {
    const password = form.password().value;
    return password && password.length >= 6;
}
