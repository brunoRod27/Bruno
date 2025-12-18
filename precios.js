// ==============================
// PRECIOS BASE POR JUGADOR
// ==============================
const PRECIOS_POR_NOMBRE = {
  // AGUADA
  "Santiago Vidal": 16000,
  "Juan Santiso": 13000,
  "Federico Pereiras": 13000,
  "Joaquín Osimani": 12000,
  "Agustín Zuvich": 13000,
  "Donald Sims": 35000,
  "Earl Clark": 25000,
  "Luis Santos": 21000,
  "Joaquín Rodríguez": 12000,
  "Agustín Gentile": 7500,
  "Manuel Fernández": 5000,

  // BIGUÁ
  "Brian García": 5000,
  "Nicolás Catalá": 7000,
  "Gonzalo Iglesias": 15000,
  "Sebastián Ottonello": 12000,
  "Deshone Hicks": 20000,
  "Frank Hassell": 18000,

  // CORDÓN
  "Luciano Planells": 6000,
  "Facundo Medina": 9000,

  // DEFENSOR SPORTING
  "Facundo Terra": 13000,
  "Mauro Zubiaurre": 9000,
  "Federico Soto": 7500,
  "Theo Metzger": 15000,
  "Mateo Bianchi": 12000,
  "Dion Wright": 17500,
  "Nestor Colmenares": 18000,
  "Elijah Weaver": 21000,

  // GOES
  "Emiliano Bonet": 12500,
  "Xavier Cousté": 12500,
  "Fernando Verrone": 11000,
  "David Nesbitt": 15000,
  "Sergio Conceicao": 10000,

  // HEBRAICA MACABI
  "Manuel Mayora": 12000,
  "Salvador Zanotta": 9500,
  "Gastón Semiglia": 15000,
  "Ignacio Xavier": 11000,
  "Federico Haller": 15000,
  "Andre Nation": 14000,

  // MALVÍN
  "Manuel Romero": 8000,
  "Kiril Wachsmann": 11000,
  "Jesús Cruz": 19000,
  "Remy Abell": 19000,
  "Dragan Zekovic": 16000,
  "Nicolás Martínez": 15000,

  // NACIONAL
  "Luciano Parodi": 15000,
  "Marcos Cabot": 8000,
  "Patricio Prieto": 16000,
  "Bernardo Barrera": 7000,
  "Gianfranco Espíndola": 13000,
  "James Feldeine": 19000,
  "Connor Zinaich": 20000,
  "Ernesto Oglivie": 18000,

  // PEÑAROL
  "Federico Bavosi": 5000,
  "Santiago Vescovi": 30000,
  "Nicola Pomoli": 20000,
  "Emiliano Serres": 16000,
  "Martín Rojas": 14000,
  "Skyler Hogan": 17000,
  "Eric Romero": 16000,
  "Andrés Ibargüen": 21000,
  "Santiago Calimares": 8000,
  "Nicolás Lema": 10000,

  // UNIÓN ATLÉTICA
  "Juan Ignacio Ducasse": 10000,

  // URUNDAY
  "Mateo Sarni": 12000,
  "Eric Demers": 16000,
  "Emmitt Holt": 13500,
  "Bruno Curadossi": 12000,

  // WELCOME
  "Gustavo Barrera": 5000,
  "Santiago Moglia": 10000,
  "Diego Pena García": 7500,
  "Ignacio Stoll": 4000,

  // LEYENDAS (UY)
  "Nicolás Mazzarino": 25000,
  "Joaquín Izuibejeres": 18000,
  "Emilio Taboada": 17000,
  "Leandro Taboada": 14000,
  "Sebastián Izaguirre": 17000,
  "Fernando Martinez": 19000,
  "Mathias Calfani": 15000,
  "Mauricio Aguiar": 15000,
  "Martín Osimani": 18000,
  "Diego García": 15000,
  "Miguel Barriola": 16000,
  "Alejandro Muro": 14000,
  "Pablo Ivon": 14000,
  "Iván Loriente": 9000,
  "Pablo Morales": 18000,
  "Rodrigo Trelles": 13000,
  "Gerardo Fernandez": 7000,
  "Germán Silvarrey": 11000,
  "Jeff Granger": 20000,
   "Jason Granger": 22000,
  "Demian Álvarez": 17000,
   "Pablo Macanskas": 13000,

  // LEYENDAS (EXT)
  "Dwayne Davis": 20000,
  "Andrew Feeley": 25000,
  "Victor Rudd": 23000,
  "Kyle Lamonte": 20000,
  "Al Thornton": 35000,
  "Jamil Wilson": 25000,
  "Egidijus Mockevicius": 10000,
  "Raphiael Putney": 15000,
  "Michael Sweetney": 16000,
  "Jeremis Smith": 25000,
  "Greg Dilligard": 17500,
  "Hatila Passos": 16000,
  "Zack Graham": 20000,
  "Anthony Dandridge": 16000,
  "Eloy Vargas": 19000,
  "Dwayne Curtis": 17500,
  "Maozinha": 18000,
  "Leandro Quiñones": 5000,
  "Nicolás Borselino": 5000,
  "Miguel Simón": 12000,
  "Leandro Garcia Morales": 35000,
  "Larry Bacon": 15000,
  "David Doblas": 12000
};

// Asignar precioBase a cada persona
personas.forEach(p => {
  p.precioBase = PRECIOS_POR_NOMBRE[p.nombre] ?? 1;
});
