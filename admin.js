// admin.js

document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('formularioAdmin'); // ID do formulário de admin
    const adminPasswordInput = document.getElementById('inputProfile');

    // Defina sua senha de administrador aqui. EM PRODUÇÃO, NUNCA DEIXE UMA SENHA FIXA NO CLIENT-SIDE.
    // Você deve usar um serviço de autenticação seguro para isso.
    const ADMIN_PASSWORD = "suasenhaadmin"; // Mude para uma senha forte

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário (recarregamento da página)

            const enteredPassword = adminPasswordInput.value;

            if (enteredPassword === ADMIN_PASSWORD) {
                // Senha correta, redireciona para o painel
                window.location.href = "./painel/index.html";
            } else {
                alert('Senha de administrador incorreta!');
                adminPasswordInput.value = ''; // Limpa o campo da senha
            }
        });
    }
});


