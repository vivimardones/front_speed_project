import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuariosService';
import type { UsuarioDto } from '../dtos/UsuarioDto';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (usuario: UsuarioDto) => {
    const nuevo = await createUsuario(usuario);
    setUsuarios((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const actualizar = async (id: string, usuario: Partial<UsuarioDto>) => {
    const actualizado = await updateUsuario(id, usuario);
    setUsuarios((prev) =>
      prev.map((u) => (u.idUsuario === id ? actualizado : u))
    );
    return actualizado;
  };

  const eliminar = async (id: string) => {
    await deleteUsuario(id);
    setUsuarios((prev) => prev.filter((u) => u.idUsuario !== id));
  };

  useEffect(() => {
    cargar();
  }, []);

  return { usuarios, loading, error, cargar, crear, actualizar, eliminar };
};
