import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { createUsuario } from "../services/usuariosService";
import type { UsuarioDto } from "../dtos/UsuarioDto";
import type { SelectChangeEvent } from "@mui/material";

export default function UsuariosForm() {
  const [usuario, setUsuario] = useState<UsuarioDto>({
    idUsuario: "",
    rut: "",
    nombreCompleto: "",
    correo: "",
    contraseña: "",
    rol: "deportista",
    fechaNacimiento: "",
    sexo: "Femenino",
    fechaRegistro: new Date().toISOString(),
  });

  // Para TextField
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name as keyof UsuarioDto]: value });
  };

  // Para Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name as keyof UsuarioDto]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUsuario(usuario);
    alert("Usuario registrado con éxito");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField label="RUT" name="rut" onChange={handleInputChange} required />
      <TextField
        label="Nombre completo"
        name="nombreCompleto"
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Correo"
        name="correo"
        type="email"
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Contraseña"
        name="contraseña"
        type="password"
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Fecha de nacimiento"
        name="fechaNacimiento"
        type="date"
        InputLabelProps={{ shrink: true }}
        onChange={handleInputChange}
        required
      />

      <FormControl>
        <InputLabel>Sexo</InputLabel>
        <Select name="sexo" value={usuario.sexo} onChange={handleSelectChange}>
          <MenuItem value="Masculino">Masculino</MenuItem>
          <MenuItem value="Femenino">Femenino</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Rol</InputLabel>
        <Select name="rol" value={usuario.rol} onChange={handleSelectChange}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="socio">Socio</MenuItem>
          <MenuItem value="deportista">Deportista</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Foto (URL)" name="foto" onChange={handleInputChange} />

      <Button type="submit" variant="contained" color="primary">
        Registrar Usuario
      </Button>
    </Box>
  );
}
