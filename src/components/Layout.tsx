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
import logoSP from "../images/LogoSP.png";

const adminPages = [
  { label: "Usuarios", path: "usuarios" },
  { label: "Vehículos", path: "/vehiculos" },
  { label: "Pagos", path: "/pagos" },
  { label: "Asistencia", path: "/asistencia" },
  { label: "Campeonatos", path: "/campeonatos" },
];

const deportistaPages = [{ label: "Profile", path: "/profile" }];
const apoderadoPages = [
  { label: "Profile", path: "/profile" },
  { label: "Deportistas", path: "usuarios" },
];

export default function Layout() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const [user, setUser] = React.useState<{ name: string; rol: string } | null>({
    name: "Nathalia Valle",
    rol: "admin", // puede ser "admin", "deportista" o "apoderado"
  });

  let pagesToShow: { label: string; path: string }[] = [];

  if (user?.rol === "admin") {
    pagesToShow = adminPages;
  } else if (user?.rol === "deportista") {
    pagesToShow = deportistaPages;
  } else if (user?.rol === "apoderado") {
    pagesToShow = apoderadoPages;
  }

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
              <Button color="inherit" component={Link} to="/contacto">
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
                      {user.name}
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
                        component={Link}
                        to={page.path}
                        onClick={handleCloseUserMenu} // 👈 esto cierra el menú al hacer clic
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {page.label}
                        </Typography>
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        setUser(null);
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
                    to="login"
                  >
                    Inicia Sesión
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}
