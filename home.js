// Função de Logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    });
}


// Verificar se o usuário está autenticado
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        user.getIdToken().then(token => console.log(token)); // Log para mostar o token do usuário no console
        findTransactions(user);
    }
});

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
    showLoading();
    transactionService.findByUser(user)
        .then(transactions => {
                hideLoading();
                console.log('Transações recuperadas', transactions); // Log para depuração, bug das transações não aparecerem na tela
                addTransactionsToScreen(transactions);
            })
            .catch(error => {
                hideLoading();
                console.log('Erro ao recuperar transações', error); // Usando console.error para erros
                alert('Erro ao recuperar transações', error);
            })
}

// Função que adiciona transações à tela
function addTransactionsToScreen(transactions) {
    if (!Array.isArray(transactions)) {
        alert('Erro: Dados de transações inválidos');
        return;
    }
    
    const orderedList = document.getElementById('transactions');
    
    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));
        
        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.type));

        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }

        orderedList.appendChild(li);
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })
        return li;
}

// Botão, flutuante, de remover dentro de cada transação 
function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Remover";
        deleteButton.classList.add('outline', 'danger');
        deleteButton.addEventListener('click', event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        });
        return deleteButton;
}

function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transação?');
    if (shouldRemove) {
        RemoveTransaction(transaction);
    }
}

function RemoveTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transação')
        });
}

// Função que formata a data
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

// Função que formata o valor de dinheiro
function formatMoney(money) {
    if (!money || typeof money.value === 'undefined' || typeof money.currency === 'undefined') {
        return "Valor inválido"; // Para evitar erros caso os dados estejam incorretos
    }
    return `${money.currency} ${parseFloat(money.value).toFixed(2)}`;
}