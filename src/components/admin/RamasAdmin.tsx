import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getRamas, createRama, updateRama, deleteRama } from "../../services/adminService";

interface Rama {
  id: string;
  nombre: string;
  descripcion: string;
  federacion: string;
}

export default function RamasAdmin() {
  const [ramas, setRamas] = useState<Rama[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Rama>({
    id: "",
    nombre: "",
    descripcion: "",
    federacion: "",
  });

  useEffect(() => {
    loadRamas();
  }, []);

  const loadRamas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRamas();
      setRamas(data || []);
    } catch (err) {
      setError("Error al cargar las ramas deportivas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (rama?: Rama) => {
    if (rama) {
      setFormData(rama);
      setEditingId(rama.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        nombre: "",
        descripcion: "",
        federacion: "",
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
        await updateRama(editingId, formData);
      } else {
        await createRama(formData);
      }
      handleCloseDialog();
      await loadRamas();
    } catch (err) {
      setError("Error al guardar la rama");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta rama?")) {
      try {
        await deleteRama(id);
        await loadRamas();
      } catch (err) {
        setError("Error al eliminar la rama");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Administración de Ramas Deportivas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Rama
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Federación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ramas.map((rama) => (
              <TableRow key={rama.id} hover>
                <TableCell>{rama.nombre}</TableCell>
                <TableCell>{rama.descripcion}</TableCell>
                <TableCell>{rama.federacion}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(rama)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(rama.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Editar Rama Deportiva" : "Nueva Rama Deportiva"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Federación"
            value={formData.federacion}
            onChange={(e) => setFormData({ ...formData, federacion: e.target.value })}
          />
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
