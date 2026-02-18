import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoSP from "../images/LogoSP.png";

const adminPages = [
  // { label: "Usuarios", path: "/usuarios" },
  // { label: "Vehículos", path: "/vehiculos" },
  // { label: "Pagos", path: "/pagos" },
  // { label: "Asistencia", path: "/asistencia" },
  { label: "Campeonatos", path: "/campeonatos" },
  { label: "Inscribir nuevo usuario", path: "/registro" },
  { label: "Deportistas", path: "/usuarios" },
];

const deportistaPages = [
  { label: "Mi Deporte", path: "/deportista/dashboard" },
];

const apoderadoPages = [
  { label: "Mi Perfil", path: "/apoderado/dashboard" },
];


const superAdminPages = [{ label: "Administrar", path: "/admin/dashboard" }];

export default function Layout() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pagesToShow = React.useMemo(() => {
    if (!user || !user.roles) return [];

    const userRoles = user.roles.map((r) => r.toLowerCase());
    let pages: typeof adminPages = [];

    // Verificar roles y agregar páginas correspondientes
    if (userRoles.includes("administrador")) {
      pages = [...pages, ...adminPages, ...superAdminPages];
    }

    if (userRoles.includes("deportista")) {
      pages = [...pages, ...deportistaPages];
    }

    if (userRoles.includes("apoderado")) {
      pages = [...pages, ...apoderadoPages];
    }
    pages = [...pages, { label: "Mi Perfil", path: "/perfil" }];

    return pages;
  }, [user]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <img
                src={logoSP}
                alt="Club Speed Project"
                style={{ height: "50px" }}
              />
            </Box>
            <Box sx={{ flexGrow: 2, display: { xs: "flex" } }}>
              <Button color="inherit" component={Link} to="/">
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/noticias">
                Noticias
              </Button>
              <Button color="inherit" component={Link} to="/contactos">
                Contacto
              </Button>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {user ? (
                <>
                  <Tooltip title="Cuenta">
                    <Button
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0 }}
                      color="inherit"
                    >
                      {user.nombre}
                    </Button>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {pagesToShow.map((page) => (
                      <MenuItem
                        key={page.label}
                        onClick={() => {
                          handleCloseUserMenu();
                          navigate(page.path);
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {page.label}
                        </Typography>
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        logout();
                        navigate("/login");
                      }}
                    >
                      <Typography sx={{ textAlign: "center", color: "red" }}>
                        Cerrar Sesión
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Tooltip title="Login">
                  <Button
                    sx={{ p: 0 }}
                    color="inherit"
                    component={Link}
                    to="/login"
                  >
                    Inicia Sesión
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Outlet />
    </>
  );
}
