// carrito.js
import { productos } from "./productos.js";
import { renderProductos } from "./productos.js";

let carrito = [];
const d = document;
const carritoContador = d.querySelector("#carrito-contador");
const carritoVentana = d.querySelector("#carrito-ventana");
const iconoCarrito = d.querySelector("#icono-carrito");

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContador();
    renderizarVentanaCarrito();
    if (carrito.length > 0) {
      carritoVentana.classList.add("visible");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
});

// Función para actualizar el contador del carrito
function actualizarContador() {
  if (!carritoContador) return;
  const contador = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  carritoContador.textContent = contador;
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    stopOnFocus: true,
  }).showToast();
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find((item) => item.id === producto.id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  producto.stock -= 1;

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarNotificacion(`Agregaste ${producto.nombre} a tu carrito`);
  renderizarVentanaCarrito();
}

// Función para quitar productos del carrito
function quitarDelCarrito(id) {
  const productoEnCarrito = carrito.find((item) => item.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad -= 1;
    if (productoEnCarrito.cantidad === 0) {
      carrito = carrito.filter((item) => item.id !== id);
    }
    const producto = productos.find((p) => p.id === id);
    if (producto) producto.stock += 1;
    actualizarContador();
    renderizarVentanaCarrito();
    renderProductos();
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

// Función para renderizar la ventana del carrito
function renderizarVentanaCarrito() {
  carritoVentana.innerHTML = "";

  carrito.forEach((item) => {
    const div = d.createElement("div");
    div.className = "carrito-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" />
      <p>${item.nombre}: -</p>
      <p>$${item.precio} -</p>
      <p>Cantidad: ${item.cantidad}</p>
      <button class="btn-quitar" data-id="${item.id}">🗑️</button>
    `;
    carritoVentana.appendChild(div);
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const totalP = d.createElement("p");
  totalP.textContent = `Total: $${total}`;
  carritoVentana.appendChild(totalP);

  const botonRealizarPedido = d.createElement("button");
  botonRealizarPedido.textContent = "Realizar Pedido";
  botonRealizarPedido.addEventListener("click", () => realizarPedido());
  carritoVentana.appendChild(botonRealizarPedido);

  // Añade evento para los botones para quitar productos
  d.querySelectorAll(".btn-quitar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      quitarDelCarrito(id);
      renderizarVentanaCarrito();
    });
  });
}

function realizarPedido() {
  if (carrito.length > 0) {
    console.log("Pedido Guardado:", carrito);
    //Con esto actualizo el carrito y lo vuelvo a 0 productos.
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarContador();
    carritoVentana.innerHTML = "";
    mostrarNotificacion(
      "Pedido Guardado, pronto se comunicarán contigo del establecimiento."
    );
  }
}

//Función para ocultar la ventana del carrito
function ocultarVentanaCarrito() {
  carritoVentana.classList.remove("visible");
}

iconoCarrito.addEventListener("click", () => {
  carritoVentana.classList.toggle("visible");
});

//Acá sería escuchar el evento Click fuera de la ventana, siempre y cuando la ventana esté abierta
d.addEventListener("click", (e) => {
  if (carritoVentana.classList.contains("visible")) {
    // Acá verifica si el click fue fuera de la ventana del carrito
    if (
      !carritoVentana.contains(e.target) &&
      !iconoCarrito.contains(e.target)
    ) {
      ocultarVentanaCarrito();
    }
  }
});

export { agregarAlCarrito, quitarDelCarrito, realizarPedido, cargarCarrito };
