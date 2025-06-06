import React, { useState } from "react";
import { FaCheckCircle, FaClipboardCheck } from "react-icons/fa";

function TaskList({ tasks = [] }) {
  // Permitir marcar tareas como completadas (solo visual/local)
  const [completed, setCompleted] = useState([]);

  const handleToggle = (id) => {
    setCompleted((curr) =>
      curr.includes(id) ? curr.filter((i) => i !== id) : [...curr, id]
    );
  };

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: 14 }}>
      <div className="card-body">
        <h6 className="fw-bold text-secondary mb-3">
          <FaClipboardCheck className="me-2" />
          Tareas / Recordatorios
        </h6>
        {tasks.length === 0 ? (
          <div className="text-center text-secondary py-4">
            ¡No hay tareas pendientes!
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {tasks.map((tarea) => (
              <li
                key={tarea.id}
                className="list-group-item d-flex align-items-center justify-content-between"
                style={{
                  background: completed.includes(tarea.id)
                    ? "linear-gradient(90deg, #5EFCE8 0%, #736EFE 100%)"
                    : "inherit",
                  color: completed.includes(tarea.id) ? "#fff" : "#333",
                  borderRadius: 9,
                  marginBottom: 4,
                  fontSize: 15,
                  transition: "background 0.22s, color 0.22s"
                }}
              >
                <span
                  style={{
                    textDecoration: completed.includes(tarea.id)
                      ? "line-through"
                      : "none",
                    flex: 1
                  }}
                >
                  {tarea.texto}
                </span>
                <button
                  className="btn btn-link p-0 ms-2"
                  style={{
                    color: completed.includes(tarea.id) ? "#fff" : "#43cea2",
                    fontSize: 22
                  }}
                  title={
                    completed.includes(tarea.id)
                      ? "Marcar como pendiente"
                      : "Marcar como completada"
                  }
                  onClick={() => handleToggle(tarea.id)}
                >
                  <FaCheckCircle />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskList;
