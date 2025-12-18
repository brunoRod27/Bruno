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
// VISOR DE EQUIPOS (canchita por jugador)
// ==============================
const visorEquipos = document.getElementById("visor-equipos");
const cancha = document.getElementById("cancha");
const equipoTitulo = document.getElementById("equipo-titulo");
const btnEquipoAnterior = document.getElementById("btn-equipo-anterior");
const btnEquipoSiguiente = document.getElementById("btn-equipo-siguiente");

/*
  POSICIONES: x/y en % dentro de la cancha
  Si querés “acomodar”, tocás estos números.
  (Están separados para que en iPad no se pisen tanto)
*/
const POSICIONES = [
  { id: "base",      label: "Base",      x: 72, y: 36 },
  { id: "escolta",   label: "Escolta",   x: 20, y: 0},
  { id: "alero",     label: "Alero",     x: 20, y: 72 },
  { id: "alapivot",  label: "Ala-Pívot", x: 40, y: 25 },
  { id: "pivot",     label: "Pívot",     x: 22, y: 45 },
];

let equipoJugadorActual = 1;

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

function sub_slug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// ==============================
// Responsive bubbles (iPad/PC)
// ==============================
function ajustarEscalaBurbujas(){
  if (!cancha) return;

  const w = cancha.clientWidth;
  if (!w) return;

  // Tamaño relativo al ancho de la cancha
  // bubbleW: 15% a 18% aprox. con límites
  const bubbleW = Math.max(56, Math.min(92, Math.round(w * 0.17)));

  // ⬅️ Acá va lo que preguntabas:
  // 1.45 = más alta, entra bien el texto de posición
  const bubbleH = Math.round(bubbleW * 1.45);

  // Imagen: un poquito más chica proporcional para dejar aire al texto
  const imgH = Math.round(bubbleH * 0.54);

  cancha.style.setProperty("--bubble-w", bubbleW + "px");
  cancha.style.setProperty("--bubble-h", bubbleH + "px");
  cancha.style.setProperty("--img-h", imgH + "px");
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

  sub_contadorSpan.textContent = `Carta ${subastas.idxEnRonda + 1} / ${total}`;
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

  // ✅ registrar compra
  setRonda.add(comprador);

  subastas.compras.push({
    ronda: subastas.ronda,
    persona,
    comprador,
    monto
  });

  sub_cerrarModalCompra();
  sub_renderLog();

  // ✅ visor siempre visible + refresco del equipo del comprador
  if (visorEquipos) visorEquipos.classList.remove("hidden");
  renderCanchaParaComprador(comprador);

  // ✅ si ya compraron todos -> siguiente ronda (máx 5)
  if (setRonda.size >= subastas.cantJugadores) {
    subastas.ronda++;
    if (subastas.ronda > 5) {
      sub_finalizarSubastas();
      return;
    }
    sub_iniciarRonda();
    return;
  }

  // ✅ seguir con la siguiente carta en la misma ronda
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
}

// ==============================
// Drag + Snap + Swap (visor)
// ==============================
function habilitarDragSnapSwapVisor() {
  if (!cancha) return;

  const slotMap = {};
  POSICIONES.forEach(p => slotMap[p.id] = p);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function snapToSlot(el, slotId) {
    const s = slotMap[slotId];
    if (!s) return;

    el.dataset.slot = slotId;
    el.style.left = s.x + "%";
    el.style.top  = s.y + "%";

    const posLabel = el.querySelector(".ppos");
    if (posLabel) posLabel.textContent = s.label;
  }

  function distanciaPct(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  }

  function slotMasCercano(xPct, yPct) {
    let mejor = POSICIONES[0];
    let mejorDist = Infinity;

    for (const s of POSICIONES) {
      const d = distanciaPct(xPct, yPct, s.x, s.y);
      if (d < mejorDist) {
        mejorDist = d;
        mejor = s;
      }
    }
    return mejor;
  }

  cancha.querySelectorAll(".player-bubble").forEach(el => {
    el.style.touchAction = "none";

    el.addEventListener("pointerdown", e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
    });

    el.addEventListener("pointermove", e => {
      if (!el.classList.contains("dragging")) return;

      const rect = cancha.getBoundingClientRect();
      const halfW = el.offsetWidth / 2;
      const halfH = el.offsetHeight / 2;

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      x = clamp(x, halfW, rect.width - halfW);
      y = clamp(y, halfH, rect.height - halfH);

      el.style.left = (x / rect.width) * 100 + "%";
      el.style.top  = (y / rect.height) * 100 + "%";
    });

    el.addEventListener("pointerup", e => {
      if (!el.classList.contains("dragging")) return;

      const xPct = parseFloat(el.style.left);
      const yPct = parseFloat(el.style.top);

      const destino = slotMasCercano(xPct, yPct);
      const origenId = el.dataset.slot;

      const otro = Array.from(cancha.querySelectorAll(".player-bubble"))
        .find(o => o !== el && o.dataset.slot === destino.id);

      if (otro) snapToSlot(otro, origenId);
      snapToSlot(el, destino.id);

      el.classList.remove("dragging");
      el.releasePointerCapture(e.pointerId);
    });

    el.addEventListener("pointercancel", () => {
      el.classList.remove("dragging");
    });
  });
}

// ==============================
// Equipo -> cancha
// ==============================
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

  // posición inicial por slot
  el.dataset.slot = slot.id;
  el.style.left = slot.x + "%";
  el.style.top  = slot.y + "%";

  return el;
}

function getEquipoPorComprador(n){
  return subastas.compras
    .filter(c => c.comprador === n)
    .map(c => c.persona)
    .slice(0, 5);
}

function renderCanchaParaComprador(n){
  if (!visorEquipos || !cancha || !equipoTitulo) {
    console.error("Faltan elementos del visor en el HTML:", { visorEquipos, cancha, equipoTitulo });
    return;
  }

  // ✅ recalcular escala según tamaño real de la cancha
  ajustarEscalaBurbujas();

  equipoTitulo.textContent = `Equipo — Jugador ${n}`;
  cancha.innerHTML = "";

  const equipo = getEquipoPorComprador(n);

  for (let i = 0; i < 5; i++){
    const slot = POSICIONES[i];
    const jugador = equipo[i];
    if (!jugador) continue;

    const el = crearBubbleEquipo(jugador, slot);
    cancha.appendChild(el);
  }

  if (btnEquipoAnterior) btnEquipoAnterior.disabled = (n <= 1);
  if (btnEquipoSiguiente) btnEquipoSiguiente.disabled = (n >= subastas.cantJugadores);

  habilitarDragSnapSwapVisor();
}

// nav visor
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

// ==============================
// Navegación (pantallas)
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

    // ✅ mostrar visor desde el inicio
    if (visorEquipos) visorEquipos.classList.remove("hidden");
    equipoJugadorActual = 1;

    // render inicial (vacío) + escala correcta
    renderCanchaParaComprador(equipoJugadorActual);

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
// Recalcular escalas al cambiar tamaño/orientación
// ==============================
window.addEventListener("resize", () => {
  ajustarEscalaBurbujas();
  renderCanchaParaComprador(equipoJugadorActual);
});

window.addEventListener("orientationchange", () => {
  ajustarEscalaBurbujas();
  renderCanchaParaComprador(equipoJugadorActual);
});









