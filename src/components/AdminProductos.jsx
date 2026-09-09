import { useState } from "react";
import { authHeaders } from "../services/api";

export default function AdminProductos({ productos, setProductos }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const crearProducto = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!nombre || !precio || stock === "") {
      setError("Completá nombre, precio y stock.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/productos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          nombre: nombre,
          descripcion: descripcion,
          precio_final: Number(precio),
          stock: Number(stock),
        }),
      });

      if (respuesta.status === 403) {
        setError("No tenés permisos para crear productos.");
        return;
      }

      if (!respuesta.ok) {
        setError("No se pudo crear el producto.");
        return;
      }

      const nuevoProducto = await respuesta.json();

      setProductos([...productos, nuevoProducto]);

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");

      setMensaje("Producto creado correctamente.");
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `http://localhost:8000/productos/${id}`,
        {
          method: "DELETE",
          headers: {
            ...authHeaders(),
          },
        }
      );

      if (respuesta.status === 403) {
        setError("No tenés permisos para eliminar productos.");
        return;
      }

      if (!respuesta.ok) {
        setError("No se pudo eliminar el producto.");
        return;
      }

      setProductos(productos.filter((producto) => producto.id !== id));

      setMensaje("Producto eliminado correctamente.");
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "30px auto",
        padding: "25px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "20px",
      }}
    >
      <h2
        style={{
          color: "#166534",
          marginTop: 0,
          marginBottom: "25px",
        }}
      >
        Panel de administrador
      </h2>

      <h3 style={{ color: "#374151" }}>Crear producto</h3>

      <form onSubmit={crearProducto}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
            step="0.01"
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
            }}
          />
        </div>

        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight: "80px",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            marginBottom: "12px",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#15803d",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Crear producto
        </button>
      </form>

      {mensaje && (
        <p
          style={{
            color: "#15803d",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          {mensaje}
        </p>
      )}

      {error && (
        <p
          style={{
            color: "#dc2626",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          {error}
        </p>
      )}

      <hr
        style={{
          margin: "30px 0",
          border: "none",
          borderTop: "1px solid #bbf7d0",
        }}
      />

      <h3 style={{ color: "#374151" }}>Productos existentes</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div>
              <strong>{producto.nombre}</strong>

              <div
                style={{
                  color: "#6b7280",
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                Precio: ${producto.precio_final} | Stock: {producto.stock}
              </div>
            </div>

            <button
              onClick={() => eliminarProducto(producto.id)}
              style={{
                padding: "9px 14px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#dc2626",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}