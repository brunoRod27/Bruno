(() => {
  // ==============================
  // IMPOSTOR - ESTADO
  // ==============================
  const imp = {
    cant: 5,
    impostores: 1,
    categoriaKey: null,
    palabra: null,
    roles: [],          // "IMPOSTOR" o palabra
    revelados: [],      // boolean por jugador
  };

  // ==============================
  // Helpers DOM
  // ==============================
  const $ = (id) => document.getElementById(id);

  // ==============================
  // DOM (pantallas / config)
  // ==============================
  const imp_btnIr = $("btn-ir-impostor");
  const imp_pantalla = $("pantalla-impostor");
  const imp_btnVolverMenu = $("btn-volver-menu-impostor");

  const imp_config = $("config-impostor");
  const imp_juego = $("juego-impostor");
  const imp_fin = $("fin-impostor");

  const imp_selCant = $("imp-cant");
  const imp_selImpostores = $("imp-impostores");
  const imp_selCategoria = $("imp-categoria");

  const imp_btnIniciar = $("btn-imp-iniciar");
  const imp_btnCancelar = $("btn-imp-cancelar");
  const imp_btnReiniciar = $("btn-imp-reiniciar");

  let imp_grid = $("imp-grid"); // opcional

  // Pantallas principales
  const imp_menuPrincipal = $("menu-principal");

  // ==============================
  // MODAL PRO (reveal)
  // ==============================
  const imp_modal = $("imp-modal");
  const imp_modalBackdrop = $("imp-modal-backdrop");
  const imp_modalClose = $("imp-modal-close");
  const imp_modalHide = $("imp-modal-hide");

  const imp_modalBadge = $("imp-modal-badge");
  const imp_modalImg = $("imp-modal-img");
  const imp_modalImgFallback = $("imp-modal-img-fallback");
  const imp_modalTitle = $("imp-modal-title");
  const imp_modalSub = $("imp-modal-sub");

  function imp_openModal({ isImpostor, titulo, subtitulo, imgSrc }) {
    // Fallback por si no agregaste el HTML del modal
    if (!imp_modal) {
      alert(isImpostor ? "😈 SOS EL IMPOSTOR" : `✅ TU PALABRA ES:\n\n${titulo}`);
      return;
    }

    // Badge
    if (imp_modalBadge) {
      imp_modalBadge.textContent = isImpostor ? "IMPOSTOR" : "TU PALABRA";
      imp_modalBadge.style.background = isImpostor ? "rgba(239,68,68,0.18)" : "rgba(59,130,246,0.20)";
      imp_modalBadge.style.borderColor = isImpostor ? "rgba(239,68,68,0.40)" : "rgba(59,130,246,0.35)";
      imp_modalBadge.style.color = isImpostor ? "#fecaca" : "#bfdbfe";
    }

    // Textos
    if (imp_modalTitle) imp_modalTitle.textContent = titulo || "-";
    if (imp_modalSub) imp_modalSub.textContent = subtitulo || "";

    // Imagen
    if (imp_modalImg) imp_modalImg.classList.add("hidden");
    if (imp_modalImgFallback) imp_modalImgFallback.classList.add("hidden");

    if (imgSrc && imp_modalImg) {
      imp_modalImg.onerror = null;
      imp_modalImg.src = imgSrc;
      imp_modalImg.classList.remove("hidden");

      imp_modalImg.onerror = () => {
        imp_modalImg.onerror = null;
        imp_modalImg.classList.add("hidden");
        if (imp_modalImgFallback) {
          imp_modalImgFallback.classList.remove("hidden");
          imp_modalImgFallback.textContent = "SIN IMAGEN";
        }
      };
    } else {
      if (imp_modalImgFallback) {
        imp_modalImgFallback.classList.remove("hidden");
        imp_modalImgFallback.textContent = "SIN IMAGEN";
      }
    }

    // Mostrar
    imp_modal.classList.remove("hidden");
    imp_modal.setAttribute("aria-hidden", "false");
  }

  function imp_closeModal() {
    if (!imp_modal) return;
    imp_modal.classList.add("hidden");
    imp_modal.setAttribute("aria-hidden", "true");
  }

  if (imp_modalBackdrop) imp_modalBackdrop.addEventListener("click", imp_closeModal);
  if (imp_modalClose) imp_modalClose.addEventListener("click", imp_closeModal);
  if (imp_modalHide) imp_modalHide.addEventListener("click", imp_closeModal);

  // ==============================
  // Validación mínima de IDs
  // ==============================
  function imp_assertBase() {
    const faltan = [];
    if (!imp_btnIr) faltan.push("btn-ir-impostor");
    if (!imp_pantalla) faltan.push("pantalla-impostor");
    if (!imp_btnVolverMenu) faltan.push("btn-volver-menu-impostor");
    if (!imp_config) faltan.push("config-impostor");
    if (!imp_juego) faltan.push("juego-impostor");
    if (!imp_fin) faltan.push("fin-impostor");
    if (!imp_selCant) faltan.push("imp-cant");
    if (!imp_selImpostores) faltan.push("imp-impostores");
    if (!imp_selCategoria) faltan.push("imp-categoria");
    if (!imp_btnIniciar) faltan.push("btn-imp-iniciar");
    if (!imp_btnCancelar) faltan.push("btn-imp-cancelar");
    if (!imp_btnReiniciar) faltan.push("btn-imp-reiniciar");

    if (faltan.length) {
      console.error("IMPOSTOR: faltan IDs en el HTML:", faltan);
      return false;
    }
    return true;
  }

  // ==============================
  // Helpers
  // ==============================
  function imp_mezclar(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function imp_slugify(txt) {
    return String(txt || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  }

  function imp_popularCategorias() {
    if (!window.CATEGORIAS_IMPOSTOR || typeof window.CATEGORIAS_IMPOSTOR !== "object") {
      console.error("IMPOSTOR: CATEGORIAS_IMPOSTOR no existe. ¿Cargaste categorias.js antes que impostor.js?");
      imp_selCategoria.innerHTML = `<option value="">(Error: no hay categorías)</option>`;
      return;
    }

    imp_selCategoria.innerHTML = "";
    const keys = Object.keys(window.CATEGORIAS_IMPOSTOR);

    keys.forEach((key, i) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = key;
      if (i === 0) opt.selected = true;
      imp_selCategoria.appendChild(opt);
    });
  }

  function imp_ajustarOpcionesImpostores() {
    const cant = Number(imp_selCant.value) || 5;

    // Regla simple: 1 siempre; 2 si >=7; 3 si >=10
    const opciones = [1];
    if (cant >= 7) opciones.push(2);
    if (cant >= 10) opciones.push(3);

    imp_selImpostores.innerHTML = "";
    opciones.forEach(n => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = String(n);
      imp_selImpostores.appendChild(opt);
    });

    imp_selImpostores.value = (cant >= 7) ? "2" : "1";
  }

  function imp_elegirPalabra() {
    const key = imp.categoriaKey;
    const pool = (window.CATEGORIAS_IMPOSTOR && window.CATEGORIAS_IMPOSTOR[key]) || [];
    if (!Array.isArray(pool) || pool.length === 0) return "SIN DATOS";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function imp_armarRoles() {
    const roles = Array(imp.cant).fill(imp.palabra);
    const idxs = imp_mezclar([...Array(imp.cant).keys()]).slice(0, imp.impostores);
    idxs.forEach(i => roles[i] = "IMPOSTOR");

    imp.roles = roles;
    imp.revelados = Array(imp.cant).fill(false);
  }

  // ==============================
  // UI - Pantallas
  // ==============================
  function imp_irConfig() {
    imp_config.classList.remove("hidden");
    imp_juego.classList.add("hidden");
    imp_fin.classList.add("hidden");
  }

  function imp_irJuego() {
    imp_config.classList.add("hidden");
    imp_juego.classList.remove("hidden");
    imp_fin.classList.add("hidden");
  }

  function imp_irFinal() {
    imp_config.classList.add("hidden");
    imp_juego.classList.add("hidden");
    imp_fin.classList.remove("hidden");
  }

  // ==============================
  // UI - Grilla
  // ==============================
  function imp_crearGridSiNoExiste() {
    if (imp_grid) return;

    imp_grid = document.createElement("div");
    imp_grid.id = "imp-grid";
    imp_grid.className = "imp-grid";
    imp_juego.appendChild(imp_grid);
  }

  function imp_renderGrid() {
  imp_crearGridSiNoExiste();
  imp_grid.innerHTML = "";

  // ✅ Título cortito (opcional)
  const titulo = document.createElement("div");
  titulo.style.textAlign = "center";
  titulo.style.fontWeight = "800";
  titulo.style.fontSize = "20px";
  titulo.style.marginBottom = "14px";
  titulo.textContent = "Elegí tu jugador";
  imp_grid.appendChild(titulo);

  // ✅ Grilla SIEMPRE vertical-friendly: 2 columnas
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  grid.style.gap = "12px";

  for (let i = 0; i < imp.cant; i++) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "btn-secundario";
    card.style.borderRadius = "16px";
    card.style.padding = "18px 10px";
    card.style.minHeight = "92px";
    card.style.fontWeight = "800";

    if (!imp.revelados[i]) {
      card.textContent = `Jugador ${i + 1}`;
      card.addEventListener("click", () => imp_revelar(i));
    } else {
      card.disabled = true;
      card.style.opacity = "0.55";
      card.innerHTML = `
        <div style="font-size:12px; opacity:.9;">Jugador ${i + 1}</div>
        <div style="font-size:13px;">Revelado</div>
      `;
    }

    grid.appendChild(card);
  }

  imp_grid.appendChild(grid);

  // ✅ contador chiquito abajo (opcional)
  const footer = document.createElement("div");
  footer.id = "imp-contador";
  footer.style.textAlign = "center";
  footer.style.marginTop = "14px";
  footer.style.color = "#c8c8ff";
  footer.style.fontSize = "13px";
  footer.textContent = `Revelados: ${imp.revelados.filter(Boolean).length} / ${imp.cant}`;
  imp_grid.appendChild(footer);
}


  function imp_actualizarContador() {
    const el = $("imp-contador");
    if (!el) return;
    el.textContent = `Revelados: ${imp.revelados.filter(Boolean).length} / ${imp.cant}`;
  }

  // ==============================
  // REVEAL (modal pro)
  // ==============================
  function imp_resolverImagen(rol, categoriaKey) {
  const cat = (categoriaKey || "").toLowerCase();

  // 👹 Impostor especial LUB
  if (rol === "IMPOSTOR" && cat.includes("lub")) {
    return "img/impostor-lub.png"; // <-- tu imagen especial
  }

  // R6: img/r6/<slug>.png
  if (cat.includes("rainbow") || cat.includes("r6") || cat.includes("siege")) {
    return `img/r6/${imp_slugify(rol)}.png`;
  }

  // LUB: img/jugadores-lub/<slug>.png
  if (cat.includes("lub")) {
    return `img/jugadores-lub/${imp_slugify(rol)}.png`;
  }

  return null;
}

  function imp_revelar(idx) {
  if (imp.revelados[idx]) return;

  const rol = imp.roles[idx];
  const isImp = (rol === "IMPOSTOR");

  imp_openModal({
    isImpostor: isImp,
    titulo: isImp ? "😈 SOS EL IMPOSTOR" : rol,
    subtitulo: isImp ? "No digas nada. Disimulá." : (imp.categoriaKey || ""),
    imgSrc: imp_resolverImagen(rol, imp.categoriaKey) // ✅ acá
  });

  imp.revelados[idx] = true;
  imp_actualizarContador();
  imp_renderGrid();

  if (imp.revelados.every(Boolean)) {
    imp_irFinal();
  }
}


  // ==============================
  // Iniciar / Reiniciar
  // ==============================
  function imp_iniciar() {
    imp.cant = Number(imp_selCant.value) || 5;
    imp.impostores = Number(imp_selImpostores.value) || 1;

    const keys = window.CATEGORIAS_IMPOSTOR ? Object.keys(window.CATEGORIAS_IMPOSTOR) : [];
    imp.categoriaKey = imp_selCategoria.value || keys[0] || null;

    if (!imp.categoriaKey) {
      alert("No hay categorías disponibles. Revisá categorias.js.");
      return;
    }

    if (imp.impostores >= imp.cant) imp.impostores = 1;

    imp.palabra = imp_elegirPalabra();
    imp_armarRoles();
    imp_irJuego();
    imp_renderGrid();
  }

  // ==============================
  // Eventos
  // ==============================
  function imp_bind() {
    if (!imp_assertBase()) return;

    // Entrar a Impostor
    imp_btnIr.addEventListener("click", () => {
      if (imp_menuPrincipal) imp_menuPrincipal.classList.add("hidden");

      // Ocultar otras pantallas si existen
      const pChar = $("pantalla-charadas");
      const pSub = $("pantalla-subastas");
      if (pChar) pChar.classList.add("hidden");
      if (pSub) pSub.classList.add("hidden");

      imp_pantalla.classList.remove("hidden");

      imp_popularCategorias();
      imp_ajustarOpcionesImpostores();
      imp_irConfig();
    });

    // Volver al menú principal
    imp_btnVolverMenu.addEventListener("click", () => {
      imp_closeModal();
      imp_pantalla.classList.add("hidden");
      if (imp_menuPrincipal) imp_menuPrincipal.classList.remove("hidden");
    });

    // Cambiar cant => recalcular impostores
    imp_selCant.addEventListener("change", imp_ajustarOpcionesImpostores);

    imp_btnIniciar.addEventListener("click", imp_iniciar);
    imp_btnCancelar.addEventListener("click", () => {
      imp_closeModal();
      imp_irConfig();
    });
    imp_btnReiniciar.addEventListener("click", () => {
      imp_closeModal();
      imp_iniciar();
    });

    // Re-render al resize (para columnas)
    window.addEventListener("resize", () => {
      if (!imp_juego.classList.contains("hidden")) {
        imp_renderGrid();
      }
    });
  }

  // Espera a que el DOM exista (por las dudas)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", imp_bind);
  } else {
    imp_bind();
  }
})();

