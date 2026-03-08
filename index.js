const video = document.getElementById('videoIntro');
const contInicio = document.querySelector('.inicio');
const contCreditos = document.querySelector('.creditos');
const vidCreditos = document.getElementById('videoCreditos')

// Verificar si salta intro
if (sessionStorage.getItem('saltarIntro') === 'true') {
    video.style.display = 'none';
    contInicio.style.display = 'block';
    // Limpiar el flag
    sessionStorage.removeItem('saltarIntro');
} else {
    // que el contenedor de inicio esté oculto
    video.style.display = 'block';
    contInicio.style.display = 'none';

    video.addEventListener('ended', () => {
        video.style.display = 'none';
        contInicio.style.display = 'block';
    });
}

function start(){
    window.location.href = "game.html";
}
function history(){
    window.location.href = "history.html";
}
function creditos(){
    contInicio.style.display = 'none';
    contCreditos.style.display = 'block';
    vidCreditos.play();
}
function volverMenu(){
    contCreditos.style.display = 'none';
    contInicio.style.display = 'block';
    sessionStorage.setItem('saltarIntro', 'true');
    vidCreditos.pause();
    vidCreditos.currentTime = 0;
}
