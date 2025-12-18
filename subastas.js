// ==============================
// SUBASTAS - Estado
// ==============================
const subastas = {
  cantJugadores: 0,
  ronda: 1,
  idxEnRonda: 0,
  ordenRonda: [],
  compras: [],                 // { ronda, persona, comprador, monto }
  compradoresRonda: {}         // { [ronda]: Set() }
};

// ==============================
// DOM
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
// MODAL COMPRA
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
  sub_selectComprador.innerHTML = "";
  for (let i = 1; i <= cant; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Jugador ${i}`;
    sub_selectComprador.appendChild(opt);
  }
}

// ==============================
// Modal
// ==============================
function sub_abrirModalCompra() {
  sub_inputMonto.value = "";
  sub_modalCompra.classList.remove("hidden");
  setTimeout(() => sub_inputMonto.focus(), 50);
}

function sub_cerrarModalCompra() {
  sub_modalCompra.classList.add("hidden");
}

// ==============================
// Flujo de juego
// ==============================
function sub_iniciarRonda() {
  sub_rondaLabel.textContent = `Ronda ${subastas.ronda}`;

  subastas.idxEnRonda = 0;
  subastas.ordenRonda = sub_mezclar(personas);

  if (!subastas.compradoresRonda[subastas.ronda]) {
    subastas.compradoresRonda[subastas.ronda] = new Set();
  }

  sub_mostrarActual();
}

function sub_mostrarActual() {
  const total = subastas.ordenRonda.length;

  if (subastas.idxEnRonda >= total) {
    subastas.idxEnRonda = 0;
  }

  const persona = subastas.ordenRonda[subastas.idxEnRonda];

  sub_contadorSpan.textContent = `Jugador ${subastas.idxEnRonda + 1} / ${total}`;
  sub_subastaNombre.textContent = persona.nombre;
  sub_subastaClub.textContent = persona.club || "-";

  const src = sub_rutaFotoPersona(persona);
  sub_subastaFoto.classList.remove("hidden");
  sub_subastaSinFoto.classList.add("hidden");
  sub_subastaFoto.src = src;

  sub_subastaFoto.onerror = () => {
    sub_subastaFoto.classList.add("hidden");
    sub_subastaSinFoto.classList.remove("hidden");
    sub_subastaSinFoto.textContent = "SIN FOTO";
  };
}

function sub_pasarSiguiente() {
  subastas.idxEnRonda++;
  sub_mostrarActual();
}

function sub_comprarActual() {
  sub_abrirModalCompra();
}

function sub_confirmarCompraDesdeModal() {
  const persona = subastas.ordenRonda[subastas.idxEnRonda];
  const comprador = Number(sub_selectComprador.value);
  const monto = Number(String(sub_inputMonto.value).replace(",", "."));

  if (!Number.isInteger(comprador) || comprador < 1 || comprador > subastas.cantJugadores) {
    alert("Comprador inválido.");
    return;
  }

  if (!Number.isFinite(monto) || monto < 0) {
    alert("Monto inválido.");
    return;
  }

  const setRonda = subastas.compradoresRonda[subastas.ronda];

  if (setRonda.has(comprador)) {
    alert(`El Jugador ${comprador} ya compró en esta ronda.`);
    return;
  }

  setRonda.add(comprador);

  subastas.compras.push({
    ronda: subastas.ronda,
    persona,
    comprador,
    monto
  });

  sub_renderLog();
  sub_cerrarModalCompra();

  // si ya compraron todos → siguiente ronda
  if (setRonda.size >= subastas.cantJugadores) {
    subastas.ronda++;
    if (subastas.ronda > 5) {
      sub_finalizarSubastas();
      return;
    }
    sub_iniciarRonda();
    return;
  }

  sub_pasarSiguiente();
}

function sub_renderLog() {
  if (subastas.compras.length === 0) {
    sub_subastasLog.textContent = "";
    return;
  }

  const ultimas = subastas.compras.slice(-6).reverse();
  sub_subastasLog.innerHTML =
    `<div style="margin-bottom:6px;font-weight:700;">Últimas compras:</div>` +
    ultimas.map(c =>
      `• R${c.ronda}: ${c.persona.nombre} — Jugador ${c.comprador} — $${c.monto}`
    ).join("<br/>");
}

function sub_finalizarSubastas() {
  sub_rondaLabel.textContent = "Subastas finalizadas";
  sub_contadorSpan.textContent = "";

  // en vez de mostrar FIN, mostramos canchitas
  mostrarVisorEquipos();
}


// ==============================
// Navegación
// ==============================
sub_btnIrSubastas.addEventListener("click", () => {
  sub_menuPrincipal.classList.add("hidden");
  sub_pantallaCharadas.classList.add("hidden");
  sub_pantallaSubastas.classList.remove("hidden");

  sub_configSubastas.classList.remove("hidden");
  sub_juegoSubastas.classList.add("hidden");
});

sub_btnVolverMenuSubastas.addEventListener("click", () => {
  sub_pantallaSubastas.classList.add("hidden");
  sub_menuPrincipal.classList.remove("hidden");
});

// ==============================
// Config cantidad jugadores
// ==============================
document.querySelectorAll("#config-subastas .btn-primario").forEach(btn => {
  btn.addEventListener("click", () => {
    subastas.cantJugadores = Number(btn.dataset.cant);

    subastas.ronda = 1;
    subastas.compras = [];
    subastas.compradoresRonda = {};

    sub_setSelectCompradores(subastas.cantJugadores);

    sub_configSubastas.classList.add("hidden");
    sub_juegoSubastas.classList.remove("hidden");

    sub_btnPasar.disabled = false;
    sub_btnComprar.disabled = false;

    sub_renderLog();
    sub_iniciarRonda();
  });
});

// ==============================
// Botones
// ==============================
sub_btnPasar.addEventListener("click", sub_pasarSiguiente);
sub_btnComprar.addEventListener("click", sub_comprarActual);

sub_btnCancelarCompra.addEventListener("click", sub_cerrarModalCompra);
sub_modalBackdrop.addEventListener("click", sub_cerrarModalCompra);
sub_btnConfirmarCompra.addEventListener("click", sub_confirmarCompraDesdeModal);

sub_inputMonto.addEventListener("keydown", e => {
  if (e.key === "Enter") sub_confirmarCompraDesdeModal();
  if (e.key === "Escape") sub_cerrarModalCompra();
});

// ==============================
// VISOR DE EQUIPOS (canchita por jugador)
// ==============================

const visorEquipos = document.getElementById("visor-equipos");
const cancha = document.getElementById("cancha");
const equipoTitulo = document.getElementById("equipo-titulo");
const btnEquipoAnterior = document.getElementById("btn-equipo-anterior");
const btnEquipoSiguiente = document.getElementById("btn-equipo-siguiente");

const POSICIONES = [
  { id: "base",      label: "Base",      x: 28, y: 55 },
  { id: "escolta",   label: "Escolta",   x: 40, y: 35 },
  { id: "alero",     label: "Alero",     x: 55, y: 30 },
  { id: "alapivot",  label: "Ala-Pívot", x: 62, y: 48 },
  { id: "pivot",     label: "Pívot",     x: 70, y: 63 },
];

let equipoJugadorActual = 1;
let bubbles = []; // [{el, slotId, jugador}]

function sub_slug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function setPosPercent(el, xPct, yPct){
  el.style.left = xPct + "%";
  el.style.top  = yPct + "%";
}

function crearBubbleEquipo(jugador, slot){
  const el = document.createElement("div");
  el.className = "player-bubble";
  el.innerHTML = `
    <img alt="${jugador.nombre}" />
    <div class="pname">${jugador.nombre}</div>
    <div class="ppos">${slot.label}</div>
  `;

  const img = el.querySelector("img");
  img.src = `img/${sub_slug(jugador.nombre)}.png`;
  img.onerror = () => {
    img.onerror = null;
    img.src = "img/jugadores.png"; // fallback
  };

  setPosPercent(el, slot.x, slot.y);

  // (Opcional) acá después metemos drag & swap, si querés.
  return el;
}

// Devuelve array de personas compradas por ese comprador (en orden de compra)
function getEquipoPorComprador(n){
  return subastas.compras
    .filter(c => c.comprador === n)
    .map(c => c.persona)
    .slice(0, 5);
}

function renderCanchaParaComprador(n){
  if (!visorEquipos || !cancha) return;

  equipoTitulo.textContent = `Equipo — Jugador ${n}`;
  cancha.innerHTML = "";
  bubbles = [];

  const equipo = getEquipoPorComprador(n);

  for (let i=0; i<5; i++){
    const slot = POSICIONES[i];
    const jugador = equipo[i];

    if (!jugador) {
      // si falta jugador, no dibujamos bubble (queda vacío ese puesto)
      continue;
    }

    const el = crearBubbleEquipo(jugador, slot);
    cancha.appendChild(el);
    bubbles.push({ el, slotId: slot.id, jugador });
  }

  // habilitar/deshabilitar nav
  btnEquipoAnterior.disabled = (n <= 1);
  btnEquipoSiguiente.disabled = (n >= subastas.cantJugadores);
}

function mostrarVisorEquipos(){
  // ocultar juego subastas (la card FIN, botones pasar/comprar, etc)
  if (sub_juegoSubastas) sub_juegoSubastas.classList.add("hidden");
  if (visorEquipos) visorEquipos.classList.remove("hidden");

  equipoJugadorActual = 1;
  renderCanchaParaComprador(equipoJugadorActual);
}

// nav
if (btnEquipoAnterior){
  btnEquipoAnterior.addEventListener("click", () => {
    if (equipoJugadorActual <= 1) return;
    equipoJugadorActual--;
    renderCanchaParaComprador(equipoJugadorActual);
  });
}

if (btnEquipoSiguiente){
  btnEquipoSiguiente.addEventListener("click", () => {
    if (equipoJugadorActual >= subastas.cantJugadores) return;
    equipoJugadorActual++;
    renderCanchaParaComprador(equipoJugadorActual);
  });
}





