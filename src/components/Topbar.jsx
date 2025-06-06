import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBell, FaCog, FaPowerOff } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext"; // Ajusta el path según tu estructura

function Topbar({
  onLogout,
  username = "Usuario",
  email = "usuario@email.com",
  role = "encargado"
}) {
  const [showPerfilMenu, setShowPerfilMenu] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [mensajeConfig, setMensajeConfig] = useState("");
  const [now, setNow] = useState(new Date());

  // Idioma: Español/Inglés
  const { language, switchLanguage } = useLanguage();

  // Traducciones
  const t = {
    es: {
      welcome: "Bienvenido",
      logout: "Cerrar sesión",
      notifications: "Notificaciones",
      noNotifications: "No hay más notificaciones",
      changeLang: "Idioma: Español",
      editProfile: "Editar perfil",
      changePass: "Cambiar contraseña",
      config: "Configuración",
      about: "Acerca del sistema",
      theme: "Cambiar tema",
      soon: "Próximamente podrás cambiar entre tema claro y oscuro.",
      notifConfig: "Aquí podrás personalizar tus notificaciones.",
      aboutMsg: "MasterStockX v1.0 — Sistema de gestión de inventarios inteligente.",
      dateOptions: {
        weekday: "short", day: "2-digit", month: "2-digit", year: "2-digit"
      }
    },
    en: {
      welcome: "Welcome",
      logout: "Log out",
      notifications: "Notifications",
      noNotifications: "No more notifications",
      changeLang: "Language: English",
      editProfile: "Edit profile",
      changePass: "Change password",
      config: "Settings",
      about: "About system",
      theme: "Change theme",
      soon: "Soon you can switch between light and dark theme.",
      notifConfig: "You will be able to customize your notifications here.",
      aboutMsg: "MasterStockX v1.0 — Intelligent inventory management system.",
      dateOptions: {
        weekday: "short", day: "2-digit", month: "2-digit", year: "2-digit"
      }
    }
  }[language];

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Refs para click fuera
  const perfilMenuRef = useRef();
  const notificacionesRef = useRef();
  const configRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (perfilMenuRef.current && !perfilMenuRef.current.contains(event.target)) {
        setShowPerfilMenu(false);
      }
      if (notificacionesRef.current && !notificacionesRef.current.contains(event.target)) {
        setShowNotificaciones(false);
      }
      if (configRef.current && !configRef.current.contains(event.target)) {
        setShowConfig(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Opciones de configuración
  const configuracionOpciones = [
    { label: t.theme, action: "theme" },
    { label: t.changeLang, action: "language" },
    { label: t.notifications, action: "notifications" },
    { label: t.about, action: "about" }
  ];

  const handleConfigClick = (action) => {
    switch (action) {
      case "theme":
        setMensajeConfig(t.soon);
        break;
      case "language":
        switchLanguage(language === "es" ? "en" : "es");
        setMensajeConfig(""); // Limpiar mensaje al cambiar idioma
        break;
      case "notifications":
        setMensajeConfig(t.notifConfig);
        break;
      case "about":
        setMensajeConfig(t.aboutMsg);
        break;
      default:
        setMensajeConfig("");
    }
  };

  // Fecha y hora formateada
  const dateStr = now.toLocaleDateString(language === "es" ? "es-GT" : "en-US", t.dateOptions);
  const timeStr = now.toLocaleTimeString(language === "es" ? "es-GT" : "en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-3 py-2 bg-white border-bottom position-fixed"
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1001,
        boxShadow: "0 1px 8px rgba(0,0,0,.03)"
      }}
    >
      {/* Izquierda: saludo + fecha/hora */}
      <div className="d-flex align-items-center">
        <span className="fw-bold" style={{ fontSize: 18, marginLeft: 64 }}>
          {t.welcome}, {username}
        </span>
        <span className="text-muted ms-4" style={{ fontSize: 11 }}>
          <i className="fa fa-calendar-alt me-1"></i>
          {dateStr} - {timeStr}
        </span>
      </div>

      {/* Derecha: botones y menús */}
      <div className="d-flex align-items-center gap-2 position-relative">
        {/* Botón logout (visible siempre) */}
        <button
          className="btn btn-link text-danger me-2"
          style={{ fontSize: 20 }}
          title={t.logout}
          onClick={onLogout}
        >
          <FaPowerOff />
        </button>

        {/* Notificaciones */}
        <button
          className="btn btn-link text-dark position-relative"
          title={t.notifications}
          onClick={() => setShowNotificaciones(!showNotificaciones)}
        >
          <FaBell size={20} />
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1"
                style={{ fontSize: 11, minWidth: 18, minHeight: 18 }}>1</span>
        </button>
        {/* Menú Notificaciones */}
        {showNotificaciones && (
          <div
            ref={notificacionesRef}
            className="dropdown-menu show"
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              left: "auto",
              minWidth: 250,
              maxWidth: 340,
              maxHeight: 350,
              overflowY: "auto",
              overflowX: "auto",
              boxShadow: "0 6px 24px #0002",
              borderRadius: 14,
              background: "#fff",
              zIndex: 1200,
              padding: 14
            }}
          >
            <div className="fw-bold mb-2">{t.notifications}</div>
            {/* Ejemplo de notificaciones */}
            <div className="alert alert-warning p-2 mb-2" style={{ fontSize: 15 }}>
              <strong>Stock bajo</strong>: Producto "Laptop HP" <span className="badge bg-danger">3</span>
            </div>
            <div className="alert alert-info p-2 mb-2" style={{ fontSize: 15 }}>
              Nuevo pedido recibido de <strong>Juan Pérez</strong>
            </div>
            <div className="text-center text-muted small">{t.noNotifications}</div>
          </div>
        )}

        {/* Perfil */}
        <button
          className="btn btn-link text-dark"
          title="Perfil"
          onClick={() => setShowPerfilMenu(!showPerfilMenu)}
        >
          <FaUserCircle size={22} />
        </button>
        {/* Menú Perfil */}
        {showPerfilMenu && (
          <div
            ref={perfilMenuRef}
            className="dropdown-menu show"
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              left: "auto",
              minWidth: 260,
              maxWidth: 340,
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: 400,
              boxShadow: "0 6px 24px #0002",
              borderRadius: 14,
              background: "#fff",
              zIndex: 1200,
              padding: 20
            }}
          >
            <div className="d-flex flex-column align-items-center mb-2">
              <FaUserCircle size={48} className="mb-2 text-secondary" />
              <div className="fw-bold" style={{ fontSize: 17 }}>{username}</div>
              <div className="text-muted small">@{username?.toLowerCase()}</div>
              <div className="d-flex align-items-center gap-1 mt-1">
                <span className="text-muted small">
                  <i className="fa fa-envelope"></i> {email}
                </span>
              </div>
              <span className="badge bg-info text-dark mt-2 text-capitalize">{role}</span>
            </div>
            <button className="btn btn-outline-primary w-100 mb-2">
              <i className="fa fa-user-edit"></i> {t.editProfile}
            </button>
            <button className="btn btn-outline-secondary w-100 mb-2">
              <i className="fa fa-key"></i> {t.changePass}
            </button>
            <button
              className="btn btn-outline-danger w-100"
              onClick={onLogout}
            >
              <FaPowerOff className="me-2" /> {t.logout}
            </button>
          </div>
        )}

        {/* Configuración */}
        <button
          className="btn btn-link text-dark"
          title={t.config}
          onClick={() => setShowConfig(!showConfig)}
        >
          <FaCog size={20} />
        </button>
        {/* Menú de Configuración */}
        {showConfig && (
          <div
            ref={configRef}
            className="dropdown-menu show"
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              left: "auto",
              minWidth: 260,
              maxWidth: 340,
              overflowY: "auto",
              maxHeight: 400,
              boxShadow: "0 6px 24px #0002",
              borderRadius: 14,
              background: "#fff",
              zIndex: 1300,
              padding: 20
            }}
          >
            <div className="fw-bold mb-3">{t.config}</div>
            {configuracionOpciones.map((opt) => (
              <button
                key={opt.action}
                className="btn btn-outline-secondary w-100 mb-2 text-start"
                onClick={() => handleConfigClick(opt.action)}
              >
                {opt.label}
              </button>
            ))}
            {mensajeConfig && (
              <div className="alert alert-info py-2 mt-2" style={{ fontSize: 14 }}>
                {mensajeConfig}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Topbar;
