import React from "react";
import { FaUsers, FaBoxOpen, FaExchangeAlt, FaUserTie, FaTruck } from "react-icons/fa";

const cards = [
  {
    label: "Usuarios",
    icon: <FaUsers size={32} />,
    color: "linear-gradient(135deg, #5EFCE8 0%, #736EFE 100%)",
    key: "usuarios",
  },
  {
    label: "Productos",
    icon: <FaBoxOpen size={32} />,
    color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    key: "productos",
  },
  {
    label: "Movimientos",
    icon: <FaExchangeAlt size={32} />,
    color: "linear-gradient(135deg, #ff5858 0%, #f09819 100%)",
    key: "movimientos",
  },
  {
    label: "Clientes",
    icon: <FaUserTie size={32} />,
    color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    key: "clientes",
  },
  {
    label: "Proveedores",
    icon: <FaTruck size={32} />,
    color: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    key: "proveedores",
  },
];

function KpiCards({ usuarios = 0, productos = 0, movimientos = 0, clientes = 0, proveedores = 0 }) {
  const data = { usuarios, productos, movimientos, clientes, proveedores };
  return (
    <div className="row g-4 justify-content-center" style={{ marginTop: 10 }}>
      {cards.map((card) => (
        <div key={card.label} className="col-6 col-md-4 col-lg-2">
          <div
            className="kpi-card text-center shadow-lg"
            style={{
              background: card.color,
              color: "#fff",
              borderRadius: 18,
              padding: "32px 10px 18px 10px",
              minHeight: 130,
              boxShadow: "0 6px 32px 0 rgba(31, 38, 135, 0.17)",
              backdropFilter: "blur(3px)",
              position: "relative",
              transition: "transform 0.13s",
              cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px) scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >
            <div className="mb-2" style={{ fontSize: 34 }}>
              {card.icon}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 1 }}>{card.label}</div>
            <div style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 1,
              marginTop: 5,
              textShadow: "0 1px 6px rgba(0,0,0,0.09)"
            }}>
              {data[card.key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KpiCards;
