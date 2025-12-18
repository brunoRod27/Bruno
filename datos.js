// ===========================================
// 📌 CLUBES
// ===========================================

const clubesLUB = [
  "Aguada",
  "Biguá",
  "Cordón",
  "Defensor Sporting",
  "Goes",
  "Hebraica Macabi",
  "Malvín",
  "Nacional",
  "Peñarol",
  "Unión Atlética",
  "Urunday Universitario",
  "Welcome",
  "Sayago",
  "Capurro",
  "San Telmo",
  "Verdirojo",
  "Albatros",
  "Reducto",
  "25 de Agosto",
  "Reducto",
  "Marne",
  "Yale",
  "Layva",
  "Olivol Mundial",
  "Auriblanco",
  "Bohemios",
  "Atenas",
  "Larrañaga",
  "Montevideo",
  "Urupan",
  "Olimpia",
  "Capitol",
  "Stockolmo",
  "Tabaré",
  "Colón",
  "Lagomar",
  "Larre Borges",
  "Paysandú",
  "Naútico",
  "Guruyú Waston",
  "Remeros Mercedes",
  "Plaza Nueva Helvecia",
  "Ferro Carril"  
];

// ===========================================
// 📌 PERSONAS (Jugadores / DTs / Sub23 / Extranjeros)
// ===========================================

const personas = [

  //AGUADA
  { nombre: "Santiago Vidal", club: "Aguada", deporte: "Basket", rol: "Jugador" },
  { nombre: "Juan Santiso", club: "Aguada", deporte: "Basket", rol: "Jugador" },
  { nombre: "Federico Pereiras", club: "Aguada", deporte: "Basket", rol: "Jugador" },
  { nombre: "Joaquín Osimani", club: "Aguada", deporte: "Basket", rol: "Jugador" },
  { nombre: "Agustín Zuvich", club: "Aguada", deporte: "Basket", rol: "Jugador" },
  { nombre: "Donald Sims", club: "Aguada", deporte: "Basket", rol: "Extranjero" },
  { nombre: "Earl Clark", club: "Aguada", deporte: "Basket", rol: "Extranjero" },
  { nombre: "Luis Santos", club: "Aguada", deporte: "Basket", rol: "Extranjero" },
  { nombre: "Joaquín Rodríguez", club: "Aguada", deporte: "Basket", rol: "Sub23" },
  { nombre: "Agustín Gentile", club: "Aguada", deporte: "Basket", rol: "Sub23" },
  { nombre: "Manuel Fernández", club: "Aguada", deporte: "Basket", rol: "Sub23" },
  // BIGUÁ
  { nombre: "Brian García", club: "Biguá", rol: "Jugador", deporte: "Basket" },
  { nombre: "Nicolás Catalá", club: "Biguá", rol: "Jugador", deporte: "Basket" },
  { nombre: "Gonzalo Iglesias", club: "Biguá", rol: "Jugador", deporte: "Basket" },
  { nombre: "Sebastián Ottonello", club: "Biguá", rol: "Jugador", deporte: "Basket" },
  { nombre: "Deshone Hicks", club: "Biguá", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Frank Hassell", club: "Biguá", rol: "Extranjero", deporte: "Basket" },

  // CORDÓN
  { nombre: "Luciano Planells", club: "Cordón", rol: "Jugador", deporte: "Basket" },
  { nombre: "Facundo Medina", club: "Cordón", rol: "Jugador", deporte: "Basket" },

  // DEFENSOR SPORTING
  { nombre: "Facundo Terra", club: "Defensor Sporting", rol: "Jugador", deporte: "Basket" },
  { nombre: "Mauro Zubiaurre", club: "Defensor Sporting", rol: "Jugador", deporte: "Basket" },
  { nombre: "Federico Soto", club: "Defensor Sporting", rol: "Jugador", deporte: "Basket" },
  { nombre: "Theo Metzger", club: "Defensor Sporting", rol: "Jugador", deporte: "Basket" },
  { nombre: "Mateo Bianchi", club: "Defensor Sporting", rol: "Jugador", deporte: "Basket" },
  { nombre: "Dion Wright", club: "Defensor Sporting", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Nestor Colmenares", club: "Defensor Sporting", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Elijah Weaver", club: "Defensor Sporting", rol: "Extranjero", deporte: "Basket" },

  // GOES
  { nombre: "Emiliano Bonet", club: "Goes", rol: "Jugador", deporte: "Basket" },
  { nombre: "Xavier Cousté", club: "Goes", rol: "Jugador", deporte: "Basket" },
  { nombre: "Fernando Verrone", club: "Goes", rol: "Jugador", deporte: "Basket" },
  { nombre: "David Nesbitt", club: "Extranjero", rol: "Jugador", deporte: "Basket" },
  { nombre: "Sergio Conceicao", club: "Extranjero", rol: "Jugador", deporte: "Basket" },

  // HEBRAICA MACABI
  { nombre: "Manuel Mayora", club: "Hebraica Macabi", rol: "Jugador", deporte: "Basket" },
  { nombre: "Salvador Zanotta", club: "Hebraica Macabi", rol: "Jugador", deporte: "Basket" },
  { nombre: "Gastón Semiglia", club: "Hebraica Macabi", rol: "Jugador", deporte: "Basket" },
  { nombre: "Ignacio Xavier", club: "Hebraica Macabi", rol: "Jugador", deporte: "Basket" },
  { nombre: "Federico Haller", club: "Hebraica Macabi", rol: "Jugador", deporte: "Basket" },
  { nombre: "Andre Nation", club: "Hebraica Macabi", rol: "Extranjero", deporte: "Basket" },

  // MALVÍN
  { nombre: "Manuel Romero", club: "Malvín", rol: "Jugador", deporte: "Basket" },
  { nombre: "Kiril Wachsmann", club: "Malvín", rol: "Jugador", deporte: "Basket" },
  { nombre: "Jesús Cruz", club: "Malvín", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Remy Abell", club: "Malvín", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Dragan Zekovic", club: "Malvín", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Nicolás Martínez", club: "Malvín", rol: "Sub23", deporte: "Basket" },

  // NACIONAL
  { nombre: "Luciano Parodi", club: "Nacional", rol: "Jugador", deporte: "Basket" },
  { nombre: "Marcos Cabot", club: "Nacional", rol: "Jugador", deporte: "Basket" },
  { nombre: "Patricio Prieto", club: "Nacional", rol: "Jugador", deporte: "Basket" },
  { nombre: "Bernardo Barrera", club: "Nacional", rol: "Jugador", deporte: "Basket" },
  { nombre: "Gianfranco Espíndola", club: "Nacional", rol: "Jugador", deporte: "Basket" },
  { nombre: "James Feldeine", club: "Nacional", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Connor Zinaich", club: "Nacional", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Ernesto Oglivie", club: "Nacional", rol: "Extranjero", deporte: "Basket" },

  // PEÑAROL
  { nombre: "Federico Bavosi", club: "Peñarol", rol: "Jugador", deporte: "Basket" },
  { nombre: "Santiago Vescovi", club: "Peñarol", rol: "Jugador", deporte: "Basket" },
  { nombre: "Nicola Pomoli", club: "Peñarol", rol: "Jugador", deporte: "Basket" },
  { nombre: "Emiliano Serres", club: "Peñarol", rol: "Jugador", deporte: "Basket" },
  { nombre: "Martín Rojas", club: "Peñarol", rol: "Jugador", deporte: "Basket" },
  { nombre: "Skyler Hogan", club: "Peñarol", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Eric Romero", club: "Peñarol", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Andrés Ibargüen", club: "Peñarol", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Santiago Calimares", club: "Peñarol", rol: "Sub23", deporte: "Basket" },
  { nombre: "Nicolás Lema", club: "Peñarol", rol: "Sub23", deporte: "Basket" },

  // UNIÓN ATLÉTICA
  { nombre: "Juan Ignacio Ducasse", club: "Unión Atlética", rol: "Jugador", deporte: "Basket" },

  // URUNDAY
  { nombre: "Mateo Sarni", club: "Urunday Universitario", rol: "Jugador", deporte: "Basket" },
  { nombre: "Eric Demers", club: "Urunday Universitario", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Emmitt Holt", club: "Urunday Universitario", rol: "Extranjero", deporte: "Basket" },
  { nombre: "Bruno Curadossi", club: "Urunday Universitario", rol: "Sub23", deporte: "Basket" },

  // WELCOME
  { nombre: "Gustavo Barrera", club: "Welcome", rol: "Jugador", deporte: "Basket" },
  { nombre: "Santiago Moglia", club: "Welcome", rol: "Jugador", deporte: "Basket" },
  { nombre: "Diego Pena García", club: "Welcome", rol: "Jugador", deporte: "Basket" },
  { nombre: "Ignacio Stoll", club: "Welcome", rol: "Sub23", deporte: "Basket" },

    { nombre: "Nicolás Mazzarino", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Joaquín Izuibejeres", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Emilio Taboada", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Leandro Taboada", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Sebastián Izaguirre", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Fernando Martinez", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Mathias Calfani", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Mauricio Aguiar", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Martín Osimani", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Diego García", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Miguel Barriola", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Alejandro Muro", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Pablo Ivon", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Iván Loriente", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Pablo Morales", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Rodrigo Trelles", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Gerardo Fernandez", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Germán Silvarrey", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Jeff Granger", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Demian Álvarez", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Dwayne Davis", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Andrew Feeley", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Victor Rudd", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Kyle Lamonte", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Al Thornton", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Jamil Wilson", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Egidijus Mockevicius", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Raphiael Putney", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Michael Sweetney", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Jeremis Smith", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Greg Dilligard", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Hatila Passos", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Zack Graham", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Anthony Dandridge", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Pablo Macanskas", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Eloy Vargas", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Dwayne Curtis", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Maozinha", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Jason Granger", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Leandro Quiñones", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Nicolás Borselino", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Miguel Simón", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Leandro Garcia Morales", club: "Uruguay", deporte: "Basket", rol: "Leyenda"},
    { nombre: "Larry Bacon", club: "Extranjero", deporte: "Basket", rol: "Leyenda"},
    { nombre: "David Doblas", club: "Extranjero", deporte: "Basket", rol: "Leyenda"}

];
// ✅ precios base (por ahora todos 1)
personas.forEach(p => {
  p.precioBase = 1;
});

