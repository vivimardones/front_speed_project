export interface UsuarioDto {
  idUsuario?: string;
  id?: string;
  loginId?: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;
  correo?: string;
  telefono?: string;
  telefonoEmergencia?: string;
  fechaNacimiento?: string;
  sexo?: string;
  tipoIdentificador?: string;
  numeroIdentificador?: string;
  estado?: string;
  rol?: string;
  roles?: string[];
  deportistasAsignados?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
  clubId?: string;
}