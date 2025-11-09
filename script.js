// Importações Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Configuração do Firebase (usar a mesma de profile.js para consistência)
const firebaseConfig = {
  apiKey: "AIzaSyBzt_7wGwrB_mpkR6A7nLGgMo7rcae6zOI",
  authDomain: "adbmg-a0618.firebaseapp.com",
  projectId: "adbmg-a0618",
  databaseURL: "https://adbmg-a0618-default-rtdb.firebaseio.com/", // Adicionar databaseURL para Realtime Database
  storageBucket: "adbmg-a0618.firebasestorage.app",
  messagingSenderId: "966966845858",
  appId: "1:966966845858:web:c320d349ed5e27949c92fb",
  measurementId: "G-H9VN98KLCC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Função para atualizar o visual do status de login
function updateLoginStatus() {
    const loginStatus = document.getElementById('loginStatus');
    const loginText = document.getElementById('loginText');
    
    if (isUserLoggedIn()) {
        loginStatus.classList.add('logged-in');
        loginText.textContent = 'Logado';
        const userName = localStorage.getItem('userName');
        if (userName) {
            loginText.textContent = userName;
        }
    } else {
        loginStatus.classList.remove('logged-in');
        loginText.textContent = 'Não logado';
    }
}

// Função para mostrar o modal de login
function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Função para verificar acesso a áreas restritas
function checkAccess(element) {
    if (!isUserLoggedIn()) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

// Função para fazer logout
async function logout() {
    // Sinalizar que está fazendo logout para evitar reautenticação automática
    window.isLoggingOut = true;
    
    // Salvar timestamp do logout no localStorage para persistir mesmo após navegação
    localStorage.setItem('logoutTimestamp', Date.now().toString());
    localStorage.setItem('manualLogout', 'true');
    
    try {
        // Limpar localStorage primeiro
        localStorage.setItem('userLoggedIn', 'false');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Atualizar status visual imediatamente
        updateLoginStatus();
        
        // Aguardar um pouco para garantir que o listener detecte a mudança
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fazer signOut do Firebase
        await signOut(auth);
        
        // Resetar flag após um tempo para permitir login futuro
        setTimeout(() => {
            window.isLoggingOut = false;
            // Remover flags após 5 segundos
            const logoutTime = localStorage.getItem('logoutTimestamp');
            if (logoutTime && Date.now() - parseInt(logoutTime) > 5000) {
                localStorage.removeItem('logoutTimestamp');
                localStorage.removeItem('manualLogout');
            }
        }, 5000);
        
    } catch (error) {
        // Mesmo com erro, garantir que localStorage está limpo
        localStorage.setItem('userLoggedIn', 'false');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        updateLoginStatus();
        
        setTimeout(() => {
            window.isLoggingOut = false;
        }, 5000);
    }
}
    // Adicionar verificação de login para áreas restritas
    const restrictedAreas = document.querySelectorAll('.restricted-area');
    restrictedAreas.forEach(area => {
        checkAccess(area);
    });

    // Configurar o evento de clique no status de login
    const loginStatus = document.getElementById('loginStatus');
    loginStatus.addEventListener('click', () => {
        if (isUserLoggedIn()) {
            if (confirm('Deseja fazer logout?')) {
                logout();
            }
        } else {
            showLoginModal();
        }
    });

    // Atualizar o status de login inicial
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', user.displayName || user.email);
      } else {
        if (!window.isLoggingOut && localStorage.getItem('manualLogout') !== 'true') {
          localStorage.setItem('userLoggedIn', 'false');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
        }
      }
      updateLoginStatus();
    });

    // Se acabou de salvar o perfil, abrir sidebar automaticamente
    const profileSaved = localStorage.getItem('profileSaved');
    if (profileSaved === 'true') {
        const savedTime = parseInt(localStorage.getItem('profileSavedTimestamp') || '0');
        const timeSinceSave = Date.now() - savedTime;
        
        // Se foi salvo nos últimos 5 segundos, abrir sidebar automaticamente
        if (timeSinceSave < 5000 && isUserLoggedIn()) {
            setTimeout(() => {
                const profileIcon = document.getElementById('profileIcon');
                if (profileIcon) {
                    profileIcon.click();
                }
                // Limpar flags
                localStorage.removeItem('profileSaved');
                localStorage.removeItem('profileSavedTimestamp');
            }, 500);
        } else {
            localStorage.removeItem('profileSaved');
            localStorage.removeItem('profileSavedTimestamp');
        }
    }

    function lerCookie(nome) {
        const cookies = document.cookie.split("; ");
        for (let c of cookies) {
          const [chave, valor] = c.split("=");
          if (chave === nome) return valor;
        }
        return null;
      }
      


