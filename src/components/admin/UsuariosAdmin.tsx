import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  capitalize,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsuarios } from "../../services/usuariosService";
import { updateUsuario, deleteUsuario } from "../../services/usuariosService";
import type { UsuarioDto } from "../../dtos/UsuarioDto";
import { formatRut } from "../../utils/formatRut";
import { formatFecha } from "../../utils/formatFecha";
import { useAuth } from "../../hooks/useAuth";

export default function UsuariosAdmin() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Remueve las propiedades que la API no permite actualizar
  function limpiarUsuarioUpdate(data: Partial<UsuarioDto>) {
    // Elimina id, createdAt, updatedAt, nombreCompleto (y puedes agregar más)
    // Solo envía lo que la API espera
    const { id, createdAt, updatedAt, nombreCompleto, ...rest } = data;
    console.log(
      "Limpiando datos para updateUsuario:",
      id,
      createdAt,
      updatedAt,
      nombreCompleto,
    );
    return rest;
  }

  const [formData, setFormData] = useState<UsuarioDto>({
    idUsuario: "",
    numeroIdentificador: "",
    nombreCompleto: "",
    correo: "",
    rol: "deportista",
    fechaNacimiento: "",
    sexo: "Femenino",
    primerNombre: "",
    apellidoPaterno: "",
  });

  useEffect(() => {
    if (user) {
      loadUsuarios();
    }
  }, [user]);
  const estadoActivo = (formData.estado ?? "").toLowerCase() === "activo";
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (usuario?: UsuarioDto) => {
    if (usuario) {
      setFormData(usuario);
    } else {
      setFormData({
        idUsuario: "",
        numeroIdentificador: "",
        nombreCompleto: "",
        correo: "",
        rol: "deportista",
        fechaNacimiento: "",
        sexo: "Femenino",
        primerNombre: "",
        apellidoPaterno: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    console.log("Guardando usuario con datos:", formData);
    const fallbackId = formData.id || formData.idUsuario || "123fake";
    try {
      setLoading(true);
      const datosLimpios = limpiarUsuarioUpdate(formData);
      console.log("Datos limpios para update:", datosLimpios);
      await updateUsuario(fallbackId, datosLimpios);
      await loadUsuarios();
      handleCloseDialog();
    } catch (err) {
      setError("Error guardando usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        setLoading(true);
        // Buscar el usuario por idUsuario o id
        const usuario = usuarios.find((u) => u.idUsuario === id || u.id === id);
        const userId = usuario?.id || usuario?.idUsuario || id;
        await deleteUsuario(userId);
        await loadUsuarios();
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Error al eliminar el usuario");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Administración de Usuarios
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre Completo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha Nacimiento
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sexo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.idUsuario} hover>
                <TableCell>{usuario.nombreCompleto}</TableCell>
                <TableCell>
                  {usuario.numeroIdentificador
                    ? formatRut(usuario.numeroIdentificador)
                    : ""}
                </TableCell>
                <TableCell>{formatFecha(usuario.fechaNacimiento)}</TableCell>
                <TableCell>
                  {usuario.sexo
                    ? usuario.sexo.charAt(0).toUpperCase() +
                      usuario.sexo.slice(1).toLowerCase()
                    : ""}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(usuario)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(usuario.idUsuario ?? "")}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog avanzado para editar usuario */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Editar Usuario - {formData.nombreCompleto}
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
              value={capitalize(formData.primerNombre || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primerNombre: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Segundo Nombre"
              name="segundoNombre"
              value={capitalize(formData.segundoNombre || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  segundoNombre: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Tercer Nombre"
              name="tercerNombre"
              value={capitalize(formData.tercerNombre || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tercerNombre: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Apellido Paterno"
              name="apellidoPaterno"
              value={capitalize(formData.apellidoPaterno || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  apellidoPaterno: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Apellido Materno"
              name="apellidoMaterno"
              value={capitalize(formData.apellidoMaterno || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  apellidoMaterno: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Apellido Materno"
              name="apellidoMaterno"
              value={capitalize(formData.apellidoMaterno || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  apellidoMaterno: capitalize(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono || ""}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Teléfono Emergencia"
              name="telefonoEmergencia"
              value={formData.telefonoEmergencia || ""}
              onChange={(e) =>
                setFormData({ ...formData, telefonoEmergencia: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento || ""}
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setFormData({ ...formData, fechaNacimiento: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="sexo-label">Sexo</InputLabel>
              <Select
                labelId="sexo-label"
                name="sexo"
                value={formData.sexo || ""}
                label="Sexo"
                onChange={(e) =>
                  setFormData({ ...formData, sexo: e.target.value })
                }
              >
                <MenuItem value="femenino">Femenino</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="tipo-identificador-label">
                Tipo Identificador
              </InputLabel>
              <Select
                labelId="tipo-identificador-label"
                name="tipoIdentificador"
                value={formData.tipoIdentificador || ""}
                label="Tipo Identificador"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoIdentificador: e.target.value,
                  })
                }
              >
                <MenuItem value="RUT">RUT</MenuItem>
                <MenuItem value="RUT_PROVISORIO">RUT Provisorio</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                <MenuItem value="IDENTIFICADOR_EXTRANJERO">
                  Otro Identificador
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={
                ["RUT", "RUT_PROVISORIO"].includes(
                  formData.tipoIdentificador || "",
                ) && formData.numeroIdentificador
                  ? `Número Identificador`
                  : "Número Identificador"
              }
              name="numeroIdentificador"
              value={
                (formData.numeroIdentificador || "") +
                " - " +
                (formatRut(formData.numeroIdentificador || "").split("-")[1] ||
                  "")
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numeroIdentificador: e.target.value,
                })
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={estadoActivo}
                  onChange={(_, checked) =>
                    setFormData({
                      ...formData,
                      estado: checked ? "activo" : "inactivo",
                    })
                  }
                />
              }
              label={estadoActivo ? "Activo" : "Inactivo"}
              sx={{ gridColumn: "3", gridRow: "4", justifySelf: "end" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
