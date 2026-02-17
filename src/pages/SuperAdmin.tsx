import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  CssBaseline,
  AppBar,
  Typography,
  Container,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LoginIcon from "@mui/icons-material/Login";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ClubesAdmin from "../components/admin/ClubesAdmin";
import LoginAdmin from "../components/admin/LoginAdmin";
import RamasAdmin from "../components/admin/RamasAdmin";
import UsuariosAdmin from "../components/admin/UsuariosAdmin";
import CampeonatosAdmin from "../components/admin/CampeonatosAdmin";
import DeportistasAdmin from "../components/admin/DeportistasAdmin";
import CategoriasAdmin from "../components/admin/CategoriasAdmin";
import SeriesAdmin from "../components/admin/SeriesAdmin";

const drawerWidth = 280;

const MENU_ITEMS = [
  {
    id: "clubes",
    label: "Clubes",
    component: ClubesAdmin,
    icon: SportsSoccerIcon,
  },
  { id: "login", label: "Login", component: LoginAdmin, icon: LoginIcon },
  {
    id: "ramas",
    label: "Ramas Deportivas",
    component: RamasAdmin,
    icon: FitnessCenterIcon,
  },
  {
    id: "usuarios",
    label: "Todos los Usuarios",
    component: UsuariosAdmin,
    icon: PeopleIcon,
  },
  {
    id: "campeonatos",
    label: "Todos los Campeonatos",
    component: CampeonatosAdmin,
    icon: EmojiEventsIcon,
  },
  {
    id: "deportistas",
    label: "Deportistas",
    component: DeportistasAdmin,
    icon: PersonIcon,
  },
  {
    id: "categorias",
    label: "Categorías",
    component: CategoriasAdmin,
    icon: CategoryIcon,
  },
  { id: "series", label: "Series", component: SeriesAdmin, icon: ViewWeekIcon },
  { id: "salir", label: "Salir", icon: ExitToAppIcon },
];

function SuperAdmin() {
  const [selectedSection, setSelectedSection] = useState("clubes");

  const currentSection = MENU_ITEMS.find((item) => item.id === selectedSection);
  const CurrentComponent = currentSection?.component || ClubesAdmin;

  const handleExit = () => {
    window.close();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" noWrap component="div">
              Panel de Administración
            </Typography>
          </Box>
          {/* El botón Salir ahora está en el menú lateral */}
        </Toolbar>
      </AppBar>

      {/* Drawer (Menú Lateral) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
            paddingTop: "16px",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Administración
          </Typography>
        </Toolbar>

        <List sx={{ px: 1 }}>
          {MENU_ITEMS.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedSection === item.id}
                onClick={() =>
                  item.id === "salir"
                    ? handleExit()
                    : setSelectedSection(item.id)
                }
                sx={{
                  borderRadius: "8px",
                  backgroundColor:
                    selectedSection === item.id ? "#1976d2" : "transparent",
                  color: selectedSection === item.id ? "#fff" : "#333",
                  "&:hover": {
                    backgroundColor:
                      selectedSection === item.id ? "#1565c0" : "#e0e0e0",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedSection === item.id ? "#fff" : "#333",
                    minWidth: 40,
                  }}
                >
                  {item.icon && <item.icon />}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight:
                        selectedSection === item.id ? "bold" : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <CurrentComponent />
        </Container>
      </Box>
    </Box>
  );
}

export default SuperAdmin;
