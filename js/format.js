// js/format.js: formato de precios (pesos colombianos y equivalente en dólares)
const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' });

export const precioCOP = (n) => cop.format(n);
export const precioUSD = (n, tasa) => `≈ ${usd.format(n / tasa)}`;
