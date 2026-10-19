// js/cart.js: carrito de compras. Guarda ids de mods, aplica combos solos y arma el mensaje para WhatsApp/correo.
import { prepararDialogo } from './dialog.js';
import { precioCOP, precioUSD } from './format.js';
import { el } from './dom.js';

const CLAVE = 'santitrucks-carrito';

export function initCarrito({ mods, combos, contacto, tienda, dialogo }) {
  const porId = new Map(mods.map((m) => [m.id, m]));
  const lista = dialogo.querySelector('#carrito-lista');
  const resumen = dialogo.querySelector('#carrito-resumen');
  const vacio = dialogo.querySelector('#carrito-vacio');
  const acciones = dialogo.querySelector('#carrito-acciones');
  const enlaceWhatsApp = dialogo.querySelector('#carrito-wa');
  const enlaceCorreo = dialogo.querySelector('#carrito-mail');
  const vaciar = dialogo.querySelector('#carrito-vaciar');
  const contador = document.getElementById('carrito-contador');
  const abrirBtn = document.getElementById('carrito-abrir');
  const aviso = document.getElementById('carrito-aviso');
  const panel = prepararDialogo(dialogo);

  dialogo.querySelector('#carrito-pago').textContent =
    `El pago se hace por Nequi al ${contacto.nequi} cuando confirmemos que están disponibles.`;

  let ids = cargar();

  /* ---------- Estado ---------- */
  function cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(guardado) ? [...new Set(guardado)].filter((id) => porId.has(id)) : [];
    } catch {
      return [];
    }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(ids)); } catch { /* sin almacenamiento: el carrito vive solo en esta visita */ }
  }
  function anunciar(texto) {
    aviso.textContent = '';
    setTimeout(() => { aviso.textContent = texto; }, 50);
  }

  /** Suma los mods y aplica cada combo completo (el que más ahorra primero, sin repetir mods). */
  function calcular() {
    const lineas = ids.map((id) => porId.get(id));
    const subtotal = lineas.reduce((s, m) => s + m.precio, 0);
    const candidatos = combos
      .map((c) => ({ c, normal: c.mods.reduce((s, id) => s + (porId.get(id)?.precio ?? 0), 0) }))
      .sort((a, b) => (b.normal - b.c.precio) - (a.normal - a.c.precio));
    const usados = new Set();
    const descuentos = [];
    for (const { c, normal } of candidatos) {
      const ahorro = normal - c.precio;
      if (ahorro > 0 && c.mods.every((id) => ids.includes(id) && !usados.has(id))) {
        c.mods.forEach((id) => usados.add(id));
        descuentos.push({ nombre: c.nombre, ahorro });
      }
    }
    const total = subtotal - descuentos.reduce((s, d) => s + d.ahorro, 0);
    return { lineas, subtotal, descuentos, total };
  }

  function agregar(...nuevos) {
    const antes = ids.length;
    nuevos.forEach((id) => { if (porId.has(id) && !ids.includes(id)) ids.push(id); });
    if (ids.length !== antes) cambio(`${nuevos.map((id) => porId.get(id)?.nombre).join(', ')} agregado al carrito.`);
  }
  function quitar(id) {
    ids = ids.filter((x) => x !== id);
    cambio(`${porId.get(id)?.nombre ?? 'Producto'} quitado del carrito.`);
  }
  function alternar(id) {
    if (ids.includes(id)) quitar(id);
    else agregar(id);
  }
  function vaciarTodo() {
    ids = [];
    cambio('Carrito vacío.');
  }
  function cambio(mensaje) {
    guardar();
    pintar();
    if (mensaje) anunciar(mensaje);
  }

  /* ---------- Mensajes ---------- */
  function textoPedido() {
    const { lineas, descuentos, total } = calcular();
    const partes = ['Hola, quiero comprar estos mods:', ...lineas.map((m) => `- ${m.nombre} (${precioCOP(m.precio)})`)];
    descuentos.forEach((d) => partes.push(`Descuento ${d.nombre}: -${precioCOP(d.ahorro)}`));
    partes.push(`Total: ${precioCOP(total)}`, '¿Están disponibles?');
    return partes.join('\n');
  }

  /* ---------- Pintado ---------- */
  function pintar() {
    const { lineas, descuentos, total } = calcular();
    const n = lineas.length;

    contador.textContent = String(n);
    contador.hidden = n === 0;
    abrirBtn.setAttribute('aria-label', `Abrir carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);

    document.querySelectorAll('[data-agregar]').forEach((b) => {
      const dentro = ids.includes(b.dataset.agregar);
      b.setAttribute('aria-pressed', String(dentro));
      b.textContent = dentro ? '✓ En el carrito' : '+ Agregar al carrito';
    });

    lista.replaceChildren(...lineas.map((m) => el('li', { class: 'carrito__item' },
      el('img', { src: m.imagen, alt: '', width: 96, height: 60 }),
      el('p', { class: 'carrito__nombre' }, m.nombre),
      el('p', { class: 'carrito__precio' }, precioCOP(m.precio)),
      el('button', { type: 'button', class: 'enlace', 'data-quitar': m.id, 'aria-label': `Quitar ${m.nombre}` }, 'Quitar')
    )));

    const filas = [];
    descuentos.forEach((d) => filas.push(el('dt', {}, `Descuento ${d.nombre}`), el('dd', { class: 'carrito__descuento' }, `-${precioCOP(d.ahorro)}`)));
    filas.push(
      el('dt', { class: 'carrito__total-et' }, 'Total'),
      el('dd', { class: 'carrito__total' }, precioCOP(total), el('small', {}, precioUSD(total, tienda.tasaUSD)))
    );
    resumen.replaceChildren(...filas);

    const hayItems = n > 0;
    vacio.hidden = hayItems;
    lista.hidden = resumen.hidden = acciones.hidden = vaciar.hidden = !hayItems;

    if (hayItems) {
      const texto = textoPedido();
      enlaceWhatsApp.href = `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
      enlaceCorreo.href = `mailto:${contacto.email}?subject=${encodeURIComponent('Pedido de mods')}&body=${encodeURIComponent(texto)}`;
    }
  }

  /* ---------- Eventos (delegación) ---------- */
  document.addEventListener('click', (e) => {
    const comprar = e.target.closest('[data-comprar]');
    const agregarBtn = e.target.closest('[data-agregar]');
    const abrir = e.target.closest('#carrito-abrir');

    if (agregarBtn) {
      alternar(agregarBtn.dataset.agregar);
    } else if (comprar) {
      // Puede ser un mod o un combo: un combo agrega todos sus mods
      const id = comprar.dataset.comprar;
      const combo = combos.find((c) => c.id === id);
      agregar(...(combo ? combo.mods : [id]));
      panel.abrir(comprar);
    } else if (abrir) {
      panel.abrir(abrir);
    }
  });

  dialogo.addEventListener('click', (e) => {
    const quitarBtn = e.target.closest('[data-quitar]');
    if (quitarBtn) quitar(quitarBtn.dataset.quitar);
  });
  vaciar.addEventListener('click', vaciarTodo);

  pintar();
}
