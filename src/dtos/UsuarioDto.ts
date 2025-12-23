export interface UsuarioDto {
  idUsuario: string;
  rut: string;
  nombreCompleto: string;
  correo: string;
  contraseña: string;
  rol: "admin" | "socio" | "deportista";
  fechaNacimiento: string;
  sexo: "Masculino" | "Femenino";
  fechaRegistro: string;
  telefono?: string;
  direccion?: string;
  comuna?: string;
  planSalud?: string;
  seguroComplementario?: string;
  centroSalud?: string;
  apoderado?: string;
  foto?: string;
}
