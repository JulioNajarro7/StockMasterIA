import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaChartBar,
  FaBell,
  FaListUl,
  FaWarehouse,
  FaRobot,
  FaTruck
} from "react-icons/fa";
import LogoMSX from "../assets/LogoMSX.svg";

// Menú personalizado por rol
const menuByRole = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: <FaHome /> },
    { to: "/admin/usuarios", label: "Usuarios", icon: <FaUsers /> },
    { to: "/admin/productos", label: "Productos", icon: <FaBoxOpen /> },
    { to: "/admin/proveedores", label: "Proveedores", icon: <FaTruck /> },
    { to: "/admin/almacenes", label: "Almacenes", icon: <FaWarehouse /> },
    { to: "/admin/alertas", label: "Alertas", icon: <FaBell /> },
    { to: "/admin/reportes", label: "Reportes", icon: <FaChartBar /> },
    { to: "/admin/movimientos", label: "Movimientos", icon: <FaListUl /> },
    { to: "/admin/pedidos", label: "Pedidos", icon: <FaListUl /> },
    { to: "/admin/AsistenteIA", label: "Asistente IA", icon: <FaRobot /> },
  ],
  encargado: [
    { to: "/admin", label: "Dashboard", icon: <FaHome /> },
    { to: "/admin/productos", label: "Productos", icon: <FaBoxOpen /> },
    { to: "/admin/almacenes", label: "Almacenes", icon: <FaWarehouse /> },
    { to: "/admin/movimientos", label: "Movimientos", icon: <FaListUl /> },
    { to: "/admin/reportes", label: "Reportes", icon: <FaChartBar /> },
    { to: "/admin/alertas", label: "Alertas", icon: <FaBell /> },
    { to: "/admin/pedidos", label: "Pedidos", icon: <FaListUl /> },
  ],
  gerente: [
    { to: "/admin", label: "Dashboard", icon: <FaHome /> },
    { to: "/admin/reportes", label: "Reportes", icon: <FaChartBar /> },
    { to: "/admin/alertas", label: "Alertas", icon: <FaBell /> },
    { to: "/admin/productos", label: "Productos", icon: <FaBoxOpen /> },
    { to: "/admin/almacenes", label: "Almacenes", icon: <FaWarehouse /> },
  ],
  auditor: [
    { to: "/admin", label: "Dashboard", icon: <FaHome /> },
    { to: "/admin/reportes", label: "Reportes", icon: <FaChartBar /> },
    { to: "/admin/movimientos", label: "Movimientos", icon: <FaListUl /> },
  ]
};

function Sidebar({
  collapsed = false,
  setCollapsed = () => {},
  userRole = "",
  onLogout = () => {}
}) {
  // Usa admin por defecto si no se reconoce el rol
  const menu = menuByRole[userRole] || menuByRole.admin;

  // Handler único para logo y texto
  const handleCollapseToggle = () => setCollapsed(!collapsed);

  return (
    <div
      className="sidebar bg-white shadow d-flex flex-column justify-content-between"
      style={{
        width: collapsed ? 60 : 220,
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        transition: "width 0.18s"
      }}
    >
      {/* Header del sidebar (logo y colapsar) */}
      <div
        className="d-flex align-items-center justify-content-between px-2"
        style={{
          height: 64,
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <div className="d-flex align-items-center" style={{ cursor: "pointer", userSelect: "none" }}>
          <img
            src={LogoMSX}
            alt="Logo"
            style={{ width: 38, transition: "width 0.18s" }}
            onClick={handleCollapseToggle}
            title="Expandir/Colapsar"
          />
          {!collapsed && (
            <span
              className="ms-2 fw-bold"
              style={{
                fontSize: 21,
                color: "#23448c",
                letterSpacing: "1.5px",
                transition: "opacity 0.18s",
                cursor: "pointer"
              }}
              onClick={handleCollapseToggle}
              title="Expandir/Colapsar"
            >
              MasterStockIA
            </span>
          )}
        </div>
      </div>

      {/* Menú */}
      <nav className="nav flex-column mt-2 flex-grow-1">
        {menu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              "nav-link d-flex align-items-center" +
              (isActive ? " active bg-light" : "") +
              (collapsed ? " justify-content-center" : "")
            }
            style={{
              padding: collapsed ? "12px 0" : "12px 20px",
              fontSize: 17,
              borderRadius: 10,
              color: "#23448c",
              margin: "2px 7px",
              transition: "background 0.15s, color 0.15s"
            }}
            title={item.label}
            end={item.to === "/admin"}
          >
            <span style={{ fontSize: 19 }}>{item.icon}</span>
            {!collapsed && <span className="ms-2">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
