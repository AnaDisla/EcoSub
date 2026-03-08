/* ========================================
   JUEGO ECOSUB By: Ana & Avril- LÓGICA PRINCIPAL
   ======================================== */

// ======= ELEMENTOS =======
const submarino = document.getElementById('submarino');
const puntajeEl = document.getElementById('puntaje');
const vidasEl = document.getElementById('vidas');
const pantallaFin = document.getElementById('pantallaFin');
const puntajeFinalEl = document.getElementById('puntajeFinal');
const contenedorJuego = document.getElementById('contenedorJuego');

// ======= VARIABLES DE JUEGO =======
let posicionY = "";
let posicionX = "";                 
let puntaje = 0;
let vidas = 3;
let jugando = true;
let generadorObjetos = null;        
let jugadorGano = false; // Variable para determinar si el jugador ganó

const peces = [];
const basura = [];

// ======= SECUENCIA DE FONDOS =======
const cintaFondos = document.getElementById('cintaFondos');
let fondoIndex = 0;                 
let posFondo = 0;                   
let enMovimientoFinal = false;      
let tocóFondoFinal = false;       

// Imágenes
const imagenesPeces = [
    'img/fish/Caballito.png',
    'img/fish/camaron.png',
    'img/fish/cangrejo.png',
    'img/fish/pez_cirujano.png',
    'img/fish/pez_globo.png',
    'img/fish/pez_loro.png',
    'img/fish/pez_payaso.png',
    'img/fish/tortuga_marina.png',
    'img/fish/trucha.png'
];

const imagenesBasura = [
    'img/trash/bomba.png',
    'img/trash/tanque.png',
    'img/trash/botella1.png',
    'img/trash/botella2.png',
    'img/trash/bolsa.png',
    'img/trash/lata1.png',
    'img/trash/lata2.png',
    'img/trash/sixpack.png'
];

// ======= CONTROLES =======
let movimientoArriba = false;
let movimientoAbajo = false;

window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') movimientoArriba = true;
    if (e.key === 'ArrowDown' || e.key === 's') movimientoAbajo = true;
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') movimientoArriba = false;
    if (e.key === 'ArrowDown' || e.key === 's') movimientoAbajo = false;
});

// ======= CALCULOS RESPONSIVEEE =======
function obtenerDimensionesJuego() {
    return {
        ancho: contenedorJuego.offsetWidth,
        alto: contenedorJuego.offsetHeight
    };
}

function obtenerAlturaSubmarino() {
    return submarino.offsetHeight;
}

// ======= MOVIMIENTO DEL SUBMARINO =======
function actualizarPosicion() {
    const dims = obtenerDimensionesJuego();
    const alturaSubmarino = obtenerAlturaSubmarino();
    const velocidad = dims.alto * 0.008; 

    if (movimientoArriba) posicionY -= velocidad;
    if (movimientoAbajo) posicionY += velocidad;

    // Limitar dentro de los límites del juego
    posicionY = Math.max(0, Math.min(dims.alto - alturaSubmarino, posicionY));
    submarino.style.top = posicionY + 'px';
}

// ======= GENERACIÓN DE OBJETOS =======
function generarObjeto() {
    const dims = obtenerDimensionesJuego();
    
    if (peces.length + basura.length > 8) return;

    const esPez = Math.random() < 0.6;
    const img = document.createElement('img');
    
    img.className = 'pez';
    img.style.position = 'absolute';
    
    if (esPez) {
        img.src = imagenesPeces[Math.floor(Math.random() * imagenesPeces.length)];
        img.dataset.tipo = 'pez';
        peces.push(img);
    } else {
        img.src = imagenesBasura[Math.floor(Math.random() * imagenesBasura.length)];
        img.dataset.tipo = 'basura';
        basura.push(img);
    }

    // Posicionar en el lado derecho con altura aleatoria
    img.style.top = Math.random() * (dims.alto - 100) + 'px';
    img.style.left = dims.ancho + 'px';
    
    contenedorJuego.appendChild(img);
}

// Genera objetos cada 1.5 segundos 
generadorObjetos = setInterval(generarObjeto, 1500);

// ======= COLISIONES =======
function procesarColisiones() {
    const dims = obtenerDimensionesJuego();
    const subRect = submarino.getBoundingClientRect();
    const todosPeces = peces.concat(basura);

    for (let i = todosPeces.length - 1; i >= 0; i--) {
        const objeto = todosPeces[i];
        const rectObjeto = objeto.getBoundingClientRect();

        // Mover objeto izquierda
        const posicionX = parseInt(objeto.style.left, 10);
        const nuevaPosicion = posicionX - dims.ancho * 0.005; 
        objeto.style.left = nuevaPosicion + 'px';

        // Eliminar
        if (nuevaPosicion < -100) {
            objeto.remove();
            const lista = (objeto.dataset.tipo === 'pez' ? peces : basura);
            lista.splice(lista.indexOf(objeto), 1);
            continue;
        }

        // Detección de colisión AABB (boundingClientRect)
        if (!(subRect.right < rectObjeto.left || 
              subRect.left > rectObjeto.right ||
              subRect.bottom < rectObjeto.top || 
              subRect.top > rectObjeto.bottom)) {

            // Acción según tipo
            if (objeto.dataset.tipo === 'basura') {
                puntaje++;
                puntajeEl.textContent = 'Puntaje: ' + puntaje;
            } else {
                vidas--;
                actualizarVidas();
                if (vidas <= 0) {
                    jugadorGano = false; // jugador perdió
                    iniciarSecuenciaFinal();
                    return;
                }
            }

            // Remover objeto 
            objeto.remove();
            const lista = (objeto.dataset.tipo === 'pez' ? peces : basura);
            lista.splice(lista.indexOf(objeto), 1);
        }
    }
}

// ======= SISTEMAS DE VIDAS =======
function actualizarVidas() {
    vidasEl.innerHTML = '';
    for (let i = 0; i < vidas; i++) {
        const corazon = document.createElement('img');
        corazon.src = 'img/vida.png';
        corazon.alt = 'vida';
        vidasEl.appendChild(corazon);
    }
}

// ======= ACTUALIZACIÓN DE FONDOS =======
function actualizarFondo() {
    const dims = obtenerDimensionesJuego();
    const velocidad = dims.ancho * 0.0025; 
    const totalFondos = cintaFondos.children.length;

    if (fondoIndex >= totalFondos - 1) {
        // cinta alineada con último fondo
        posFondo = -dims.ancho * (totalFondos - 1);
        cintaFondos.style.transform = `translateX(${posFondo}px)`;
        return;
    }

    // avanzar la cinta
    posFondo -= velocidad;
    cintaFondos.style.transform = `translateX(${posFondo}px)`;

    // comprobación cambio fondo completo
    if (posFondo <= -dims.ancho * (fondoIndex + 1)) {
        fondoIndex++;
    }
}

// detecta fondo3 
function detectarToqueFondoFinal() {
    if (tocóFondoFinal) return;
    const totalFondos = cintaFondos.children.length;

    if (fondoIndex === totalFondos - 1) {
        tocóFondoFinal = true;
        jugadorGano = true; // El jugador gano
        iniciarSecuenciaFinal();
    }
}

function mostrarPantallaFinal() {
    jugando = false;
    const vieneDeHistoria = sessionStorage.getItem("desdeHistoria");

    // Si gana y viene de historia, mostrar video antes de la pantalla final
    if (jugadorGano && vieneDeHistoria === "true") {
        const contenedorVideo = document.getElementById('contenedorVideoFinal');
        contenedorVideo.style.display = 'block';
        contenedorVideo.style.position = 'fixed';
        contenedorVideo.style.top = '0';
        contenedorVideo.style.left = '0';
        contenedorVideo.style.width = '100vw';
        contenedorVideo.style.height = '100vh';
        contenedorVideo.style.zIndex = '50';
        contenedorVideo.innerHTML = '<video id="videoFinal" autoplay style="width: 100%; height: 100%; object-fit: contain; background: black;"></video>';
        const video = document.getElementById('videoFinal');
        video.src = 'img/animacion_final.mp4';
        
        // Permitir saltar el video con click o teclado
        const finalizarVideo = () => {
            contenedorVideo.style.display = 'none';
            sessionStorage.removeItem("desdeHistoria");
            mostrarPantallaGanar();
            window.removeEventListener('keydown', skipVideoHandler);
        };
        video.onclick = finalizarVideo;
        video.onended = finalizarVideo;
        
        // Permitir saltar con ESC o SPACE
        function skipVideoHandler(e) {
            if (e.code === 'Escape' || e.code === 'Space') {
                if (!video.paused) video.pause();
                finalizarVideo();
            }
        }
        window.addEventListener('keydown', skipVideoHandler);
        return;
    }

    // Si pierde o no viene de historia, no limpiar la bandera aquí
    mostrarPantallaGanar();
}

function mostrarPantallaGanar() {
    const ventanaPuntaje = document.querySelector('.ventanaPuntaje');
    if (jugadorGano) {
        ventanaPuntaje.src = 'img/congrats.png';
    } else {
        ventanaPuntaje.src = 'img/gameover.png';
    }

    // Calcular impacto ambiental
    const plasticRetirado = (puntaje * 0.2).toFixed(2); // 1 objeto = 0.2 kg de plástico
    const pecesProtegidos = (plasticRetirado * 10.5).toFixed(2); // 1 kg de plástico = 10.5 peces protegidos
    const metrosOceanoLimpio = (plasticRetirado / 0.15).toFixed(2); // 0.15 kg de plástico = 1 m² de océano limpio

    // Mostrar pantalla final
    submarino.style.display = 'none';
    document.getElementById('uiJuego').style.display = 'none';

    pantallaFin.style.display = 'flex';
    setTimeout(() => {
        pantallaFin.classList.add('mostrar');
    }, 10);

    const estadisticas = `
        Puntaje: ${puntaje}<br>
        Plastico eliminado: ${plasticRetirado} kg<br>
        Peces protegidos: ${pecesProtegidos}<br>
        Arecifes limpiados: ${metrosOceanoLimpio} m²
    `;
    document.getElementById('estadisticasAmbientales').innerHTML = estadisticas;
}

function iniciarSecuenciaFinal() {
    clearInterval(generadorObjetos);
    peces.forEach(p => p.remove());
    basura.forEach(b => b.remove());
    peces.length = 0;
    basura.length = 0;

    movimientoArriba = movimientoAbajo = false;

    // preparar coordenada horizontal inicial
    posicionX = submarino.offsetLeft;
    enMovimientoFinal = true;
}

// mueve el submarino automáticamente hacia el borde derecho
function moverSubmarinoFinal() {
    const dims = obtenerDimensionesJuego();
    const velocidad = dims.ancho * 0.005; 
    posicionX += velocidad;
    submarino.style.left = posicionX + 'px';

    if (posicionX > dims.ancho) {
        mostrarPantallaFinal();
    }
}

// ======= BUCLE PRINCIPAL DEL JUEGO =======
function buclePrincipal() {
    if (!jugando) {
        requestAnimationFrame(buclePrincipal);
        return;
    }

    if (enMovimientoFinal) {
        moverSubmarinoFinal();
        requestAnimationFrame(buclePrincipal);
        return;
    }

    actualizarPosicion();
    procesarColisiones();
    actualizarFondo();
    detectarToqueFondoFinal();
    requestAnimationFrame(buclePrincipal);
}

// ======= GAME OVER =======
function terminarJuego() {
    jugando = false;
    
    submarino.style.display = 'none';
    document.getElementById('uiJuego').style.display = 'none';
    
    pantallaFin.style.display = 'flex';
    setTimeout(() => {
        pantallaFin.classList.add('mostrar');
    }, 10);
    
    puntajeFinalEl.textContent = 'Puntaje: ' + puntaje;
}

function redo(){
  window.location.href = "game.html";
}

function menu(){
  // Marcar que se debe saltar la intro al volver al menú
  sessionStorage.setItem('saltarIntro', 'true');
  window.location.href = "index.html";
}

function pausarJuego(){
  jugando = false;
  clearInterval(generadorObjetos);
  const pantallaPausa = document.getElementById('pantallaPausa');
  pantallaPausa.style.display = 'flex';
  setTimeout(() => {
    pantallaPausa.classList.add('mostrar');
  }, 10);
}

function reanudarJuego(){
  const pantallaPausa = document.getElementById('pantallaPausa');
  pantallaPausa.classList.remove('mostrar');
  setTimeout(() => {
    pantallaPausa.style.display = 'none';
    jugando = true;
    generadorObjetos = setInterval(generarObjeto, 1500);
  }, 500);
}
// ======= INICIALIZACIÓN =======
function inicializar() {
    const dims = obtenerDimensionesJuego();
    posicionY = dims.alto * 0.50;
    submarino.style.top = posicionY + 'px';

    actualizarVidas();
    buclePrincipal();
}

window.addEventListener('load', inicializar);