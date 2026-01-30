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
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../../services/adminService";

interface Categoria {
  id: string;
  nombre: string;
  edadMinima: number;
  edadMaxima: number;
  rama: string;
}

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Categoria>({
    id: "",
    nombre: "",
    edadMinima: 0,
    edadMaxima: 0,
    rama: "",
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategorias();
      setCategorias(data || []);
    } catch (err) {
      setError("Error al cargar las categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (categoria?: Categoria) => {
    if (categoria) {
      setFormData(categoria);
      setEditingId(categoria.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        nombre: "",
        edadMinima: 0,
        edadMaxima: 0,
        rama: "",
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
        await updateCategoria(editingId, formData);
      } else {
        await createCategoria(formData);
      }
      handleCloseDialog();
      await loadCategorias();
    } catch (err) {
      setError("Error al guardar la categoría");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await deleteCategoria(id);
        await loadCategorias();
      } catch (err) {
        setError("Error al eliminar la categoría");
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
          Administración de Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Categoría
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Edad Mínima</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Edad Máxima</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rama</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id} hover>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>{categoria.edadMinima}</TableCell>
                <TableCell>{categoria.edadMaxima}</TableCell>
                <TableCell>{categoria.rama}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(categoria)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(categoria.id)}
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
          {editingId ? "Editar Categoría" : "Nueva Categoría"}
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
            label="Edad Mínima"
            type="number"
            value={formData.edadMinima}
            onChange={(e) => setFormData({ ...formData, edadMinima: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Edad Máxima"
            type="number"
            value={formData.edadMaxima}
            onChange={(e) => setFormData({ ...formData, edadMaxima: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rama Deportiva"
            value={formData.rama}
            onChange={(e) => setFormData({ ...formData, rama: e.target.value })}
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
