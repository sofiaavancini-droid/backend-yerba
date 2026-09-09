import { useState } from "react";
import { registrar } from "../services/api";

export default function RegistroModal({ onCerrar }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptoTratamiento, setAceptoTratamiento] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const crearCuenta = async () => {
    if (
      nombre.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setError("Completá todos los campos.");
      return;
    }

    if (!aceptoTratamiento) {
      setError("Tenés que aceptar el tratamiento de datos.");
      return;
    }

    try {
      setError("");
      setMensaje("");
      setCargando(true);

      await registrar({
        nombre: nombre,
        email: email,
        password: password,
        acepto_tratamiento: aceptoTratamiento,
      });

      setMensaje("✓ Cuenta creada correctamente.");

      setTimeout(() => {
        onCerrar();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "470px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* ENCABEZADO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: "bold",
              color: "#166534",
            }}
          >
            Crear cuenta
          </h2>

          <button
            onClick={onCerrar}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "28px",
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* NOMBRE */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Nombre
          </label>

          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              fontSize: "15px",
            }}
          />
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="tuemail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              fontSize: "15px",
            }}
          />
        </div>

        {/* CONTRASEÑA */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Contraseña
          </label>

          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              fontSize: "15px",
            }}
          />
        </div>

        {/* CONSENTIMIENTO */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            marginBottom: "25px",
            color: "#374151",
            fontSize: "14px",
            lineHeight: "1.5",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={aceptoTratamiento}
            onChange={(e) =>
              setAceptoTratamiento(e.target.checked)
            }
            style={{
              marginTop: "3px",
            }}
          />

          <span>
            «Acepto que se guarden mi nombre y mi correo para gestionar mi
            cuenta y mis pedidos. Puedo verlos o pedir que los borren
            (Ley 25.326).»
          </span>
        </label>

        {/* ERROR */}
        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
        )}

        {/* MENSAJE */}
        {mensaje && (
          <p
            style={{
              color: "#15803d",
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            {mensaje}
          </p>
        )}

        {/* BOTÓN */}
        <button
          type="button"
          onClick={crearCuenta}
          disabled={!aceptoTratamiento || cargando}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            backgroundColor:
              !aceptoTratamiento || cargando
                ? "#d1d5db"
                : "#15803d",
            color:
              !aceptoTratamiento || cargando
                ? "#6b7280"
                : "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor:
              !aceptoTratamiento || cargando
                ? "not-allowed"
                : "pointer",
          }}
        >
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
}