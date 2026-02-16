export interface Dirigente {
  presidente?: string;
  secretario?: string;
  tesorero?: string;
  director?: string;
}

export interface Colores {
  primario?: string;
  secundario?: string;
  terciario?: string;
}

export interface Direccion {
  calle?: string;
  numero?: string;
  comuna?: string;
  ciudad?: string;
  region?: string;
}

export interface Club {
  id: string;
  nombreFantasia: string;
  nombreReal: string;
  fechaIniciacion: string;
  rut?: string;
  dirigentes?: Dirigente;
  fechaVencimientoVigencia?: string;
  colores?: Colores;
  direccionSede?: Direccion;
  escudo?: string;
  insignia?: string;
  vigencia?: boolean;
  correo?: string;
  telefono?: string;
  sitioWeb?: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClubDto {
  nombreFantasia: string;
  nombreReal: string;
  fechaIniciacion: string;
  rut?: string;
  dirigentes?: Dirigente;
  fechaVencimientoVigencia?: string;
  colores?: Colores;
  direccionSede?: Direccion;
  escudo?: string;
  insignia?: string;
  vigencia?: boolean;
  correo?: string;
  telefono?: string;
  sitioWeb?: string;
  descripcion?: string;
}