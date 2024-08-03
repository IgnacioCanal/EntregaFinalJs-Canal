// carrito.js
import { productos } from "./productos.js";
import { renderProductos } from "./productos.js";

let carrito = [];
const d = document;
const carritoContador = d.querySelector("#carrito-contador");
const carritoVentana = d.querySelector("#carrito-ventana"); 
const iconoCarrito = d.querySelector("#icono-carrito");

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContador();
    renderizarVentanaCarrito();
    if (carrito.length > 0) {
      carritoVentana.classList.add('visible');
    }
  }
}

document.addEventListener('DOMContentLoaded',() => {
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
  const notificacion = d.createElement("div");
  notificacion.className = "notificacion";
  notificacion.textContent = mensaje;
  d.body.appendChild(notificacion);
  setTimeout(() => notificacion.remove(), 1500);
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find(item => item.id === producto.id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  producto.stock -= 1;

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
  mostrarNotificacion(`Agregaste ${producto.nombre} a tu carrito`);
  renderizarVentanaCarrito();
}

// Función para quitar productos del carrito
function quitarDelCarrito(id) {
  const productoEnCarrito = carrito.find(item => item.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad -= 1;
    if (productoEnCarrito.cantidad === 0) {
      carrito = carrito.filter(item => item.id !== id);
    }
    const producto = productos.find(p => p.id === id);
    if (producto) producto.stock += 1;
    actualizarContador();
    renderizarVentanaCarrito();

    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
}

// Función para renderizar la ventana del carrito
function renderizarVentanaCarrito() {
  carritoVentana.innerHTML = '';

  carrito.forEach(item => {
    const div = d.createElement('div');
    div.className = 'carrito-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" />
      <p>${item.nombre}: -</p>
      <p>$${item.precio} -</p>
      <p>Cantidad: ${item.cantidad}</p>
      <button class="btn-quitar" data-id="${item.id}">🗑️</button>
    `;
    carritoVentana.appendChild(div);
  });

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalP = d.createElement('p');
  totalP.textContent = `Total: $${total}`;
  carritoVentana.appendChild(totalP);

  const botonRealizarPedido = d.createElement('button');
  botonRealizarPedido.textContent = 'Realizar Pedido';
  botonRealizarPedido.addEventListener('click', () => realizarPedido());
  carritoVentana.appendChild(botonRealizarPedido);

  // Añade evento para los botones para quitar productos
  d.querySelectorAll('.btn-quitar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      quitarDelCarrito(id);
      renderizarVentanaCarrito();
    });
  });
}


function realizarPedido() {
  if (carrito.length > 0) {
    console.log('Pedido Guardado:', carrito);
    actualizarContador();
    carritoVentana.innerHTML = '';
    mostrarNotificacion('Pedido Guardado, pronto se comunicarán contigo del establecimiento.');
  }
}

iconoCarrito.addEventListener('click', () => {
  carritoVentana.classList.toggle('visible');
});

export { agregarAlCarrito, quitarDelCarrito, realizarPedido, cargarCarrito};