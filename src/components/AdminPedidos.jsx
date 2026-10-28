
import { useEffect, useState } from "react";
import {
  getTodosLosPedidos,
  cambiarEstadoPedido,
} from "../services/api";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState(null);

  const cargarPedidos = async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await getTodosLosPedidos();
      setPedidos(datos);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    setActualizando(pedidoId);
    setError("");

    try {
      await cambiarEstadoPedido(pedidoId, nuevoEstado);
      await cargarPedidos();
    } catch (err) {
      setError(err.message || "No se pudo actualizar el pedido.");
    } finally {
      setActualizando(null);
    }
  };

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "25px",
        color: "#1f2937",
      }}
    >
      <h1 style={{ color: "#166534" }}>📦 Administrar pedidos</h1>
      <p>Consultá las compras de tus clientes y actualizá su estado.</p>

      <button
        onClick={cargarPedidos}
        disabled={cargando}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#15803d",
          color: "white",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {cargando ? "Cargando..." : "Actualizar lista"}
      </button>

      {error && (
        <p
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>Todavía no hay pedidos registrados.</p>
      ) : (
        <div style={{ display: "grid", gap: "18px" }}>
          {pedidos.map((pedido) => (
            <section
              key={pedido.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <h2 style={{ margin: 0, color: "#166534" }}>
                  Pedido #{pedido.id}
                </h2>

                <strong>
                  Total: ${Number(pedido.total || 0).toLocaleString("es-AR")}
                </strong>
              </div>

              <p>
                <strong>Cliente:</strong>{" "}
                {pedido.cliente?.nombre || "Sin nombre"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {pedido.cliente?.email || "Sin email"}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {pedido.fecha
                  ? new Date(pedido.fecha).toLocaleString("es-AR")
                  : "No disponible"}
              </p>

              <h3>Productos</h3>

              {pedido.items?.length ? (
                <ul>
                  {pedido.items.map((item, index) => (
                    <li key={`${pedido.id}-${item.producto_id}-${index}`}>
                      {item.producto || `Producto #${item.producto_id}`}
                      {" — Cantidad: "}
                      {item.cantidad}
                      {" — Precio unitario: $"}
                      {Number(item.precio_unitario || 0).toLocaleString("es-AR")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay productos detallados para este pedido.</p>
              )}

              <label
                htmlFor={`estado-${pedido.id}`}
                style={{ display: "block", fontWeight: "600", marginTop: "16px" }}
              >
                Estado del pedido
              </label>

              <select
                id={`estado-${pedido.id}`}
                value={pedido.estado}
                disabled={actualizando === pedido.id}
                onChange={(e) =>
                  actualizarEstado(pedido.id, e.target.value)
                }
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #9ca3af",
                  backgroundColor: "white",
                  minWidth: "180px",
                }}
              >
                <option value="pendiente">Pendiente</option>
                <option value="aceptado">Aceptado</option>
                <option value="cancelado">Cancelado</option>
              </select>

              {actualizando === pedido.id && (
                <span style={{ marginLeft: "10px" }}>
                  Actualizando...
                </span>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
