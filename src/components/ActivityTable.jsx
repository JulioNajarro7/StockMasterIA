import React from "react";
import { FaClipboardList, FaCogs, FaUser, FaBoxOpen } from "react-icons/fa";

function iconForType(tipo) {
  if (!tipo) return <FaClipboardList className="me-1" />;
  if (["entrada", "salida", "ajuste"].includes(tipo))
    return <FaBoxOpen className="me-1 text-primary" />;
  if (["crear", "actualizar", "eliminar"].includes(tipo))
    return <FaCogs className="me-1 text-success" />;
  return <FaClipboardList className="me-1" />;
}

function ActivityTable({ activities = [] }) {
  return (
    <div className="card shadow-sm" style={{ borderRadius: 14 }}>
      <div className="card-body">
        <h6 className="fw-bold text-secondary mb-3">
          <FaClipboardList className="me-2" />
          Actividades recientes
        </h6>
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: 45 }}></th>
                <th>Fecha/Hora</th>
                <th>Tipo</th>
                <th>Entidad/Producto</th>
                <th>Usuario</th>
                <th>Descripción</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-secondary py-4">
                    Sin actividades recientes
                  </td>
                </tr>
              ) : (
                activities.map((act, idx) => (
                  <tr key={idx}>
                    <td>
                      {iconForType(act.tipo)}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {act.fecha
                        ? new Date(act.fecha).toLocaleString("es-GT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </td>
                    <td>
                      <span className="badge bg-info text-dark" style={{ fontSize: 13 }}>
                        {act.tipo}
                      </span>
                    </td>
                    <td>{act.producto}</td>
                    <td>
                      <FaUser className="me-1" style={{ fontSize: 13, color: "#23448c" }} />
                      {act.usuario_nombre}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 13 }}>
                      {act.descripcion || "-"}
                    </td>
                    <td>
                      {act.cantidad !== "" ? (
                        <span className="badge bg-light text-dark" style={{ fontSize: 13 }}>
                          {act.cantidad}
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ActivityTable;
