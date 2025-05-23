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

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-maverick:free',
          messages: [
            {
              role: 'system',
              content:
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
      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

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
    </div>
  );
}

export default AiComandos;
