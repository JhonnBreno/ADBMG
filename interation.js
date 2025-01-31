const bar = document.getElementById('bar')
const sidebar = document.getElementById('sidebar')

bar.addEventListener('click', () =>{
    if(sidebar.classList.contains('hidden')){
        sidebar.classList.remove('hidden')
        sidebar.classList.add('visible')
    } else{
        sidebar.classList.contains('visible')
        sidebar.classList.remove('visible')
        sidebar.classList.add('hidden')
    }
        
})

function mudarImagem() {
    const imagem = document.getElementById('main-img');
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) {
        imagem.src = './imagens/manha.jpg'; // Manhã
    } else if (hora >= 12 && hora < 16) {
        imagem.src = './imagens/tarde.jpg'; // Tarde
    } else if(hora >= 16 && hora < 18){
        imagem.src = './imagens/ceu-sm.jpg'; // tardinha
    }else{
        imagem.src = './imagens/noite.jpg'; // noite
    }
}
// Chama a função ao carregar a página
mudarImagem();

// Atualiza a imagem a cada hora
setInterval(mudarImagem, 3600000); // 3600000 ms = 1 hora

const btnDonate = document.getElementById('btn-donate')
const contribua = document.getElementById('contribua')

btnDonate.addEventListener('click', () =>{
    if (contribua.classList.contains('hidden2')){
    contribua.classList.remove('hidden2')
    contribua.classList.add('visible2')
    }else{
        contribua.classList.contains('visible2')
        contribua.classList.remove('visible2')
        contribua.classList.add('hidden2')
    }
})
