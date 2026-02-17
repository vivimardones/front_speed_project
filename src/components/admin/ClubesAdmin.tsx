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
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Autocomplete,
  Avatar,
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
import { getUsuarios } from "../../services/usuariosService";
import type { Club, CreateClubDto } from "../../types/club.types";
import type { UsuarioDto } from "../../dtos/UsuarioDto";

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

interface FormErrors {
  nombreFantasia?: string;
  nombreReal?: string;
  fechaIniciacion?: string;
  rut?: string;
  correo?: string;
  telefono?: string;
  sitioWeb?: string;
}

export default function ClubesAdmin() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateClubDto>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Estados para imágenes
  const [escudoFile, setEscudoFile] = useState<File | null>(null);
  const [escudoPreview, setEscudoPreview] = useState<string | null>(null);
  const [insigniaFile, setInsigniaFile] = useState<File | null>(null);
  const [insigniaPreview, setInsigniaPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Nuevo estado para usuarios
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    loadClubes();
    loadUsuarios();
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

  const loadUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const data = await getUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Función para obtener el usuario por ID
  const getUsuarioById = (id?: string) => {
    if (!id) return null;
    return usuarios.find((u) => u.idUsuario === id || u.id === id);
  };

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para filtrar usuarios disponibles según cargo
  const getUsuariosDisponibles = (
    cargoActual: "presidente" | "secretario" | "tesorero" | "director",
  ) => {
    return usuarios.filter((u) => {
      // Solo mayores de 18 años
      if (u.fechaNacimiento) {
        const edad = calcularEdad(u.fechaNacimiento);
        if (edad < 18) return false;
      }

      const userId = u.idUsuario || u.id;

      // Excluir usuarios ya seleccionados en otros cargos
      if (
        cargoActual === "presidente" &&
        userId &&
        (userId === formData.dirigentes?.secretario ||
          userId === formData.dirigentes?.tesorero ||
          userId === formData.dirigentes?.director)
      ) {
        return false;
      }

      if (
        cargoActual === "secretario" &&
        userId &&
        (userId === formData.dirigentes?.presidente ||
          userId === formData.dirigentes?.tesorero ||
          userId === formData.dirigentes?.director)
      ) {
        return false;
      }

      if (
        cargoActual === "tesorero" &&
        userId &&
        (userId === formData.dirigentes?.presidente ||
          userId === formData.dirigentes?.secretario ||
          userId === formData.dirigentes?.director)
      ) {
        return false;
      }

      if (
        cargoActual === "director" &&
        userId &&
        (userId === formData.dirigentes?.presidente ||
          userId === formData.dirigentes?.secretario ||
          userId === formData.dirigentes?.tesorero)
      ) {
        return false;
      }

      return true;
    });
  };

  // VALIDACIONES
  const validateRut = (rut: string): boolean => {
    if (!rut) return true; // Opcional
    const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;
    return rutRegex.test(rut);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Opcional
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    return phoneRegex.test(phone);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Opcional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {};

    switch (step) {
      case 0: // Información Básica
        if (!formData.nombreFantasia || formData.nombreFantasia.trim() === "") {
          errors.nombreFantasia = "El nombre fantasía es obligatorio";
        }
        if (!formData.nombreReal || formData.nombreReal.trim() === "") {
          errors.nombreReal = "El nombre real es obligatorio";
        }
        if (!formData.fechaIniciacion) {
          errors.fechaIniciacion = "La fecha de iniciación es obligatoria";
        }
        if (formData.rut && !validateRut(formData.rut)) {
          errors.rut = "Formato de RUT inválido (ej: 12.345.678-9)";
        }
        break;

      case 2: // Contacto y Ubicación
        if (formData.correo && !validateEmail(formData.correo)) {
          errors.correo = "Formato de correo inválido";
        }
        if (formData.telefono && !validatePhone(formData.telefono)) {
          errors.telefono = "Formato de teléfono inválido";
        }
        if (formData.sitioWeb && !validateUrl(formData.sitioWeb)) {
          errors.sitioWeb =
            "URL inválida (debe comenzar con http:// o https://)";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    setFormErrors({});
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
    setFormErrors({});
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFormErrors({}); // Limpiar errores al retroceder
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "escudo" | "insignia",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen ${type} no puede superar los 5MB`);
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setError(`El archivo ${type} debe ser una imagen`);
        return;
      }

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
    // Validar paso actual antes de guardar
    if (!validateStep(activeStep)) {
      return;
    }

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
              error={!!formErrors.nombreFantasia}
              helperText={formErrors.nombreFantasia}
            />
            <TextField
              fullWidth
              required
              label="Nombre Real"
              value={formData.nombreReal}
              onChange={(e) =>
                setFormData({ ...formData, nombreReal: e.target.value })
              }
              error={!!formErrors.nombreReal}
              helperText={formErrors.nombreReal}
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
                error={!!formErrors.fechaIniciacion}
                helperText={formErrors.fechaIniciacion}
              />
              <TextField
                fullWidth
                label="RUT"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
                error={!!formErrors.rut}
                helperText={formErrors.rut || "Formato: 12.345.678-9"}
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Selecciona los usuarios que ocuparán los cargos directivos (solo
              mayores de 18 años)
            </Typography>

            {loadingUsuarios ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                {/* Presidente */}
                <Autocomplete
                  options={getUsuariosDisponibles("presidente")}
                  getOptionLabel={(option) =>
                    option.nombreCompleto || "Sin nombre"
                  }
                  value={getUsuarioById(formData.dirigentes?.presidente)}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      dirigentes: {
                        ...formData.dirigentes,
                        presidente: newValue?.idUsuario || newValue?.id || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Presidente" />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {option.primerNombre?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {option.nombreCompleto || "Sin nombre"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.roles?.[0] || option.rol || "Sin rol"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No hay usuarios mayores de 18 años disponibles"
                />

                {/* Secretario */}
                <Autocomplete
                  options={getUsuariosDisponibles("secretario")}
                  getOptionLabel={(option) =>
                    option.nombreCompleto || "Sin nombre"
                  }
                  value={getUsuarioById(formData.dirigentes?.secretario)}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      dirigentes: {
                        ...formData.dirigentes,
                        secretario: newValue?.idUsuario || newValue?.id || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Secretario" />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {option.primerNombre?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {option.nombreCompleto || "Sin nombre"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.roles?.[0] || option.rol || "Sin rol"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No hay usuarios mayores de 18 años disponibles"
                />

                {/* Tesorero */}
                <Autocomplete
                  options={getUsuariosDisponibles("tesorero")}
                  getOptionLabel={(option) =>
                    option.nombreCompleto || "Sin nombre"
                  }
                  value={getUsuarioById(formData.dirigentes?.tesorero)}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      dirigentes: {
                        ...formData.dirigentes,
                        tesorero: newValue?.idUsuario || newValue?.id || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tesorero" />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {option.primerNombre?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {option.nombreCompleto || "Sin nombre"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.roles?.[0] || option.rol || "Sin rol"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No hay usuarios mayores de 18 años disponibles"
                />

                {/* Director */}
                <Autocomplete
                  options={getUsuariosDisponibles("director")}
                  getOptionLabel={(option) =>
                    option.nombreCompleto || "Sin nombre"
                  }
                  value={getUsuarioById(formData.dirigentes?.director)}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      dirigentes: {
                        ...formData.dirigentes,
                        director: newValue?.idUsuario || newValue?.id || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Director" />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {option.primerNombre?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {option.nombreCompleto || "Sin nombre"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.roles?.[0] || option.rol || "Sin rol"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No hay usuarios mayores de 18 años disponibles"
                />

                {/* Vista previa de dirigentes seleccionados */}
                {(formData.dirigentes?.presidente ||
                  formData.dirigentes?.secretario ||
                  formData.dirigentes?.tesorero ||
                  formData.dirigentes?.director) && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Dirigentes seleccionados:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.dirigentes?.presidente && (
                        <Chip
                          label={`Presidente: ${getUsuarioById(formData.dirigentes.presidente)?.nombreCompleto}`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {formData.dirigentes?.secretario && (
                        <Chip
                          label={`Secretario: ${getUsuarioById(formData.dirigentes.secretario)?.nombreCompleto}`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {formData.dirigentes?.tesorero && (
                        <Chip
                          label={`Tesorero: ${getUsuarioById(formData.dirigentes.tesorero)?.nombreCompleto}`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {formData.dirigentes?.director && (
                        <Chip
                          label={`Director: ${getUsuarioById(formData.dirigentes.director)?.nombreCompleto}`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </>
            )}
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
                placeholder="contacto@club.cl"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                error={!!formErrors.correo}
                helperText={formErrors.correo}
              />
              <TextField
                fullWidth
                label="Teléfono"
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                error={!!formErrors.telefono}
                helperText={formErrors.telefono}
              />
            </Box>
            <TextField
              fullWidth
              label="Sitio Web"
              placeholder="https://www.club.cl"
              value={formData.sitioWeb}
              onChange={(e) =>
                setFormData({ ...formData, sitioWeb: e.target.value })
              }
              error={!!formErrors.sitioWeb}
              helperText={formErrors.sitioWeb}
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Máximo 5MB - JPG, PNG, GIF
                  </Typography>
                  {escudoPreview && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={escudoPreview}
                      alt="Escudo"
                      sx={{ objectFit: "contain", mb: 2, mt: 1 }}
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Máximo 5MB - JPG, PNG, GIF
                  </Typography>
                  {insigniaPreview && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={insigniaPreview}
                      alt="Insignia"
                      sx={{ objectFit: "contain", mb: 2, mt: 1 }}
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
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
