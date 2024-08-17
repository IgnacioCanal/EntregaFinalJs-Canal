// carrito.js
import { productos } from "./productos.js";
import { renderProductos } from "./productos.js";
import { valorDolar } from "./dolarhoy.js";

let preciosCarritoEnDolares = false;
let carrito = [];
const d = document;
const carritoContador = d.querySelector("#carrito-contador");
const carritoVentana = d.querySelector("#carrito-ventana");
const iconoCarrito = d.querySelector("#icono-carrito");

//Llamo a la función para cargar el carrito
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
});

//Función para encontrar el carrito guardado o no.
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
// Función para actualizar el contador del carrito
function actualizarContador() {
  if (!carritoContador) return;
  const contador = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  carritoContador.textContent = contador;
}

// Función para agregar productos al carrito
function agregarAlCarrito(productos) {
  const productoEnCarrito = carrito.find((item) => item.id === productos.id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({ ...productos, cantidad: 1 });
  }
  productos.stock -= 1;

  //Guardo los nuevos productos al Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarNotificacion(`Agregaste ${productos.nombre} a tu carrito`);
  renderizarVentanaCarrito();
  renderProductos();
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
    mostrarNotificacion(`Quitaste ${producto.nombre} de tu carrito.`);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

// Función para renderizar la ventana del carrito
function renderizarVentanaCarrito() {
  carritoVentana.innerHTML = "";

  if (carrito.length === 0) {
    carritoVentana.innerHTML = "<p>El carrito está vacío.</p>";
    // Desactiva el botón "Eliminar Todo" si el carrito está vacío
    const botonEliminarTodo = d.querySelector("#btn-eliminar-todo");
    if (botonEliminarTodo) botonEliminarTodo.disabled = true;
    return;
  }

  carrito.forEach((item) => {
    const div = d.createElement("div");
    div.className = "carrito-item";
    div.innerHTML = `
    <img src="${item.img}" alt="${item.nombre}" />
      <p>${item.nombre}: <spam class="precio-item" data-precio = '${item.precio}'>$${item.precio}</spam> - Cantidad: ${item.cantidad}</p>
      <div class="btn-group">
        <button class="btn-sumar" data-id="${item.id}">+</button>
        <button class="btn-restar" data-id="${item.id}">-</button>
      </div>
      <button class="btn-quitar-todo" data-id="${item.id}">Eliminar</button>
    `;
    carritoVentana.appendChild(div);
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const totalP = d.createElement("p");
  totalP.className = "total-precio";
  totalP.setAttribute("data-total-precio", total);
  totalP.textContent = `Total: $${total}`;
  carritoVentana.appendChild(totalP);

  const botonRealizarPedido = d.createElement("button");
  botonRealizarPedido.textContent = "Realizar Pedido";
  botonRealizarPedido.addEventListener("click", () => realizarPedido());
  carritoVentana.appendChild(botonRealizarPedido);

  let botonEliminarTodo = d.querySelector("#btn-eliminar-todo");
  if (!botonEliminarTodo) {
    botonEliminarTodo = d.createElement("button");
    botonEliminarTodo.id = "btn-eliminar-todo";
    botonEliminarTodo.textContent = "Eliminar Todo";
    botonEliminarTodo.addEventListener("click", () => eliminarTodoDelCarrito());
    carritoVentana.appendChild(botonEliminarTodo);
  }

  // Habilita el botón "Eliminar Todo" si hay productos en el carrito
  botonEliminarTodo.disabled = carrito.length === 0;

  // Añade evento para los botones para sumar, restar, quitar productos o eliminar todo el carrito.
  d.querySelectorAll(".btn-sumar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      const producto = productos.find((p) => p.id === id);
      if (producto && producto.stock > 0) {
        agregarAlCarrito(producto);
        renderizarVentanaCarrito();
      } else if (producto.stock === 0) {
        mostrarNotificacion(`No hay más ${producto.nombre} en stock.`);
      }
    });
  });

  d.querySelectorAll(".btn-restar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      quitarDelCarrito(id);
      renderizarVentanaCarrito();
    });
  });

  d.querySelectorAll(".btn-quitar-todo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      eliminarProductos(id);
      renderizarVentanaCarrito();
    });
  });
}

//Función para eliminar todos los productos del carrito.
function eliminarTodoDelCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarContador();
  renderizarVentanaCarrito();
  mostrarNotificacion("Se han eliminado todos los productos del carrito.");
}

//Función para eliminar todos los items de un producto
function eliminarProductos(id) {
  const productoEnCarrito = carrito.find((item) => item.id === id);
  if (productoEnCarrito) {
    // Aumentar el stock del producto eliminado
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      producto.stock += productoEnCarrito.cantidad;
    }
    // Eliminar todos los productos del carrito
    carrito = carrito.filter((item) => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    renderizarVentanaCarrito();
    renderProductos();
    mostrarNotificacion(`Eliminiaste todos tus ${producto.nombre}.`);
  }
}

//Función para guardar el pedido, limpiar el carrito y actualizar el Storage.
function realizarPedido() {
  if (carrito.length > 0) {
    console.log("Pedido Guardado:", carrito);
    // Vacía el carrito
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarContador();
    carritoVentana.innerHTML = "<p>Gracias por confiar en nosotros.</p>";
    mostrarNotificacion(
      "Pedido Guardado, pronto se comunicarán contigo del establecimiento."
    );
  }
}

// Función para mostrar cualquier notificación pertinente
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
//Función para ocultar la ventana del carrito
function ocultarVentanaCarrito() {
  carritoVentana.classList.remove("visible");
}
//Función para que se vea el contenido del carrito.
iconoCarrito.addEventListener("click", () => {
  carritoVentana.classList.toggle("visible");
});

function actualizarCarritoADolares(valorDolar) {
  const itemsCarrito = document.querySelectorAll(".precio-item");
  const totalP = document.querySelector(".total-precio");
  itemsCarrito.forEach((item) => {
    const precioOriginal = parseFloat(item.getAttribute("data-precio"));
    if (preciosCarritoEnDolares) {
      const precioEnPesos = precioOriginal;
      item.textContent = `$${precioEnPesos.toFixed(2)}`;
    } else {
      const precioEnDolares = precioOriginal / valorDolar;
      item.textContent = `${precioEnDolares.toFixed(2)} USD`;
    }
  });

  if (totalP) {
    // Actualizar el total
    const totalOriginal = parseFloat(totalP.getAttribute("data-total-precio"));
    if (preciosCarritoEnDolares) {
      totalP.textContent = `Total: $${totalOriginal.toFixed(2)}`;
    } else {
      const totalEnDolares = totalOriginal / valorDolar;
      totalP.textContent = `Total: ${totalEnDolares.toFixed(2)} USD`;
    }
  }
  // Alternar el estado de la moneda
  preciosCarritoEnDolares = !preciosCarritoEnDolares;
}

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

export {
  agregarAlCarrito,
  quitarDelCarrito,
  realizarPedido,
  cargarCarrito,
  actualizarCarritoADolares,
};
