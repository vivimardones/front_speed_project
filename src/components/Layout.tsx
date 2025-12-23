import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Club Speed Project
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/usuarios">Usuarios</Button>
          <Button color="inherit" component={Link} to="/vehiculos">Vehículos</Button>
          <Button color="inherit" component={Link} to="/pagos">Pagos</Button>
          <Button color="inherit" component={Link} to="/asistencia">Asistencia</Button>
          <Button color="inherit" component={Link} to="/inscripciones">Inscripciones</Button>
          <Button color="inherit" component={Link} to="/campeonatos">Campeonatos</Button>
          <Button color="inherit" component={Link} to="/noticias">Noticias</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet /> {/* 👈 Aquí se renderizan las páginas hijas */}
      </Container>
    </>
  );
}