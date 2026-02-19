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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsuarios } from "../../services/usuariosService";
import { updateUsuario, deleteUsuario } from "../../services/usuariosService";
import type { UsuarioDto } from "../../dtos/UsuarioDto";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    loadUsuarios();
  }, []);

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
      setEditingId(usuario.idUsuario ?? null);
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
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateUsuario(editingId, formData);
      } else {
        // Para nuevo usuario, usar el servicio de creación
        alert("Para crear nuevos usuarios, use el formulario de registro");
      }
      handleCloseDialog();
      await loadUsuarios();
    } catch (err) {
      setError("Error al guardar el usuario");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUsuario(id);
        await loadUsuarios();
      } catch (err) {
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
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.idUsuario} hover>
                <TableCell>{usuario.nombreCompleto}</TableCell>
                <TableCell>{usuario.correo}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>{usuario.numeroIdentificador}</TableCell>
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

      {/* Dialog para editar */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={formData.nombreCompleto}
            onChange={(e) =>
              setFormData({ ...formData, nombreCompleto: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Número Identificador"
            value={formData.numeroIdentificador}
            onChange={(e) => setFormData({ ...formData, numeroIdentificador: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              label="Rol"
            >
              <MenuItem value="deportista">Deportista</MenuItem>
              <MenuItem value="apoderado">Apoderado</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="superadmin">SuperAdmin</MenuItem>
            </Select>
          </FormControl>
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
