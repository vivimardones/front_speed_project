import { Routes, Route, Navigate } from "react-router-dom";
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
import AccesoDenegado from "./pages/AccesoDenegado";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route index element={<Inicio />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="noticias" element={<NoticiasForm />} />
        <Route path="contactos" element={<Contactos />} />
        <Route path="acceso-denegado" element={<AccesoDenegado />} />

        {/* Dashboards por rol */}
        <Route
          path="deportista/dashboard"
          element={
            <ProtectedRoute roles={['deportista']}>
              <PagDeportista />
            </ProtectedRoute>
          }
        />
        <Route
          path="apoderado/dashboard"
          element={
            <ProtectedRoute roles={['apoderado']}>
              <PagApoderado />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute roles={['administrador']}>
              <SuperAdmin />
            </ProtectedRoute>
          }
        />

        {/* Rutas administrativas */}
        <Route
          path="usuarios"
          element={
            <ProtectedRoute roles={['administrador']}>
              <UsuariosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehiculos"
          element={
            <ProtectedRoute roles={['administrador', 'dirigente']}>
              <VehiculosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="pagos"
          element={
            <ProtectedRoute roles={['administrador', 'dirigente']}>
              <PagosForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="asistencia"
          element={
            <ProtectedRoute roles={['administrador', 'dirigente', 'entrenador']}>
              <AsistenciaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="inscripciones"
          element={
            <ProtectedRoute roles={['administrador', 'dirigente']}>
              <InscripcionesForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="campeonatos"
          element={
            <ProtectedRoute roles={['administrador', 'dirigente']}>
              <CampeonatosForm />
            </ProtectedRoute>
          }
        />

        {/* Rutas legacy (deprecar después) */}
        <Route
          path="PagDeportista"
          element={<Navigate to="/deportista/dashboard" replace />}
        />
        <Route
          path="PagApoderado"
          element={<Navigate to="/apoderado/dashboard" replace />}
        />
        <Route
          path="SuperAdmin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}

export default App;