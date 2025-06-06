import React, { useState, useEffect } from "react";
import KpiCards from "../components/KpiCards";
import ChartSection from "../components/ChartSection";
import ActivityTable from "../components/ActivityTable";
import FloatingButton from "../components/FloatingButton";
import TaskList from "../components/TaskList";
import NotificationToast from "../components/NotificationToast";

const API_BASE = "https://master.soporteumg.com/api.php?endpoint=";

function DashboardHome() {
  const [kpis, setKpis] = useState({});
  const [charts, setCharts] = useState({});
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") ||
    sessionStorage.getItem("userRole") ||
    ""
  );

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchKPIs(), fetchCharts(), fetchActivities(), fetchTasks()]);
  };

  // --- ACTUALIZADO: Incluye almacenes y pedidos ---
  const fetchKPIs = async () => {
    const [
      usuarios,
      productos,
      movimientos,
      clientes,
      proveedores,
      almacenes,
      pedidos
    ] = await Promise.all([
      fetch(API_BASE + "usuarios").then(r => r.json()),
      fetch(API_BASE + "productos").then(r => r.json()),
      fetch(API_BASE + "movimientos").then(r => r.json()),
      fetch(API_BASE + "clientes").then(r => r.json()),
      fetch(API_BASE + "proveedores").then(r => r.json()),
      fetch(API_BASE + "almacenes").then(r => r.json()),
      fetch(API_BASE + "pedidos").then(r => r.json())
    ]);
    setKpis({
      usuarios: userRole === "admin" ? usuarios.length : undefined,
      productos: productos.length,
      movimientos: movimientos.length,
      clientes: clientes.length,
      proveedores: userRole === "admin" ? proveedores.length : undefined,
      almacenes: almacenes.length,
      pedidos: pedidos.length,
    });
  };

  const fetchCharts = async () => {
    const [productos, categorias, movimientos] = await Promise.all([
      fetch(API_BASE + "productos").then(r => r.json()),
      fetch(API_BASE + "categorias").then(r => r.json()),
      fetch(API_BASE + "movimientos").then(r => r.json())
    ]);
    const productosPorCategoria = {};
    categorias.forEach(cat => {
      productosPorCategoria[cat.nombre] = productos.filter(p => Number(p.categoria_id) === Number(cat.id)).length;
    });
    const movimientosPorTipo = {};
    movimientos.forEach(mov => {
      movimientosPorTipo[mov.tipo] = (movimientosPorTipo[mov.tipo] || 0) + 1;
    });
    setCharts({
      productosPorCategoria,
      movimientosPorTipo
    });
  };

  const fetchActivities = async () => {
    const [movimientos, historial, usuarios, productos] = await Promise.all([
      fetch(API_BASE + "movimientos").then(r => r.json()),
      fetch(API_BASE + "historial_cambios").then(r => r.json()),
      fetch(API_BASE + "usuarios").then(r => r.json()),
      fetch(API_BASE + "productos").then(r => r.json())
    ]);
    const usersMap = {}; usuarios.forEach(u => { usersMap[u.id] = u.nombre; });
    const prodMap = {}; productos.forEach(p => { prodMap[p.id] = p.nombre; });
    const actsMov = movimientos.map(m => ({
      fecha: m.fecha,
      tipo: m.tipo,
      producto: prodMap[m.producto_id] || "",
      cantidad: m.cantidad,
      usuario_nombre: usersMap[m.usuario_id] || m.usuario_id,
      descripcion: ""
    }));
    const actsHist = historial.map(h => ({
      fecha: h.fecha,
      tipo: h.accion,
      producto: h.entidad,
      cantidad: "",
      usuario_nombre: usersMap[h.usuario_id] || h.usuario_id,
      descripcion: h.descripcion
    }));
    const allActs = [...actsMov, ...actsHist].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setActivities(allActs.slice(0, 15));
  };

  const fetchTasks = async () => {
    const productos = await fetch(API_BASE + "productos").then(r => r.json());
    const tareas = productos
      .filter(p => Number(p.stock_actual) < Number(p.stock_minimo))
      .map(p => ({
        id: p.id,
        texto: `¡Reponer stock de "${p.nombre}"! (Actual: ${p.stock_actual}, Mínimo: ${p.stock_minimo})`,
        completada: false
      }));
    setTasks(tareas);
  };

  return (
    <div>
      <KpiCards {...kpis} userRole={userRole} />
      <div className="row mt-4">
        <div className="col-md-8">
          <ChartSection charts={charts} userRole={userRole} />
          <ActivityTable activities={activities} userRole={userRole} />
        </div>
        <div className="col-md-4">
          <TaskList tasks={tasks} userRole={userRole} />
        </div>
      </div>
      {userRole === "admin" && (
        <FloatingButton onClick={() => setShowToast(true)} tooltip="Nuevo elemento (solo Admin)" />
      )}
      <NotificationToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default DashboardHome;
