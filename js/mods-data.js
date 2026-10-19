// js/mods-data.js
// Única fuente de datos de la página. Para agregar un mod, copia un bloque de `mods` y edítalo.

export const contacto = {
  whatsapp: "573177762098",          // código de país + número, sin + ni espacios
  whatsappVisible: "317 776 2098",
  email: "kevin.spedraza.ortiz11@gmail.com",
  nequi: "317 776 2098"              // ⚠ confirma que este es tu número de Nequi
};

export const tienda = {
  tasaUSD: 4000                      // pesos por 1 dólar (aprox.). Actualízala cuando quieras.
};

// Categorías para los filtros del catálogo: clave => etiqueta
export const categorias = {
  sonido: "Sonido",
  clima: "Clima",
  mecanica: "Mecánica",
  multimedia: "Multimedia"
};

// Campos de cada mod:
//   precio (número en COP; sin precio mientras esté "proximamente") · categoria · estado: "disponible" | "proximamente" | "agotado"
//   detalles: pares etiqueta/valor que se muestran en la tarjeta (solo los que existan)
//   caracteristicas: lista opcional (si está vacía no se muestra)
export const mods = [
  {
    id: "santi-engine-sound-santitrucks",
    nombre: "Santi Engine Sound Santitrucks",
    descripcion: "Sonido de motor realista para los camiones Santitrucks.",
    categoria: "sonido",
    estado: "disponible",
    precio: 20000,
    detalles: { Juego: "American Truck Simulator", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-engine-sound-santitrucks.jpg",
    alt: "Logo Motores Santitrucks SMC con tres camiones, uno gris, uno blanco y uno verde, sobre un motor"
  },
  {
    id: "santi-pack-de-sonidos",
    nombre: "Santi Pack de sonidos",
    descripcion: "Pack de sonidos realistas para tu American Truck Simulator.",
    categoria: "sonido",
    estado: "disponible",
    precio: 10000,
    detalles: { Juego: "American Truck Simulator", Formato: ".scs", Tamaño: "230 KB", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-pack-de-sonidos.jpg",
    alt: "Portada del mod Sonidos Realistas de Santi Trucks: camión rojo con acoplado ganadero por un camino de tierra"
  },
  {
    id: "santi-mod-de-lluvia",
    nombre: "Santi Mod de lluvia",
    descripcion: "Efectos de lluvia realista para tus recorridos.",
    categoria: "clima",
    estado: "disponible",
    precio: 15000,
    detalles: { Juego: "American Truck Simulator", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-mod-de-lluvia.jpg",
    alt: "Portada del mod de lluvia realista de Santitrucks: camiones bajo una tormenta sobre una carretera mojada"
  },
  {
    id: "santi-mod-de-suspension",
    nombre: "Santi Mod de suspensión",
    descripcion: "Suspensión realista para tus camiones.",
    categoria: "mecanica",
    estado: "disponible",
    precio: 5000,
    detalles: { Juego: "American Truck Simulator", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-mod-de-suspension.jpg",
    alt: "Portada del mod Suspensión Realista de Santitrucks: camión amarillo en la carretera y detalle de la suspensión trasera"
  },
  {
    id: "multimedia-santi",
    nombre: "Multimedia Santi",
    descripcion: "Multimedia compacta para camiones Scania, con pantalla de infoentretenimiento dentro de la cabina. Muy pronto.",
    categoria: "multimedia",
    estado: "proximamente",
    precio: null,
    detalles: { Juego: "American Truck Simulator", Entrega: "Digital" },
    caracteristicas: [
      "Pantalla multimedia correcta",
      "Sin inversión ni reflejos",
      "Funciona antes de iniciar el juego",
      "Estabilidad al cerrar ATS"
    ],
    imagen: "assets/images/multimedia-santi.jpg",
    alt: "Portada de Multimedia Compacta Santi para Scania en American Truck Simulator: tablero de la cabina con pantalla multimedia mostrando radio, música, Bluetooth y navegación"
  }
];

// Promociones: `mods` son los ids incluidos; `precio` es el precio del combo.
// El ahorro se calcula solo: suma de los mods menos el precio del combo.
export const combos = [
  {
    id: "combo-lluvia-suspension",
    nombre: "Combo Lluvia + Suspensión",
    mods: ["santi-mod-de-lluvia", "santi-mod-de-suspension"],
    precio: 15000
  },
  {
    id: "combo-motores-sonidos",
    nombre: "Combo Motores + Sonidos",
    mods: ["santi-engine-sound-santitrucks", "santi-pack-de-sonidos"],
    precio: 25000
  }
];

// Opiniones de clientes (con su permiso). Mientras esté vacío, la sección no se muestra.
// Formato: { nombre: "Juan P.", texto: "Excelente mod…" }
export const opiniones = [];
