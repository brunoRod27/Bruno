// ==============================
// ESTADO DEL JUEGO
// ==============================
const estado = {
  modoCharadas: null,     // "jugadores" o "clubes"
  actual: null,           // guarda el objeto o string actual
  tiempoRestante: 0,      // en segundos
  puntaje: 0,             // 10 puntos por acierto
  timerId: null,          // id del setInterval
  movimientoActivo: false // para no activar dos veces el sensor
};

// ==============================
// REFERENCIAS AL DOM
// ==============================
const bloqueJugadores = document.getElementById("bloque-jugadores");
const bloqueClubes = document.getElementById("bloque-clubes");

const pantallaMenu = document.querySelector(".grid-opciones");
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
// FUNCIONES: PALABRAS
// ==============================
function obtenerNuevaPalabra() {
  if (estado.modoCharadas === "jugadores") {
    const i = Math.floor(Math.random() * personas.length);
    estado.actual = personas[i]; // objeto { nombre, club, etc }
    return estado.actual.nombre;
  }

  if (estado.modoCharadas === "clubes") {
    const i = Math.floor(Math.random() * clubesLUB.length);
    estado.actual = clubesLUB[i]; // string
    return estado.actual;
  }

  return "-";
}

function actualizarPalabra() {
  const palabra = obtenerNuevaPalabra();
  palabraSpan.textContent = palabra;
}

// ==============================
// FUNCIONES: UI PUNTAJE / TIEMPO
// ==============================
function actualizarUITiempo() {
  timerSpan.textContent = estado.tiempoRestante + "s";
}

function actualizarUIPuntaje() {
  puntajeSpan.textContent = estado.puntaje;
}

function feedbackVisual(tipo) {
  if (!palabraWrapper) return;

  palabraWrapper.classList.remove(
    "palabra-wrapper--correcto",
    "palabra-wrapper--pasar"
  );

  if (tipo === "correcto") {
    palabraWrapper.classList.add("palabra-wrapper--correcto");
  } else if (tipo === "pasar") {
    palabraWrapper.classList.add("palabra-wrapper--pasar");
  }

  setTimeout(() => {
    palabraWrapper.classList.remove(
      "palabra-wrapper--correcto",
      "palabra-wrapper--pasar"
    );
  }, 220);
}

// ==============================
// FUNCIONES: RONDA / TIMER
// ==============================
function iniciarRonda() {
  estado.tiempoRestante = 40; // límite de 40 segundos
  estado.puntaje = 0;
  actualizarUITiempo();
  actualizarUIPuntaje();

  if (estado.timerId !== null) {
    clearInterval(estado.timerId);
  }

  estado.timerId = setInterval(() => {
    estado.tiempoRestante--;
    actualizarUITiempo();

    if (estado.tiempoRestante <= 0) {
      finalizarRonda();
    }
  }, 1000);

  actualizarPalabra();
}

function finalizarRonda() {
  if (estado.timerId !== null) {
    clearInterval(estado.timerId);
    estado.timerId = null;
  }

  estado.tiempoRestante = 0;
  actualizarUITiempo();
  palabraSpan.textContent = "¡Tiempo!";
}

// ==============================
// FUNCIONES: ACCIONES DEL JUEGO
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

  if (modo === "jugadores") {
    modoLabel.textContent = "Modo: Jugadores / DTs";
  } else if (modo === "clubes") {
    modoLabel.textContent = "Modo: Clubes";
  } else {
    modoLabel.textContent = "Modo: -";
  }

  pantallaMenu.classList.add("hidden");
  pantallaJuego.classList.remove("hidden");

  iniciarRonda();
  pedirPermisoMovimiento();
}

function volverAlMenu() {
  estado.modoCharadas = null;
  estado.actual = null;

  if (estado.timerId !== null) {
    clearInterval(estado.timerId);
    estado.timerId = null;
  }

  palabraSpan.textContent = "-";
  timerSpan.textContent = "40s";
  puntajeSpan.textContent = "0";
  modoLabel.textContent = "Modo: -";

  pantallaJuego.classList.add("hidden");
  pantallaMenu.classList.remove("hidden");
}

// ==============================
// CONTROL POR MOVIMIENTO (TILT)
// ==============================
function pedirPermisoMovimiento() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((resp) => {
        if (resp === "granted") {
          activarMovimiento();
        } else {
          console.warn("No se otorgó permiso para el movimiento.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    activarMovimiento();
  }
}

function activarMovimiento() {
  if (estado.movimientoActivo) return;
  estado.movimientoActivo = true;

  let estadoGesto = "neutro";
  let ultimoGestoMs = 0;
  const COOLDOWN_MS = 900;

  // gamma = inclinación IZQ/DERECHA del teléfono,
  // pero cuando lo sostenés horizontal, se convierte en ARRIBA/ABAJO
  const UMBRAL_ARRIBA = 25;   // hacia tu cara (arriba)
  const UMBRAL_ABAJO = -25;   // hacia adelante (abajo)
  const ZONA_NEUTRA = 10;     // rango sin activar gestos

  window.addEventListener("deviceorientation", (event) => {
    if (estado.tiempoRestante <= 0) return;

    const gamma = event.gamma;  // eje que realmente funciona bien
    if (gamma == null) return;

    const ahora = Date.now();

    // Cooldown: no permitir gestos demasiado seguidos
    if (ahora - ultimoGestoMs < COOLDOWN_MS) return;

    // Volvió a neutro
    if (gamma > -ZONA_NEUTRA && gamma < ZONA_NEUTRA) {
      estadoGesto = "neutro";
      return;
    }

    // Ya hicimos un gesto y no volvió a neutro
    if (estadoGesto !== "neutro") return;

    // ARRIBA → gamma POSITIVO
    if (gamma >= UMBRAL_ARRIBA) {
      estadoGesto = "arriba";
      ultimoGestoMs = ahora;
      accionCorrecto();   // 🟢 CORRECTO
      return;
    }

    // ABAJO → gamma NEGATIVO
    if (gamma <= UMBRAL_ABAJO) {
      estadoGesto = "abajo";
      ultimoGestoMs = ahora;
      accionPasar();      // ⏭️ PASAR
      return;
    }
  });
}


// ==============================
// EVENTOS DE BOTONES
// ==============================
bloqueJugadores.addEventListener("click", () => {
  irAJuego("jugadores");
});

bloqueClubes.addEventListener("click", () => {
  irAJuego("clubes");
});

btnVolver.addEventListener("click", () => {
  volverAlMenu();
});

btnCorrecto.addEventListener("click", () => {
  accionCorrecto();
});

btnPasar.addEventListener("click", () => {
  accionPasar();
});

// ==============================
// SERVICE WORKER (opcional)
// ==============================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        console.log("Service Worker registrado correctamente");
      })
      .catch((err) => {
        console.error("Error registrando el Service Worker", err);
      });
  });
}


