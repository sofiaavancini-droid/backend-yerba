
import { useEffect, useRef, useState } from "react";
import { authHeaders, subirImagen } from "../services/api";

const MAX_TAMANO = 2 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function AdminProductos({ productos, setProductos }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [productoId, setProductoId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (!archivo) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(archivo);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [archivo]);

  const limpiarArchivo = () => {
    setArchivo(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const elegirArchivo = (e) => {
    const seleccionado = e.target.files?.[0];

    setMensaje("");
    setError("");

    if (!seleccionado) {
      setArchivo(null);
      return;
    }

    if (!TIPOS_PERMITIDOS.includes(seleccionado.type)) {
      setError("El archivo debe ser JPG, PNG o WEBP.");
      limpiarArchivo();
      return;
    }

    if (seleccionado.size > MAX_TAMANO) {
      setError("La imagen no puede superar los 2 MB.");
      limpiarArchivo();
      return;
    }

    setArchivo(seleccionado);

    console.log("Archivo seleccionado:", seleccionado);
  };

  const crearProducto = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!nombre.trim() || !precio || stock === "") {
      setError("Completá nombre, precio y stock.");
      return;
    }

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/productos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion,
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

      setProductos((anteriores) => [...anteriores, nuevoProducto]);

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");

      setMensaje("Producto creado correctamente.");
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const cargarImagen = async () => {
    if (!productoId || !archivo) {
      setError("Elegí un producto y una imagen.");
      return;
    }

    setSubiendo(true);
    setMensaje("");
    setError("");

    try {
      const productoActualizado = await subirImagen(
        productoId,
        archivo
      );

      setProductos((anteriores) =>
        anteriores.map((producto) =>
          producto.id === productoActualizado.id
            ? productoActualizado
            : producto
        )
      );

      setMensaje("Imagen subida correctamente.");
      limpiarArchivo();
    } catch (e) {
      setError(e.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) return;

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/productos/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
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

      setProductos((anteriores) =>
        anteriores.filter((producto) => producto.id !== id)
      );

      if (String(id) === productoId) {
        setProductoId("");
      }

      setMensaje("Producto eliminado correctamente.");
    } catch {
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
      <h2 style={{ color: "#166534", marginTop: 0 }}>
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
            style={estiloInput}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
            step="0.01"
            style={estiloInput}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            style={estiloInput}
          />
        </div>

        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            ...estiloInput,
            width: "100%",
            boxSizing: "border-box",
            minHeight: "80px",
            marginBottom: "12px",
            resize: "vertical",
          }}
        />

        <button type="submit" style={estiloBoton}>
          Crear producto
        </button>
      </form>

      <hr style={estiloSeparador} />

      <h3 style={{ color: "#374151" }}>Subir imagen de un producto</h3>

      <label style={estiloEtiqueta}>
        Seleccioná el producto
      </label>

      <select
        value={productoId}
        onChange={(e) => setProductoId(e.target.value)}
        style={{
          ...estiloInput,
          width: "100%",
          boxSizing: "border-box",
          marginBottom: "15px",
        }}
      >
        <option value="">Elegí un producto</option>

        {productos.map((producto) => (
          <option key={producto.id} value={producto.id}>
            {producto.nombre}
          </option>
        ))}
      </select>

      <label style={estiloEtiqueta}>
        Elegí una imagen (JPG, PNG o WEBP, máximo 2 MB)
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={elegirArchivo}
        style={{
          display: "block",
          marginTop: "10px",
          marginBottom: "15px",
        }}
      />

      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "600" }}>Vista previa</p>

          <img
            src={preview}
            alt="Vista previa"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
            }}
          />

          <p style={{ fontSize: "14px", color: "#4b5563" }}>
            Archivo: {archivo?.name}
          </p>

          <p style={{ fontSize: "14px", color: "#4b5563" }}>
            Tamaño: {((archivo?.size || 0) / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={cargarImagen}
        disabled={!archivo || !productoId || subiendo}
        style={{
          ...estiloBoton,
          backgroundColor:
            !archivo || !productoId || subiendo
              ? "#9ca3af"
              : "#15803d",
          cursor:
            !archivo || !productoId || subiendo
              ? "not-allowed"
              : "pointer",
        }}
      >
        {subiendo ? "Subiendo…" : "Subir imagen"}
      </button>

      {mensaje && (
        <p style={{ color: "#15803d", fontWeight: "bold" }}>
          {mensaje}
        </p>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <hr style={estiloSeparador} />

      <h3 style={{ color: "#374151" }}>Productos existentes</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

              <div style={{ color: "#6b7280", marginTop: "5px", fontSize: "14px" }}>
                Precio: ${producto.precio_final} | Stock: {producto.stock}
              </div>

              <div style={{ color: "#6b7280", fontSize: "13px" }}>
                {producto.imagen_url ? "Tiene imagen" : "Sin imagen"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => eliminarProducto(producto.id)}
              style={{
                ...estiloBoton,
                backgroundColor: "#dc2626",
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

const estiloInput = {
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
};

const estiloBoton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#15803d",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const estiloEtiqueta = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
};

const estiloSeparador = {
  margin: "30px 0",
  border: "none",
  borderTop: "1px solid #bbf7d0",
};