import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsuariosForm from "./pages/UsuarioForm";
import VehiculosForm from "./pages/VehiculosForm";
import PagosForm from "./pages/PagosForm";
import AsistenciaForm from "./pages/AsistenciaForm";
import InscripcionesForm from "./pages/InscripcionesForm";
import CampeonatosForm from "./pages/CampeonatosForm";
import NoticiasForm from "./pages/NoticiasForm";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/usuarios">Usuarios</Link> |
        <Link to="/vehiculos">Vehículos</Link> |<Link to="/pagos">Pagos</Link> |
        <Link to="/asistencia">Asistencia</Link> |
        <Link to="/inscripciones">Inscripciones</Link> |
        <Link to="/campeonatos">Campeonatos</Link> |
        <Link to="/noticias">Noticias</Link>
      </nav>

      <Routes>
        <Route path="/usuarios" element={<UsuariosForm />} />
        <Route path="/vehiculos" element={<VehiculosForm />} />
        <Route path="/pagos" element={<PagosForm />} />
        <Route path="/asistencia" element={<AsistenciaForm />} />
        <Route path="/inscripciones" element={<InscripcionesForm />} />
        <Route path="/campeonatos" element={<CampeonatosForm />} />
        <Route path="/noticias" element={<NoticiasForm />} />
      </Routes>
    </Router>
  );
}

export default App;
