// ==============================
// CATEGORÍAS – MODO IMPOSTOR
// Cada categoría es un array de STRINGS
// ==============================

// ---------- LUB (usa tus datos reales) ----------
const LUB_JUGADORES = Array.isArray(personas)
  ? personas.map(p => p.nombre)
  : [];

const LUB_CLUBES = Array.isArray(clubesLUB)
  ? clubesLUB
  : [];

// ---------- RAINBOW SIX SIEGE ----------
const R6_OPERADORES = [
  "Denari",
  "Rauora",
  "Skopos",
  "Sentry",
  "Striker",
  "Deimos",
  "Tubarao",
  "Ram",
  "Fenrir",
  "Brava",
  "Solis",
  "Grim",
  "Sens",
  "Azami",
  "Thorn",
  "Osa",
  "Thunderbird",
  "Flores",
  "Aruni",
  "Zero",
  "Ace",
  "Melusi",
  "Oryx",
  "Iana",
  "Wamai",
  "Kali",
  "Amaru",
  "Goyo",
  "Nokk",
  "Warden",
  "Mozzie",
  "Gridlock",
  "Nomad",
  "Kaid",
  "Clash",
  "Maverick",
  "Maestro",
  "Alibi",
  "Lion",
  "Finka",
  "Vigil",
  "Dokkaebi",
  "Zofia",
  "Ela",
  "Ying",
  "Lesion",
  "Mira",
  "Jackal",
  "Hibana",
  "Echo",
  "Caveira",
  "CAPITaO",
  "Blackbeard",
  "Valkyrie",
  "Buck",
  "Frost",
  "Mute",
  "Sledge",
  "Smoke",
  "Thatcher",
  "Ash",
  "Castle",
  "Pulse",
  "Thermite",
  "Montagne",
  "Twitch",
  "Doc",
  "Rook",
  "Jager",
  "Bandit",
  "Blitz",
  "IQ",
  "Fuze",
  "Glaz",
  "Tachanka",
  "Kapkan"
];

// ---------- COMIDAS ----------
const COMIDAS = [
  "Hamburguesa",
  "Pizza",
  "Milanesa",
  "Asado",
  "Chivito",
  "Empanadas",
  "Sushi",
  "Tacos",
  "Pasta",
  "Paella",
  "Ramen",
  "Ñoquis",
  "Lasagna"
];

// ---------- ANIMALES ----------
const ANIMALES = [
  "Perro",
  "Gato",
  "Elefante",
  "León",
  "Tigre",
  "Caballo",
  "Águila",
  "Delfín",
  "Tiburón",
  "Cocodrilo",
  "Mono",
  "Pingüino",
  "Jirafa"
];

// ==============================
// OBJETO FINAL DE CATEGORÍAS
// (esto es lo que usa impostor.js)
// ==============================
const CATEGORIAS_IMPOSTOR = {
  "LUB — Jugadores / DTs": LUB_JUGADORES,
  "LUB — Clubes": LUB_CLUBES,
  "Rainbow Six Siege — Operadores": R6_OPERADORES,
  "Comidas": COMIDAS,
  "Animales": ANIMALES
};


// Exponer en global para que impostor.js lo pueda usar
window.CATEGORIAS_IMPOSTOR = CATEGORIAS_IMPOSTOR;
console.log("CATEGORIAS_IMPOSTOR cargado:", Object.keys(window.CATEGORIAS_IMPOSTOR || {}));

