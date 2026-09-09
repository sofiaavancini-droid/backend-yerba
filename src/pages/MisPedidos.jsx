
import { useEffect, useState } from "react";
import { getMisPedidos, revocarPedido } from "../services/api";

export default function MisPedidos({ onVolverAComprar }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [codigoRevocacion, setCodigoRevocacion] = useState("");

  const cargarPedidos = async () => {
    try {
      setError("");

      const datos = await getMisPedidos();
      setPedidos(datos);

      const codigoGuardado = localStorage.getItem(
        "codigo_revocacion"
      );

      if (codigoGuardado) {
        setCodigoRevocacion(codigoGuardado);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const puedeArrepentirse = (pedido) => {
    if (pedido.estado === "cancelado") {
      return false;
    }

    const fechaPedido = new Date(pedido.creado_en);
    const ahora = new Date();

    const diferencia =
      ahora.getTime() - fechaPedido.getTime();

    const dias =
      diferencia / (1000 * 60 * 60 * 24);

    return dias <= 10;
  };

  const arrepentirme = async (pedidoId) => {
    try {
      const respuesta = await revocarPedido(pedidoId);

      localStorage.setItem(
        "codigo_revocacion",
        respuesta.codigo
      );

      setCodigoRevocacion(respuesta.codigo);

      await cargarPedidos();
    } catch (e) {
      alert(e.message);
    }
  };

  const volverAComprar = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) {
      alert(
        "No se encontraron los productos de este pedido."
      );
      return;
    }

    onVolverAComprar(pedido.items);
  };

  if (cargando) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Cargando tus compras...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f8f2",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#166534" }}>
          Mis compras
        </h1>

        {error && (
          <p style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {codigoRevocacion && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "2px solid #15803d",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                color: "#166534",
                marginTop: 0,
              }}
            >
              ✓ Compra revocada correctamente
            </h2>

            <p>
              Tu código de arrepentimiento es:
            </p>

            <strong
              style={{
                fontSize: "22px",
                color: "#166534",
              }}
            >
              {codigoRevocacion}
            </strong>
          </div>
        )}

        {pedidos.length === 0 ? (
          <p>No tenés compras registradas.</p>
        ) : (
          pedidos.map((pedido) => (
            <div
              key={pedido.id}
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "16px",
                marginBottom: "20px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2>
                Pedido #{pedido.id}
              </h2>

              <p>
                <strong>Estado:</strong>{" "}
                {pedido.estado}
              </p>

              <p>
                <strong>Total:</strong> $
                {Number(pedido.total).toLocaleString(
                  "es-AR"
                )}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(
                  pedido.creado_en
                ).toLocaleString("es-AR")}
              </p>

              {puedeArrepentirse(pedido) && (
                <button
                  onClick={() =>
                    arrepentirme(pedido.id)
                  }
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "10px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Arrepentirme
                </button>
              )}

              {pedido.estado === "cancelado" && (
                <div>
                  <p
                    style={{
                      color: "#6b7280",
                      marginTop: "15px",
                    }}
                  >
                    Esta compra fue cancelada.
                  </p>

                  <button
                    onClick={() =>
                      volverAComprar(pedido)
                    }
                    style={{
                      padding: "12px 20px",
                      border: "none",
                      borderRadius: "10px",
                      backgroundColor: "#15803d",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Volver a comprar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
