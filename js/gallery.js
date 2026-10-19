// js/gallery.js: galería de miniaturas y lightbox accesible
import { prepararDialogo } from './dialog.js';

export function initGallery({ items, lista, visor }) {
  const img = visor.querySelector('#visor-img');
  const pie = visor.querySelector('#visor-pie');
  const contador = visor.querySelector('#visor-contador');
  const titulo = visor.querySelector('#visor-titulo');
  const btnAnterior = visor.querySelector('[data-accion="anterior"]');
  const btnSiguiente = visor.querySelector('[data-accion="siguiente"]');
  const hayVarias = items.length > 1;
  let actual = 0;

  const dialogo = prepararDialogo(visor, {
    alTeclear(e) {
      if (!hayVarias) return;
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
      if (e.key === 'ArrowRight') mostrar(actual + 1);
    }
  });

  items.forEach((item, i) => {
    const miniatura = document.createElement('img');
    miniatura.src = item.src;
    miniatura.alt = item.alt;
    miniatura.loading = 'lazy';

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.setAttribute('aria-haspopup', 'dialog');
    boton.append(miniatura);
    boton.addEventListener('click', () => {
      mostrar(i);
      dialogo.abrir(boton);
    });

    const li = document.createElement('li');
    li.append(boton);
    lista.append(li);
  });

  btnAnterior.hidden = btnSiguiente.hidden = !hayVarias;
  btnAnterior.addEventListener('click', () => mostrar(actual - 1));
  btnSiguiente.addEventListener('click', () => mostrar(actual + 1));

  function mostrar(i) {
    actual = (i + items.length) % items.length;
    const item = items[actual];
    img.src = item.src;
    img.alt = item.alt;
    titulo.textContent = item.titulo;
    pie.textContent = item.alt;
    contador.textContent = `${actual + 1} de ${items.length}`;
  }
}
