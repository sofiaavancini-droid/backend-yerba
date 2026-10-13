
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [lento, setLento] = useState(false);

  // Mostrar un aviso si el servidor tarda más de 5 segundos.
  useEffect(() => {
    if (!cargando) {
      setLento(false);
      return;
    }

    const temporizador = setTimeout(() => {
      setLento(true);
    }, 5000);

    return () => clearTimeout(temporizador);
  }, [cargando]);

  // Cargar los productos desde el backend.
  useEffect(() => {
    async function cargarProductos() {
      try {
        setError("");

        const BASE_URL = import.meta.env.VITE_API_URL;

        if (!BASE_URL) {
          throw new Error("Falta configurar VITE_API_URL");
        }

        const respuesta = await fetch(
          `${BASE_URL.replace(/\/$/, "")}/productos/`
        );

        if (!respuesta.ok) {
          throw new Error("Error al cargar productos");
        }

        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No se pudieron cargar los productos. Probá nuevamente.");
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // Mensaje de error.
  if (error) {
    return (
      <p
        role="alert"
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#b91c1c",
        }}
      >
        {error}
      </p>
    );
  }

  // Mostrar la espera mientras se cargan los productos.
  if (cargando) {
    return (
      <p
        role="status"
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#15803d",
          fontSize: "17px",
        }}
      >
        {lento
          ? "Despertando el servidor, la primera visita puede tardar un minuto…"
          : "Cargando productos…"}
      </p>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* BUSCADOR */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "45px",
        }}
      >
        <input
          type="text"
          placeholder="🔎  Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "620px",
            padding: "16px 20px",
            border: "1px solid #d1d5db",
            borderRadius: "14px",
            backgroundColor: "white",
            fontSize: "16px",
            color: "#374151",
            outline: "none",
            boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* PRODUCTOS */}
      {productosFiltrados.length === 0 ? (
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            backgroundColor: "white",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            No se encontró ningún producto
          </p>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
            }}
          >
            Probá buscando con otro nombre.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            width: "100%",
          }}
        >
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;