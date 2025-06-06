import React, { useEffect, useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaUser,
  FaMoneyBillAlt
} from "react-icons/fa";

const API_PEDIDOS = "https://master.soporteumg.com/api.php?endpoint=pedidos";
const API_CLIENTES = "https://master.soporteumg.com/api.php?endpoint=clientes";
const API_PRODUCTOS = "https://master.soporteumg.com/api.php?endpoint=productos";
const API_DETALLES = "https://master.soporteumg.com/api.php?endpoint=pedido_detalles";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal y formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [pedidoActual, setPedidoActual] = useState({
    cliente_id: "",
    fecha: "",
    total: 0,
    estado: "pendiente",
    detalles: []
  });

  // Pedido detalles temporales
  const [detalleTemp, setDetalleTemp] = useState({
    producto_id: "",
    cantidad: 1,
    precio_unitario: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resPedidos, resClientes, resProductos] = await Promise.all([
        fetch(API_PEDIDOS).then(r => r.json()),
        fetch(API_CLIENTES).then(r => r.json()),
        fetch(API_PRODUCTOS).then(r => r.json())
      ]);
      // Traer detalles para cada pedido (solo para mostrar, podrías optimizarlo)
      const pedidosWithDetails = await Promise.all(resPedidos.map(async (p) => {
        const resDet = await fetch(`${API_DETALLES}&pedido_id=${p.id}`).then(r => r.json());
        return { ...p, detalles: resDet };
      }));
      setPedidos(pedidosWithDetails);
      setClientes(resClientes);
      setProductos(resProductos);
    } catch (e) {
      setError("No se pudo cargar la información de pedidos.");
    }
    setLoading(false);
  };

  const limpiarBusqueda = () => setBusqueda("");

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      clientes.find(c => c.id === p.cliente_id)?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.estado?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Modal: agregar/editar
  const abrirModalAgregar = () => {
    setPedidoActual({
      cliente_id: "",
      fecha: new Date().toISOString().slice(0, 10),
      total: 0,
      estado: "pendiente",
      detalles: []
    });
    setEditando(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (pedido) => {
    setPedidoActual({ ...pedido });
    setEditando(true);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setPedidoActual({
      cliente_id: "",
      fecha: new Date().toISOString().slice(0, 10),
      total: 0,
      estado: "pendiente",
      detalles: []
    });
    setEditando(false);
    setDetalleTemp({
      producto_id: "",
      cantidad: 1,
      precio_unitario: 0
    });
  };

  const handleInput = (e) => {
    setPedidoActual({ ...pedidoActual, [e.target.name]: e.target.value });
  };

  // ---- Detalles del pedido ----
  const handleDetalleInput = (e) => {
    setDetalleTemp({ ...detalleTemp, [e.target.name]: e.target.value });
  };

  const agregarDetalle = () => {
    if (!detalleTemp.producto_id || detalleTemp.cantidad <= 0) return;
    const prod = productos.find(p => String(p.id) === String(detalleTemp.producto_id));
    if (!prod) return;
    setPedidoActual({
      ...pedidoActual,
      detalles: [
        ...pedidoActual.detalles,
        {
          ...detalleTemp,
          nombre: prod.nombre,
          precio_unitario: detalleTemp.precio_unitario || prod.precio || 0
        }
      ]
    });
    setDetalleTemp({
      producto_id: "",
      cantidad: 1,
      precio_unitario: 0
    });
  };

  const eliminarDetalle = (idx) => {
    setPedidoActual({
      ...pedidoActual,
      detalles: pedidoActual.detalles.filter((_, i) => i !== idx)
    });
  };

  // AGREGAR o EDITAR pedido
  const guardarPedido = async (e) => {
    e.preventDefault();
    if (!pedidoActual.cliente_id || pedidoActual.detalles.length === 0) {
      alert("Debes seleccionar un cliente y agregar al menos un producto.");
      return;
    }

    // Calcular total
    const total = pedidoActual.detalles.reduce(
      (sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario), 0
    );
    const datosPedido = {
      ...pedidoActual,
      total,
    };

    try {
      let resPedido;
      if (editando) {
        // Actualizar pedido
        resPedido = await fetch(`${API_PEDIDOS}&id=${pedidoActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosPedido),
        });
      } else {
        // Crear pedido
        resPedido = await fetch(API_PEDIDOS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosPedido),
        });
      }

      if (!resPedido.ok) throw new Error("No se pudo guardar el pedido.");

      // El backend debe manejar los detalles en el mismo endpoint, o hacer otra petición aquí.
      // Si lo necesitas explícitamente para detalles, házmelo saber.

      cerrarModal();
      fetchAllData();
    } catch (err) {
      alert("Ocurrió un error.");
    }
  };

  // ELIMINAR pedido
  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await fetch(`${API_PEDIDOS}&id=${id}`, { method: "DELETE" });
      fetchAllData();
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaClipboardList style={{ fontSize: 24, opacity: 0.9 }} /> Pedidos
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <div className="input-group rounded shadow-sm flex-grow-1" style={{ minWidth: 120, maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar pedido/cliente..."
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
            onClick={fetchAllData}
            title="Actualizar lista"
            style={{ fontWeight: "bold" }}
            disabled={loading}
          >
            <FaSyncAlt />
          </button>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
            onClick={abrirModalAgregar}
            title="Agregar pedido"
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

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2 text-muted">Cargando pedidos...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center py-3">{error}</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-4 text-muted">No se encontraron pedidos.</div>
      ) : (
        <div className="d-none d-md-block table-responsive px-2">
          <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
            <thead className="table-light" style={{ fontSize: 16 }}>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalles</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{clientes.find(c => c.id === p.cliente_id)?.nombre || "-"}</td>
                  <td>{p.fecha}</td>
                  <td>Q {parseFloat(p.total).toFixed(2)}</td>
                  <td>
                    <span className={
                      p.estado === "pendiente" ? "badge bg-warning text-dark" :
                        p.estado === "completado" ? "badge bg-success" :
                          "badge bg-secondary"
                    }>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    {p.detalles && p.detalles.length > 0 ? (
                      <ul className="mb-0 small">
                        {p.detalles.map((d, i) => (
                          <li key={i}>
                            {productos.find(prod => prod.id === d.producto_id)?.nombre || "Producto"} x{d.cantidad}
                            {" "}({parseFloat(d.precio_unitario).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-muted">Sin productos</span>}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => abrirModalEditar(p)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarPedido(p.id)}
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
      )}

      {/* MODAL para agregar/editar pedido */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <form onSubmit={guardarPedido}>
                <div className="modal-header" style={{ background: "#f3f6fb" }}>
                  <h5 className="modal-title fw-bold">
                    {editando ? "Editar pedido" : "Agregar pedido"}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>
                <div className="modal-body row">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <label className="form-label fw-semibold">Cliente *</label>
                      <select
                        className="form-select"
                        name="cliente_id"
                        value={pedidoActual.cliente_id}
                        onChange={handleInput}
                        required
                      >
                        <option value="">Seleccione cliente</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fecha"
                        value={pedidoActual.fecha}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold">Estado</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={pedidoActual.estado}
                        onChange={handleInput}
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                  {/* DETALLES */}
                  <div className="col-md-6">
                    <h6>Agregar producto al pedido:</h6>
                    <div className="d-flex gap-2 mb-2">
                      <select
                        className="form-select"
                        name="producto_id"
                        value={detalleTemp.producto_id}
                        onChange={handleDetalleInput}
                        style={{ minWidth: 120 }}
                      >
                        <option value="">Producto</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="form-control"
                        name="cantidad"
                        min={1}
                        value={detalleTemp.cantidad}
                        onChange={handleDetalleInput}
                        style={{ width: 80 }}
                      />
                      <input
                        type="number"
                        className="form-control"
                        name="precio_unitario"
                        min={0}
                        step="0.01"
                        value={detalleTemp.precio_unitario}
                        onChange={handleDetalleInput}
                        placeholder="Precio"
                        style={{ width: 110 }}
                      />
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={agregarDetalle}
                        title="Agregar producto"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <ul className="list-group mb-2">
                      {pedidoActual.detalles.map((d, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                          {productos.find(p => String(p.id) === String(d.producto_id))?.nombre || "Producto"} x{d.cantidad} {" "}
                          <span className="badge bg-info text-dark">Q{parseFloat(d.precio_unitario).toFixed(2)}</span>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            type="button"
                            onClick={() => eliminarDetalle(i)}
                            title="Quitar"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="text-end fw-bold">
                      Total: Q {pedidoActual.detalles.reduce((sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario), 0).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ background: "#f6f6f6" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Guardar cambios" : "Agregar pedido"}
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

export default Pedidos;
