
import { useEffect, useState } from "react";
import Catalogo from "./pages/Catalogo";
import MisPedidos from "./pages/MisPedidos";
import Arrepentimiento from "./pages/Arrepentimiento";
import CarritoModal from "./components/CarritoModal";
import LoginModal from "./components/LoginModal";
import RegistroModal from "./components/RegistroModal";
import AdminProductos from "./components/AdminProductos";
import MisDatos from "./pages/MisDatos";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { crearPedido } from "./services/api";

function Tienda() {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);

  const [verCarrito, setVerCarrito] = useState(false);
  const [verLogin, setVerLogin] = useState(false);
  const [verRegistro, setVerRegistro] = useState(false);
  const [verMenuCuenta, setVerMenuCuenta] = useState(false);
  const [verAdmin, setVerAdmin] = useState(false);
  const [verMisDatos, setVerMisDatos] = useState(false);
  const [verMisPedidos, setVerMisPedidos] = useState(false);

  const [mensajeCuenta, setMensajeCuenta] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState("");

  const { usuario, cerrarSesion } = useAuth();

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    const productosGuardados =
      localStorage.getItem("volver_a_comprar");

    if (!productosGuardados || productos.length === 0) {
      return;
    }

    const items = JSON.parse(productosGuardados);

    volverAComprar(items);

    localStorage.removeItem("volver_a_comprar");
  }, [productos]);

  const cargarProductos = () => {
    fetch("http://localhost:8000/productos/")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch(() => {
        console.error(
          "No se pudieron cargar los productos."
        );
      });
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (item) => item.id === producto.id
      );

      if (existe) {
        if (existe.cantidad >= producto.stock) {
          alert(
            `No hay suficiente stock de "${producto.nombre}". Stock disponible: ${producto.stock}`
          );

          return prev;
        }

        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      if (producto.stock <= 0) {
        alert(
          `El producto "${producto.nombre}" está sin stock.`
        );

        return prev;
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });

    setProductoAgregado(producto.nombre);

    setTimeout(() => {
      setProductoAgregado("");
    }, 2500);
  };

  const incrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.cantidad >= item.stock) {
          alert(
            `No hay suficiente stock de "${item.nombre}". Stock disponible: ${item.stock}`
          );

          return item;
        }

        return {
          ...item,
          cantidad: item.cantidad + 1,
        };
      })
    );
  };

  const decrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      return;
    }

    if (!usuario) {
      setVerCarrito(false);
      setVerLogin(true);
      return;
    }

    try {
      const pedido = await crearPedido(carrito);

      alert(
        `¡Compra realizada con éxito!\n\nPedido #${pedido.id}`
      );

      setCarrito([]);
      setVerCarrito(false);

      cargarProductos();
    } catch (error) {
      alert(error.message);
    }
  };

  const volverAComprar = (items) => {
    const nuevosProductos = [];

    items.forEach((item) => {
      const producto = productos.find(
        (producto) =>
          producto.id === item.producto_id
      );

      if (!producto) {
        return;
      }

      const existente = nuevosProductos.find(
        (p) => p.id === producto.id
      );

      if (existente) {
        existente.cantidad += item.cantidad;
      } else {
        nuevosProductos.push({
          ...producto,
          cantidad: item.cantidad,
        });
      }
    });

    const productosSinStock = nuevosProductos.filter(
      (item) => item.cantidad > item.stock
    );

    if (productosSinStock.length > 0) {
      alert(
        `No hay suficiente stock de "${productosSinStock[0].nombre}". Stock disponible: ${productosSinStock[0].stock}`
      );
      return;
    }

    setCarrito((prev) => {
      const nuevoCarrito = [...prev];

      nuevosProductos.forEach((producto) => {
        const existe = nuevoCarrito.find(
          (item) => item.id === producto.id
        );

        if (existe) {
          const nuevaCantidad =
            existe.cantidad + producto.cantidad;

          if (nuevaCantidad <= producto.stock) {
            existe.cantidad = nuevaCantidad;
          }
        } else {
          nuevoCarrito.push(producto);
        }
      });

      return nuevoCarrito;
    });

    setVerMisPedidos(false);
    setVerCarrito(true);
  };

  const totalUnidades = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f8f2",
        color: "#1f2937",
      }}
    >
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #d1fae5",
          boxShadow:
            "0 2px 10px rgba(0, 0, 0, 0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            minHeight: "105px",
            padding: "20px 40px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "700",
                color: "#166534",
                letterSpacing: "-0.5px",
              }}
            >
              🌿 Yerba Mate Ar
            </h1>

            <p
              style={{
                margin: "7px 0 0 0",
                fontSize: "15px",
                color: "#6b7280",
              }}
            >
              Tu yerba mate favorita
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {usuario ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() =>
                    setVerMenuCuenta(
                      !verMenuCuenta
                    )
                  }
                  style={{
                    padding: "12px 20px",
                    border:
                      "1px solid #15803d",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    color: "#15803d",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Mi cuenta ▾
                </button>

                {verMenuCuenta && (
                  <div
                    style={{
                      position: "absolute",
                      top: "55px",
                      right: 0,
                      width: "220px",
                      backgroundColor: "white",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "12px",
                      padding: "10px",
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,0.15)",
                      zIndex: 100,
                    }}
                  >
                    {usuario?.rol ===
                      "admin" && (
                      <button
                        onClick={() => {
                          setVerMenuCuenta(
                            false
                          );
                          setVerAdmin(true);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom:
                            "8px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor:
                            "#dcfce7",
                          color: "#166534",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        ⚙️ Administrar productos
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setVerMenuCuenta(
                          false
                        );
                        setVerMisDatos(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "8px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor:
                          "#dcfce7",
                        color: "#166534",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      👤 Mis datos
                    </button>

                    <button
                      onClick={() => {
                        setVerMenuCuenta(
                          false
                        );
                        setVerMisPedidos(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "8px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor:
                          "#dcfce7",
                        color: "#166534",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      🛍️ Mis compras
                    </button>

                    <button
                      onClick={() => {
                        cerrarSesion();
                        setVerMenuCuenta(
                          false
                        );
                        setVerAdmin(false);
                        setVerMisDatos(false);
                        setVerMisPedidos(
                          false
                        );
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor:
                          "#fee2e2",
                        color: "#dc2626",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() =>
                    setVerLogin(true)
                  }
                  style={{
                    padding: "12px 20px",
                    border:
                      "1px solid #15803d",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    color: "#15803d",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Iniciar sesión
                </button>

                <button
                  onClick={() =>
                    setVerRegistro(true)
                  }
                  style={{
                    padding: "12px 20px",
                    border:
                      "1px solid #15803d",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    color: "#15803d",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Crear cuenta
                </button>
              </>
            )}

            <button
              onClick={() => setVerCarrito(true)}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#15803d",
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow:
                  "0 3px 8px rgba(21, 128, 61, 0.25)",
              }}
            >
              🛒 Carrito ({totalUnidades})
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "35px 30px 50px 30px",
          boxSizing: "border-box",
        }}
      >
        <Catalogo
          productos={productos}
          agregarAlCarrito={agregarAlCarrito}
        />
      </main>

      {verAdmin &&
        usuario?.rol === "admin" && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              backgroundColor:
                "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "1000px",
                maxHeight: "90vh",
                overflowY: "auto",
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={() =>
                    setVerAdmin(false)
                  }
                  style={{
                    border: "none",
                    backgroundColor:
                      "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <AdminProductos
                productos={productos}
                setProductos={setProductos}
              />
            </div>
          </div>
        )}

      {verMisDatos && usuario && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "flex-end",
              padding: "15px 25px",
              backgroundColor: "white",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <button
              onClick={() =>
                setVerMisDatos(false)
              }
              style={{
                border: "none",
                backgroundColor:
                  "#fee2e2",
                color: "#dc2626",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <MisDatos />
        </div>
      )}

      {verMisPedidos && usuario && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "flex-end",
              padding: "15px 25px",
              backgroundColor: "white",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <button
              onClick={() =>
                setVerMisPedidos(false)
              }
              style={{
                border: "none",
                backgroundColor:
                  "#fee2e2",
                color: "#dc2626",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <MisPedidos
            onVolverAComprar={
              volverAComprar
            }
          />
        </div>
      )}

      {productoAgregado && (
        <div
          style={{
            position: "fixed",
            top: "125px",
            right: "30px",
            zIndex: 100,
            width: "320px",
            backgroundColor: "white",
            border: "1px solid #bbf7d0",
            borderLeft:
              "5px solid #15803d",
            borderRadius: "14px",
            padding: "18px 22px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.15)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#15803d",
              fontSize: "17px",
              fontWeight: "700",
            }}
          >
            ✓ Producto agregado
          </p>

          <p
            style={{
              margin: "8px 0 0 0",
              color: "#4b5563",
              fontSize: "14px",
            }}
          >
            {productoAgregado}
          </p>
        </div>
      )}

      {verCarrito && (
        <CarritoModal
          carrito={carrito}
          onCerrar={() =>
            setVerCarrito(false)
          }
          onIncrementar={
            incrementarCantidad
          }
          onDecrementar={
            decrementarCantidad
          }
          onFinalizarCompra={
            finalizarCompra
          }
        />
      )}

      {verLogin && (
        <LoginModal
          onCerrar={() => setVerLogin(false)}
          onLoginExitoso={() =>
            setMensajeCuenta(true)
          }
        />
      )}

      {verRegistro && (
        <RegistroModal
          onCerrar={() =>
            setVerRegistro(false)
          }
        />
      )}

      <footer
        style={{
          backgroundColor: "#166534",
          color: "white",
          textAlign: "center",
          padding: "25px",
          marginTop: "30px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          Yerba Mate Ar
        </p>
      </footer>

      {mensajeCuenta && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "35px",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#166534",
              }}
            >
              ✓ Ya estás en tu cuenta
            </h2>

            <p
              style={{
                marginTop: "20px",
                marginBottom: "30px",
                color: "#6b7280",
                fontSize: "16px",
              }}
            >
              Tu sesión se inició correctamente.
            </p>

            <button
              onClick={() =>
                setMensajeCuenta(false)
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#15803d",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  if (
    window.location.pathname ===
    "/arrepentimiento"
  ) {
    return (
      <AuthProvider>
        <Arrepentimiento />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Tienda />
    </AuthProvider>
  );
}