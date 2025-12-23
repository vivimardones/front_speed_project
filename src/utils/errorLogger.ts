import { AxiosError } from 'axios';

export interface ErrorLog {
  timestamp: string;
  context: string;
  message: string;
  stack?: string;
  response?: unknown;
}

export const logError = (error: unknown, context = ''): void => {
  const timestamp = new Date().toISOString();

  let message = 'Error desconocido';
  let stack: string | undefined;
  let response: unknown = null;

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  // Si es un error de Axios, podemos tiparlo correctamente
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    response = axiosError.response?.data;
  }

  const errorData: ErrorLog = {
    timestamp,
    context,
    message,
    stack,
    response,
  };

  console.error('Error log:', errorData);

  // Guardar en localStorage (opcional)
  const logs: ErrorLog[] = JSON.parse(localStorage.getItem('errorLogs') || '[]');
  logs.push(errorData);
  localStorage.setItem('errorLogs', JSON.stringify(logs));
};
