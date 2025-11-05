// Configuração do Firebase (mesma do login)
const firebaseConfig = {
    apiKey: "AIzaSyBVBAp4XInsO3uWxeCyhMXwgyZc8wG7R5A",
    authDomain: "adbmg-a0618.firebaseapp.com",
    projectId: "adbmg-a0618",
    storageBucket: "adbmg-a0618.firebasestorage.app",
    messagingSenderId: "966966845858",
    appId: "1:966966845858:web:85d3f4e0a3f953649c92fb",
    measurementId: "G-DXT8S3VMK7"
};

try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error('Erro ao inicializar Firebase:', e);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (!email || !password || !confirm) {
            alert('Preencha todos os campos');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (password !== confirm) {
            alert('As senhas não conferem');
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            // Envia verificação de email
            await userCredential.user.sendEmailVerification();
            alert('Conta criada! Verifique seu e-mail para ativar a conta.');
            // Redireciona para a página de login
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            alert('Erro ao criar conta: ' + (error.message || error));
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const box = document.getElementById("box");
    box.classList.add("animate");
  });
  
