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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCampeonatos, createCampeonato, updateCampeonato, deleteCampeonato } from "../../services/adminService";

interface Campeonato {
  id: string;
  nombre: string;
  rama: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export default function CampeonatosAdmin() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Campeonato>({
    id: "",
    nombre: "",
    rama: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "Planificación",
  });

  useEffect(() => {
    loadCampeonatos();
  }, []);

  const loadCampeonatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampeonatos();
      setCampeonatos(data || []);
    } catch (err) {
      setError("Error al cargar los campeonatos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (campeonato?: Campeonato) => {
    if (campeonato) {
      setFormData(campeonato);
      setEditingId(campeonato.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        nombre: "",
        rama: "",
        fechaInicio: "",
        fechaFin: "",
        estado: "Planificación",
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
        await updateCampeonato(editingId, formData);
      } else {
        await createCampeonato(formData);
      }
      handleCloseDialog();
      await loadCampeonatos();
    } catch (err) {
      setError("Error al guardar el campeonato");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este campeonato?")) {
      try {
        await deleteCampeonato(id);
        await loadCampeonatos();
      } catch (err) {
        setError("Error al eliminar el campeonato");
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
          Administración de Campeonatos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Campeonato
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rama</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha Inicio</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha Fin</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campeonatos.map((campeonato) => (
              <TableRow key={campeonato.id} hover>
                <TableCell>{campeonato.nombre}</TableCell>
                <TableCell>{campeonato.rama}</TableCell>
                <TableCell>{campeonato.fechaInicio}</TableCell>
                <TableCell>{campeonato.fechaFin}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor:
                        campeonato.estado === "Activo" ? "#4caf50" : "#ff9800",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: "4px",
                    }}
                  >
                    {campeonato.estado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(campeonato)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(campeonato.id)}
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
          {editingId ? "Editar Campeonato" : "Nuevo Campeonato"}
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
            label="Rama Deportiva"
            value={formData.rama}
            onChange={(e) => setFormData({ ...formData, rama: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha Inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Fecha Fin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              label="Estado"
            >
              <MenuItem value="Planificación">Planificación</MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
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
