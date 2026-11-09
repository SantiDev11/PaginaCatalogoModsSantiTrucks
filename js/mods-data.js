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

export const mods = [
  {
    id: "santi-pack-de-sonidos",
    nombre: "Santi Pack de sonidos",
    descripcion: "Pack de sonidos realistas para tu American Truck Simulator.",
    categoria: "sonido",
    estado: "disponible",
    precio: 8000,
    detalles: { Juego: "American Truck Simulator", Formato: ".scs", Tamaño: "230 KB", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-pack-de-sonidos.jpg",
    alt: "Portada de Sonidos Realistas SantiTrucks para camiones SMC y CRM: camión azul con carpa negra"
  },
  {
    id: "santi-mod-de-lluvia",
    nombre: "Santi Mod de lluvia",
    descripcion: "Efectos de lluvia realista para tus recorridos.",
    categoria: "clima",
    estado: "disponible",
    precio: 10000,
    detalles: { Juego: "American Truck Simulator", Entrega: "Digital" },
    caracteristicas: [],
    imagen: "assets/images/santi-mod-de-lluvia.jpg",
    alt: "Portada de Mod de lluvia realista Santitrucks v1: camiones bajo la lluvia frente a una estación de servicio"
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
    alt: "Portada de Suspensión Realista SantiTruck: camión amarillo con remolque Yang Ming y amortiguadores de suspensión naranja"
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

export const combos = [
  {
    id: "combo-suspension-lluvia",
    nombre: "Combo Suspensión + Lluvia",
    mods: ["santi-mod-de-suspension", "santi-mod-de-lluvia"],
    precio: 12000
  },
  {
    id: "combo-suspension-sonidos",
    nombre: "Combo Suspensión + Sonidos",
    mods: ["santi-mod-de-suspension", "santi-pack-de-sonidos"],
    precio: 10000
  },
  {
    id: "combo-lluvia-sonidos",
    nombre: "Combo Lluvia + Sonidos",
    mods: ["santi-mod-de-lluvia", "santi-pack-de-sonidos"],
    precio: 14000
  },
  {
    id: "combo-completo-santitrucks",
    nombre: "Combo Ruta Completa",
    mods: ["santi-mod-de-suspension", "santi-mod-de-lluvia", "santi-pack-de-sonidos"],
    precio: 17000
  }
];

// Opiniones de clientes (con su permiso). Mientras esté vacío, la sección no se muestra.
// Formato: { nombre: "Juan P.", texto: "Excelente mod…" }
export const opiniones = [];
