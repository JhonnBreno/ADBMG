// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVBAp4XInsO3uWxeCyhMXwgyZc8wG7R5A",
    authDomain: "adbmg-a0618.firebaseapp.com",
    projectId: "adbmg-a0618",
    storageBucket: "adbmg-a0618.firebasestorage.app",
    messagingSenderId: "966966845858",
    appId: "1:966966845858:web:85d3f4e0a3f953649c92fb",
    measurementId: "G-DXT8S3VMK7"
};

// Inicializa o Firebase (se já não estiver inicializado)
try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error('Erro ao inicializar Firebase:', e);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const googleBtn = document.getElementById('googleSignIn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Por favor, preencha email e senha');
                return;
            }

            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                
                // Salvar informações no localStorage
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userName', userCredential.user.email.split('@')[0]);
                localStorage.setItem('userEmail', userCredential.user.email);
                
                // Redireciona para a página principal após login
                window.location.href = '../index.html';
            } catch (error) {
                console.error('Erro no login:', error);
                let mensagem = 'Erro ao fazer login. ';
                switch (error.code) {
                    case 'auth/invalid-email':
                        mensagem += 'Email inválido.';
                        break;
                    case 'auth/user-disabled':
                        mensagem += 'Conta desativada.';
                        break;
                    case 'auth/user-not-found':
                        mensagem += 'Usuário não encontrado.';
                        break;
                    case 'auth/wrong-password':
                        mensagem += 'Senha incorreta.';
                        break;
                    default:
                        mensagem += error.message;
                }
                alert(mensagem);
            }
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await firebase.auth().signInWithPopup(provider);
                
                // Salvar informações no localStorage
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userName', result.user.displayName || result.user.email.split('@')[0]);
                localStorage.setItem('userEmail', result.user.email);
                
                // Redireciona para a página principal após login
                window.location.href = '../index.html';
            } catch (error) {
                console.error('Erro no login com Google:', error);
                alert('Erro ao fazer login com Google: ' + (error.message || 'Tente novamente mais tarde'));
            }
        });
    }

    // Monitora o estado de autenticação
    firebase.auth().onAuthStateChanged((user) => {
        // Verificar se houve logout manual recentemente
        const manualLogout = localStorage.getItem('manualLogout');
        const logoutTimestamp = localStorage.getItem('logoutTimestamp');
        
        // Se houve logout manual nos últimos 10 segundos, não reautenticar
        if (manualLogout === 'true' && logoutTimestamp) {
            const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
            if (timeSinceLogout < 10000) {
                return;
            } else {
                // Limpar flags antigas
                localStorage.removeItem('manualLogout');
                localStorage.removeItem('logoutTimestamp');
            }
        }
        
        // Não atualizar se estiver fazendo logout
        if (window.isLoggingOut) {
            return;
        }
        
        if (user) {
            // Verificar se o localStorage indica que o usuário fez logout manualmente
            const currentLoggedIn = localStorage.getItem('userLoggedIn');
            if (currentLoggedIn === 'false' && manualLogout === 'true') {
                // Se fez logout manual, fazer signOut do Firebase também
                firebase.auth().signOut().catch(() => {});
                return;
            }
            
            // Verificar se já está logado no localStorage para evitar atualizações desnecessárias
            const currentEmail = localStorage.getItem('userEmail');
            
            // Só atualizar se realmente houver mudança ou se não estiver no localStorage
            if (currentLoggedIn !== 'true' || currentEmail !== user.email) {
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
                localStorage.setItem('userEmail', user.email);
                // Limpar flags de logout se estiver logando
                localStorage.removeItem('manualLogout');
                localStorage.removeItem('logoutTimestamp');
            }
            
            // Se estiver na página de login, redireciona para a página principal
            if (window.location.pathname.includes('/login.html')) {
                window.location.href = '../index.html';
            }
        } else {
            // Usuário não está logado - só atualizar se não estiver fazendo logout
            const currentLoggedIn = localStorage.getItem('userLoggedIn');
            if (currentLoggedIn === 'true' && !window.isLoggingOut) {
                localStorage.setItem('userLoggedIn', 'false');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
            }
        }
    });
});
