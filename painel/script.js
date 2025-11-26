// Importações Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js"; // Importar autenticação
import { equalTo, getDatabase, onValue, orderByChild, query, ref } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Configuração do Firebase (usar a mesma de profile.js para consistência)
const firebaseConfig = {
  apiKey: "AIzaSyBzt_7wGwrB_mpkR6A7nLGgMo7rcae6zOI",
  authDomain: "adbmg-a0618.firebaseapp.com",
  projectId: "adbmg-a0618",
  databaseURL: "https://adbmg-a0618-default-rtdb.firebaseio.com/",
  storageBucket: "adbmg-a0618.firebasestorage.app",
  messagingSenderId: "966966845858",
  appId: "1:966966845858:web:c320d349ed5e27949c92fb",
  measurementId: "G-H9VN98KLCC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); // Inicializa autenticação

document.addEventListener("DOMContentLoaded", () => {
    const userListDiv = document.getElementById("userList");
    const searchCongregacaoInput = document.getElementById("searchCongregacao");
    const filterBatizadoSelect = document.getElementById("filterBatizado");
    const filterCidadeSelect = document.getElementById("filterCidade"); // Novo elemento select para cidade
    const userCountSpan = document.getElementById("userCount"); // Novo elemento para exibir a contagem

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Se não estiver logado, redireciona para a página de login
            window.location.href = "../home/login.html"; 
            return;
        }
        // Se estiver logado, continua a carregar os dados
        fetchUsers(); // Carrega todos os usuários ao iniciar, sem filtros
    });

    function displayUsers(users) {
        userListDiv.innerHTML = ""; // Limpa a lista existente
        const numberOfUsers = users ? Object.keys(users).length : 0; // Calcula o número de usuários
        userCountSpan.textContent = numberOfUsers; // Atualiza o contador

        if (users && Object.keys(users).length > 0) {
            Object.keys(users).forEach(uid => {
                const user = users[uid];
                const userCard = document.createElement("div");
                userCard.className = "col-md-4 mb-4";
                userCard.innerHTML = `
                    <div class="cards h-100">
                        <div class="card-body">
                            <h1 class="card-title">${user.nomeCompleto || 'Nome não informado'}</h1>
                            <p class="card-text"><strong>Email:</strong> ${user.email || 'Não informado'}</p>
                            <p class="card-text"><strong>Congregação:</strong> ${user.congregacao || 'Não informado'}</p>
                            <p class="card-text"><strong>Cidade:</strong> ${user.cidade || 'Não informado'}</p>
                            <p class="card-text"><strong>Batizado:</strong> ${user.batizado ? 'Sim' : 'Não'}</p>
                            <p class="card-text"><strong>Função:</strong> ${user.funcao || 'Não informado'}</p>
                            <p class="card-text"><strong>CPF:</strong> ${user.cpf || 'Não informado'}</p>
                            <p class="card-text"><strong>RG:</strong> ${user.rg || 'Não informado'}</p>
                            <p class="card-text"><strong>Nascimento:</strong> ${user.nascimento || 'Não informado'}</p>
                            <p class="card-text"><strong>Nome do Pai:</strong> ${user.nomePai || 'Não informado'}</p>
                            <p class="card-text"><strong>Nome da Mãe:</strong> ${user.nomeMae || 'Não informado'}</p>
                            ${user.batizado && user.dataBatismo ? `<p class="card-text"><strong>Data Batismo:</strong> ${user.dataBatismo}</p>` : ''}
                        </div>
                    </div>
                `;
                userListDiv.appendChild(userCard);
            });
        } else {
            userListDiv.innerHTML = "<p>Não foi possível encontrar nenhum usuário.</p>";
        }
    }

    function fetchUsers(nomeCompletoFiltro = '', batizadoFiltro = '', cidadeFiltro = '') {
        let usersRef = ref(db, "usuarios"); // Começa com a referência base
        let currentQuery = usersRef;

        // Aplica o filtro de batizado no lado do servidor
        if (batizadoFiltro === 'sim') {
            currentQuery = query(usersRef, orderByChild('batizado'), equalTo(true));
        } else if (batizadoFiltro === 'nao') {
            currentQuery = query(usersRef, orderByChild('batizado'), equalTo(false));
        }

        onValue(currentQuery, (snapshot) => {
            const allUsers = snapshot.val();
            let filteredUsers = {};

            if (allUsers) {
                // Converte o objeto de usuários em um array para facilitar a filtragem
                let usersArray = Object.keys(allUsers).map(uid => ({ ...allUsers[uid], uid }));

                // Filtra por nome completo no lado do cliente (busca parcial)
                if (nomeCompletoFiltro) {
                    usersArray = usersArray.filter(user => 
                        user.nomeCompleto && user.nomeCompleto.toLowerCase().includes(nomeCompletoFiltro.toLowerCase())
                    );
                }

                // Filtra por cidade no lado do cliente
                if (cidadeFiltro) {
                    usersArray = usersArray.filter(user => user.cidade === cidadeFiltro);
                }
                
                filteredUsers = usersArray.reduce((obj, user) => { obj[user.uid] = user; return obj; }, {}); // Converte de volta para objeto
            }
            
            displayUsers(filteredUsers); // Exibe os usuários filtrados
        });
    }

    searchCongregacaoInput.addEventListener('input', () => {
        const nomeCompleto = searchCongregacaoInput.value.trim();
        const batizado = filterBatizadoSelect.value;
        const cidade = filterCidadeSelect.value;
        fetchUsers(nomeCompleto, batizado, cidade);
    });

    filterBatizadoSelect.addEventListener('change', () => {
        const nomeCompleto = searchCongregacaoInput.value.trim();
        const batizado = filterBatizadoSelect.value;
        const cidade = filterCidadeSelect.value;
        fetchUsers(nomeCompleto, batizado, cidade);
    });

    filterCidadeSelect.addEventListener('change', () => { // Event listener para o filtro de cidade
        const nomeCompleto = searchCongregacaoInput.value.trim();
        const batizado = filterBatizadoSelect.value;
        const cidade = filterCidadeSelect.value;
        fetchUsers(nomeCompleto, batizado, cidade);
    });
            
});
