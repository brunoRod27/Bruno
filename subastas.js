// ==============================
// SUBASTAS - Estado
// ==============================
const subastas = {
  cantJugadores: 0,
  ronda: 1,
  idxEnRonda: 0,
  ordenRonda: [],
  compras: [],                 // { ronda, persona, comprador, monto }
  compradoresRonda: {},        // { [ronda]: Set() }
  formaciones: {}, 
              // { [jugador]: { [slotId]: persona } }
pool: [],          // cartas disponibles (sin repetir)
usados: new Set(), // nombres ya mostrados (backup)

  // ✅ Presupuestos
  presupuestoInicial: 100000,  // <- cambiá este número si querés
  saldos: {},                  // { [jugador]: number }

  // ✅ Control de rondas / pases
  pasesEnRonda: 0,
  maxPasesPorRonda: 2,         // <- solo 2 pases por ronda
  cartasPorRonda: 0            // <- se setea como cantJugadores + 2
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
const sub_subastaPrecio = document.getElementById("subasta-precio");

const sub_btnPasar = document.getElementById("btn-subasta-pasar");
const sub_btnComprar = document.getElementById("btn-subasta-comprar");

const sub_subastasLog = document.getElementById("subastas-log");

// ✅ panel presupuestos (agregá el div en el HTML)
const sub_presupuestosBox = document.getElementById("subastas-presupuestos");

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
*/
const POSICIONES = [
  { id: "base",      label: "Base",      x: 72, y: 36 },
  { id: "escolta",   label: "Escolta",   x: 20, y: 0  },
  { id: "alero",     label: "Alero",     x: 20, y: 72 },
  { id: "alapivot",  label: "Ala-Pívot", x: 40, y: 25 },
  { id: "pivot",     label: "Pívot",     x: 22, y: 45 },
];

let equipoJugadorActual = 1;

// ==============================
// Helpers
// ==============================
function sub_slugifyNombre(nombre) {
  return String(nombre || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function sub_rutaFotoPersona(persona) {
  return `img/jugadores-lub/${sub_slugifyNombre(persona.nombre)}.png`;
}

function sub_mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function sub_setSelectCompradores(cant) {
  if (!sub_selectComprador) return;
  sub_selectComprador.innerHTML = "";
  for (let i = 1; i <= cant; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Jugador ${i}`;
    sub_selectComprador.appendChild(opt);
  }
}

// ==============================
// ✅ Presupuestos
// ==============================
function sub_initSaldos() {
  subastas.saldos = {};
  for (let i = 1; i <= subastas.cantJugadores; i++) {
    subastas.saldos[i] = subastas.presupuestoInicial;
  }
  sub_renderSaldos();
}

function sub_renderSaldos() {
  if (!sub_presupuestosBox) return;

  let html = `<div style="font-weight:700; margin-bottom:6px;">Plata por jugador:</div>`;
  for (let i = 1; i <= subastas.cantJugadores; i++) {
    const s = Number(subastas.saldos[i] ?? 0);
    html += `• Jugador ${i}: $${s.toLocaleString("es-UY")}<br/>`;
  }
  sub_presupuestosBox.innerHTML = html;
}

// ==============================
// Responsive bubbles (iPad/PC)
// ==============================
function ajustarEscalaBurbujas(){
  if (!cancha) return;

  const w = cancha.clientWidth;
  if (!w) return;

  const bubbleW = Math.max(56, Math.min(92, Math.round(w * 0.17)));
  const bubbleH = Math.round(bubbleW * 1.45);
  const imgH = Math.round(bubbleH * 0.54);

  cancha.style.setProperty("--bubble-w", bubbleW + "px");
  cancha.style.setProperty("--bubble-h", bubbleH + "px");
  cancha.style.setProperty("--img-h", imgH + "px");
}

// ==============================
// Modal
// ==============================
function sub_abrirModalCompra() {
  if (!sub_modalCompra) return;
  if (sub_inputMonto) sub_inputMonto.value = "";
  sub_modalCompra.classList.remove("hidden");
  setTimeout(() => sub_inputMonto && sub_inputMonto.focus(), 50);
}

function sub_cerrarModalCompra() {
  if (!sub_modalCompra) return;
  sub_modalCompra.classList.add("hidden");
}

// ==============================
// FORMACIONES (persisten al cambiar equipo)
// ==============================
function sub_getFormacion(n){
  if (!subastas.formaciones[n]) subastas.formaciones[n] = {};
  return subastas.formaciones[n];
}

function sub_agregarAFormacion(n, persona){
  const form = sub_getFormacion(n);

  // ✅ si ya está en algún slot, no lo agrego de nuevo
  const yaEsta = Object.values(form).some(p => p && p.nombre === persona.nombre);
  if (yaEsta) return;

  for (const slot of POSICIONES){
    if (!form[slot.id]) {
      form[slot.id] = persona;
      return;
    }
  }
}

function sub_swapSlots(n, origenId, destinoId){
  if (!origenId || !destinoId || origenId === destinoId) return;

  const form = sub_getFormacion(n);
  const a = form[origenId];
  if (!a) return;

  const b = form[destinoId];
  form[destinoId] = a;

  if (b) form[origenId] = b;
  else delete form[origenId];
}

// Mete en slots vacíos las compras del jugador (sin duplicar)
function sub_syncFormacionConCompras(n){
  const form = sub_getFormacion(n);
  const equipo = getEquipoPorComprador(n);

  for (const persona of equipo){
    const yaEsta = Object.values(form).some(p => p && p.nombre === persona.nombre);
    if (yaEsta) continue;

    for (const slot of POSICIONES){
      if (!form[slot.id]) {
        form[slot.id] = persona;
        break;
      }
    }
  }
}

// ==============================
// Flujo de subastas
// ==============================
function sub_iniciarRonda() {
  sub_rondaLabel.textContent = `Ronda ${subastas.ronda}`;

  subastas.idxEnRonda = 0;

  // por ronda: 2 + X
  subastas.cartasPorRonda = (subastas.cantJugadores || 0) + 2;

  // solo 2 pases por ronda
  subastas.pasesEnRonda = 0;

  // si no hay pool todavía, lo inicializo con TODAS las personas (mezcladas)
  if (!Array.isArray(subastas.pool) || subastas.pool.length === 0) {
    subastas.pool = sub_mezclar(personas);
    subastas.usados = new Set();
  }

  // armo la ronda sacando del pool (no vuelven a aparecer)
  const cant = Math.min(subastas.cartasPorRonda, subastas.pool.length);
  subastas.ordenRonda = subastas.pool.splice(0, cant);

  // marco como usados (por si querés debug o validación extra)
  subastas.ordenRonda.forEach(p => subastas.usados.add(p.nombre));

  if (!subastas.compradoresRonda[subastas.ronda]) {
    subastas.compradoresRonda[subastas.ronda] = new Set();
  }

  if (subastas.ordenRonda.length === 0) {
    sub_finalizarSubastas();
    return;
  }

  sub_mostrarActual();
}


function sub_mostrarActual() {
  const total = subastas.ordenRonda.length;
  if (total === 0) return;

  // ✅ si por algún motivo te fuiste al final, remezclo un nuevo lote
  if (subastas.idxEnRonda >= total) {
    const lote = sub_mezclar(personas);
    subastas.ordenRonda = lote.slice(0, Math.min(subastas.cartasPorRonda, lote.length));
    subastas.idxEnRonda = 0;
  }

  const persona = subastas.ordenRonda[subastas.idxEnRonda];
  const precio = Number.isFinite(persona.precioBase) ? persona.precioBase : 1;

  sub_contadorSpan.textContent = `Carta ${subastas.idxEnRonda + 1} / ${total}`;
  sub_subastaNombre.textContent = persona.nombre;

  // Texto debajo
  sub_subastaClub.textContent = `${persona.club || "-"} • ${persona.rol || "-"}`;

  // Costadito
  if (sub_subastaPrecio) sub_subastaPrecio.textContent = `Base: $${precio}`;

  // Foto
  const src = sub_rutaFotoPersona(persona);

  sub_subastaFoto.onerror = null;
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
  // ✅ máximo 2 pases por ronda
  if (subastas.pasesEnRonda >= subastas.maxPasesPorRonda) {
    alert("Ya se pasaron 2 jugadores en esta ronda. Ahora alguien está obligado a comprar.");
    return;
  }

  subastas.pasesEnRonda++;
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
    sub_cerrarModalCompra();
    return;
  }

  if (!Number.isFinite(monto) || monto < 0) {
    alert("Monto inválido.");
    sub_cerrarModalCompra();
    return;
  }

  const setRonda = subastas.compradoresRonda[subastas.ronda];

  // ✅ si ya compró en la ronda, no hacemos nada más
  if (setRonda.has(comprador)) {
    alert(`El Jugador ${comprador} ya compró en esta ronda.`);
    sub_cerrarModalCompra();
    return;
  }

  const precioBase = Number.isFinite(persona.precioBase) ? persona.precioBase : 1;
  if (monto < precioBase) {
    alert(`El mínimo para ${persona.nombre} es $${precioBase}`);
    sub_cerrarModalCompra();
    return;
  }

  // ✅ presupuesto: validar saldo
  const saldoActual = Number(subastas.saldos[comprador] ?? 0);
  if (monto > saldoActual) {
    alert(`El Jugador ${comprador} no tiene saldo suficiente. Le quedan $${saldoActual}.`);
    sub_cerrarModalCompra();
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

  // ✅ descontar saldo + render
  subastas.saldos[comprador] = saldoActual - monto;
  sub_renderSaldos();

  // ✅ agregar a formación del comprador
  sub_agregarAFormacion(comprador, persona);

  sub_cerrarModalCompra();
  sub_renderLog();

  // ✅ visor visible + mostrar equipo del comprador
  if (visorEquipos) visorEquipos.classList.remove("hidden");
  equipoJugadorActual = comprador;
  renderCanchaParaComprador(equipoJugadorActual);

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

  // ✅ seguir con la siguiente carta
  subastas.idxEnRonda++;
  sub_mostrarActual();
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
    ultimas.map(c =>
      `• R${c.ronda}: ${c.persona.nombre} — Jugador ${c.comprador} — $${c.monto}`
    ).join("<br/>");
}

function sub_finalizarSubastas() {
  sub_rondaLabel.textContent = "Subastas finalizadas";
  sub_contadorSpan.textContent = "";
}

// ==============================
// VISOR: bubbles
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
  img.src = `img/jugadores-lub/${sub_slugifyNombre(jugador.nombre)}.png`;
  img.onerror = () => {
    img.onerror = null;
    img.src = "img/jugadores-lub/jugadores.png";
  };

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
  equipoJugadorActual = n;

  if (!visorEquipos || !cancha || !equipoTitulo) {
    console.error("Faltan elementos del visor en el HTML:", { visorEquipos, cancha, equipoTitulo });
    return;
  }

  ajustarEscalaBurbujas();

  equipoTitulo.textContent = `Equipo — Jugador ${n}`;
  cancha.innerHTML = "";

  // ✅ importante: sincroniza formaciones con compras sin duplicar
  sub_syncFormacionConCompras(n);

  const form = sub_getFormacion(n);

  for (let i = 0; i < 5; i++){
    const slot = POSICIONES[i];
    const jugador = form[slot.id];
    if (!jugador) continue;
    cancha.appendChild(crearBubbleEquipo(jugador, slot));
  }

  if (btnEquipoAnterior) btnEquipoAnterior.disabled = (n <= 1);
  if (btnEquipoSiguiente) btnEquipoSiguiente.disabled = (n >= subastas.cantJugadores);

  habilitarDragSnapSwapVisor();
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

      // swap visual
      if (otro) snapToSlot(otro, origenId);
      snapToSlot(el, destino.id);

      // swap guardado
      sub_swapSlots(equipoJugadorActual, origenId, destino.id);

      el.classList.remove("dragging");
      el.releasePointerCapture(e.pointerId);
    });

    el.addEventListener("pointercancel", () => {
      el.classList.remove("dragging");
    });
  });
}

// ==============================
// Navegación visor
// ==============================
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
// Navegación pantallas
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

    // reset estado
    subastas.ronda = 1;
    subastas.idxEnRonda = 0;
    subastas.ordenRonda = [];
    subastas.compras = [];
    subastas.compradoresRonda = {};
    subastas.formaciones = {};

    subastas.pool = [];
subastas.usados = new Set();


    // ✅ reset de reglas por ronda
    subastas.pasesEnRonda = 0;
    subastas.cartasPorRonda = subastas.cantJugadores + 2;

    // ✅ init saldos
    sub_initSaldos();

    sub_setSelectCompradores(subastas.cantJugadores);

    sub_configSubastas.classList.add("hidden");
    sub_juegoSubastas.classList.remove("hidden");

    sub_btnPasar.disabled = false;
    sub_btnComprar.disabled = false;

    // visor visible desde el inicio
    if (visorEquipos) visorEquipos.classList.remove("hidden");
    equipoJugadorActual = 1;
    renderCanchaParaComprador(equipoJugadorActual);

    sub_renderLog();
    sub_iniciarRonda();
  });
});

// ==============================
// Botones juego
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












