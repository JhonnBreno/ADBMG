document.addEventListener('DOMContentLoaded', ()=>{
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 3000);


const bar = document.getElementById('bar')
const sidebar = document.getElementById('sidebar')
const searchList = document.getElementById('search-list')
const btnSearch = document.getElementById('search')

bar.addEventListener('click', ()=>{
    if(sidebar.classList.contains('visible')){
        sidebar.classList.replace('visible', 'hidden')
    }else{
        sidebar.classList.replace('hidden', 'visible')
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

});
