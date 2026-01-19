import { Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Inicio.css"; 

import patin1 from "../images/patin_1.jpg";
import patin2 from "../images/patin_2.jpg";
import patin3 from "../images/patin_3.jpg";

<Container maxWidth="sm">
  
</Container>
const noticias = [
  { titulo: "Campeonato Nacional", resumen: "Speed Project arrasa en la final.", imagen: patin1 },
  { titulo: "Nueva indumentaria", resumen: "Presentamos el nuevo uniforme oficial.", imagen: patin2 },
  { titulo: "Entrenamiento abierto", resumen: "Ven a conocer el club.", imagen: patin3 },
];

export default function Inicio() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div>
      {/* Banner principal */}
      <div
        className="banner"
        style={{ backgroundImage: `url(${patin1})` }} // 👈 usa una imagen como fondo
      >
        <Typography variant="h4" align="center">
          ONE TEAM, ONE DREAM 🏁
        </Typography>
      </div>

      {/* Encabezado */}
      <Container className="encabezado">
        <Typography variant="h3" gutterBottom>
          Club Speed Project
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Una pasión, un equipo, un sueño
        </Typography>

        {/* Carrusel */}
        <div className="carrusel">
          <Slider {...sliderSettings}>
            {noticias.map((n, i) => (
              <div key={i}>
                <img src={n.imagen} alt={n.titulo} />
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                  {n.titulo}
                </Typography>
                <Typography variant="body2" align="center">
                  {n.resumen}
                </Typography>
              </div>
            ))}
          </Slider>
        </div>

        {/* Botón de navegación */}
        <div className="boton-noticias">
          <Button variant="contained" color="primary" component={Link} to="/noticias">
            Ver más noticias
          </Button>
        </div>
      </Container>
    </div>
  );
}