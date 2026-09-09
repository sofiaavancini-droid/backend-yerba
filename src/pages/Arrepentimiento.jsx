
import { useAuth } from "../context/AuthContext";

export default function Arrepentimiento() {
  const { usuario } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f8f2",
        padding: "50px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#166534",
            marginTop: 0,
          }}
        >
          Botón de arrepentimiento
        </h1>

        <p
          style={{
            color: "#4b5563",
            lineHeight: "1.6",
          }}
        >
          Desde esta sección podés conocer y ejercer tu derecho
          de arrepentimiento sobre una compra realizada
          recientemente.
        </p>

        <p
          style={{
            color: "#4b5563",
            lineHeight: "1.6",
          }}
        >
          Para arrepentirte de una compra, ingresá a{" "}
          <strong>Mi cuenta → Mis compras</strong> y seleccioná
          el botón <strong>“Arrepentirme”</strong> del pedido
          correspondiente.
        </p>

        {!usuario && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "25px",
            }}
          >
            <strong>¿Ya tenés una cuenta?</strong>

            <p style={{ marginBottom: 0 }}>
              Iniciá sesión para acceder a tus compras y poder
              arrepentirte de una de ellas.
            </p>
          </div>
        )}

        {usuario && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #15803d",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "25px",
            }}
          >
            <strong>Ya estás conectado.</strong>

            <p style={{ marginBottom: 0 }}>
              Entrá a <strong>Mi cuenta → Mis compras</strong>{" "}
              para seleccionar la compra de la que querés
              arrepentirte.
            </p>
          </div>
        )}

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            marginTop: "25px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#15803d",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}