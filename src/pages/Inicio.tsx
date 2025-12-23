import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

export default function Inicio() {
  const secciones = [
    { title: "Usuarios", path: "/usuarios" },
    { title: "Vehículos", path: "/vehiculos" },
    { title: "Pagos", path: "/pagos" },
    { title: "Asistencia", path: "/asistencia" },
    { title: "Inscripciones", path: "/inscripciones" },
    { title: "Campeonatos", path: "/campeonatos" },
    { title: "Noticias", path: "/noticias" },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bienvenida al Club Speed Project 🏎️
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Selecciona una sección para comenzar
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {secciones.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card>
              <CardActionArea component={Link} to={item.path}>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
