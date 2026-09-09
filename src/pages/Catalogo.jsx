import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/productos/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar productos");
        }

        return res.json();
      })
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        console.error(error);
        setError("No se pudieron cargar los productos");
      });
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (error) {
    return (
      <p
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

  return (
    <div
      style={{
        width: "100%",
      }}
    >
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
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
