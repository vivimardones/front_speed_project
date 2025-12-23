import axios from "axios";
import type{ UsuarioDto } from "../dtos/UsuarioDto";

// URL de tu backend NestJS (ajusta si usas otro puerto o dominio)
const API_URL = "http://localhost:3000/usuarios";

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<UsuarioDto[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Crear un usuario
export const createUsuario = async (
  usuario: UsuarioDto
): Promise<UsuarioDto> => {
  const res = await axios.post(API_URL, usuario);
  return res.data;
};

// Actualizar un usuario
export const updateUsuario = async (
  id: string,
  usuario: Partial<UsuarioDto>
): Promise<UsuarioDto> => {
  const res = await axios.put(`${API_URL}/${id}`, usuario);
  return res.data;
};

// Eliminar un usuario
export const deleteUsuario = async (
  id: string
): Promise<{ mensaje: string }> => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
