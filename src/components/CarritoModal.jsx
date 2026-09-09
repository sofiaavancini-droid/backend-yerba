export default function CarritoModal({
  carrito,
  onCerrar,
  onIncrementar,
  onDecrementar,
  onFinalizarCompra,
}) {
  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado + Number(item.precio_final) * item.cantidad,
    0
  );

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
          maxWidth: "650px",
          maxHeight: "90vh",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "30px 35px",
            borderBottom: "1px solid #e5e7eb",
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
            🛒 Mi carrito
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

        <div
          style={{
            padding: "30px 35px",
            overflowY: "auto",
          }}
        >
          {carrito.length === 0 ? (
            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#6b7280",
                }}
              >
                Tu carrito está vacío.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              {carrito.map((item) => {
                const subtotal =
                  Number(item.precio_final) * item.cantidad;

                return (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "22px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {item.nombre}
                    </h3>

                    <p
                      style={{
                        marginTop: "10px",
                        marginBottom: "25px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Precio: $
                      {Number(item.precio_final).toLocaleString("es-AR")}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() => onDecrementar(item.id)}
                          style={{
                            width: "34px",
                            height: "34px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor: "#e5e7eb",
                            fontSize: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>

                        <span
                          style={{
                            minWidth: "25px",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          {item.cantidad}
                        </span>

                        <button
                          onClick={() => onIncrementar(item.id)}
                          style={{
                            width: "34px",
                            height: "34px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor: "#15803d",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          Subtotal
                        </p>

                        <p
                          style={{
                            margin: "6px 0 0 0",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#15803d",
                          }}
                        >
                          ${subtotal.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {carrito.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "30px 35px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                TOTAL:
              </span>

              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#166534",
                }}
              >
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            <button
              onClick={onFinalizarCompra}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#15803d",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}