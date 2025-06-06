import React, { useEffect, useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope
} from "react-icons/fa";


const API_URL = "https://master.soporteumg.com/api.php?endpoint=usuarios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  // Modal & formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    rol: "encargado",
    estado: "activo"
  });

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setUsuarios([]);
      setError("No se pudo cargar la lista de usuarios: " + err.message);
    }
    setLoading(false);
  };

  const limpiarBusqueda = () => setBusqueda("");

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rol?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.estado?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Badge UX por rol
  const badgeRol = (rol) => {
    switch ((rol || "").toLowerCase()) {
      case "admin":
        return <span className="badge bg-primary"><FaUserShield /> Admin</span>;
      case "encargado":
        return <span className="badge bg-info text-dark"><FaUser /> Encargado</span>;
      case "gerente":
        return <span className="badge bg-warning text-dark"><FaUserCheck /> Gerente</span>;
      case "auditor":
        return <span className="badge bg-secondary"><FaUserTimes /> Auditor</span>;
      default:
        return <span className="badge bg-light text-dark">{rol}</span>;
    }
  };

  // MODALES
  const abrirModalAgregar = () => {
    setUsuarioActual({
      nombre: "",
      usuario: "",
      email: "",
      password: "",
      rol: "encargado",
      estado: "activo"
    });
    setEditando(false);
    setFormError(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioActual({ ...usuario, password: "" });
    setEditando(true);
    setFormError(null);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setUsuarioActual({
      nombre: "",
      usuario: "",
      email: "",
      password: "",
      rol: "encargado",
      estado: "activo"
    });
    setEditando(false);
    setFormError(null);
  };

  const handleInput = (e) => {
    setUsuarioActual({ ...usuarioActual, [e.target.name]: e.target.value });
  };

  // AGREGAR o EDITAR con verificador de errores
  const guardarUsuario = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (
      !usuarioActual.nombre ||
      !usuarioActual.usuario ||
      !usuarioActual.email ||
      !usuarioActual.rol ||
      !usuarioActual.estado
    ) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      let response, data;
      if (editando) {
        response = await fetch(`${API_URL}&id=${usuarioActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioActual),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioActual),
        });
      }
      data = await response.json();

      // Verifica errores del backend
      if (!response.ok || data.success === false) {
        setFormError(
          data.message
            ? `Error del servidor: ${data.message}`
            : `Error HTTP: ${response.status}`
        );
        return;
      }

      cerrarModal();
      fetchUsuarios();
    } catch (err) {
      setFormError("Error de red: " + err.message);
    }
  };

  // ELIMINAR
const eliminarUsuario = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
  setError(null);
  try {
    const response = await fetch(`${API_URL}&id=${id}`, { method: "DELETE" });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {}; // Respuesta vacía, considera como error
    }
    if (!response.ok || data.success === false) {
      setError(data.message ? "Error del servidor: " + data.message : "No se pudo eliminar el usuario.");
    }
    fetchUsuarios();
  } catch (err) {
    setError("Error de red al eliminar: " + err.message);
  }
};

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      {/* Barra superior y buscador */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaUser style={{ fontSize: 26, opacity: 0.9 }} /> Usuarios
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <div className="input-group rounded shadow-sm flex-grow-1" style={{ minWidth: 120, maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={fetchUsuarios}
            title="Actualizar lista"
            style={{ fontWeight: "bold" }}
            disabled={loading}
          >
            <FaSyncAlt />
          </button>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
            onClick={abrirModalAgregar}
            title="Agregar usuario"
            style={{
              fontWeight: "bold",
              borderRadius: 10,
              boxShadow: "0 4px 14px #0084ff14"
            }}
          >
            <FaPlus /> <span className="d-none d-sm-inline">Agregar</span>
          </button>
        </div>
      </div>

      <hr className="my-2 mb-3" />

      {/* Error general de CRUD */}
      {error && (
        <div className="alert alert-danger text-center py-2">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2 text-muted">Cargando usuarios...</div>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-4 text-muted">No se encontraron usuarios.</div>
      ) : (
        // --- Tabla para desktop, lista para mobile ---
        <div>
          <div className="d-none d-md-block table-responsive px-2">
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light" style={{ fontSize: 16 }}>
                <tr>
                  <th>#</th>
                  <th><FaUser /> Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th><FaEnvelope /> Email</th>
                  <th style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u, idx) => (
                  <tr key={u.id || idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{u.nombre}</td>
                    <td className="text-muted">{u.usuario}</td>
                    <td>{badgeRol(u.rol)}</td>
                    <td>
                      <span
                        className={
                          u.estado === "activo"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {u.estado}
                      </span>
                    </td>
                    <td>{u.email || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => abrirModalEditar(u)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarUsuario(u.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Vista tipo lista para mobile */}
          <div className="d-block d-md-none px-2">
            {usuariosFiltrados.map((u, idx) => (
              <div key={u.id || idx} className="card mb-2 shadow-sm" style={{ borderRadius: 13 }}>
                <div className="card-body py-2 px-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: 16 }}>{u.nombre}</span>
                    <span>
                      <button className="btn btn-xs btn-outline-secondary me-1 py-1 px-2"
                        onClick={() => abrirModalEditar(u)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-xs btn-outline-danger py-1 px-2"
                        onClick={() => eliminarUsuario(u.id)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
                    <span className="badge bg-light text-dark">{u.usuario}</span>
                    {badgeRol(u.rol)}
                    <span className={u.estado === "activo" ? "badge bg-success" : "badge bg-secondary"}>
                      {u.estado}
                    </span>
                  </div>
                  <div className="small text-muted"><FaEnvelope /> {u.email || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar/editar usuario */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <form onSubmit={guardarUsuario}>
                <div className="modal-header" style={{ background: "#f3f6fb" }}>
                  <h5 className="modal-title fw-bold">
                    {editando ? "Editar usuario" : "Agregar usuario"}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>
                <div className="modal-body">
                  {/* Error en el formulario */}
                  {formError && (
                    <div className="alert alert-danger py-2">{formError}</div>
                  )}
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={usuarioActual.nombre}
                      onChange={handleInput}
                      required
                      placeholder="Ej: Pedro García"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Usuario *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="usuario"
                      value={usuarioActual.usuario}
                      onChange={handleInput}
                      required
                      placeholder="Ej: jgarcia"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={usuarioActual.email}
                      onChange={handleInput}
                      required
                      placeholder="usuario@email.com"
                    />
                  </div>
                  {!editando && (
                    <div className="mb-2">
                      <label className="form-label fw-semibold">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={usuarioActual.password}
                        onChange={handleInput}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Rol *</label>
                    <select
                      className="form-select"
                      name="rol"
                      value={usuarioActual.rol}
                      onChange={handleInput}
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="encargado">Encargado</option>
                      <option value="gerente">Gerente</option>
                      <option value="auditor">Auditor</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Estado *</label>
                    <select
                      className="form-select"
                      name="estado"
                      value={usuarioActual.estado}
                      onChange={handleInput}
                      required
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer" style={{ background: "#f6f6f6" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Guardar cambios" : "Agregar usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
