export function formatRut(rut: string): string {
  // Elimina puntos y guion si existen
  const clean = rut.replace(/[^0-9kK]/g, "");
  if (!clean) return "";
  // Si ya viene con DV
  let cuerpo = clean;
  let dv = "";
  if (clean.length > 1) {
    if (clean.length > 8) {
      // Si viene con DV
      cuerpo = clean.slice(0, -1);
      dv = clean.slice(-1);
    } else {
      // Si no viene con DV, calcularlo
      cuerpo = clean;
      dv = calcularDV(cuerpo);
    }
  } else {
    return clean;
  }
  let formatted = "";
  let i = 0;
  for (let j = cuerpo.length - 1; j >= 0; j--) {
    formatted = cuerpo[j] + formatted;
    i++;
    if (i % 3 === 0 && j !== 0) {
      formatted = "." + formatted;
    }
  }
  return formatted + "-" + dv.toUpperCase();
}

function calcularDV(rut: string): string {
  let suma = 0;
  let multiplo = 2;
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const dv = 11 - (suma % 11);
  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
}
