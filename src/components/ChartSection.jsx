import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function ChartSection({ charts = {} }) {
  // Datos para productos por categoría (Barra)
  const barLabels = Object.keys(charts.productosPorCategoria || {});
  const barData = Object.values(charts.productosPorCategoria || {});

  // Datos para movimientos por tipo (Pastel)
  const pieLabels = Object.keys(charts.movimientosPorTipo || {});
  const pieData = Object.values(charts.movimientosPorTipo || {});

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: 14 }}>
      <div className="card-body">
        <div className="row g-3">
          {/* Gráfica de Barras: Productos por Categoría */}
          <div className="col-12 col-lg-7">
            <div style={{ height: 260, background: "#f9f9fc", borderRadius: 10, padding: 14 }}>
              <h6 className="fw-bold text-secondary mb-2">Productos por Categoría</h6>
              <Bar
                data={{
                  labels: barLabels,
                  datasets: [
                    {
                      label: "Cantidad de productos",
                      data: barData,
                      backgroundColor: [
                        "#1de9b6", "#ffd200", "#ff5858", "#6a11cb", "#43cea2"
                      ],
                      borderRadius: 8,
                      maxBarThickness: 34
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                  }
                }}
              />
            </div>
          </div>
          {/* Gráfica de Pastel: Movimientos por Tipo */}
          <div className="col-12 col-lg-5 d-flex align-items-center">
            <div style={{ width: "100%" }}>
              <h6 className="fw-bold text-secondary mb-2 text-center">Movimientos por Tipo</h6>
              <Pie
                data={{
                  labels: pieLabels,
                  datasets: [
                    {
                      data: pieData,
                      backgroundColor: [
                        "#736EFE", "#f7971e", "#43cea2"
                      ],
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: { color: "#222" }
                    },
                    tooltip: { enabled: true }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartSection;
