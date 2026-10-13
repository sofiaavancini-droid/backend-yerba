import { useState } from "react";
import { urlImagen } from "../utils/imagenes";

import playadito from "../imagenes/playadito.jpg";
import taragui from "../imagenes/taragui.jpg";
import rosamonte from "../imagenes/rosamonte.jpg";
import canarias from "../imagenes/canarias.jpg";

export default function ProductCard({ producto, agregarAlCarrito }) {
  const [imagenesFallidas, setImagenesFallidas] = useState([]);

  const sinStock = producto.stock <= 0;

  // Obtener la imagen subida al servidor, si existe.
  const imagenServidor = urlImagen(producto);

  // Identificar la yerba para usar su imagen local como respaldo.
  const nombre = String(producto.nombre || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  let imagenLocal = null;

  if (nombre.includes("playadito")) {
    imagenLocal = playadito;
  } else if (nombre.includes("taragui")) {
    imagenLocal = taragui;
  } else if (nombre.includes("rosamonte")) {
    imagenLocal = rosamonte;
  } else if (nombre.includes("canarias")) {
    imagenLocal = canarias;
  }

  // Priorizar la imagen del servidor y usar la local como respaldo.
  const imagen =
    imagenServidor && !imagenesFallidas.includes(imagenServidor)
      ? imagenServidor
      : imagenLocal && !imagenesFallidas.includes(imagenLocal)
        ? imagenLocal
        : null;

  function manejarErrorImagen() {
    if (!imagen) return;

    setImagenesFallidas((anteriores) =>
      anteriores.includes(imagen)
        ? anteriores
        : [...anteriores, imagen]
    );
  }

  return (
    <article
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: "420px",
      }}
    >
      {/* FRANJA VERDE */}
      <div
        style={{
          height: "12px",
          backgroundColor: "#15803d",
        }}
      />

      {/* IMAGEN DEL PRODUCTO */}
      <div
        style={{
          width: "100%",
          height: "220px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafb",
          overflow: "hidden",
        }}
      >
        {imagen ? (
          <img
            src={imagen}
            alt={producto.nombre}
            loading="lazy"
            onError={manejarErrorImagen}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Sin imagen
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* NOMBRE */}
        <h2
          style={{
            margin: 0,
            minHeight: "65px",
            fontSize: "21px",
            lineHeight: "1.4",
            fontWeight: "700",
            color: "#1f2937",
          }}
        >
          {producto.nombre}
        </h2>

        {/* DATOS DEL PRODUCTO */}
        <div
          style={{
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* PRECIO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Precio
            </span>

            <span
              style={{
                color: "#15803d",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              ${Number(producto.precio_final).toLocaleString("es-AR")}
            </span>
          </div>

          {/* CUOTAS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Cuotas
            </span>

            <span
              style={{
                color: "#374151",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {producto.cuotas
                ? `${producto.cuotas} cuotas`
                : "Sin cuotas"}
            </span>
          </div>

          {/* GARANTÍA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Garantía
            </span>

            <span
              style={{
                color: "#374151",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {producto.garantia
                ? `${producto.garantia} meses`
                : "Sin garantía"}
            </span>
          </div>

          {/* STOCK */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Stock
            </span>

            <span
              style={{
                color: sinStock ? "#dc2626" : "#15803d",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              {sinStock
                ? "Sin stock"
                : `${producto.stock} disponibles`}
            </span>
          </div>
        </div>

        {/* ESPACIO */}
        <div style={{ flex: 1 }} />

        {/* BOTÓN DEL CARRITO */}
        <button
          type="button"
          disabled={sinStock}
          onClick={() => agregarAlCarrito(producto)}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            backgroundColor: sinStock ? "#e5e7eb" : "#15803d",
            color: sinStock ? "#6b7280" : "white",
            fontSize: "15px",
            fontWeight: "700",
            cursor: sinStock ? "not-allowed" : "pointer",
          }}
        >
          {sinStock
            ? "Producto sin stock"
            : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}