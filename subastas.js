// ==============================
// SUBASTAS - Estado
// ==============================
const subastas = {
  cantJugadores: 0,
  ronda: 1,
  idxEnRonda: 0,
  ordenRonda: [],
  compras: [] // {ronda, persona, monto, comprador}
};

// ==============================
// DOM (prefijo sub_ para no chocar con charadas.js)
// ==============================
const sub_btnIrSubastas = document.getElementById("btn-ir-subastas");
const sub_pantallaSubastas = document.getElementById("pantalla-subastas");
const sub_btnVolverMenuSubastas = document.getElementById("btn-volver-menu-subastas");

const sub_configSubastas = document.getElementById("config-subastas");
const sub_juegoSubastas = document.getElementById("juego-subastas");

const sub_rondaLabel = document.getElementById("ronda-label");
const sub_contadorSpan = document.getElementById("subastas-contador");

const sub_subastaFoto = document.getElementById("subasta-foto");
const sub_subastaSinFoto = document.getElementById("subasta-sin-foto");
const sub_subastaNombre = document.getElementById("subasta-nombre");
const sub_subastaClub = document.getElementById("subasta-club");

const sub_btnPasar = document.getElementById("btn-subasta-pasar");
const sub_btnComprar = document.getElementById("btn-subasta-comprar");

const sub_subastasLog = document.getElementById("subastas-log");

// pantallas principales
const sub_menuPrincipal = document.getElementById("menu-principal");
const sub_pantallaCharadas = document.getElementById("pantalla-charadas");

// ==============================
// MODAL COMPRA (nuevo)
// ==============================
const sub_modalCompra = document.getElementById("modal-compra");
const sub_modalBackdrop = document.getElementById("modal-compra-backdrop");
const sub_selectComprador = document.getElementById("compra-comprador");
const sub_inputMonto = document.getElementById("compra-monto");
const sub_btnCancelarCompra = document.getElementById("btn-compra-cancelar");
const sub_btnConfirmarCompra = document.getElementById("btn-compra-confirmar");

// ==============================
// Helpers
// ==============================
function sub_slugifyNombre(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function sub_rutaFotoPersona(persona) {
  return `img/${sub_slugifyNombre(persona.nombre)}.png`;
}

function sub_mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function sub_setSelectCompradores(cant) {
  if (!sub_selectComprador) return;

  sub_selectComprador.innerHTML = "";
  for (let i = 1; i <= cant; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `Jugador ${i}`;
    sub_selectComprador.appendChild(opt);
  }
}

function sub_abrirModalCompra() {
  if (!sub_modalCompra) return;

  sub_inputMonto.value = "";
  sub_modalCompra.classList.remove("hidden");
  sub_modalCompra.setAttribute("aria-hidden", "false");

  // enfocar para que salga teclado numérico en móvil
  setTimeout(() => {
    sub_inputMonto.focus();
  }, 50);
}

function sub_cerrarModalCompra() {
  if (!sub_modalCompra) return;

  sub_modalCompra.classList.add("hidden");
  sub_modalCompra.setAttribute("aria-hidden", "true");
}

// ==============================
// Flujo juego
// ==============================
function sub_iniciarRonda() {
  sub_rondaLabel.textContent = `Ronda ${subastas.ronda}`;

  subastas.idxEnRonda = 0;
  subastas.ordenRonda = sub_mezclar(personas); // personas viene de datos.js

  sub_mostrarActual();
}

function sub_mostrarActual() {
  const total = subastas.ordenRonda.length;
  const i = subastas.idxEnRonda;

  if (i >= total) {
    subastas.ronda++;
    if (subastas.ronda > 5) {
      sub_finalizarSubastas();
      return;
    }
    sub_iniciarRonda();
    return;
  }

  const persona = subastas.ordenRonda[i];
  sub_contadorSpan.textContent = `Jugador ${i + 1} / ${total}`;

  sub_subastaNombre.textContent = persona.nombre;
  sub_subastaClub.textContent = persona.club ? persona.club : "-";

  const src = sub_rutaFotoPersona(persona);

  sub_subastaFoto.classList.remove("hidden");
  sub_subastaSinFoto.classList.add("hidden");
  sub_subastaFoto.src = src;

  sub_subastaFoto.onerror = () => {
    sub_subastaFoto.onerror = null;
    sub_subastaFoto.classList.add("hidden");
    sub_subastaSinFoto.classList.remove("hidden");
    sub_subastaSinFoto.textContent = "SIN FOTO";
  };
}

function sub_pasarSiguiente() {
  subastas.idxEnRonda++;
  sub_mostrarActual();
}

// antes era prompt(), ahora abrimos modal
function sub_comprarActual() {
  const persona = subastas.ordenRonda[subastas.idxEnRonda];
  if (!persona) return;
  if (subastas.cantJugadores <= 0) return;

  sub_abrirModalCompra();
}

function sub_confirmarCompraDesdeModal() {
  const persona = subastas.ordenRonda[subastas.idxEnRonda];
  if (!persona) return;

  const comprador = Number(sub_selectComprador.value);
  const monto = Number(String(sub_inputMonto.value).replace(",", "."));

  if (!Number.isFinite(comprador) || comprador < 1 || comprador > subastas.cantJugadores) {
    alert("Comprador inválido.");
    return;
  }

  if (!Number.isFinite(monto) || monto < 0) {
    alert("Monto inválido.");
    return;
  }

  subastas.compras.push({
    ronda: subastas.ronda,
    persona,
    comprador,
    monto
  });

  sub_renderLog();
  sub_cerrarModalCompra();
  sub_pasarSiguiente();
}

function sub_renderLog() {
  if (!sub_subastasLog) return;

  if (subastas.compras.length === 0) {
    sub_subastasLog.textContent = "";
    return;
  }

  const ultimas = subastas.compras.slice(-6).reverse();
  sub_subastasLog.innerHTML =
    `<div style="margin-bottom:6px;font-weight:700;">Últimas compras:</div>` +
    ultimas
      .map(c => `• R${c.ronda}: ${c.persona.nombre} — Jugador ${c.comprador} — $${c.monto}`)
      .join("<br/>");
}

function sub_finalizarSubastas() {
  sub_rondaLabel.textContent = "Subastas finalizadas";
  sub_contadorSpan.textContent = "";

  sub_subastaNombre.textContent = "-";
  sub_subastaClub.textContent = "-";
  sub_subastaFoto.classList.add("hidden");
  sub_subastaSinFoto.classList.remove("hidden");
  sub_subastaSinFoto.textContent = "FIN";

  sub_btnPasar.disabled = true;
  sub_btnComprar.disabled = true;

  sub_renderLog();
}

// ==============================
// Navegación (ENTRAR / SALIR)
// ==============================
if (sub_btnIrSubastas) {
  sub_btnIrSubastas.addEventListener("click", () => {
    if (sub_menuPrincipal) sub_menuPrincipal.classList.add("hidden");
    if (sub_pantallaCharadas) sub_pantallaCharadas.classList.add("hidden");
    if (sub_pantallaSubastas) sub_pantallaSubastas.classList.remove("hidden");

    // al entrar: mostrar config
    if (sub_configSubastas) sub_configSubastas.classList.remove("hidden");
    if (sub_juegoSubastas) sub_juegoSubastas.classList.add("hidden");
  });
}

if (sub_btnVolverMenuSubastas) {
  sub_btnVolverMenuSubastas.addEventListener("click", () => {
    if (sub_pantallaSubastas) sub_pantallaSubastas.classList.add("hidden");
    if (sub_menuPrincipal) sub_menuPrincipal.classList.remove("hidden");
  });
}

// ==============================
// Config cantidad jugadores
// ==============================
document.querySelectorAll("#config-subastas .btn-primario").forEach((btn) => {
  btn.addEventListener("click", () => {
    subastas.cantJugadores = Number(btn.dataset.cant);

    sub_configSubastas.classList.add("hidden");
    sub_juegoSubastas.classList.remove("hidden");

    subastas.ronda = 1;
    subastas.compras = [];

    sub_btnPasar.disabled = false;
    sub_btnComprar.disabled = false;

    sub_setSelectCompradores(subastas.cantJugadores);

    sub_renderLog();
    sub_iniciarRonda();
  });
});

// ==============================
// Botones juego
// ==============================
if (sub_btnPasar) sub_btnPasar.addEventListener("click", sub_pasarSiguiente);
if (sub_btnComprar) sub_btnComprar.addEventListener("click", sub_comprarActual);

// ==============================
// Modal eventos
// ==============================
if (sub_modalBackdrop) sub_modalBackdrop.addEventListener("click", sub_cerrarModalCompra);
if (sub_btnCancelarCompra) sub_btnCancelarCompra.addEventListener("click", sub_cerrarModalCompra);
if (sub_btnConfirmarCompra) sub_btnConfirmarCompra.addEventListener("click", sub_confirmarCompraDesdeModal);

// Enter para confirmar (cómodo en PC)
if (sub_inputMonto) {
  sub_inputMonto.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sub_confirmarCompraDesdeModal();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      sub_cerrarModalCompra();
    }
  });
}




