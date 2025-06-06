<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowUp, FaArrowLeft, FaFilePdf, FaEye } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

function Reportes() {
=======
<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowLeft, FaFilePdf, FaEye } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import styles from './Reportes.module.css';

function Reportes() {
=======
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function Reportes() {
  const navigate = useNavigate();
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const [productos, setProductos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reporte, setReporte] = useState('inventario');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const reporteRef = useRef();

  const API = 'https://master.soporteumg.com/api.php';

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = {
        inventario: 'productos',
        bajoStock: 'productos',
        entradas: 'entradas',
        salidas: 'salidas',
        pedidos: 'pedidos',
      };
      const res = await fetch(`${API}?endpoint=${endpoints[reporte]}`);
      const data = await res.json();
      if (reporte === 'inventario' || reporte === 'bajoStock') setProductos(data);
      else if (reporte === 'entradas') setEntradas(data);
      else if (reporte === 'salidas') setSalidas(data);
      else if (reporte === 'pedidos') setPedidos(data);
    };

    fetchData();
<<<<<<< HEAD
=======

>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reporte]);

<<<<<<< HEAD
=======
  // Detectar cambios de tamaño de ventana (responsivo en tiempo real)
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

<<<<<<< HEAD
  // Descargar PDF
  const descargarPDF = async () => {
    if (mostrarPreview && pdfBlob) {
=======
  // Botón de descarga PDF
  const descargarPDF = async () => {
    if (mostrarPreview && pdfBlob) {
      // Descargar el PDF generado en la previsualización
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${reporte}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
<<<<<<< HEAD
=======
      // Generar y descargar directamente
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      const opt = {
        margin: 0.5,
        filename: `reporte-${reporte}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(reporteRef.current).save();
    }
  };

<<<<<<< HEAD
  // Previsualizar PDF
=======
  // Previsualizar y guardar el blob
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const previsualizarPDF = async () => {
    if (mostrarPreview) {
      setMostrarPreview(false);
      setPreviewUrl('');
      setPdfBlob(null);
      return;
    }
<<<<<<< HEAD
=======
=======
  const reporteRef = useRef();

  useEffect(() => {
    if (reporte === 'inventario' || reporte === 'bajoStock') {
      fetch('http://localhost/api.php?endpoint=productos')
        .then(res => res.json())
        .then(data => setProductos(data));
    } else if (reporte === 'entradas') {
      fetch('http://localhost/api.php?endpoint=entradas')
        .then(res => res.json())
        .then(data => setEntradas(data));
    } else if (reporte === 'salidas') {
      fetch('http://localhost/api.php?endpoint=salidas')
        .then(res => res.json())
        .then(data => setSalidas(data));
    } else if (reporte === 'pedidos') {
      fetch('http://localhost/api.php?endpoint=pedidos')
        .then(res => res.json())
        .then(data => setPedidos(data));
    }
  }, [reporte]);

  const generarPDF = () => {
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    const opt = {
      margin: 0.5,
      filename: `reporte-${reporte}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
<<<<<<< HEAD
=======
<<<<<<< HEAD
    // Genera PDF como blob y como url
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    html2pdf().set(opt).from(reporteRef.current).outputPdf('blob').then((blob) => {
      setPdfBlob(blob);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setMostrarPreview(true);
    });
<<<<<<< HEAD
=======
=======
    html2pdf().set(opt).from(reporteRef.current).save();
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  };

  const filtrarPorFecha = (data) => {
    if (!fechaInicio || !fechaFin) return data;
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    return data.filter((item) => {
      const fecha = new Date(item.fecha);
      return fecha >= start && fecha <= end;
    });
  };

<<<<<<< HEAD
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Filtrar datos según tipo de reporte y búsqueda
  const getDataToRender = () => {
    let data = [];
    if (reporte === 'inventario' || reporte === 'bajoStock') {
      data = productos.filter(p =>
        p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        (p.categoria?.toLowerCase?.() ?? '').includes(filtro.toLowerCase())
      );
      if (reporte === 'bajoStock') data = data.filter(p => Number(p.stock_actual || p.stock) <= 10);
    } else if (reporte === 'entradas') {
      data = filtrarPorFecha(entradas).filter(e =>
        String(e.producto_id)?.toLowerCase().includes(filtro.toLowerCase())
      );
    } else if (reporte === 'salidas') {
      data = filtrarPorFecha(salidas).filter(s =>
        String(s.producto_id)?.toLowerCase().includes(filtro.toLowerCase())
      );
    } else if (reporte === 'pedidos') {
      data = pedidos.filter(p =>
        (p.cliente?.toLowerCase() ?? '').includes(filtro.toLowerCase()) ||
        (p.estado?.toLowerCase() ?? '').includes(filtro.toLowerCase())
      );
    }
    return data;
  };

  const dataRender = getDataToRender();

=======
<<<<<<< HEAD
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const obtenerTitulo = () => {
    const titulos = {
      inventario: 'Reporte de Inventario General',
      entradas: 'Reporte de Entradas',
      salidas: 'Reporte de Salidas',
      pedidos: 'Reporte de Pedidos',
      bajoStock: 'Productos con Bajo Stock'
    };
    return titulos[reporte] || 'Reporte';
  };

  const obtenerFechaTexto = () => {
    const hoy = new Date();
    const fechaActual = hoy.toLocaleDateString();
    if (reporte === 'entradas' || reporte === 'salidas') {
      if (fechaInicio && fechaFin) {
        return `Desde: ${fechaInicio}  Hasta: ${fechaFin}`;
      }
    }
    return `Fecha de generación: ${fechaActual}`;
  };

<<<<<<< HEAD
  return (
    <div className="container py-4">
      <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
        {/* Barra de título y controles */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
          <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
            <FaFilePdf style={{ fontSize: 28, opacity: 0.9 }} /> Reportes
          </h3>
          <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
            <select
              className="form-select"
              value={reporte}
              onChange={e => setReporte(e.target.value)}
              style={{ minWidth: 160, maxWidth: 220, borderRadius: 8 }}
            >
=======
  // Filtrar según tipo de reporte y búsqueda
  const getDataToRender = () => {
    let data = [];
    if (reporte === 'inventario' || reporte === 'bajoStock') {
      data = productos.filter(p =>
        p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(filtro.toLowerCase())
      );
      if (reporte === 'bajoStock') data = data.filter(p => p.stock <= 10);
    } else if (reporte === 'entradas') {
      data = filtrarPorFecha(entradas).filter(e =>
        String(e.producto_id)?.toLowerCase().includes(filtro.toLowerCase())
      );
    } else if (reporte === 'salidas') {
      data = filtrarPorFecha(salidas).filter(s =>
        String(s.producto_id)?.toLowerCase().includes(filtro.toLowerCase())
      );
    } else if (reporte === 'pedidos') {
      data = pedidos.filter(p =>
        p.cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.estado?.toLowerCase().includes(filtro.toLowerCase())
      );
    }
    return data;
  };

  const dataRender = getDataToRender();

  return (
    <div className={styles.reporteRoot}>
      <div className={styles.reporteContent}>
        <h1 className={styles.title}>Reportes 📊</h1>
        <button
          onClick={goBackToDashboard}
          className={styles.backButton}
        >
          <FaArrowLeft />
        </button>

        {/* Controles superiores */}
        <div className={styles.centerRow}>
          <div>
            <label><strong>Tipo de reporte: </strong></label>
            <select value={reporte} onChange={(e) => setReporte(e.target.value)} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
              <option value="inventario">Inventario general</option>
              <option value="entradas">Entradas por fecha</option>
              <option value="salidas">Salidas por fecha</option>
              <option value="pedidos">Pedidos por estado</option>
              <option value="bajoStock">Productos con bajo stock</option>
            </select>
<<<<<<< HEAD
            <button className="btn btn-outline-danger" onClick={descargarPDF}>
              <FaFilePdf /> <span className="d-none d-sm-inline">Descargar PDF</span>
            </button>
            <button className="btn btn-outline-secondary" onClick={previsualizarPDF}>
              <FaEye /> <span className="d-none d-sm-inline">{mostrarPreview ? 'Ocultar Vista Previa' : 'Previsualizar PDF'}</span>
            </button>
          </div>
        </div>
        {/* Filtros y búsqueda */}
        {(reporte === 'entradas' || reporte === 'salidas') && (
          <div className="d-flex gap-3 px-3 px-md-4 mb-2 flex-wrap">
            <label className="fw-semibold">
              Desde: <input type="date" className="form-control d-inline-block" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ maxWidth: 180 }} />
            </label>
            <label className="fw-semibold">
              Hasta: <input type="date" className="form-control d-inline-block" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ maxWidth: 180 }} />
            </label>
          </div>
        )}
        <div className="px-3 px-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar en reporte"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ borderRadius: 8, maxWidth: 400 }}
=======
          </div>
          <button className={styles.addButton} onClick={descargarPDF}>
            <FaFilePdf /> Descargar PDF
          </button>
          <button className={styles.addButton} onClick={previsualizarPDF}>
            <FaEye /> {mostrarPreview ? 'Ocultar Vista Previa' : 'Previsualizar PDF'}
          </button>
        </div>

        {(reporte === 'entradas' || reporte === 'salidas') && (
          <div className={styles.centerRow}>
            <label>Desde: </label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ marginRight: '1rem' }} />
            <label>Hasta: </label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
        )}

        <div className={styles.centerInput}>
          <input
            type="text"
            placeholder="🔍 Buscar en reporte"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              padding: '0.8rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              width: '100%',
              maxWidth: '400px',
              color: '#333'
            }}
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
          />
        </div>

        {!mostrarPreview && (
<<<<<<< HEAD
          <div className="table-responsive px-2" ref={reporteRef}>
            <h4 className="text-center mb-2" style={{ color: "#23448c" }}>{obtenerTitulo()}</h4>
            <p className="text-end text-muted mb-2" style={{ fontSize: 14 }}>{obtenerFechaTexto()}</p>
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light">
                {reporte === 'inventario' && <tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th></tr>}
                {reporte === 'bajoStock' && <tr><th>Producto</th><th>Categoría</th><th>Stock</th></tr>}
                {reporte === 'entradas' && <tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr>}
                {reporte === 'salidas' && <tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr>}
                {reporte === 'pedidos' && <tr><th>Cliente</th><th>Estado</th><th>Total</th><th>Almacén</th></tr>}
              </thead>
              <tbody>
                {dataRender.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No hay datos para mostrar.</td>
                  </tr>
                ) : (
                  dataRender.map((item, i) => {
                    if (reporte === 'inventario') {
                      return (
                        <tr key={item.id}>
                          <td>{item.nombre}</td>
                          <td>{item.categoria || item.categoria_id}</td>
                          <td>{item.stock_actual || item.stock}</td>
                          <td>Q{parseFloat(item.precio || 0).toFixed(2)}</td>
                        </tr>
                      );
                    }
                    if (reporte === 'bajoStock') {
                      return (
                        <tr key={item.id}>
                          <td>{item.nombre}</td>
                          <td>{item.categoria || item.categoria_id}</td>
                          <td>{item.stock_actual || item.stock}</td>
                        </tr>
                      );
                    }
                    if (reporte === 'entradas' || reporte === 'salidas') {
                      return (
                        <tr key={i}>
                          <td>{item.producto_id}</td>
                          <td>{item.cantidad}</td>
                          <td>{item.almacen_id}</td>
                          <td>{item.fecha}</td>
                        </tr>
                      );
                    }
                    if (reporte === 'pedidos') {
                      return (
                        <tr key={i}>
                          <td>{item.cliente}</td>
                          <td>{item.estado}</td>
                          <td>Q{parseFloat(item.total || 0).toFixed(2)}</td>
                          <td>{item.almacen_id}</td>
                        </tr>
                      );
                    }
                    return null;
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {mostrarPreview && previewUrl && (
          isMobile ? (
            <div className="my-4 text-center">
              <p className="text-dark mb-3">No es posible visualizar el PDF en móvil.</p>
              <button className="btn btn-danger" onClick={descargarPDF}>
=======
          <div className={styles.reporteScrollContainer}>
            <div ref={reporteRef} style={{ width: '100%' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', color: '#222' }}>{obtenerTitulo()}</h2>
              <p style={{ textAlign: 'right', fontSize: '1rem', marginBottom: '1rem', color: '#222' }}>{obtenerFechaTexto()}</p>
              <table className={styles.reporteTable}>
                <thead>
                  {reporte === 'inventario' && <tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th></tr>}
                  {reporte === 'bajoStock' && <tr><th>Producto</th><th>Categoría</th><th>Stock</th></tr>}
                  {reporte === 'entradas' && <tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr>}
                  {reporte === 'salidas' && <tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr>}
                  {reporte === 'pedidos' && <tr><th>Cliente</th><th>Estado</th><th>Total</th><th>Almacén</th></tr>}
                </thead>
                <tbody>
                  {dataRender.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyMessage}>No hay datos para mostrar.</td>
                    </tr>
                  ) : (
                    dataRender.map((item, i) => {
                      if (reporte === 'inventario') {
                        return (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>{item.categoria}</td>
                            <td>{item.stock}</td>
                            <td>Q{parseFloat(item.precio).toFixed(2)}</td>
                          </tr>
                        );
                      }
                      if (reporte === 'bajoStock') {
                        return (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>{item.categoria}</td>
                            <td>{item.stock}</td>
                          </tr>
                        );
                      }
                      if (reporte === 'entradas' || reporte === 'salidas') {
                        return (
                          <tr key={i}>
                            <td>{item.producto_id}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.almacen_id}</td>
                            <td>{item.fecha}</td>
                          </tr>
                        );
                      }
                      if (reporte === 'pedidos') {
                        return (
                          <tr key={i}>
                            <td>{item.cliente}</td>
                            <td>{item.estado}</td>
                            <td>Q{parseFloat(item.total).toFixed(2)}</td>
                            <td>{item.almacen_id}</td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PREVISUALIZACIÓN */}
        {mostrarPreview && previewUrl && (
          isMobile ? (
            <div style={{
              marginTop: '2rem',
              width: '100%',
              minHeight: '100px',
              background: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <p style={{ color: '#222', fontSize: '1.1rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                No es posible visualizar el PDF en móvil.
              </p>
              <button className={styles.addButton} onClick={descargarPDF}>
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
                <FaFilePdf style={{ marginRight: 6 }} />
                Descargar PDF
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '2rem', width: '100%', height: '80vh' }}>
              <iframe src={previewUrl} title="Vista previa PDF" style={{ width: '100%', height: '100%', border: 'none', borderRadius: '1rem' }}></iframe>
            </div>
          )
        )}

        {showScrollTop && (
<<<<<<< HEAD
          <button
            onClick={scrollToTop}
            className="btn btn-primary position-fixed"
            style={{
              right: 32, bottom: 32, zIndex: 1055, borderRadius: "50%", width: 48, height: 48, fontSize: 22, padding: 0
            }}
            title="Subir"
          >
            <FaArrowUp />
          </button>
        )}
        <button
          className="btn btn-outline-primary mt-3 ms-3"
          style={{ borderRadius: 8, fontWeight: "bold", minWidth: 110 }}
          onClick={() => window.history.back()}
        >
          <FaArrowLeft /> Volver
        </button>
      </div>
=======
          <button onClick={scrollToTop} className={styles.scrollTopButton}>
            <FaArrowUp />
          </button>
        )}
      </div>
=======
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Reportes 📊</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>←</button>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Tipo de reporte: </strong></label>
        <select value={reporte} onChange={(e) => setReporte(e.target.value)} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          <option value="inventario">Inventario general</option>
          <option value="entradas">Entradas por fecha</option>
          <option value="salidas">Salidas por fecha</option>
          <option value="pedidos">Pedidos por estado</option>
          <option value="bajoStock">Productos con bajo stock</option>
        </select>
      </div>

      {(reporte === 'entradas' || reporte === 'salidas') && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Desde: </label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ marginRight: '1rem' }} />
          <label>Hasta: </label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>
      )}

      <div ref={reporteRef} style={{ width: '100%', maxWidth: '1000px', marginTop: '1rem' }}>
        {reporte === 'inventario' && (
          <table className="table">
            <thead>
              <tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td><td>{p.categoria}</td><td>{p.stock}</td><td>Q{parseFloat(p.precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'bajoStock' && (
          <table className="table">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th></tr></thead>
            <tbody>
              {productos.filter(p => p.stock <= 10).map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td><td>{p.categoria}</td><td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'entradas' && (
          <table className="table">
            <thead><tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr></thead>
            <tbody>
              {filtrarPorFecha(entradas).map((e, i) => (
                <tr key={i}>
                  <td>{e.producto_id}</td><td>{e.cantidad}</td><td>{e.almacen_id}</td><td>{e.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'salidas' && (
          <table className="table">
            <thead><tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr></thead>
            <tbody>
              {filtrarPorFecha(salidas).map((s, i) => (
                <tr key={i}>
                  <td>{s.producto_id}</td><td>{s.cantidad}</td><td>{s.almacen_id}</td><td>{s.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'pedidos' && (
          <table className="table">
            <thead><tr><th>Cliente</th><th>Estado</th><th>Total</th><th>Almacén</th></tr></thead>
            <tbody>
              {pedidos.map((p, i) => (
                <tr key={i}>
                  <td>{p.cliente}</td><td>{p.estado}</td><td>Q{parseFloat(p.total).toFixed(2)}</td><td>{p.almacen_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="add-button" onClick={generarPDF} style={{ marginTop: '1rem' }}>
        Generar Reporte PDF
      </button>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    </div>
  );
}

export default Reportes;
