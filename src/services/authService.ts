import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LoginDto } from '../dtos/LoginDto';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_AUTH_URL = `${API_BASE_URL}/auth`;

// Interface actualizada según la respuesta REAL del backend
export interface ApiLoginResponse {
  success: boolean;
  message: string;
  token: string;  // ← El JWT token
  usuario: {
    id: string;
    loginId: string;
    correo: string;  // ← Backend usa "correo"
    primerNombre: string;
    apellidoPaterno: string;
    verificado: boolean;
    roles: string[];  // ← Array de roles
  };
}

export interface LoginResponse {
  email: string;
  nombre: string;
  roles: string[];  // ← Cambiar a array
  userId: string;
}

export interface AuthUser {
  email: string;
  nombre: string;
  roles: string[];  // ← Array
  userId: string;
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
          window.location.href = '/login';
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
      // Cambiar email a correo y password a password
      const response = await axios.post<ApiLoginResponse>(`${API_AUTH_URL}/login`, {
        correo: dto.email,  // ← Backend espera "correo"
        password: dto.password
      });
      
      // Mapear correctamente los datos del backend
      const userData: LoginResponse = {
        email: response.data.usuario.correo,
        nombre: `${response.data.usuario.primerNombre} ${response.data.usuario.apellidoPaterno}`,
        roles: response.data.usuario.roles,  // ← Array completo
        userId: response.data.usuario.id,
      };
      
      // Guardar el TOKEN JWT real (NO el email)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);  // ← ¡EL TOKEN REAL!
      
      this.token = response.data.token;
      this.setAuthHeader();
      
      // Disparar evento para actualizar el contexto
      window.dispatchEvent(new CustomEvent('authUpdate', { detail: userData }));
      
      return userData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al iniciar sesión';
        throw new Error(message);
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
  
  // Método helper para verificar roles
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  }
}

export const authService = new AuthService();
export default authService;