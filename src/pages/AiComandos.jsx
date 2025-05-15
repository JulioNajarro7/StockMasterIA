import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AiComandos() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [mensajeSistema, setMensajeSistema] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;

    setCargando(true);
    setRespuesta('');
    setMensajeSistema('');

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-maverick:free',
          messages: [
            {
              role: 'system',
              content:
                'Responde solo en formato JSON. Ejemplos válidos: ' +
                '{"accion":"actualizar_inventario","producto":"Producto A","cantidad":10}, ' +
                '{"accion":"mostrar_pedidos","estado":"Pendiente"}, ' +
                '{"accion":"cambiar_estado_pedido","id":12,"estado":"Enviado"}, ' +
                '{"accion":"ver_productos_bajo_stock"}, ' +
                '{"accion":"agregar_producto","nombre":"Cereal","categoria":"Alimentos","stock":50,"precio":12.5}, ' +
                '{"accion":"agregar_pedido","cliente":"Juan","estado":"Pendiente","total":230}, ' +
                '{"accion":"agregar_entrada","producto_id":1,"cantidad":30,"almacen_id":2}'
            },
            {
              role: 'user',
              content: [{ type: 'text', text: pregunta }]
            }
          ]
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
          }
        }
      );

      const instrucciones = JSON.parse(res.data.choices[0].message.content);
      setRespuesta(JSON.stringify(instrucciones, null, 2));

      switch (instrucciones.accion) {
        case 'ver_productos_bajo_stock':
          navigate('/alertas');
          break;
        case 'mostrar_pedidos':
          navigate('/pedidos');
          break;
        case 'actualizar_inventario':
          await fetch('http://localhost/api.php?endpoint=inventario', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              producto: instrucciones.producto,
              cantidad: instrucciones.cantidad
            })
          });
          setMensajeSistema('Inventario actualizado correctamente.');
          break;
        case 'cambiar_estado_pedido':
          await fetch(`http://localhost/api.php?endpoint=pedidos&id=${instrucciones.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: instrucciones.estado })
          });
          setMensajeSistema(`Estado del pedido #${instrucciones.id} actualizado a "${instrucciones.estado}".`);
          break;
        case 'agregar_producto':
          await fetch('http://localhost/api.php?endpoint=productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: instrucciones.nombre,
              categoria: instrucciones.categoria,
              stock: instrucciones.stock,
              precio: instrucciones.precio
            })
          });
          setMensajeSistema('Producto agregado exitosamente.');
          break;
        case 'agregar_pedido':
          await fetch('http://localhost/api.php?endpoint=pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cliente: instrucciones.cliente,
              estado: instrucciones.estado,
              total: instrucciones.total,
              almacen_id: instrucciones.almacen_id || 1
            })
          });
          setMensajeSistema('Pedido agregado exitosamente.');
          break;
        case 'agregar_entrada':
          await fetch('http://localhost/api.php?endpoint=entradas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              producto_id: instrucciones.producto_id,
              cantidad: instrucciones.cantidad,
              almacen_id: instrucciones.almacen_id
            })
          });
          setMensajeSistema('Entrada registrada exitosamente.');
          break;
        default:
          setMensajeSistema('Acción no reconocida.');
      }
    } catch (error) {
      console.error(error);
      setRespuesta('Error interpretando la respuesta de la IA.');
    } finally {
      setCargando(false);
      setPregunta('');
    }
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">IA 🤖</h1>
      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <div style={{ marginBottom: '1rem', maxWidth: '800px', width: '100%' }}>
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej. Agrega 30 unidades del producto X al almacén 2"
          style={{
            padding: '0.8rem',
            width: '80%',
            marginRight: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc'
          }}
        />
        <button onClick={enviarPregunta} className="add-button" disabled={cargando}>
          {cargando ? 'Cargando...' : 'Enviar'}
        </button>
      </div>

      {respuesta && (
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: '0.5rem',
            maxWidth: '800px',
            width: '100%',
            color: '#000'
          }}
        >
          <strong>Respuesta de IA (JSON interpretado):</strong>
          <pre>{respuesta}</pre>
        </div>
      )}

      {mensajeSistema && (
        <div
          style={{
            marginTop: '1rem',
            background: '#e6fffa',
            border: '1px solid #38b2ac',
            padding: '1rem',
            borderRadius: '0.5rem',
            maxWidth: '800px',
            color: '#2c7a7b'
          }}
        >
          <strong>✔ Acción ejecutada:</strong> {mensajeSistema}
        </div>
      )}
    </div>
  );
}

export default AiComandos;
