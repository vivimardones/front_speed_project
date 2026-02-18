import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useUsuarios } from "../hooks/useUsuarios";
import type { UsuarioDto } from "../dtos/UsuarioDto";
import { getUsuario } from "../services/usuariosService";

// --- Validaciones reutilizadas de Registro.tsx ---
function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validarRut(rut: string) {
  rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rut.length < 2) return false;
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const dvNum = 11 - (suma % 11);
  let dvEsperado: string;
  if (dvNum === 11) dvEsperado = "0";
  else if (dvNum === 10) dvEsperado = "K";
  else dvEsperado = String(dvNum);
  return dv === dvEsperado;
}
function validarTelefono(fono: string) {
  return /^\+56\d{9}$/.test(fono);
}
function calcularEdad(fechaNacimiento: string) {
  const hoy = new Date();
  const fn = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fn.getFullYear();
  const m = hoy.getMonth() - fn.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) {
    edad--;
  }
  return edad;
}

const Perfil: React.FC = () => {
  // Estado de errores para validación
  const [editErrors, setEditErrors] = useState<{ [k: string]: string }>({});
  const { user } = useAuth();
  const { crear, actualizar } = useUsuarios();

  // Estado para editar datos propios
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<UsuarioDto>>({});
  // Para controlar el switch de estado
  const estadoActivo = (editData.estado ?? "").toLowerCase() === "activo";
  const [editSuccess, setEditSuccess] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  // Estado para crear deportista
  const [createOpen, setCreateOpen] = useState(false);
  const [newDeportista, setNewDeportista] = useState<UsuarioDto>({
    primerNombre: "",
    apellidoPaterno: "",
    correo: "",
    roles: ["deportista"],
  });
  const [createSuccess, setCreateSuccess] = useState<string>("");
  const [createError, setCreateError] = useState<string>("");

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6">
          No hay información de usuario disponible.
        </Typography>
      </Box>
    );
  }

  // Handlers para editar datos propios
  const handleEditOpen = async () => {
    setEditSuccess("");
    setEditError("");
    try {
      if (user?.userId) {
        const datosCompletos = await getUsuario(user.userId);
        setEditData({
          primerNombre: datosCompletos.primerNombre || "",
          segundoNombre: datosCompletos.segundoNombre || "",
          tercerNombre: datosCompletos.tercerNombre || "",
          apellidoPaterno: datosCompletos.apellidoPaterno || "",
          apellidoMaterno: datosCompletos.apellidoMaterno || "",
          numeroIdentificador: datosCompletos.numeroIdentificador || "",
          correo: datosCompletos.correo || "",
          telefono: datosCompletos.telefono || "",
          telefonoEmergencia: datosCompletos.telefonoEmergencia || "",
          fechaNacimiento: datosCompletos.fechaNacimiento || "",
          sexo: datosCompletos.sexo || "",
          tipoIdentificador: datosCompletos.tipoIdentificador || "",
          estado: datosCompletos.estado || "",
        });
      }
      setEditOpen(true);
    } catch (err) {
      console.log(err);
      setEditError("No se pudieron cargar los datos completos del usuario");
    }
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name as keyof UsuarioDto]: value });
  };
  const handleTipoIdentificadorChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    // Si es RUT, bloquear y setear número identificador igual a rut
    if (value === "RUT") {
      setEditData((prev) => ({
        ...prev,
        tipoIdentificador: value,
        numeroIdentificador: prev.numeroIdentificador || "",
      }));
    } else {
      setEditData((prev) => ({ ...prev, tipoIdentificador: value }));
    }
  };
  // Validación similar a Registro.tsx
  function validarEdit() {
    const errs: { [k: string]: string } = {};
    if (!editData.primerNombre) errs.primerNombre = "Campo obligatorio";
    if (!editData.apellidoPaterno) errs.apellidoPaterno = "Campo obligatorio";
    if (!editData.apellidoMaterno) errs.apellidoMaterno = "Campo obligatorio";
    if (!editData.correo) errs.correo = "El correo es obligatorio";
    else if (!validarEmail(editData.correo)) errs.correo = "Correo inválido";
    if (!editData.fechaNacimiento) errs.fechaNacimiento = "Campo obligatorio";
    else {
      const edad = calcularEdad(editData.fechaNacimiento);
      if (edad < 10) errs.fechaNacimiento = "No se permiten menores de 10 años";
    }
    if (!editData.sexo) errs.sexo = "Campo obligatorio";
    if (!editData.tipoIdentificador)
      errs.tipoIdentificador = "Campo obligatorio";
    if (!editData.numeroIdentificador && editData.tipoIdentificador !== "RUT")
      errs.numeroIdentificador = "Campo obligatorio";
    if (
      (editData.tipoIdentificador === "RUT" ||
        editData.tipoIdentificador === "RUT_PROVISORIO") &&
      !validarRut(editData.numeroIdentificador || "")
    )
      errs.numeroIdentificador = "RUT inválido";
    if (
      editData.tipoIdentificador === "PASAPORTE" &&
      (editData.numeroIdentificador?.trim().length ?? 0) < 6
    )
      errs.numeroIdentificador = "Pasaporte inválido";
    if (!editData.telefono) errs.telefono = "Campo obligatorio";
    else if (!validarTelefono(editData.telefono))
      errs.telefono = "Formato: +569XXXXXXXX";
    if (
      editData.telefonoEmergencia &&
      !validarTelefono(editData.telefonoEmergencia)
    )
      errs.telefonoEmergencia = "Formato: +569XXXXXXXX";
    return errs;
  }

  const handleEditSave = async () => {
    const v = validarEdit();
    setEditErrors(v);
    if (Object.keys(v).length > 0) return;
    try {
      // Prepara el payload según el tipo de identificador
      let payload: Partial<UsuarioDto> = { ...editData };
      if (editData.tipoIdentificador === "RUT") {
        payload = {
          ...editData,
          numeroIdentificador: editData.numeroIdentificador,
        };
      } else {
        payload = {
          ...editData,
          numeroIdentificador: undefined,
        };
      }
      await actualizar(user.userId, payload);
      setEditSuccess("Datos actualizados correctamente");
      setEditError("");
      setEditOpen(false);
    } catch (err) {
      console.log(err);
      setEditError("Error al actualizar datos");
    }
  };

  // Handlers para crear deportista
  const handleCreateOpen = () => {
    setNewDeportista({
      primerNombre: "",
      apellidoPaterno: "",
      correo: "",
      roles: ["deportista"],
    });
    setCreateOpen(true);
    setCreateSuccess("");
    setCreateError("");
  };
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeportista({ ...newDeportista, [e.target.name]: e.target.value });
  };
  const handleCreateSave = async () => {
    try {
      await crear(newDeportista);
      setCreateSuccess("Deportista creado correctamente");
      setCreateError("");
      setCreateOpen(false);
    } catch (err) {
      console.log(err);
      setCreateError("Error al crear deportista");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          minWidth: 900,
          maxWidth: 1300,
          width: "100%",
          borderRadius: 4,
          boxShadow: 8,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: 40,
              bgcolor: "primary.main",
            }}
          >
            {user.nombre?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {user.nombre}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1, fontSize: 18 }}>
              {user.correo}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Roles:
            </Typography>
            <Typography>{user.roles?.join(", ") || "Sin roles"}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleEditOpen}
          >
            Modificar mis datos
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleCreateOpen}
          >
            Crear nuevo deportista
          </Button>
        </Box>
        {editSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {editSuccess}
          </Alert>
        )}
        {editError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {editError}
          </Alert>
        )}
        {createSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {createSuccess}
          </Alert>
        )}
        {createError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {createError}
          </Alert>
        )}
      </Paper>

      {/* Dialog para editar datos propios */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Modificar mis datos
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              label="Primer Nombre"
              name="primerNombre"
              value={editData.primerNombre || ""}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.primerNombre}
              helperText={editErrors.primerNombre}
            />
            <TextField
              label="Segundo Nombre"
              name="segundoNombre"
              value={editData.segundoNombre || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Tercer Nombre"
              name="tercerNombre"
              value={editData.tercerNombre || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Apellido Paterno"
              name="apellidoPaterno"
              value={editData.apellidoPaterno || ""}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.apellidoPaterno}
              helperText={editErrors.apellidoPaterno}
            />
            <TextField
              label="Apellido Materno"
              name="apellidoMaterno"
              value={editData.apellidoMaterno || ""}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.apellidoMaterno}
              helperText={editErrors.apellidoMaterno}
            />
            {editData.correo && (
              <TextField
                label="Correo"
                name="correo"
                value={editData.correo}
                onChange={handleEditChange}
                fullWidth
                error={!!editErrors.correo}
                helperText={editErrors.correo}
              />
            )}
            <TextField
              label="Teléfono"
              name="telefono"
              value={editData.telefono || ""}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.telefono}
              helperText={editErrors.telefono}
            />
            <TextField
              label="Teléfono Emergencia"
              name="telefonoEmergencia"
              value={editData.telefonoEmergencia || ""}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.telefonoEmergencia}
              helperText={editErrors.telefonoEmergencia}
            />
            <TextField
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              value={editData.fechaNacimiento || ""}
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={handleEditChange}
              fullWidth
              error={!!editErrors.fechaNacimiento}
              helperText={editErrors.fechaNacimiento}
              disabled
            />
            <FormControlLabel
              control={<Switch checked={estadoActivo} disabled />}
              label={estadoActivo ? "Activo" : "Inactivo"}
              sx={{ gridColumn: "3", gridRow: "4", justifySelf: "end" }}
            />
            <FormControl fullWidth error={!!editErrors.sexo}>
              <InputLabel id="sexo-label">Sexo</InputLabel>
              <Select
                labelId="sexo-label"
                name="sexo"
                value={editData.sexo || ""}
                label="Sexo"
                onChange={(event) => {
                  const { name, value } = event.target as {
                    name?: string;
                    value: unknown;
                  };
                  setEditData({
                    ...editData,
                    [name as keyof UsuarioDto]: value,
                  });
                }}
                disabled
              >
                <MenuItem value="femenino">Femenino</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
              </Select>
              {editErrors.sexo && (
                <Typography color="error" variant="caption">
                  {editErrors.sexo}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth error={!!editErrors.tipoIdentificador}>
              <InputLabel id="tipo-identificador-label">
                Tipo Identificador
              </InputLabel>
              <Select
                labelId="tipo-identificador-label"
                name="tipoIdentificador"
                value={editData.tipoIdentificador || ""}
                label="Tipo Identificador"
                onChange={handleTipoIdentificadorChange}
                disabled={
                  editData.tipoIdentificador === "RUT" && Boolean(editData.numeroIdentificador)
                }
              >
                <MenuItem value="RUT">RUT</MenuItem>
                <MenuItem value="RUT_PROVISORIO">RUT Provisorio</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                <MenuItem value="IDENTIFICADOR_EXTRANJERO">
                  Otro Identificador
                </MenuItem>
              </Select>
              {editErrors.tipoIdentificador && (
                <Typography color="error" variant="caption">
                  {editErrors.tipoIdentificador}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Número Identificador"
              name="numeroIdentificador"
              value={
                editData.tipoIdentificador === "RUT"
                  ? editData.numeroIdentificador || ""
                  : editData.numeroIdentificador || ""
              }
              onChange={handleEditChange}
              fullWidth
              disabled={
                editData.tipoIdentificador === "RUT" &&
                Boolean(
                  editData.numeroIdentificador && editData.numeroIdentificador === editData.numeroIdentificador,
                )
              }
              error={!!editErrors.numeroIdentificador}
              helperText={editErrors.numeroIdentificador}
            />
            {/* Switch de estado ahora está en la 3ra columna, 4ta fila */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para crear deportista */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Crear nuevo deportista
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Primer Nombre"
              name="primerNombre"
              value={newDeportista.primerNombre}
              onChange={handleCreateChange}
              fullWidth
            />
            <TextField
              label="Apellido Paterno"
              name="apellidoPaterno"
              value={newDeportista.apellidoPaterno}
              onChange={handleCreateChange}
              fullWidth
            />
            <TextField
              label="Correo"
              name="correo"
              value={newDeportista.correo}
              onChange={handleCreateChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateSave} variant="contained">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;
