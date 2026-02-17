import authService from "./authService";
import type { UsuarioDto } from "../dtos/UsuarioDto";

// Usar la URL del archivo de env
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/usuarios`;

// Obtener la instancia de axios con los interceptores de autenticación
const getApiClient = () => authService.getAxiosInstance();

// Función helper para construir el nombre completo
const construirNombreCompleto = (usuario: UsuarioDto): string => {
  return [
    usuario.primerNombre,
    usuario.segundoNombre,
    usuario.tercerNombre,
    usuario.apellidoPaterno,
    usuario.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<UsuarioDto[]> => {
  const client = getApiClient();
  const res = await client.get<UsuarioDto[]>(API_URL);

  // Mapear y agregar nombreCompleto
  const usuarios = res.data.map((usuario: UsuarioDto) => ({
    ...usuario,
    nombreCompleto: construirNombreCompleto(usuario),
  }));

  return usuarios;
};

// Obtener un usuario por ID
export const getUsuario = async (id: string): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.get<UsuarioDto>(`${API_URL}/${id}`);

  // Agregar nombreCompleto
  const usuario: UsuarioDto = {
    ...res.data,
    nombreCompleto: construirNombreCompleto(res.data),
  };

  return usuario;
};

// Crear un usuario
export const createUsuario = async (
  usuario: UsuarioDto,
): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.post<UsuarioDto>(API_URL, usuario);
  return res.data;
};

// Actualizar un usuario
export const updateUsuario = async (
  id: string,
  usuario: Partial<UsuarioDto>,
): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.put<UsuarioDto>(`${API_URL}/${id}`, usuario);
  return res.data;
};

// Eliminar un usuario
export const deleteUsuario = async (
  id: string,
): Promise<{ mensaje: string }> => {
  const client = getApiClient();
  const res = await client.delete<{ mensaje: string }>(`${API_URL}/${id}`);
  return res.data;
};
