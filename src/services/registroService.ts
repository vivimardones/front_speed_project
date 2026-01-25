import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function registrarUsuario(data: Record<string, string>) {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return response.data;
}
