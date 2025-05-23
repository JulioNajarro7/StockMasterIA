<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function isValidJson(str) {
  try {
    const json = JSON.parse(str);
    return typeof json === 'object';
  } catch (e) {
    return false;
  }
}

function AiComandos() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [chat, setChat] = useState([
    {
      role: 'system',
      content: '¡Hola! Soy tu asistente IA. Puedes hacer preguntas generales o pedir acciones sobre las bases de datos (consultar, insertar, actualizar, eliminar).'
    }
  ]);
  const chatRef = useRef(null);

  const API = 'https://master.soporteumg.com/api.php';

  useEffect(() => {
    // Scroll al final del chat al agregar mensajes
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const enviarPregunta = async (e) => {
    if (e) e.preventDefault();
    if (!pregunta.trim()) return;

    setChat(prev => [
      ...prev,
      { role: 'user', content: pregunta }
    ]);
    setCargando(true);
=======
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
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-maverick:free',
          messages: [
            {
              role: 'system',
              content:
<<<<<<< HEAD
                'Responde en texto natural SI NO es una acción sobre datos. Si detectas una acción de datos (insertar, actualizar, eliminar, consultar), responde SOLO en formato JSON como estos ejemplos:\n' +
                '{"accion":"consultar","tabla":"productos"}\n' +
                '{"accion":"consultar","tabla":"productos","filtro":{"stock":"<=10"}}\n' +
                '{"accion":"insertar","tabla":"productos","datos":{"nombre":"Mouse","categoria":"Tecnología","stock":50,"precio":15.5}}\n' +
                '{"accion":"actualizar","tabla":"almacenes","id":2,"datos":{"nombre":"Principal","capacidad":500}}\n' +
                '{"accion":"eliminar","tabla":"salidas","id":4}'
            },
            ...chat.filter(m => m.role !== 'system').map(m => ({
              role: m.role,
              content: [{ type: 'text', text: m.content }]
            })),
=======
                'Responde solo en formato JSON. Ejemplos válidos: ' +
                '{"accion":"actualizar_inventario","producto":"Producto A","cantidad":10}, ' +
                '{"accion":"mostrar_pedidos","estado":"Pendiente"}, ' +
                '{"accion":"cambiar_estado_pedido","id":12,"estado":"Enviado"}, ' +
                '{"accion":"ver_productos_bajo_stock"}, ' +
                '{"accion":"agregar_producto","nombre":"Cereal","categoria":"Alimentos","stock":50,"precio":12.5}, ' +
                '{"accion":"agregar_pedido","cliente":"Juan","estado":"Pendiente","total":230}, ' +
                '{"accion":"agregar_entrada","producto_id":1,"cantidad":30,"almacen_id":2}'
            },
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
            {
              role: 'user',
              content: [{ type: 'text', text: pregunta }]
            }
          ]
        },
        {
          headers: {
<<<<<<< HEAD
            'Authorization': 'Bearer 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',
=======
            'Authorization': 'Bearer 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',
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
            'Content-Type': 'application/json'
          }
        }
      );

<<<<<<< HEAD
      let rawContent = res.data.choices[0].message.content;
      let handled = false;

      // Si es JSON válido (acción sobre la base de datos)
      if (isValidJson(rawContent)) {
        const instrucciones = JSON.parse(rawContent);
        

        const { accion, tabla, id, datos } = instrucciones;
        const tablasProhibidas = ['usuarios'];

        if (['insertar', 'actualizar', 'eliminar'].includes(accion) && tablasProhibidas.includes(tabla)) {
          setChat(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `❌ No tienes permiso para modificar la tabla "${tabla}".`
            }
          ]);
          handled = true;
        } else {
          switch (accion) {
            case 'insertar':
              await fetch(`${API}?endpoint=${tabla}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
              });
              setChat(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: `✅ Registro insertado correctamente en "${tabla}".`
                }
              ]);
              handled = true;
              break;

            case 'actualizar':
              {
                const resExistente = await fetch(`${API}?endpoint=${tabla}`);
                const lista = await resExistente.json();
                const existente = lista.find(item => item.id == id);
                if (!existente) {
                  setChat(prev => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: `❌ No se encontró el registro con ID ${id} en "${tabla}".`
                    }
                  ]);
                  handled = true;
                  break;
                }
                const datosCompletos = { ...existente, ...datos };
                await fetch(`${API}?endpoint=${tabla}&id=${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(datosCompletos)
                });
                setChat(prev => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: `✅ Registro actualizado en "${tabla}" con ID ${id}.`
                  }
                ]);
                handled = true;
              }
              break;

            case 'eliminar':
              await fetch(`${API}?endpoint=${tabla}&id=${id}`, {
                method: 'DELETE'
              });
              setChat(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: `✅ Registro eliminado de "${tabla}" con ID ${id}.`
                }
              ]);
              handled = true;
              break;

            case 'consultar':
              let url = `${API}?endpoint=${tabla}`;
              let dataTabla = await fetch(url).then(r => r.json());

              // Procesar filtros sencillos (igual que antes)
              if (instrucciones.filtro && typeof instrucciones.filtro === 'object') {
                Object.entries(instrucciones.filtro).forEach(([key, value]) => {
                  if (typeof value === 'string' && value.startsWith('<=')) {
                    const max = Number(value.replace('<=', ''));
                    dataTabla = dataTabla.filter(row => Number(row[key]) <= max);
                  } else if (typeof value === 'string' && value.startsWith('>=')) {
                    const min = Number(value.replace('>=', ''));
                    dataTabla = dataTabla.filter(row => Number(row[key]) >= min);
                  } else {
                    dataTabla = dataTabla.filter(row => String(row[key]).toLowerCase() === String(value).toLowerCase());
                  }
                });
              }

              // Muestra máximo 10 resultados si hay muchos
              const dataPreview = dataTabla.length > 10
                ? [...dataTabla.slice(0, 10), { "...": `Mostrando 10 de ${dataTabla.length} resultados` }]
                : dataTabla;

              setChat(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: (
                    <div>
                      <div>✅ Consulta realizada en <strong>{tabla}</strong>:</div>
                      <pre style={{margin: 0, maxHeight: 300, overflow: 'auto'}}>{JSON.stringify(dataPreview, null, 2)}</pre>
                    </div>
                  )
                }
              ]);
              handled = true;
              break;

            default:
              setChat(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: '❌ Acción no reconocida por el sistema.'
                }
              ]);
              handled = true;
          }
        }
      }

      if (!handled) {
        // Respuesta normal (pregunta general o de otro ámbito)
        setChat(prev => [
          ...prev,
          { role: 'assistant', content: rawContent }
        ]);
      }
    } catch (error) {
      setChat(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Error interpretando la respuesta de la IA o ejecutando la acción.' }
      ]);
=======
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
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
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
<<<<<<< HEAD
    <div
      className="dashboard-container"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h1 className="dashboard-title">IA Chat 🤖</h1>
=======
    <div className="dashboard-container">
      <h1 className="dashboard-title">IA 🤖</h1>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

<<<<<<< HEAD
      <form
        onSubmit={enviarPregunta}
        style={{
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
        autoComplete="off"
      >
        <input
          type="text"
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          placeholder="Haz una pregunta de cualquier ámbito o consulta datos de la BD"
          style={{
            flex: 1,
            padding: '0.9rem',
            borderRadius: '0.7rem',
            border: '1px solid #ccc',
            fontSize: '1.05rem',
            color: '#fff'
          }}
          autoFocus
          disabled={cargando}
        />
        <button
          type="submit"
          className="add-button"
          disabled={cargando || !pregunta.trim()}
          style={{
            minWidth: 120,
            fontSize: '1.05rem'
          }}
        >
          {cargando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <div
        ref={chatRef}
        style={{
          width: '100%',
          maxWidth: 700,
          height: 450,
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem 1rem',
          margin: '1.5rem 0 1rem 0',
          overflowY: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {chat.slice(1).map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? 'linear-gradient(90deg, #667eea 70%, #764ba2 100%)' : '#f1f1f1',
              color: msg.role === 'user' ? '#fff' : '#333',
              borderRadius: '1rem',
              maxWidth: '80%',
              padding: '0.8rem 1rem',
              fontSize: '1rem',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              boxShadow: msg.role === 'user' ? '0 0 6px rgba(102,126,234,0.15)' : '0 0 6px rgba(0,0,0,0.04)'
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
=======
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
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
    </div>
  );
}

export default AiComandos;
