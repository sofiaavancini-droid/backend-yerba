
import { useEffect, useState } from "react";
import {
  getMisDatos,
  exportarMisDatos,
  eliminarMiCuenta,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MisDatos() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [texto, setTexto] = useState("");

  const { cerrarSesion } = useAuth();

  useEffect(() => {
    getMisDatos()
      .then(setDatos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";

    return new Date(fecha).toLocaleString("es-AR");
  };

  const eliminar = async () => {
    if (texto !== "ELIMINAR") {
      return;
    }

    const confirmar = window.confirm(
      "¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarMiCuenta();

      cerrarSesion();

      window.location.href = "/";
    } catch (e) {
      setError(e.message);
    }
  };

  if (cargando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f8f2",
        }}
      >
        <p>Cargando tus datos...</p>
      </div>
    );
  }

  if (error && !datos) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "50px",
          backgroundColor: "#f4f8f2",
        }}
      >
        <h2>No se pudieron cargar tus datos</h2>
        <p>{error}</p>
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
        <h1
          style={{
            color: "#166534",
            marginBottom: "30px",
          }}
        >
          Mis datos
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* DATOS PERSONALES */}
        <section
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "20px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Datos que guardamos de vos</h2>

          <p>
            <strong>Nombre:</strong>{" "}
            {datos?.titular?.nombre}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {datos?.titular?.email}
          </p>

          <p>
            <strong>Rol:</strong>{" "}
            {datos?.titular?.rol}
          </p>
        </section>

        {/* CONSENTIMIENTO */}
        <section
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "20px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Consentimiento</h2>

          <p>
            <strong>Tratamiento de datos:</strong>{" "}
            {datos?.consentimiento?.acepto_tratamiento
              ? "Aceptado"
              : "No aceptado"}
          </p>

          <p>
            <strong>Fecha del consentimiento:</strong>{" "}
            {formatearFecha(
              datos?.consentimiento?.fecha
            )}
          </p>
        </section>

        {/* PEDIDOS */}
        <section
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "20px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Tus compras</h2>

          <p>
            Tenés{" "}
            <strong>
              {datos?.pedidos?.length || 0}
            </strong>{" "}
            pedidos registrados.
          </p>

          {datos?.pedidos?.length > 0 && (
            <div>
              {datos.pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    padding: "15px 0",
                  }}
                >
                  <strong>
                    Pedido #{pedido.id}
                  </strong>

                  <p>
                    Estado: {pedido.estado}
                  </p>

                  <p>
                    Total: $
                    {Number(pedido.total).toLocaleString(
                      "es-AR"
                    )}
                  </p>

                  <p>
                    Fecha:{" "}
                    {formatearFecha(pedido.creado_en)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EXPORTAR */}
        <section
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "20px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Exportar mis datos</h2>

          <p>
            Podés descargar una copia de los datos que
            tenemos guardados.
          </p>

          <button
            onClick={exportarMisDatos}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#15803d",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Descargar mis datos
          </button>
        </section>

        {/* ELIMINAR CUENTA */}
        <section
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            border: "2px solid #fecaca",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#b91c1c" }}>
            Eliminar mi cuenta
          </h2>

          <p>
            Esta acción dará de baja tu cuenta. No se puede
            deshacer.
          </p>

          <p>
            Para confirmar, escribí exactamente:
            <strong> ELIMINAR</strong>
          </p>

          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="ELIMINAR"
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <br />

          <button
            onClick={eliminar}
            disabled={texto !== "ELIMINAR"}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor:
                texto === "ELIMINAR"
                  ? "#dc2626"
                  : "#d1d5db",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor:
                texto === "ELIMINAR"
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            Eliminar mi cuenta
          </button>
        </section>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "12px 20px",
            border: "1px solid #15803d",
            borderRadius: "10px",
            backgroundColor: "white",
            color: "#15803d",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}