import React, { useState } from "react";
import { FaRobot, FaPaperPlane, FaSyncAlt } from "react-icons/fa";

const API_BASE = "https://master.soporteumg.com/api.php?endpoint=";
const OPENROUTER_API_KEY = "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";

async function consultaIA(textoUsuario) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo-1106", // O GPT-4o si tienes acceso
      messages: [{
        role: "system",
        content: `
Eres un asistente para un sistema de inventarios. Cuando el usuario haga una solicitud, responde SOLO en JSON de la siguiente forma:
{
  "accion": "GET|POST|PUT|DELETE",
  "endpoint": "productos|usuarios|movimientos|pedidos",
  "filtros_o_datos": { ... }
}
Si es una consulta (mostrar, cuántos, listar), usa "GET".
Si es agregar, usa "POST".
Si es actualizar, usa "PUT" (debe incluir "id").
Si es eliminar, usa "DELETE" (debe incluir "id").
Ejemplo: "Agrega usuario nombre Julio" ⇒ {"accion": "POST","endpoint": "usuarios","filtros_o_datos":{"nombre":"Julio"}}
Responde SOLO el JSON, sin explicar nada.
        `
      },
      { role: "user", content: textoUsuario }
      ],
      temperature: 0.2,
      max_tokens: 300,
    })
  });
  const data = await resp.json();
  // Extrae solo el JSON de la respuesta (parsea si es string)
  let msg = data?.choices?.[0]?.message?.content;
  try {
    return typeof msg === "string" ? JSON.parse(msg) : msg;
  } catch {
    return null;
  }
}

function AsistenteIA() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      // 1. Pide a la IA qué acción hacer
      const instruccion = await consultaIA(prompt);
      if (!instruccion) {
        setResponse("La IA no pudo entender la instrucción.");
        setLoading(false);
        return;
      }
      // 2. Ejecuta acción real contra tu API PHP
      let res;
      const url = API_BASE + instruccion.endpoint +
        (instruccion.accion === "GET" || instruccion.accion === "DELETE" ? (instruccion.filtros_o_datos?.id ? `&id=${instruccion.filtros_o_datos.id}` : "") : "");
      if (instruccion.accion === "GET" || instruccion.accion === "DELETE") {
        res = await fetch(url, { method: instruccion.accion });
      } else {
        res = await fetch(url, {
          method: instruccion.accion,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(instruccion.filtros_o_datos)
        });
      }
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Ocurrió un error al consultar: " + err);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <div className="mb-4 d-flex align-items-center gap-2">
        <FaRobot style={{ fontSize: 28, color: "#23448c" }} />
        <h2 className="fw-bold mb-0" style={{ color: "#23448c" }}>Asistente de IA</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          className="form-control"
          placeholder="Escribe tu consulta..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          style={{ resize: "vertical", borderRadius: 8 }}
        />
        <button type="submit" className="btn btn-primary mt-2" disabled={loading || !prompt.trim()}>
          {loading ? <><FaSyncAlt className="fa-spin" /> Consultando...</> : <><FaPaperPlane /> Enviar</>}
        </button>
      </form>
      {response && (
        <div className="alert alert-info mt-4" style={{ whiteSpace: "pre-line", fontSize: "15px" }}>
          <strong>Respuesta:</strong>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default AsistenteIA;
