import React from 'react';

function VehiculosForm() {
  return (
    <div>
      <h1>Página de Vehículos</h1>
      <form>
        <input type="text" placeholder="Marca" />
        <input type="text" placeholder="Modelo" />
        <input type="text" placeholder="Color" />
        <input type="text" placeholder="Patente" />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default VehiculosForm;