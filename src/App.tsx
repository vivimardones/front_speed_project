import {
  // ...existing code...
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Contactos from "./pages/Contactos";
import Registro from "./pages/Registro";
import Inicio from "./pages/Inicio";
import UsuariosForm from "./pages/UsuarioForm";
import VehiculosForm from "./pages/VehiculosForm";
import PagosForm from "./pages/PagosForm";
import AsistenciaForm from "./pages/AsistenciaForm";
import InscripcionesForm from "./pages/InscripcionesForm";
import CampeonatosForm from "./pages/CampeonatosForm";
import NoticiasForm from "./pages/NoticiasForm";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PagApoderado from "./pages/PagApoderado";
import PagDeportista from "./pages/PagDeportista";
import SuperAdmin from "./pages/SuperAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route index element={<Inicio />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="noticias" element={<NoticiasForm />} />
        <Route path="contactos" element={<Contactos />} />
        {/* Rutas protegidas */}
        <Route
          path="usuarios"
          element={
            <ProtectedRoute>
              <UsuariosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehiculos"
          element={
            <ProtectedRoute>
              <VehiculosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="pagos"
          element={
            <ProtectedRoute>
              <PagosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="asistencia"
          element={
            <ProtectedRoute>
              <AsistenciaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="inscripciones"
          element={
            <ProtectedRoute>
              <InscripcionesForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="campeonatos"
          element={
            <ProtectedRoute>
              <CampeonatosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="PagDeportista"
          element={
            <ProtectedRoute>
              <PagDeportista />
            </ProtectedRoute>
          }
        />
        <Route
          path="PagApoderado"
          element={
            <ProtectedRoute>
              <PagApoderado />
            </ProtectedRoute>
          }
        />
        <Route
          path="SuperAdmin"
          element={
            <ProtectedRoute>
              <SuperAdmin />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Redirigir rutas no encontradas a inicio */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;
