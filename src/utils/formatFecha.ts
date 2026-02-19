export function formatFecha(fecha: string | undefined): string {
  if (!fecha) return "";
  // Soporta fechas tipo 'YYYY-MM-DD' o ISO
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
