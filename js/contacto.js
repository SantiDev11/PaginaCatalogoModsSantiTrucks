// js/contacto.js: enlaces de contacto compartidos por todas las páginas (pie y botón flotante)
export function initContacto(contacto) {
  const poner = (id, fn) => {
    const nodo = document.getElementById(id);
    if (nodo) fn(nodo);
  };
  poner('pie-correo', (a) => { a.href = `mailto:${contacto.email}`; a.textContent = contacto.email; });
  poner('pie-whatsapp', (a) => { a.href = `https://wa.me/${contacto.whatsapp}`; a.textContent = `WhatsApp ${contacto.whatsappVisible}`; });
  poner('pie-nequi', (p) => { p.textContent = `Pagos por Nequi: ${contacto.nequi}`; });
  poner('medida-wa', (a) => {
    a.href = `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent('Hola, quiero un mod personalizado (carpa, romarco, logo u otra idea). Te cuento lo que necesito:')}`;
  });
  poner('wa-flotante', (a) => {
    a.href = `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre sus mods de American Truck Simulator.')}`;
  });
}
