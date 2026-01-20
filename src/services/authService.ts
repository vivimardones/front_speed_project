import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LoginDto } from '../dtos/LoginDto';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_AUTH_URL = `${API_BASE_URL}/auth`;

export interface LoginResponse {
  idUsuario: string;
  nombre: string;
  rol: string;
}

export interface AuthUser {
  idUsuario: string;
  nombre: string;
  rol: string;
}

class AuthService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Cargar token del localStorage si existe
    this.token = localStorage.getItem('token');
    this.setAuthHeader();

    // Interceptor para agregar token a todas las peticiones
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader() {
    if (this.token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_AUTH_URL}/login`, dto);
      
      // Aquí podrías guardar el token si tu API lo devuelve
      // De momento guardamos los datos del usuario
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.idUsuario);
      
      this.token = response.data.idUsuario;
      this.setAuthHeader();
      
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const authService = new AuthService();
export default authService;
