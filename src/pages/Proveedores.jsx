import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTruck, FaSearch, FaSync } from "react-icons/fa";

const API = "https://master.soporteumg.com/api.php?endpoint=proveedores";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null); // Si es null, es un nuevo proveedor
  const [form, setForm] = useState({ nombre: "", contacto: "" });
  const [mensaje, setMensaje] = useState("");
  const [userRole] = useState(
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || ""
  );
  const puedeEditar = userRole === "admin";

  // Cargar proveedores al iniciar
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProveedores(data);
    } catch {
      setMensaje("❌ Error al cargar proveedores.");
    }
    setLoading(false);
  };

  // Manejo del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      if (editando) {
        await fetch(`${API}&id=${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMensaje("✅ Proveedor actualizado.");
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMensaje("✅ Proveedor creado.");
      }
      setShowForm(false);
      setForm({ nombre: "", contacto: "" });
      setEditando(null);
      await cargarProveedores();
    } catch {
      setMensaje("❌ Error al guardar proveedor.");
    }
    setLoading(false);
  };

  // Editar
  const handleEditar = (proveedor) => {
    setForm({ nombre: proveedor.nombre, contacto: proveedor.contacto });
    setEditando(proveedor);
    setShowForm(true);
    setMensaje("");
  };

  // Eliminar
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    setLoading(true);
    try {
      await fetch(`${API}&id=${id}`, { method: "DELETE" });
      setMensaje("✅ Proveedor eliminado.");
      await cargarProveedores();
    } catch {
      setMensaje("❌ Error al eliminar proveedor.");
    }
    setLoading(false);
  };

  // Nuevo proveedor
  const handleNuevo = () => {
    setShowForm(true);
    setEditando(null);
    setForm({ nombre: "", contacto: "" });
    setMensaje("");
  };

  // Buscar
  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (p.contacto && p.contacto.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="container-fluid py-4">
      <div
        className="mx-auto mb-4"
        style={{
          maxWidth: 1200,
          background: "rgba(255,255,255,0.93)",
          borderRadius: 16,
          boxShadow: "0 3px 24px #0001",
          padding: "2.5rem 2.2rem 2rem 2.2rem"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
            <FaTruck size={32} style={{ color: "#2079db" }} />
            <h2 className="fw-bold m-0" style={{ color: "#23448c" }}>
              Proveedores
            </h2>
          </div>
          <div className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white" id="basic-addon1">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                style={{ minWidth: 180 }}
                placeholder="Buscar proveedor..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-outline-secondary" title="Actualizar" onClick={cargarProveedores}>
                <FaSync />
              </button>
            </div>
            {puedeEditar && (
              <button className="btn btn-primary" onClick={handleNuevo}>
                <FaPlus className="me-2" />
                Agregar
              </button>
            )}
          </div>
        </div>

        {mensaje && (
          <div
            className={`alert py-2 mb-3 text-center ${
              mensaje.includes("✅") ? "alert-success" : "alert-danger"
            }`}
            style={{ fontSize: 15, border: "none" }}
          >
            {mensaje}
          </div>
        )}

        {/* Formulario crear/editar */}
        {showForm && (
          <div
            className="card shadow-sm mb-4"
            style={{
              maxWidth: 440,
              margin: "0 auto",
              background: "rgba(255,255,255,0.99)",
              borderRadius: 14,
            }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">
                {editando ? "Editar proveedor" : "Nuevo proveedor"}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contacto</label>
                  <input
                    type="text"
                    name="contacto"
                    className="form-control"
                    value={form.contacto}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditando(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? editando
                        ? "Actualizando..."
                        : "Creando..."
                      : editando
                      ? "Actualizar"
                      : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla de proveedores */}
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm bg-white rounded">
            <thead>
              <tr style={{ background: "#f6f8fc" }}>
                <th style={{ minWidth: 60 }}>#</th>
                <th style={{ minWidth: 150 }}>Nombre</th>
                <th style={{ minWidth: 120 }}>Contacto</th>
                {puedeEditar && <th style={{ width: 120 }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={puedeEditar ? 4 : 3} className="text-center py-4 text-muted">
                    {loading ? "Cargando..." : "No hay proveedores registrados."}
                  </td>
                </tr>
              )}
              {proveedoresFiltrados.map((p, idx) => (
                <tr key={p.id}>
                  <td>
                    <span
                      style={{
                        background: "#f0f4ff",
                        color: "#23448c",
                        borderRadius: "7px",
                        padding: "3px 11px",
                        fontWeight: 600,
                        fontSize: 15
                      }}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="fw-semibold">{p.nombre}</td>
                  <td>{p.contacto}</td>
                  {puedeEditar && (
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditar(p)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(p.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Proveedores;
