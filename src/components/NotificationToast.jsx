import React, { useEffect, useRef } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

function NotificationToast({
  show = false,
  onClose = () => {},
  message = "¡Acción realizada con éxito!",
  type = "success" // "success" | "error" | "info"
}) {
  const toastRef = useRef(null);

  // Cerrar automáticamente después de 2.5s
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // Icono según tipo
  let icon, bgClass;
  switch (type) {
    case "success":
      icon = <FaCheckCircle className="me-2" style={{ color: "#28a745" }} />;
      bgClass = "bg-success text-white";
      break;
    case "error":
      icon = <FaTimesCircle className="me-2" style={{ color: "#dc3545" }} />;
      bgClass = "bg-danger text-white";
      break;
    case "info":
    default:
      icon = <FaInfoCircle className="me-2" style={{ color: "#17a2b8" }} />;
      bgClass = "bg-info text-white";
      break;
  }

  return (
    <div
      ref={toastRef}
      style={{
        position: "fixed",
        bottom: 30,
        right: 24,
        zIndex: 1080,
        minWidth: 260,
        maxWidth: 350,
        transition: "opacity 0.2s",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none"
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`toast show shadow-lg ${bgClass}`} style={{ borderRadius: 12 }}>
        <div className="toast-body d-flex align-items-center">
          {icon}
          <span style={{ fontSize: 15 }}>{message}</span>
          <button
            type="button"
            className="btn-close ms-auto"
            style={{ filter: "invert(1)" }}
            aria-label="Cerrar"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default NotificationToast;
