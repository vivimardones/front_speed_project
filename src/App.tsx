import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import UsuariosForm from './pages/UsuarioForm';
import VehiculosForm from './pages/VehiculosForm';
import PagosForm from './pages/PagosForm';
import AsistenciaForm from './pages/AsistenciaForm';
import InscripcionesForm from './pages/InscripcionesForm';
import CampeonatosForm from './pages/CampeonatosForm';
import NoticiasForm from './pages/NoticiasForm';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="usuarios" element={<UsuariosForm />} />
        <Route path="vehiculos" element={<VehiculosForm />} />
        <Route path="pagos" element={<PagosForm />} />
        <Route path="asistencia" element={<AsistenciaForm />} />
        <Route path="inscripciones" element={<InscripcionesForm />} />
        <Route path="campeonatos" element={<CampeonatosForm />} />
        <Route path="noticias" element={<NoticiasForm />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;