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
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getSeries,
  createSerie,
  updateSerie,
  deleteSerie,
} from "../../services/adminService";

interface Serie {
  id: string;
  nombre: string;
  campeonato: string;
  rama: string;
  categoria: string;
  numeroParticipantes: number;
}

export default function SeriesAdmin() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Serie>({
    id: "",
    nombre: "",
    campeonato: "",
    rama: "",
    categoria: "",
    numeroParticipantes: 0,
  });

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSeries();
      setSeries(data || []);
    } catch (err) {
      setError("Error al cargar las series");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (serie?: Serie) => {
    if (serie) {
      setFormData(serie);
      setEditingId(serie.id);
    } else {
      setFormData({
        id: Date.now().toString(),
        nombre: "",
        campeonato: "",
        rama: "",
        categoria: "",
        numeroParticipantes: 0,
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
        await updateSerie(editingId, formData);
      } else {
        await createSerie(formData);
      }
      handleCloseDialog();
      await loadSeries();
    } catch (err) {
      setError("Error al guardar la serie");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta serie?")) {
      try {
        await deleteSerie(id);
        await loadSeries();
      } catch (err) {
        setError("Error al eliminar la serie");
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
          Administración de Series
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Serie
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
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Campeonato</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rama</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Participantes</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {series.map((serie) => (
              <TableRow key={serie.id} hover>
                <TableCell>{serie.nombre}</TableCell>
                <TableCell>{serie.campeonato}</TableCell>
                <TableCell>{serie.rama}</TableCell>
                <TableCell>{serie.categoria}</TableCell>
                <TableCell>{serie.numeroParticipantes}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(serie)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(serie.id)}
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingId ? "Editar Serie" : "Nueva Serie"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Campeonato"
            value={formData.campeonato}
            onChange={(e) =>
              setFormData({ ...formData, campeonato: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Número de Participantes"
            type="number"
            value={formData.numeroParticipantes}
            onChange={(e) =>
              setFormData({
                ...formData,
                numeroParticipantes: parseInt(e.target.value) || 0,
              })
            }
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
