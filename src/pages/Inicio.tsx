import { Typography, Container } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Inicio.css";

import patin1 from "../images/patin_1.jpg";
import patin2 from "../images/patin_2.jpg";
import patin3 from "../images/patin_3.jpg";

<Container maxWidth="sm"></Container>;
const noticias = [
  {
    titulo: "Campeonato Nacional",
    resumen: "Speed Project arrasa en la final.",
    imagen: patin1,
  },
  {
    titulo: "Nueva indumentaria",
    resumen: "Presentamos el nuevo uniforme oficial.",
    imagen: patin2,
  },
  {
    titulo: "Entrenamiento abierto",
    resumen: "Ven a conocer el club.",
    imagen: patin3,
  },
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
      <div className="banner">
        <Typography variant="h4" align="center">
          Speed Project Chile
        </Typography>
      </div>

      {/* Encabezado */}
      <Container className="encabezado">
        {/* Carrusel */}
        <div className="carrusel">
          <Slider {...sliderSettings}>
            {noticias.map((n, i) => (
              <div key={i} className="carrusel-slide">
                <div className="carrusel-img-container">
                  <img src={n.imagen} alt={n.titulo} className="carrusel-img" />
                </div>
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
      </Container>
    </div>
  );
}
