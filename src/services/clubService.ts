import authService from "./authService";
import type { Club, CreateClubDto } from "../types/club.types";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definido en el archivo .env");
}

const getApiClient = () => authService.getAxiosInstance();

// CRUD Clubes
export const getClubes = async (): Promise<Club[]> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getClubById = async (id: string): Promise<Club> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes/${id}`);
  return res.data;
};

export const createClub = async (club: CreateClubDto): Promise<Club> => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/clubes`, club);
  return res.data;
};

export const updateClub = async (
  id: string,
  club: Partial<CreateClubDto>,
): Promise<Club> => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/clubes/${id}`, club);
  return res.data;
};

export const deleteClub = async (id: string): Promise<void> => {
  const client = getApiClient();
  await client.delete(`${API_URL}/clubes/${id}`);
};

// Upload de imágenes
export const uploadClubImage = async (
  clubId: string,
  file: File,
  type: "escudo" | "insignia",
): Promise<{ url: string }> => {
  const client = getApiClient();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await client.post(
    `${API_URL}/clubes/${clubId}/upload-image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

export const deleteClubImage = async (
  clubId: string,
  type: "escudo" | "insignia",
): Promise<{ success: boolean; message: string }> => {
  const client = getApiClient();
  const res = await client.delete(
    `${API_URL}/clubes/${clubId}/delete-image/${type}`,
  );
  return res.data;
};

// Búsquedas
export const searchClubesByNombre = async (nombre: string): Promise<Club[]> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes/search/nombre/${nombre}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const searchClubByRut = async (rut: string): Promise<Club | null> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes/search/rut/${rut}`);
  return res.data;
};

export const getClubesVigentes = async (): Promise<Club[]> => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes/vigentes/all`);
  return Array.isArray(res.data) ? res.data : [];
};

export const updateVigencia = async (
  id: string,
  vigencia: boolean,
): Promise<{ id: string; vigencia: boolean }> => {
  const client = getApiClient();
  const res = await client.patch(`${API_URL}/clubes/${id}/vigencia`, {
    vigencia,
  });
  return res.data;
};
