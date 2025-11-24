// ==============================
// CONFIG
// ==============================
const DURACION_RONDA_SEG = 120;

// ==============================
// ESTADO DEL JUEGO
// ==============================
const estado = {
  modoCharadas: null,   // "jugadores" o "clubes"
  actual: null,         // objeto o string actual
  tiempoRestante: 0,
  puntaje: 0,
  timerId: null,
  movimientoActivo: false,
  poolActual: []        // palabras disponibles sin repetir
};

// ==============================
// REFERENCIAS AL DOM
// ==============================

// Menú principal
const menuPrincipal = document.getElementById("menu-principal");
const btnIrCharadas = document.getElementById("btn-ir-charadas");

// Pantalla charadas
const pantallaCharadas = document.getElementById("pantalla-charadas");
const menuCharadas = document.getElementById("menu-charadas");
const btnVolverMenu = document.getElementById("btn-volver-menu");

// Opciones del menú interno
const bloqueJugadores = document.getElementById("bloque-jugadores");
const bloqueClubes = document.getElementById("bloque-clubes");

// Pantalla de juego
const pantallaJuego = document.getElementById("pantalla-juego");
const modoLabel = document.getElementById("modo-label");
const palabraSpan = document.getElementById("palabra-actual");
const timerSpan = document.getElementById("timer");
const puntajeSpan = document.getElementById("puntaje");

const btnVolver = document.getElementById("btn-volver");
const btnCorrecto = document.getElementById("btn-correcto");
const btnPasar = document.getElementById("btn-pasar");

const palabraWrapper = document.querySelector(".palabra-wrapper");


// ==============================
// POOL DE PALABRAS (SIN REPETIR)
// ==============================
function resetearPool() {
  if (estado.modoCharadas === "jugadores") {
    estado.poolActual = [...personas];
  } else if (estado.modoCharadas === "clubes") {
    estado.poolActual = [...clubesLUB];
  }
}

function obtenerNuevaPalabra() {
  if (!estado.modoCharadas) return "-";

  // Si el pool está vacío, se reinicia
  if (estado.poolActual.length === 0) {
    resetearPool();
  }

  const idx = Math.floor(Math.random() * estado.poolActual.length);
  const elemento = estado.poolActual.splice(idx, 1)[0];
  estado.actual = elemento;

  if (estado.modoCharadas === "jugadores") return elemento.nombre;
  if (estado.modoCharadas === "clubes") return elemento;

  return "-";
}

function actualizarPalabra() {
  palabraSpan.textContent = obtenerNuevaPalabra();
}


// ==============================
// UI TIEMPO / PUNTAJE
// ==============================
function actualizarUITiempo() {
  timerSpan.textContent = estado.tiempoRestante + "s";
}

function actualizarUIPuntaje() {
  puntajeSpan.textContent = estado.puntaje;
}

function feedbackVisual(tipo) {
  palabraWrapper.classList.remove(
    "palabra-wrapper--correcto",
    "palabra-wrapper--pasar"
  );

  if (tipo === "correcto") palabraWrapper.classList.add("palabra-wrapper--correcto");
  if (tipo === "pasar")    palabraWrapper.classList.add("palabra-wrapper--pasar");

  setTimeout(() => {
    palabraWrapper.classList.remove(
      "palabra-wrapper--correcto",
      "palabra-wrapper--pasar"
    );
  }, 220);
}


// ==============================
// RONDA / TIMER
// ==============================
function iniciarRonda() {
  estado.tiempoRestante = DURACION_RONDA_SEG;
  estado.puntaje = 0;

  actualizarUITiempo();
  actualizarUIPuntaje();

  if (estado.timerId) clearInterval(estado.timerId);

  estado.timerId = setInterval(() => {
    estado.tiempoRestante--;
    actualizarUITiempo();

    if (estado.tiempoRestante <= 0) {
      finalizarRonda();
    }
  }, 1000);

  resetearPool();
  actualizarPalabra();
}

function finalizarRonda() {
  clearInterval(estado.timerId);
  estado.timerId = null;

  estado.tiempoRestante = 0;
  actualizarUITiempo();
  palabraSpan.textContent = "¡Tiempo!";
}


// ==============================
// ACCIONES DEL JUEGO
// ==============================
function accionCorrecto() {
  if (estado.tiempoRestante <= 0) return;

  estado.puntaje += 10;
  actualizarUIPuntaje();
  feedbackVisual("correcto");
  actualizarPalabra();
}

function accionPasar() {
  if (estado.tiempoRestante <= 0) return;

  feedbackVisual("pasar");
  actualizarPalabra();
}


// ==============================
// CAMBIO DE PANTALLAS
// ==============================
function irAJuego(modo) {
  estado.modoCharadas = modo;

  modoLabel.textContent =
    modo === "jugadores" ? "Modo: Jugadores / DTs" :
    modo === "clubes"    ? "Modo: Clubes" :
                           "Modo: -";

  menuCharadas.classList.add("hidden");
  pantallaJuego.classList.remove("hidden");

  iniciarRonda();
  pedirPermisoMovimiento();
}

function volverAlMenuCharadas() {
  estado.modoCharadas = null;
  estado.actual = null;
  estado.poolActual = [];

  if (estado.timerId) clearInterval(estado.timerId);

  pantallaJuego.classList.add("hidden");
  menuCharadas.classList.remove("hidden");

  palabraSpan.textContent = "-";
  timerSpan.textContent = DURACION_RONDA_SEG + "s";
  puntajeSpan.textContent = "0";
  modoLabel.textContent = "Modo: -";
}


// ==============================
// SENSOR DE MOVIMIENTO
// ==============================
function pedirPermisoMovimiento() {
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    DeviceOrientationEvent.requestPermission()
      .then(resp => { if (resp === "granted") activarMovimiento(); })
      .catch(console.error);

  } else {
    activarMovimiento();
  }
}

function activarMovimiento() {
  if (estado.movimientoActivo) return;
  estado.movimientoActivo = true;

  let estadoGesto = "neutro";
  let ultimoGestoMs = 0;
  const COOLDOWN = 900;

  const UMBRAL_ARRIBA = 25;
  const UMBRAL_ABAJO = -25;
  const ZONA_NEUTRA = 10;

  window.addEventListener("deviceorientation", (event) => {
    if (estado.tiempoRestante <= 0) return;

    const gamma = event.gamma;
    if (gamma == null) return;

    const ahora = Date.now();
    if (ahora - ultimoGestoMs < COOLDOWN) return;

    if (gamma > -ZONA_NEUTRA && gamma < ZONA_NEUTRA) {
      estadoGesto = "neutro";
      return;
    }

    if (estadoGesto !== "neutro") return;

    if (gamma >= UMBRAL_ARRIBA) {
      estadoGesto = "arriba";
      ultimoGestoMs = ahora;
      accionCorrecto();
    }

    if (gamma <= UMBRAL_ABAJO) {
      estadoGesto = "abajo";
      ultimoGestoMs = ahora;
      accionPasar();
    }
  });
}


// ==============================
// EVENTOS DE BOTONES
// ==============================

// ➤ Entrar al modo charadas
btnIrCharadas.addEventListener("click", () => {
  menuPrincipal.classList.add("hidden");
  pantallaCharadas.classList.remove("hidden");
});

// ➤ Elegir Jugadores / Clubes
bloqueJugadores.addEventListener("click", () => irAJuego("jugadores"));
bloqueClubes.addEventListener("click", () => irAJuego("clubes"));

// ➤ Volver desde partida al menú interno
btnVolver.addEventListener("click", volverAlMenuCharadas);

// ➤ Botones Correcto / Pasar
btnCorrecto.addEventListener("click", accionCorrecto);
btnPasar.addEventListener("click", accionPasar);

// ➤ Volver al menú principal
btnVolverMenu.addEventListener("click", () => {
  pantallaCharadas.classList.add("hidden");
  menuPrincipal.classList.remove("hidden");
});


// ==============================
// SERVICE WORKER (opcional)
// ==============================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}




