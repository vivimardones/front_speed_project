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
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  Chip,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getClubes,
  createClub,
  updateClub,
  deleteClub,
  uploadClubImage,
} from "../../services/clubService";
import type { Club, CreateClubDto } from "../../types/club.types";

const steps = [
  "Información Básica",
  "Dirigentes",
  "Contacto y Ubicación",
  "Colores e Imágenes",
];

const INITIAL_FORM_DATA: CreateClubDto = {
  nombreFantasia: "",
  nombreReal: "",
  fechaIniciacion: "",
  rut: "",
  dirigentes: {
    presidente: "",
    secretario: "",
    tesorero: "",
    director: "",
  },
  colores: {
    primario: "#4169E1",
    secundario: "#FF4500",
    terciario: "#FFFFFF",
  },
  direccionSede: {
    calle: "",
    numero: "",
    comuna: "",
    ciudad: "",
    region: "",
  },
  correo: "",
  telefono: "",
  sitioWeb: "",
  descripcion: "",
  vigencia: true,
};

export default function ClubesAdmin() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateClubDto>(INITIAL_FORM_DATA);

  // Estados para imágenes
  const [escudoFile, setEscudoFile] = useState<File | null>(null);
  const [escudoPreview, setEscudoPreview] = useState<string | null>(null);
  const [insigniaFile, setInsigniaFile] = useState<File | null>(null);
  const [insigniaPreview, setInsigniaPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadClubes();
  }, []);

  const loadClubes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClubes();
      setClubs(data || []);
    } catch (err) {
      setError("Error al cargar los clubes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (club?: Club) => {
    if (club) {
      setFormData({
        nombreFantasia: club.nombreFantasia,
        nombreReal: club.nombreReal,
        fechaIniciacion: club.fechaIniciacion,
        rut: club.rut || "",
        dirigentes: club.dirigentes || INITIAL_FORM_DATA.dirigentes,
        colores: club.colores || INITIAL_FORM_DATA.colores,
        direccionSede: club.direccionSede || INITIAL_FORM_DATA.direccionSede,
        correo: club.correo || "",
        telefono: club.telefono || "",
        sitioWeb: club.sitioWeb || "",
        descripcion: club.descripcion || "",
        vigencia: club.vigencia ?? true,
      });
      setEscudoPreview(club.escudo || null);
      setInsigniaPreview(club.insignia || null);
      setEditingId(club.id);
    } else {
      setFormData(INITIAL_FORM_DATA);
      setEscudoPreview(null);
      setInsigniaPreview(null);
      setEditingId(null);
    }
    setActiveStep(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setActiveStep(0);
    setEscudoFile(null);
    setInsigniaFile(null);
    setEscudoPreview(null);
    setInsigniaPreview(null);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "escudo" | "insignia",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "escudo") {
        setEscudoFile(file);
        setEscudoPreview(URL.createObjectURL(file));
      } else {
        setInsigniaFile(file);
        setInsigniaPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async () => {
    try {
      let clubId = editingId;

      // 1. Crear o actualizar el club
      if (editingId) {
        await updateClub(editingId, formData);
      } else {
        const newClub = await createClub(formData);
        clubId = newClub.id;
      }

      // 2. Subir imágenes si existen
      if (clubId) {
        if (escudoFile) {
          setUploadingImage(true);
          await uploadClubImage(clubId, escudoFile, "escudo");
        }
        if (insigniaFile) {
          setUploadingImage(true);
          await uploadClubImage(clubId, insigniaFile, "insignia");
        }
      }

      handleCloseDialog();
      await loadClubes();
    } catch (err) {
      setError("Error al guardar el club");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este club?")) {
      try {
        await deleteClub(id);
        await loadClubes();
      } catch (err) {
        setError("Error al eliminar el club");
        console.error(err);
      }
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              required
              label="Nombre Fantasía"
              value={formData.nombreFantasia}
              onChange={(e) =>
                setFormData({ ...formData, nombreFantasia: e.target.value })
              }
            />
            <TextField
              fullWidth
              required
              label="Nombre Real"
              value={formData.nombreReal}
              onChange={(e) =>
                setFormData({ ...formData, nombreReal: e.target.value })
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha Iniciación"
                value={formData.fechaIniciacion}
                onChange={(e) =>
                  setFormData({ ...formData, fechaIniciacion: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="RUT"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.vigencia}
                  onChange={(e) =>
                    setFormData({ ...formData, vigencia: e.target.checked })
                  }
                />
              }
              label="Club Vigente"
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Presidente"
                value={formData.dirigentes?.presidente || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dirigentes: {
                      ...formData.dirigentes,
                      presidente: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                label="Secretario"
                value={formData.dirigentes?.secretario || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dirigentes: {
                      ...formData.dirigentes,
                      secretario: e.target.value,
                    },
                  })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tesorero"
                value={formData.dirigentes?.tesorero || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dirigentes: {
                      ...formData.dirigentes,
                      tesorero: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                label="Director"
                value={formData.dirigentes?.director || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dirigentes: {
                      ...formData.dirigentes,
                      director: e.target.value,
                    },
                  })
                }
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Correo"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
              />
            </Box>
            <TextField
              fullWidth
              label="Sitio Web"
              value={formData.sitioWeb}
              onChange={(e) =>
                setFormData({ ...formData, sitioWeb: e.target.value })
              }
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Dirección Sede
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Calle"
                sx={{ flex: 3 }}
                value={formData.direccionSede?.calle || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccionSede: {
                      ...formData.direccionSede,
                      calle: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                label="Número"
                sx={{ flex: 1 }}
                value={formData.direccionSede?.numero || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccionSede: {
                      ...formData.direccionSede,
                      numero: e.target.value,
                    },
                  })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Comuna"
                value={formData.direccionSede?.comuna || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccionSede: {
                      ...formData.direccionSede,
                      comuna: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.direccionSede?.ciudad || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccionSede: {
                      ...formData.direccionSede,
                      ciudad: e.target.value,
                    },
                  })
                }
              />
            </Box>
            <TextField
              fullWidth
              label="Región"
              value={formData.direccionSede?.region || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccionSede: {
                    ...formData.direccionSede,
                    region: e.target.value,
                  },
                })
              }
            />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1">Colores del Club</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                type="color"
                label="Color Primario"
                value={formData.colores?.primario || "#4169E1"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colores: { ...formData.colores, primario: e.target.value },
                  })
                }
              />
              <TextField
                fullWidth
                type="color"
                label="Color Secundario"
                value={formData.colores?.secundario || "#FF4500"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colores: {
                      ...formData.colores,
                      secundario: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                type="color"
                label="Color Terciario"
                value={formData.colores?.terciario || "#FFFFFF"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colores: { ...formData.colores, terciario: e.target.value },
                  })
                }
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {/* Escudo */}
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Escudo del Club
                  </Typography>
                  {escudoPreview && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={escudoPreview}
                      alt="Escudo"
                      sx={{ objectFit: "contain", mb: 2 }}
                    />
                  )}
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="escudo-upload"
                    type="file"
                    onChange={(e) => handleImageChange(e, "escudo")}
                  />
                  <label htmlFor="escudo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      fullWidth
                    >
                      {escudoPreview ? "Cambiar Escudo" : "Subir Escudo"}
                    </Button>
                  </label>
                </CardContent>
              </Card>

              {/* Insignia */}
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Insignia del Club
                  </Typography>
                  {insigniaPreview && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={insigniaPreview}
                      alt="Insignia"
                      sx={{ objectFit: "contain", mb: 2 }}
                    />
                  )}
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="insignia-upload"
                    type="file"
                    onChange={(e) => handleImageChange(e, "insignia")}
                  />
                  <label htmlFor="insignia-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      fullWidth
                    >
                      {insigniaPreview ? "Cambiar Insignia" : "Subir Insignia"}
                    </Button>
                  </label>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );
      default:
        return null;
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
          Administración de Clubes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Club
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
              <TableCell sx={{ fontWeight: "bold" }}>Escudo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre Fantasía</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre Real</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Vigencia</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id} hover>
                <TableCell>
                  {club.escudo && (
                    <img
                      src={club.escudo}
                      alt={club.nombreFantasia}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{club.nombreFantasia}</TableCell>
                <TableCell>{club.nombreReal}</TableCell>
                <TableCell>{club.rut || "-"}</TableCell>
                <TableCell>
                  {club.vigencia ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Vigente"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="No Vigente"
                      color="error"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(club)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(club.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Multi-Step */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingId ? "Editar Club" : "Nuevo Club"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep > 0 && <Button onClick={handleBack}>Anterior</Button>}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={uploadingImage}
            >
              {uploadingImage ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
