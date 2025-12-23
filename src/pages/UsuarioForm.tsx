import React from "react";

function UsuariosForm() {
  return (
    <div>
      <h1>Página de Usuarios</h1>
      <form>
        <input type="text" placeholder="RUT" />
        <input type="text" placeholder="Nombre completo" />
        <input type="email" placeholder="Correo" />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default UsuariosForm;
