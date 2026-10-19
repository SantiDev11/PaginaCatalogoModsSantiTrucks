# Santi Trucks · Catálogo de mods para American Truck Simulator

Página web estática (HTML, CSS y JavaScript sin frameworks) para mostrar y vender mods de American Truck Simulator (ATS). Los precios están en pesos colombianos, el cliente arma un carrito y el pedido llega por WhatsApp o correo. El pago se hace por Nequi.

## Qué incluye

- Vitrina en el inicio con los mods en orden aleatorio.
- Catálogo con filtros por categoría, estado (Disponible, Próximamente, Agotado) y precio en pesos con equivalente en dólares.
- Combos con descuento automático.
- Carrito que se guarda en el navegador y genera el mensaje del pedido.
- Botón "Pedir video" (el video se envía por WhatsApp), "Compartir" y "Avísame" para mods que aún no salen.
- Galería con visor ampliado, instalación en 4 pasos, preguntas frecuentes, pedidos a medida y página de políticas y soporte.
- Botón flotante de WhatsApp.

## Cómo verla en tu computador

Los archivos JavaScript usan módulos (`import`/`export`), así que **no funcionan abriendo `index.html` con doble clic**. Hay que servir la carpeta:

```bash
cd mods-ats
python -m http.server 8000
```

Luego abre <http://localhost:8000>. También sirve la extensión Live Server de VS Code o `npx serve`.

## Estructura

```
mods-ats/
├── index.html          Página principal
├── politicas.html      Políticas y soporte
├── css/
│   ├── base.css        Reset, colores (variables), tipografía
│   ├── layout.css      Grids, secciones y breakpoints (600 / 900 / 1200 px)
│   └── components.css  Tarjetas, botones, carrito, visor, etc.
├── js/
│   ├── mods-data.js    TODOS los datos: mods, combos, contacto, precios
│   ├── main.js         Arranque: vitrina, catálogo, filtros, combos, navegación
│   ├── cart.js         Carrito y mensaje del pedido
│   ├── gallery.js      Galería y visor
│   ├── dialog.js       Comportamiento accesible de los diálogos
│   ├── contacto.js     Enlaces de contacto (pie y botones de WhatsApp)
│   ├── format.js       Formato de precios (COP y USD)
│   ├── dom.js          Ayudante para crear elementos
│   └── politicas.js    Script de la página de políticas
└── assets/
    ├── images/         Portadas y logo
    └── icons/          Favicon e ícono para celular
```

## Cómo editar (casi todo en `js/mods-data.js`)

### Datos de contacto y tasa del dólar

```js
export const contacto = {
  whatsapp: "573177762098",   // código de país + número, sin + ni espacios
  whatsappVisible: "317 776 2098",
  email: "kevin.spedraza.ortiz11@gmail.com",
  nequi: "317 776 2098"
};
export const tienda = { tasaUSD: 4000 };   // pesos por dólar, aproximado
```

### Agregar un mod

Copia un bloque de `mods` y cambia sus campos:

```js
{
  id: "santi-nuevo-mod",                 // único, sin espacios ni tildes
  nombre: "Santi Nuevo Mod",
  descripcion: "Qué hace el mod.",
  categoria: "sonido",                   // sonido | clima | mecanica | multimedia (o una nueva en `categorias`)
  estado: "disponible",                  // disponible | proximamente | agotado
  precio: 12000,                         // número en COP; null si aún no tiene precio
  detalles: { Juego: "American Truck Simulator", Formato: ".scs", Tamaño: "300 KB", Entrega: "Digital" },
  caracteristicas: ["Primera", "Segunda"],   // opcional; si está vacío no se muestra
  imagen: "assets/images/santi-nuevo-mod.jpg",
  alt: "Descripción de la imagen para lectores de pantalla"
}
```

Aparece solo en el catálogo, la galería, los filtros y la vitrina. Solo se puede comprar si `estado` es `"disponible"` y `precio` es un número.

### Publicar un mod que estaba "Próximamente"

Cambia `estado` a `"disponible"` y pon el `precio`. El botón "Avísame" se convierte en "Comprar" y el mod entra al carrito.

### Combos

```js
export const combos = [
  { id: "combo-x", nombre: "Combo X", mods: ["id-mod-1", "id-mod-2"], precio: 15000 }
];
```

El "Ahorras…" se calcula solo (suma de los mods menos el precio del combo). En el carrito, el descuento se aplica automáticamente cuando están los dos mods.

### Opiniones de clientes

Agrega objetos a `opiniones` (con permiso de cada persona). Mientras esté vacío, la sección no se muestra:

```js
export const opiniones = [{ nombre: "Juan P.", texto: "Excelente mod." }];
```

## Cómo reemplazar las imágenes

1. Guarda la nueva imagen en `assets/images/` (JPG o PNG, idealmente 1200 px de ancho o más).
2. Cambia la ruta `imagen` y el `alt` del mod en `js/mods-data.js`, o guarda el archivo con el mismo nombre que ya tiene.

Las imágenes no se recortan: se muestran completas en un recuadro 16:9. Si la imagen tiene otra proporción, quedan bandas oscuras a los lados.

## Colores

Están como variables en `css/base.css` (`:root`). Para cambiar el rojo de toda la página, cambia `--rojo`; el fondo azul oscuro es `--fondo`.

## Publicarla en internet

Es un sitio estático: sirve cualquier hosting de archivos. Opciones gratuitas:

- **GitHub Pages**, **Netlify** o **Cloudflare Pages**: sube la carpeta `mods-ats` y listo.

Tras publicar, conviene cambiar la imagen `og:image` de `index.html` por la dirección completa (con tu dominio) para que se vea la vista previa al compartir en WhatsApp.

## Reglas con las que se construyó

- Sin `<div>` ni `<span>`: solo etiquetas semánticas.
- Sin estilos ni scripts incrustados en el HTML.
- Sin librerías externas, salvo Google Fonts (Barlow Condensed e Inter).
- Accesibilidad: foco visible, navegación por teclado, diálogos con foco atrapado y cierre con Escape, `alt` descriptivo, respeto de `prefers-reduced-motion`.
- Los precios y datos de los mods salen solo de `js/mods-data.js`.

## Por revisar antes de publicar

- Confirmar que el número de Nequi es el correcto.
- Revisar los textos de `politicas.html` (devoluciones, uso de los mods, datos personales).
- Actualizar `tasaUSD` según el dólar del día.
- Reemplazar las portadas de baja resolución por las originales.
- Completar descripciones y características de cada mod.

## Aviso

Proyecto independiente, sin afiliación con SCS Software. American Truck Simulator es marca de sus propietarios.
