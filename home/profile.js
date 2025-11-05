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

try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error('Erro ao inicializar Firebase:', e);
}

const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profileForm');
    
    // Verificar autenticação
    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Carregar dados existentes se houver
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            document.getElementById('nomeCompleto').value = data.nomeCompleto || '';
            document.getElementById('cpf').value = data.cpf || '';
            document.getElementById('rg').value = data.rg || '';
            document.getElementById('nascimento').value = data.nascimento || '';
            document.getElementById('nomePai').value = data.nomePai || '';
            document.getElementById('nomeMae').value = data.nomeMae || '';
            document.getElementById('funcao').value = data.funcao || '';
            document.getElementById('congregacao').value = data.congregacao || '';
            
            if (data.batizado !== undefined) {
                document.getElementById('batizado').value = data.batizado ? 'sim' : 'nao';
                if (typeof toggleDataBatismo === 'function') {
                    toggleDataBatismo();
                }
                if (data.dataBatismo) {
                    document.getElementById('dataBatismo').value = data.dataBatismo;
                }
            }
        }
    });

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('Você precisa estar logado para salvar o perfil.');
            window.location.href = 'login.html';
            return;
        }

        const batizado = document.getElementById('batizado').value;
        const dataBatismo = batizado === 'sim' ? document.getElementById('dataBatismo').value : null;

        // Validar campos obrigatórios
        const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
        if (!nomeCompleto) {
            alert('Por favor, preencha o nome completo.');
            return;
        }

        const userData = {
            nomeCompleto: nomeCompleto,
            cpf: document.getElementById('cpf').value.trim(),
            rg: document.getElementById('rg').value.trim(),
            nascimento: document.getElementById('nascimento').value,
            nomePai: document.getElementById('nomePai').value.trim(),
            nomeMae: document.getElementById('nomeMae').value.trim(),
            funcao: document.getElementById('funcao').value,
            batizado: batizado === 'sim',
            dataBatismo: dataBatismo || null,
            congregacao: document.getElementById('congregacao').value.trim(),
            email: user.email,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Adicionar createdAt apenas se não existir
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (!userDoc.exists) {
            userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        try {
            // Salvar no Firestore - usando set com merge para atualizar ou criar
            const userRef = db.collection('usuarios').doc(user.uid);
            await userRef.set(userData, { merge: true });
            
            // Verificar se foi salvo corretamente
            const savedDoc = await userRef.get();
            if (!savedDoc.exists) {
                throw new Error('Não foi possível verificar se o perfil foi salvo.');
            }
            
            // Salvar flag no localStorage para indicar que o perfil foi salvo
            localStorage.setItem('profileSaved', 'true');
            localStorage.setItem('profileSavedTimestamp', Date.now().toString());
            
            alert('Perfil salvo com sucesso! As informações foram guardadas no banco de dados.');
            window.location.href = '../index.html';
        } catch (error) {
            let errorMessage = 'Erro ao salvar perfil. ';
            if (error.code) {
                switch (error.code) {
                    case 'permission-denied':
                        errorMessage += 'Permissão negada. Verifique as regras do Firestore.';
                        break;
                    case 'unavailable':
                        errorMessage += 'Serviço temporariamente indisponível. Tente novamente.';
                        break;
                    default:
                        errorMessage += error.message || 'Tente novamente.';
                }
            } else {
                errorMessage += error.message || 'Tente novamente.';
            }
            alert(errorMessage);
        }
    });
});
