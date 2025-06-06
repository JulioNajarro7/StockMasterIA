import React, { useState } from "react";
import FloatingButton from "../components/FloatingButton"; // ajusta el path si es necesario
import { FaPlus } from "react-icons/fa";

function ProductosPage() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Shampoo" },
    { id: 2, nombre: "Jabón" }
  ]);

  // Esta función será ejecutada cuando hagas click en el botón flotante
  const handleAgregarProducto = () => {
    const nombre = window.prompt("¿Nombre del nuevo producto?");
    if (nombre && nombre.trim() !== "") {
      setProductos((prev) => [
        ...prev,
        { id: Date.now(), nombre: nombre.trim() }
      ]);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Lista de productos</h2>
      <ul>
        {productos.map((prod) => (
          <li key={prod.id}>{prod.nombre}</li>
        ))}
      </ul>

      {/* Botón flotante que llama a la función handleAgregarProducto */}
      <FloatingButton
        onClick={handleAgregarProducto}
        icon={<FaPlus size={22} />}
        tooltip="Agregar producto"
      />
    </div>
  );
}

export default ProductosPage;
