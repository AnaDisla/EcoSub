// ========================================
// REPRODUCTOR DE CINEMÁTICAS - HISTORIA DEL JUEGO
// ========================================

// Lista de cinemáticas en orden
const listaCinematicas = [
    { tipo: 'imagen', archivo: 'img/history/1.jpg' },
    { tipo: 'video', archivo: 'img/history/2.mp4' },
    { tipo: 'pregunta', numero: 3 },
    { tipo: 'video', archivo: 'img/history/4.mp4' },
    { tipo: 'pregunta', numero: 5 },
    { tipo: 'video', archivo: 'img/history/6.mp4' },
    { tipo: 'video', archivo: 'img/history/7.mp4' },
    { tipo: 'video', archivo: 'img/history/9.mp4' },
    { tipo: 'video', archivo: 'img/history/10.mp4' },
    { tipo: 'video', archivo: 'img/history/11.mp4' },
    { tipo: 'video', archivo: 'img/history/12.mp4' }
];

// Datos de las preguntas interactivas
const preguntasInteractivas = {
    3: {
        fondo: 'img/history/pregunta1/3.png',
        opciones: ['img/history/pregunta1/opcion1.png', 'img/history/pregunta1/opcion2.png', 'img/history/pregunta1/opcion3.png']
    },
    5: {
        fondo: 'img/history/pregunta2/5.png',
        opciones: ['img/history/pregunta2/opción1.png', 'img/history/pregunta2/opcion2.png', 'img/history/pregunta2/opcion3.png']
    }
};

// Variables globales
let indiceCinematicaActual = 0;
let interaccionCompletada = false;

// Elementos del DOM
const elementoVideo = document.getElementById('elementoVideo');
const elementoImagen = document.getElementById('elementoImagen');
const textoProgreso = document.getElementById('textoProgreso');
const contenedorPregunta = document.getElementById('contenedorPregunta');
const imagenFondo = document.getElementById('imagenFondo');
const contenedorOpciones = document.getElementById('contenedorOpciones');

// ========================================
// FUNCIÓN: REPRODUCIR CINEMÁTICA
// ========================================

function reproducirCinematica() {
    if (indiceCinematicaActual >= listaCinematicas.length) {
        finalizarHistoria();
        return;
    }

    const cinematica = listaCinematicas[indiceCinematicaActual];
    actualizarProgreso();
    ocultarElementos();

    switch (cinematica.tipo) {
        case 'video':
            reproducirVideo(cinematica.archivo);
            break;
        case 'imagen':
            reproducirImagen(cinematica.archivo);
            break;
        case 'pregunta':
            mostrarPregunta(cinematica.numero);
            break;
    }
}

// ========================================
// FUNCIÓN: REPRODUCIR VIDEO
// ========================================

function reproducirVideo(archivo) {
    elementoVideo.src = archivo;
    elementoVideo.classList.add('activo');
    elementoVideo.onended = siguienteCinematica;
    elementoVideo.play();
}

// ========================================
// FUNCIÓN: REPRODUCIR IMAGEN
// ========================================

function reproducirImagen(archivo) {
    elementoImagen.src = archivo;
    elementoImagen.classList.add('activo');
}

// ========================================
// FUNCIÓN: MOSTRAR PREGUNTA INTERACTIVA
// ========================================

function mostrarPregunta(numeroPregunta) {
    // Obtener datos de la pregunta
    const datos = preguntasInteractivas[numeroPregunta];

    // Mostrar imagen de fondo (ya contiene la pregunta)
    imagenFondo.src = datos.fondo;

    // Limpiar opciones anteriores
    contenedorOpciones.innerHTML = '';

    // Crear opciones
    datos.opciones.forEach((ruta, indice) => {
        const img = document.createElement('img');
        img.src = ruta;
        img.alt = `Opción ${indice + 1}`;
        img.className = 'imagen-opcion'; // Clase para opciones interactivas
        
        // Animación al hacer click
        img.addEventListener('click', () => {
            img.classList.add('clicked');
            setTimeout(() => {
                img.classList.remove('clicked');
                interaccionCompletada = true;
                siguienteCinematica();
            }, 200);
        });
        
        contenedorOpciones.appendChild(img);
    });

    // Mostrar contenedor de pregunta
    contenedorPregunta.classList.add('activo');
}


function ocultarElementos() {
    elementoVideo.classList.remove('activo');
    elementoImagen.classList.remove('activo');
    contenedorPregunta.classList.remove('activo');
    elementoVideo.src = '';
    elementoImagen.src = '';
    contenedorOpciones.innerHTML = '';
    interaccionCompletada = false;
}

function siguienteCinematica() {
    const esPreguntal = listaCinematicas[indiceCinematicaActual].tipo === 'pregunta';
    if (esPreguntal && !interaccionCompletada) return;

    indiceCinematicaActual++;
    reproducirCinematica();
}

function actualizarProgreso() {
    textoProgreso.textContent = `${indiceCinematicaActual + 1}/${listaCinematicas.length}`;
}

function finalizarHistoria() {
    ocultarElementos();
    textoProgreso.textContent = 'Fin';
    sessionStorage.setItem("desdeHistoria", "true");
    setTimeout(() => { window.location.href = 'game.html'; }, 2000);
}

document.addEventListener('keydown', (evento) => {
    if (evento.code === 'Space') {
        evento.preventDefault();
        
        // Bloquear SPACE en preguntas interactivas
        if (listaCinematicas[indiceCinematicaActual].tipo === 'pregunta') return;
        
        // Pausar video y continuar
        if (listaCinematicas[indiceCinematicaActual].tipo === 'video') {
            elementoVideo.pause();
        }
        
        siguienteCinematica();
    }
});

document.addEventListener('DOMContentLoaded', reproducirCinematica);
