import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

function FloatingButton({ tooltip = "Nuevo producto", icon = <FaPlus size={22} />, style = {} }) {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria_id, setCategoriaId] = useState(""); // ahora es ID
  const [stock_actual, setStockActual] = useState("");
  const [stock_minimo, setStockMinimo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://master.soporteumg.com/api.php?endpoint=productos";

  const handleOpen = () => {
    setShowModal(true);
    setMensaje("");
  };

  const handleClose = () => {
    setShowModal(false);
    setMensaje("");
    setNombre("");
    setCategoriaId("");
    setStockActual("");
    setStockMinimo("");
    setUbicacion("");
    setLoading(false);
  };

  // *** NUEVO: función de timeout fetch ***
  const fetchWithTimeout = (resource, options = {}) => {
    const { timeout = 9000 } = options;
    return Promise.race([
      fetch(resource, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("❌ Tiempo de espera agotado")), timeout)
      )
    ]);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    if (!nombre.trim() || !categoria_id || !stock_actual || !stock_minimo) {
      setMensaje("❌ Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const res = await fetchWithTimeout(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          categoria_id: Number(categoria_id),
          stock_actual: Number(stock_actual),
          stock_minimo: Number(stock_minimo),
          ubicacion
        }),
        timeout: 9000
      });

      // Si no es JSON válido, lanza error
      let json;
      try {
        json = await res.json();
      } catch (err) {
        const texto = await res.text();
        setMensaje(
          "❌ Error en respuesta: " +
            (texto.length < 200 ? texto : texto.slice(0, 150) + "...")
        );
        setLoading(false);
        return;
      }

      if (json.success) {
        setMensaje("✅ Producto creado exitosamente");
        setTimeout(() => handleClose(), 1300);
      } else {
        setMensaje(json.message || "❌ Error al crear el producto");
        setLoading(false);
      }
    } catch (err) {
      setMensaje(err.message || "❌ Error de red o servidor");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="floating-btn"
        title={tooltip}
        style={{
          position: "fixed",
          bottom: 34,
          right: 32,
          zIndex: 1090,
          borderRadius: "50%",
          boxShadow: "0 3px 14px 0 rgba(50,50,93,0.17)",
          background: "linear-gradient(135deg, #736EFE 0%, #5EFCE8 100%)",
          color: "#fff",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 23,
          border: "none",
          outline: "none",
          transition: "box-shadow 0.16s, transform 0.12s",
          ...style
        }}
        onClick={handleOpen}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "")}
      >
        {icon}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 6px 24px #0003",
              minWidth: 350,
              position: "relative"
            }}
          >
            <button
              style={{
                position: "absolute",
                right: 16,
                top: 12,
                border: "none",
                background: "none",
                fontSize: 24,
                cursor: "pointer"
              }}
              onClick={handleClose}
              aria-label="Cerrar"
              disabled={loading}
            >
              ×
            </button>
            <h4 className="mb-3">Agregar Producto</h4>
            <form onSubmit={handleCrear}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre del producto"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Categoría (ID, ej: 1)"
                value={categoria_id}
                onChange={e => setCategoriaId(e.target.value)}
                required
                disabled={loading}
                min={1}
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Stock actual"
                value={stock_actual}
                onChange={e => setStockActual(e.target.value)}
                required
                min={0}
                disabled={loading}
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Stock mínimo"
                value={stock_minimo}
                onChange={e => setStockMinimo(e.target.value)}
                required
                min={0}
                disabled={loading}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Ubicación"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                disabled={loading}
              />
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Crear"}
              </button>
            </form>
            {mensaje && (
              <div className="alert alert-info mt-3 py-2" style={{ fontSize: 15 }}>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingButton;
