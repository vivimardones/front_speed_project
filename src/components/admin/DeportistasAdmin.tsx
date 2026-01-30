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
import { getDeportistas, createDeportista, updateDeportista, deleteDeportista } from "../../services/adminService";

interface Deportista {
  id: string;
  nombre: string;
  rut: string;
  club: string;
  rama: string;
  categoria: string;
}

export default function DeportistasAdmin() {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Deportista>({
    id: "",
    nombre: "",
    rut: "",
    club: "",
    rama: "",
    categoria: "",
  });

  useEffect(() => {
    loadDeportistas();
  }, []);

  const loadDeportistas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDeportistas();
      setDeportistas(data || []);
    } catch (err) {
      setError("Error al cargar los deportistas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (deportista?: Deportista) => {
    if (deportista) {
      setFormData(deportista);
      setEditingId(deportista.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        nombre: "",
        rut: "",
        club: "",
        rama: "",
        categoria: "",
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
        await updateDeportista(editingId, formData);
      } else {
        await createDeportista(formData);
      }
      handleCloseDialog();
      await loadDeportistas();
    } catch (err) {
      setError("Error al guardar el deportista");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este deportista?")) {
      try {
        await deleteDeportista(id);
        await loadDeportistas();
      } catch (err) {
        setError("Error al eliminar el deportista");
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
          Administración de Deportistas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Deportista
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Club</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rama</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deportistas.map((deportista) => (
              <TableRow key={deportista.id} hover>
                <TableCell>{deportista.nombre}</TableCell>
                <TableCell>{deportista.rut}</TableCell>
                <TableCell>{deportista.club}</TableCell>
                <TableCell>{deportista.rama}</TableCell>
                <TableCell>{deportista.categoria}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(deportista)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(deportista.id)}
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
          {editingId ? "Editar Deportista" : "Nuevo Deportista"}
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
            label="RUT"
            value={formData.rut}
            onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Club"
            value={formData.club}
            onChange={(e) => setFormData({ ...formData, club: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rama Deportiva"
            value={formData.rama}
            onChange={(e) => setFormData({ ...formData, rama: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
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
