import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onCerrar, onLoginExitoso }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { iniciarSesion } = useAuth();

  const manejarLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Completá el correo electrónico y la contraseña.");
      return;
    }

    try {
      setError("");
      setCargando(true);

      await iniciarSesion(email, password);

      onCerrar();
      onLoginExitoso();
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
          maxWidth: "420px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
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
            Iniciar sesión
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

        <div style={{ marginBottom: "35px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
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

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
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

        <button
          type="button"
          onClick={manejarLogin}
          disabled={cargando}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            backgroundColor: cargando ? "#9ca3af" : "#15803d",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: cargando ? "not-allowed" : "pointer",
          }}
        >
          {cargando
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </button>
      </div>
    </div>
  );
}