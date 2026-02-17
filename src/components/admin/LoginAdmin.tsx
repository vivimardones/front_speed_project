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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLogins } from "../../services/adminService";

interface LoginRecord {
  id: string;
  usuario: string;
  email: string;
  fecha: string;
  hora: string;
  estado: string;
}

export default function LoginAdmin() {
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginRecord>({
    id: "",
    usuario: "",
    email: "",
    fecha: "",
    hora: "",
    estado: "Exitoso",
  });

  useEffect(() => {
    loadLogins();
  }, []);

  const loadLogins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLogins();
      setLogins(data || []);
    } catch (err) {
      setError("Error al cargar los registros de login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (login?: LoginRecord) => {
    if (login) {
      setFormData(login);
      setEditingId(login.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        usuario: "",
        email: "",
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toLocaleTimeString(),
        estado: "Exitoso",
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
        // Aquí iría la llamada a updateLogin cuando esté disponible
        // await updateLogin(editingId, formData);
      }
      handleCloseDialog();
      await loadLogins();
    } catch (err) {
      setError("Error al guardar el registro");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        // Aquí iría la llamada a deleteLogin cuando esté disponible
        setLogins(logins.filter((l) => l.id !== id));
        await loadLogins();
      } catch (err) {
        setError("Error al eliminar el registro");
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
          Administración de Usuarios de Login
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Registrar Login
        </Button>
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
              <TableCell sx={{ fontWeight: "bold" }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hora</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logins.map((login) => (
              <TableRow key={login.id} hover>
                <TableCell>{login.usuario}</TableCell>
                <TableCell>{login.email}</TableCell>
                <TableCell>{login.fecha}</TableCell>
                <TableCell>{login.hora}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor:
                        login.estado === "Exitoso" ? "#4caf50" : "#f44336",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: "4px",
                    }}
                  >
                    {login.estado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(login)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(login.id)}
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
        <DialogTitle>
          {editingId ? "Editar Login" : "Registrar Login"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Usuario"
            value={formData.usuario}
            onChange={(e) =>
              setFormData({ ...formData, usuario: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Hora"
            type="time"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value })
              }
              label="Estado"
            >
              <MenuItem value="Exitoso">Exitoso</MenuItem>
              <MenuItem value="Fallido">Fallido</MenuItem>
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
