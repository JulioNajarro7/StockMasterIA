import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import fondo1 from "../assets/fondo1.gif"; // Asegúrate que la ruta es correcta

function Dashboard({ onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("nombreUsuario") ||
    sessionStorage.getItem("nombreUsuario") ||
    "Usuario"
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") ||
    sessionStorage.getItem("userRole") ||
    ""
  );

  // Estilos principales del contenido
  const mainContentStyle = {
    marginLeft: sidebarCollapsed ? 60 : 220,
    marginTop: 64,
    minHeight: "calc(100vh - 64px)",
    transition: "margin-left 0.2s, margin-top 0.2s",
    background: "transparent",
    position: "relative",
    zIndex: 2,
  };

  return (
    <div
      className="bg-light text-dark"
      style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* FONDO GIF */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          background: `url(${fondo1}) center center / cover no-repeat`,
          opacity: 0.16, // Puedes ajustar la opacidad si deseas
        }}
      />
      {/* CONTENIDO DEL DASHBOARD */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userRole={userRole}
        username={username}
        onLogout={onLogout}
      />
      <div className="main-content" style={mainContentStyle}>
        <Topbar
          onLogout={onLogout}
          username={username}
        />
        <div className="container-fluid py-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
