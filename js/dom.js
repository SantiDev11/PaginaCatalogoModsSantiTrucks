// js/dom.js: helper para crear elementos. Todo con textContent/append, nunca innerHTML.
export function el(tag, attrs = {}, ...hijos) {
  const nodo = document.createElement(tag);
  for (const [clave, valor] of Object.entries(attrs)) {
    if (valor !== undefined && valor !== null) nodo.setAttribute(clave, valor);
  }
  nodo.append(...hijos);
  return nodo;
}
