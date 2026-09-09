
const BASE_URL = "http://localhost:8000";

// REGISTRO
export async function registrar(datos) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (res.status === 400) {
    throw new Error("Ese email ya está registrado");
  }

  if (res.status === 422) {
    throw new Error("Revisá los datos ingresados");
  }

  if (!res.ok) {
    throw new Error("No se pudo crear la cuenta");
  }

  return res.json();
}

// LOGIN
export async function login(email, password) {
  const body = new URLSearchParams({
    username: email,
    password: password,
  });

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (res.status === 401) {
    throw new Error("Email o contraseña incorrectos");
  }

  if (!res.ok) {
    throw new Error("No se pudo iniciar sesión");
  }

  return res.json();
}

// OBTENER USUARIO
export async function getMe() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Sesión vencida");
  }

  return res.json();
}

// HEADERS CON TOKEN
export function authHeaders() {
  const token = localStorage.getItem("access_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// CREAR PEDIDO
export async function crearPedido(carrito) {
  const res = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      items: carrito.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
      })),
    }),
  });

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión para comprar.");
  }

  if (res.status === 409) {
    const data = await res.json();
    throw new Error(
      data.detail || "No hay suficiente stock."
    );
  }

  if (!res.ok) {
    throw new Error("No se pudo realizar la compra.");
  }

  return res.json();
}

// MIS DATOS
export async function getMisDatos() {
  const res = await fetch(`${BASE_URL}/usuarios/me/datos`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (!res.ok) {
    throw new Error("No se pudieron cargar tus datos.");
  }

  return res.json();
}

// EXPORTAR MIS DATOS
export async function exportarMisDatos() {
  const res = await fetch(
    `${BASE_URL}/usuarios/me/exportar`,
    {
      headers: authHeaders(),
    }
  );

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (!res.ok) {
    throw new Error("No se pudieron exportar tus datos.");
  }

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "mis-datos.json";

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

// ELIMINAR MI CUENTA
export async function eliminarMiCuenta() {
  const res = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (!res.ok) {
    throw new Error("No se pudo eliminar la cuenta.");
  }

  return res.json();
}

// MIS PEDIDOS
export async function getMisPedidos() {
  const res = await fetch(`${BASE_URL}/pedidos/mios`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (!res.ok) {
    throw new Error("No se pudieron cargar tus compras.");
  }

  return res.json();
}

// OBTENER UN PEDIDO
export async function getPedido(pedidoId) {
  const res = await fetch(
    `${BASE_URL}/pedidos/${pedidoId}`,
    {
      headers: authHeaders(),
    }
  );

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (res.status === 404) {
    throw new Error("No se encontró ese pedido.");
  }

  if (!res.ok) {
    throw new Error("No se pudo cargar el pedido.");
  }

  return res.json();
}

// ARREPENTIRME DE UN PEDIDO
export async function revocarPedido(pedidoId) {
  const res = await fetch(
    `${BASE_URL}/pedidos/${pedidoId}/revocacion`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );

  if (res.status === 401) {
    throw new Error("Tenés que iniciar sesión.");
  }

  if (res.status === 404) {
    throw new Error("No se encontró ese pedido.");
  }

  if (res.status === 409) {
    const data = await res.json();

    throw new Error(
      data.detail ||
        "Ya no podés arrepentirte de esta compra."
    );
  }

  if (!res.ok) {
    throw new Error("No se pudo revocar la compra.");
  }

  return res.json();
}