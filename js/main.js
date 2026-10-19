// js/main.js: inicialización, render desde datos y navegación
import { mods, combos, opiniones, contacto, categorias, tienda } from './mods-data.js';
import { initGallery } from './gallery.js';
import { initCarrito } from './cart.js';
import { el } from './dom.js';
import { initContacto } from './contacto.js';
import { precioCOP, precioUSD } from './format.js';

const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ETIQUETA_ESTADO = { disponible: 'Disponible', proximamente: 'Próximamente', agotado: 'Agotado' };

/** Solo los mods disponibles y con precio se pueden comprar o agregar al carrito. */
const esComprable = (mod) => (mod.estado || 'disponible') === 'disponible' && typeof mod.precio === 'number';

/** Precio en pesos con el equivalente en dólares al lado. */
function bloquePrecio(valor, clase) {
  return el('p', { class: clase }, precioCOP(valor), el('small', {}, precioUSD(valor, tienda.tasaUSD)));
}

/** Orden aleatorio (Fisher-Yates): la vitrina muestra los mods en un orden distinto en cada visita. */
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function iniciarVitrina() {
  if (!mods.length) return;
  const orden = mezclar(mods);
  const img = document.getElementById('vitrina-img');
  const categoria = document.getElementById('vitrina-categoria');
  const nombre = document.getElementById('vitrina-nombre');
  const precio = document.getElementById('vitrina-precio');
  const ver = document.getElementById('vitrina-ver');
  const vitrina = document.querySelector('.vitrina');
  const puntos = document.getElementById('vitrina-puntos');
  const pausa = document.getElementById('vitrina-pausa');
  let actual = 0;
  let temporizador = null;
  let pausadoPorUsuario = reducirMovimiento; // con movimiento reducido no rota sola

  orden.forEach((mod, i) => {
    puntos.append(el('li', {}, el('button', { type: 'button', 'aria-label': `Ver ${mod.nombre}`, 'data-punto': i })));
  });

  function mostrar(i) {
    actual = (i + orden.length) % orden.length;
    const mod = orden[actual];
    img.src = mod.imagen;
    img.alt = mod.alt;
    categoria.textContent = categorias[mod.categoria] || 'Mod';
    nombre.textContent = mod.nombre;
    precio.textContent = typeof mod.precio === 'number'
      ? `${precioCOP(mod.precio)} · ${precioUSD(mod.precio, tienda.tasaUSD)}`
      : 'Próximamente';
    ver.href = `#${mod.id}`;
    ver.setAttribute('aria-label', `Ver ${mod.nombre} en el catálogo`);
    puntos.querySelectorAll('button').forEach((b, k) => {
      if (k === actual) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  function detener() {
    clearInterval(temporizador);
    temporizador = null;
  }
  function arrancar() {
    detener();
    if (orden.length > 1 && !pausadoPorUsuario) temporizador = setInterval(() => mostrar(actual + 1), 5000);
  }
  function etiquetaPausa() {
    pausa.setAttribute('aria-pressed', String(pausadoPorUsuario));
    pausa.textContent = pausadoPorUsuario ? 'Reanudar' : 'Pausar';
  }

  puntos.addEventListener('click', (e) => {
    const punto = e.target.closest('[data-punto]');
    if (punto) mostrar(Number(punto.dataset.punto));
  });
  pausa.addEventListener('click', () => {
    pausadoPorUsuario = !pausadoPorUsuario;
    etiquetaPausa();
    arrancar();
  });
  // Se detiene mientras el usuario apunta o tiene el foco dentro de la vitrina
  vitrina.addEventListener('mouseenter', detener);
  vitrina.addEventListener('mouseleave', arrancar);
  vitrina.addEventListener('focusin', detener);
  vitrina.addEventListener('focusout', arrancar);

  etiquetaPausa();
  mostrar(0);
  arrancar();
}

function crearTarjeta(mod, indice) {
  const numero = String(indice + 1).padStart(2, '0');
  const estado = mod.estado || 'disponible';
  const detalles = Object.entries(mod.detalles || {});
  const caracteristicas = mod.caracteristicas || [];

  const cuerpo = el('section', { class: 'mod__cuerpo' },
    el('h3', { id: `${mod.id}-titulo` }, mod.nombre),
    el('p', {}, mod.descripcion)
  );

  if (detalles.length) {
    const dl = el('dl', { class: 'mod__detalles' });
    detalles.forEach(([clave, valor]) => dl.append(el('dt', {}, clave), el('dd', {}, valor)));
    cuerpo.append(dl);
  }
  if (caracteristicas.length) {
    cuerpo.append(el('ul', { class: 'mod__lista' }, ...caracteristicas.map((c) => el('li', {}, c))));
  }

  const mensajeVideo = `Hola, ¿me puedes enviar el video del mod "${mod.nombre}"?`;
  const comprable = esComprable(mod);
  const extras = el('ul', { class: 'mod__extras' });
  if (comprable) {
    extras.append(el('li', {}, el('button', { type: 'button', class: 'enlace', 'data-agregar': mod.id, 'aria-pressed': 'false' }, '+ Agregar al carrito')));
  }
  extras.append(
    el('li', {}, el('a', {
      href: `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensajeVideo)}`,
      target: '_blank',
      rel: 'noopener',
      'aria-label': `Pedir el video de ${mod.nombre} por WhatsApp`
    }, 'Pedir video')),
    el('li', {}, el('button', { type: 'button', class: 'enlace', 'data-compartir': mod.id }, 'Compartir'))
  );
  cuerpo.append(extras);

  const avisoMensaje = `Hola, avísame cuando salga "${mod.nombre}".`;
  cuerpo.append(comprable
    ? el('footer', { class: 'mod__pie' },
        bloquePrecio(mod.precio, 'mod__precio'),
        el('button', { type: 'button', class: 'boton', 'data-comprar': mod.id, 'aria-label': `Comprar ${mod.nombre}`, 'aria-haspopup': 'dialog' }, 'Comprar')
      )
    : el('footer', { class: 'mod__pie' },
        el('p', { class: 'mod__precio' }, estado === 'agotado' ? 'Agotado' : 'Próximamente', el('small', {}, 'Precio por anunciar')),
        el('a', {
          class: 'boton boton--claro',
          href: `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(avisoMensaje)}`,
          target: '_blank',
          rel: 'noopener',
          'aria-label': `Avisarme cuando salga ${mod.nombre}`
        }, 'Avísame')
      )
  );

  return el('article', { class: 'mod', id: mod.id, 'aria-labelledby': `${mod.id}-titulo` },
    el('figure', {},
      el('img', { src: mod.imagen, alt: mod.alt, loading: 'lazy', width: 800, height: 500 }),
      el('figcaption', {}, `MOD ${numero}`),
      el('p', { class: `estado estado--${estado}` }, ETIQUETA_ESTADO[estado] || estado)
    ),
    cuerpo
  );
}

function renderCatalogo() {
  const lista = document.getElementById('catalogo-lista');
  if (!mods.length) {
    lista.append(el('li', { class: 'vacio' }, 'Pronto habrá mods disponibles.'));
    return;
  }
  mods.forEach((mod, i) => lista.append(el('li', { 'data-categoria': mod.categoria || '' }, crearTarjeta(mod, i))));
}

/** Botones de filtro generados con las categorías que realmente se usan. */
function renderFiltros() {
  const lista = document.getElementById('filtros');
  const estado = document.getElementById('filtro-estado');
  const usadas = [...new Set(mods.map((m) => m.categoria).filter(Boolean))];
  if (usadas.length < 2) {
    lista.closest('nav').hidden = true;
    return;
  }

  const opciones = [['todos', 'Todos'], ...usadas.map((c) => [c, categorias[c] || c])];
  opciones.forEach(([clave, texto], i) => {
    const boton = el('button', { type: 'button', class: 'filtro', 'data-filtro': clave, 'aria-pressed': String(i === 0) }, texto);
    lista.append(el('li', {}, boton));
  });

  lista.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-filtro]');
    if (!boton) return;
    const clave = boton.dataset.filtro;
    lista.querySelectorAll('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    let visibles = 0;
    document.querySelectorAll('#catalogo-lista > li').forEach((li) => {
      const mostrar = clave === 'todos' || li.dataset.categoria === clave;
      li.hidden = !mostrar;
      if (mostrar) visibles += 1;
    });
    estado.textContent = `Mostrando ${visibles} ${visibles === 1 ? 'mod' : 'mods'}`;
  });
}

function crearCombo(combo) {
  const incluidos = combo.mods.map((id) => mods.find((m) => m.id === id)).filter(Boolean);
  const normal = incluidos.reduce((suma, m) => suma + m.precio, 0);
  const ahorro = normal - combo.precio;

  return el('article', { class: 'combo', id: combo.id, 'aria-labelledby': `${combo.id}-titulo` },
    el('figure', { class: 'combo__imgs' },
      ...incluidos.map((m) => el('img', { src: m.imagen, alt: m.alt, loading: 'lazy', width: 800, height: 500 })),
      el('figcaption', {}, ahorro > 0 ? `Ahorras ${precioCOP(ahorro)}` : 'Combo')
    ),
    el('section', { class: 'combo__cuerpo' },
      el('h3', { id: `${combo.id}-titulo` }, combo.nombre),
      el('p', {}, `Incluye: ${incluidos.map((m) => m.nombre).join(' + ')}`),
      el('footer', { class: 'combo__pie' },
        el('p', { class: 'combo__precios' },
          ahorro > 0 ? el('s', {}, precioCOP(normal)) : '',
          el('strong', {}, precioCOP(combo.precio)),
          el('small', {}, precioUSD(combo.precio, tienda.tasaUSD))
        ),
        el('button', { type: 'button', class: 'boton', 'data-comprar': combo.id, 'aria-label': `Comprar ${combo.nombre}`, 'aria-haspopup': 'dialog' }, 'Comprar combo')
      )
    )
  );
}

function renderCombos() {
  const seccion = document.getElementById('promos');
  const lista = document.getElementById('combos-lista');
  if (!combos.length) {
    seccion.hidden = true;
    return;
  }
  combos.forEach((c) => lista.append(el('li', {}, crearCombo(c))));
}

/** La sección de opiniones solo aparece si hay opiniones en los datos. */
function renderOpiniones() {
  const seccion = document.getElementById('opiniones');
  const lista = document.getElementById('opiniones-lista');
  if (!opiniones.length) return;
  seccion.hidden = false;
  opiniones.forEach((o) => lista.append(el('li', {},
    el('figure', { class: 'opinion' },
      el('blockquote', {}, el('p', {}, o.texto)),
      el('figcaption', {}, o.nombre)
    )
  )));
}

/** Botón "Compartir": usa el menú del sistema o copia el enlace directo al mod. */
function iniciarCompartir() {
  document.addEventListener('click', async (e) => {
    const boton = e.target.closest('[data-compartir]');
    if (!boton) return;
    const url = `${location.href.split('#')[0]}#${boton.dataset.compartir}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        boton.textContent = '¡Enlace copiado!';
        setTimeout(() => { boton.textContent = 'Compartir'; }, 2000);
      }
    } catch {
      /* el usuario canceló o el navegador no lo permite */
    }
  });
}

/** Resalta en el menú la sección visible (solo enlaces internos #). */
function iniciarNavegacion() {
  const enlaces = [...document.querySelectorAll('.menu a[href^="#"]')];
  const secciones = enlaces.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      enlaces.forEach((a) => {
        if (a.getAttribute('href') === `#${entrada.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-40% 0px -55% 0px' });

  secciones.forEach((s) => observador.observe(s));
}

/** Entrada de secciones. Con prefers-reduced-motion no se oculta nada. */
function iniciarRevelado() {
  if (reducirMovimiento || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-on');
  const observador = new IntersectionObserver((entradas, obs) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      }
    }
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach((s) => observador.observe(s));
}

iniciarVitrina();
renderFiltros();
renderCatalogo();
renderCombos();
renderOpiniones();
initGallery({
  items: mods.map((m) => ({ src: m.imagen, alt: m.alt, titulo: m.nombre })),
  lista: document.getElementById('galeria-lista'),
  visor: document.getElementById('visor')
});
initCarrito({ mods: mods.filter(esComprable), combos, contacto, tienda, dialogo: document.getElementById('carrito') });
initContacto(contacto);
iniciarCompartir();
iniciarNavegacion();
iniciarRevelado();

// Enlace directo (#id de un mod): las tarjetas se crean después de la carga, así que desplazamos a mano
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
