// js/dialog.js: comportamiento accesible compartido por los <dialog> (visor y compra)
const FOCUSABLES = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Cierre con Escape, clic en el fondo o [data-accion="cerrar"], foco atrapado
 * y foco devuelto al elemento que abrió el diálogo.
 */
export function prepararDialogo(dialogo, { alTeclear } = {}) {
  let origen = null;

  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo || e.target.closest('[data-accion="cerrar"]')) dialogo.close();
  });

  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dialogo.close();
    } else if (e.key === 'Tab') {
      const foco = [...dialogo.querySelectorAll(FOCUSABLES)].filter((n) => !n.hidden);
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    } else {
      alTeclear?.(e);
    }
  });

  dialogo.addEventListener('close', () => origen?.focus());

  return {
    abrir(desde) {
      origen = desde;
      dialogo.showModal();
    }
  };
}
