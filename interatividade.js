document.addEventListener('DOMContentLoaded', ()=>{
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 3000);


const bar = document.getElementById('bar')
const sidebar = document.getElementById('sidebar')
const searchList = document.getElementById('search-list')
const btnSearch = document.getElementById('search')
const btnHeader = document.getElementById('closeHeaderStyle')

bar.addEventListener('click', ()=>{
    if(sidebar.classList.contains('sidebarOff')){
        sidebar.classList.replace('sidebarOff', 'sidebarOn')
    }else{
        sidebar.classList.replace('sidebarOn', 'sidebarOff')
    }
})
btnHeader.addEventListener('click', ()=> {
    if(sidebar.classList.contains('sidebarOn')){
        sidebar.classList.replace('sidebarOn', 'sidebarOff')
    }
})

btnSearch.addEventListener('keydown', function (){
    if(searchList.classList.contains('hidden')){
        searchList.classList.replace('hidden', 'visible')
    }
})

    document.addEventListener('click', (event)=>{
        if(searchList.classList.contains('visible') && event.target !== btnSearch && !searchList.contains(event.target)){
            searchList.classList.remove('visible')
            searchList.classList.add('hidden')
        }
    })
    const audio = document.getElementById('audio');
    const icon = document.getElementById('btn')
    const gif = document.getElementById('bird');
  
    icon.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            gif.src = "./imagens/loading_V1.gif"
            icon.classList.replace('bi-play-fill', 'bi-pause-circle-fill');
        } else {
            audio.pause();
            gif.src = "./imagens/loading.png"
            icon.classList.replace('bi-pause-circle-fill', 'bi-play-fill');
        }
    });

    const inputField = document.getElementById('search-input');
    const lista = document.querySelectorAll('#search-list li');

    inputField.addEventListener('input', () => {
        const inputBuscar = inputField.value.toLowerCase();
        lista.forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(inputBuscar) ? "list-item" : "none";
        });
    });

    const locais = document.getElementById('locais');
    const search = document.getElementById('search-input');
    locais.addEventListener('click', () => {
        search.style.setProperty("background-color", "red", "important");
        search.style.setProperty("transition", "1s", "important");
        setTimeout(() => {
            search.style.setProperty("background-color", "white", "important");
        }, 2000);
    });

  const banner = document.getElementById("cookie-banner");
  const btn = document.getElementById("aceitar-cookies");

  // Verifica se o cookie já foi aceito
  if (document.cookie.includes("cookiesAceitos=true")) {
    banner.style.display = "none";
  }

  btn.addEventListener("click", () => {
    // Define o cookie com validade de 1 ano
    document.cookie = "cookiesAceitos=true; max-age=" + 60 * 60 * 24 * 365 + "; path=/";
    banner.style.display = "none";
  });

});
