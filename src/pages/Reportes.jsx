import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowLeft, FaFilePdf, FaEye } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import styles from './Reportes.module.css';

function Reportes() {
  const [productos, setProductos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reporte, setReporte] = useState('inventario');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const navigate = useNavigate();
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

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reporte]);

  // Detectar cambios de tamaño de ventana (responsivo en tiempo real)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Botón de descarga PDF
  const descargarPDF = async () => {
    if (mostrarPreview && pdfBlob) {
      // Descargar el PDF generado en la previsualización
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${reporte}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Generar y descargar directamente
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

  // Previsualizar y guardar el blob
  const previsualizarPDF = async () => {
    if (mostrarPreview) {
      setMostrarPreview(false);
      setPreviewUrl('');
      setPdfBlob(null);
      return;
    }
    const opt = {
      margin: 0.5,
      filename: `reporte-${reporte}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Genera PDF como blob y como url
    html2pdf().set(opt).from(reporteRef.current).outputPdf('blob').then((blob) => {
      setPdfBlob(blob);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setMostrarPreview(true);
    });
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
              <option value="inventario">Inventario general</option>
              <option value="entradas">Entradas por fecha</option>
              <option value="salidas">Salidas por fecha</option>
              <option value="pedidos">Pedidos por estado</option>
              <option value="bajoStock">Productos con bajo stock</option>
            </select>
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
          />
        </div>

        {!mostrarPreview && (
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
          <button onClick={scrollToTop} className={styles.scrollTopButton}>
            <FaArrowUp />
          </button>
        )}
      </div>
    </div>
  );
}

export default Reportes;
