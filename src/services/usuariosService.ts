import authService from './authService';
import type { UsuarioDto } from '../dtos/UsuarioDto';

// Usar la URL del archivo de env
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/usuarios`;

// Obtener la instancia de axios con los interceptores de autenticación
const getApiClient = () => authService.getAxiosInstance();

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<UsuarioDto[]> => {
  const client = getApiClient();
  const res = await client.get(API_URL);
  return res.data;
};

// Obtener un usuario por ID
export const getUsuario = async (id: string): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/${id}`);
  return res.data;
};

// Crear un usuario
export const createUsuario = async (
  usuario: UsuarioDto
): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.post(API_URL, usuario);
  return res.data;
};

// Actualizar un usuario
export const updateUsuario = async (
  id: string,
  usuario: Partial<UsuarioDto>
): Promise<UsuarioDto> => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/${id}`, usuario);
  return res.data;
};

// Eliminar un usuario
export const deleteUsuario = async (
  id: string
): Promise<{ mensaje: string }> => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/${id}`);
  return res.data;
};
