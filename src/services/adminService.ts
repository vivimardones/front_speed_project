import authService from './authService';

// Obtener la URL base desde el archivo .env (VITE_API_URL). No usar hardcode.
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  // Lanzar error temprano para que el desarrollador configure correctamente el .env
  // Evita que el front compile con una URL por defecto no deseada.
  throw new Error('VITE_API_URL no está definido en el archivo .env');
}

const getApiClient = () => authService.getAxiosInstance();

// Types
interface Club {
  id?: string;
  nombre: string;
  ciudad: string;
  telefono: string;
  correo: string;
}

interface Rama {
  id?: string;
  nombre: string;
  descripcion: string;
  federacion: string;
}

interface Campeonato {
  id?: string;
  nombre: string;
  rama: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface Deportista {
  id?: string;
  nombre: string;
  rut: string;
  club: string;
  rama: string;
  categoria: string;
}

interface Categoria {
  id?: string;
  nombre: string;
  edadMinima: number;
  edadMaxima: number;
  rama: string;
}

interface Serie {
  id?: string;
  nombre: string;
  campeonato: string;
  rama: string;
  categoria: string;
  numeroParticipantes: number;
}

// Clubes
export const getClubes = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/clubes`);
  return Array.isArray(res.data) ? res.data : [];
};

export const createClub = async (club: Club) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/clubes`, club);
  return res.data;
};

export const updateClub = async (id: string, club: Club) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/clubes/${id}`, club);
  return res.data;
};

export const deleteClub = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/clubes/${id}`);
  return res.data;
};

// Ramas Deportivas
export const getRamas = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/ramas`);
  return Array.isArray(res.data) ? res.data : [];
};

export const createRama = async (rama: Rama) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/ramas`, rama);
  return res.data;
};

export const updateRama = async (id: string, rama: Rama) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/ramas/${id}`, rama);
  return res.data;
};

export const deleteRama = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/ramas/${id}`);
  return res.data;
};

// Campeonatos
export const getCampeonatos = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/campeonatos`);
  return Array.isArray(res.data) ? res.data : [];
};

export const createCampeonato = async (campeonato: Campeonato) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/campeonatos`, campeonato);
  return res.data;
};

export const updateCampeonato = async (id: string, campeonato: Campeonato) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/campeonatos/${id}`, campeonato);
  return res.data;
};

export const deleteCampeonato = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/campeonatos/${id}`);
  return res.data;
};

// Deportistas
export const getDeportistas = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/deportistas`);
  return Array.isArray(res.data) ? res.data : [];
};

export const createDeportista = async (deportista: Deportista) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/deportistas`, deportista);
  return res.data;
};

export const updateDeportista = async (id: string, deportista: Deportista) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/deportistas/${id}`, deportista);
  return res.data;
};

export const deleteDeportista = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/deportistas/${id}`);
  return res.data;
};

// Categorías
export const getCategorias = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/categorias`);
  return Array.isArray(res.data) ? res.data : [];
};

export const createCategoria = async (categoria: Categoria) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/categorias`, categoria);
  return res.data;
};

export const updateCategoria = async (id: string, categoria: Categoria) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/categorias/${id}`, categoria);
  return res.data;
};

export const deleteCategoria = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/categorias/${id}`);
  return res.data;
};

// Series
export const getSeries = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/series`);
  // Asegurar que siempre retorna un array
  return Array.isArray(res.data) ? res.data : [];
};

export const createSerie = async (serie: Serie) => {
  const client = getApiClient();
  const res = await client.post(`${API_URL}/series`, serie);
  return res.data;
};

export const updateSerie = async (id: string, serie: Serie) => {
  const client = getApiClient();
  const res = await client.put(`${API_URL}/series/${id}`, serie);
  return res.data;
};

export const deleteSerie = async (id: string) => {
  const client = getApiClient();
  const res = await client.delete(`${API_URL}/series/${id}`);
  return res.data;
};

// Logins (Para auditoría)
export const getLogins = async () => {
  const client = getApiClient();
  const res = await client.get(`${API_URL}/auth/login`);
  // Devolver exactamente lo que trae la API (no filtrar passwords desde front)
  return Array.isArray(res.data) ? res.data : [];
};
