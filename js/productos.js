import { agregarAlCarrito } from "./carrito.js";
let id_productos = 1;
const d = document;

class Producto {
  constructor(nombre, precio, categoria = "") {
    let tipos_categoria = [
      "Maquinas",
      "Clavos y Tornillos",
      "Herramientas",
      "Electricidad",
    ];

    this.nombre = nombre;
    this.categoria = tipos_categoria[categoria];
    this.precio = precio;
    this.id = id_productos++;
    this.img = `./assets/img/${nombre.toLowerCase()}.jpg`;
    this.stock = rand_int(0, 30);
  }
}

let productos = [
  new Producto("Martillo", 10000, 2),
  new Producto("Destornillador Philips", 4000, 2),
  new Producto("Destornillador Paleta", 4000, 2),
  new Producto("Agujereadora", 50000, 0),
  new Producto("Cinta Metrica", 6000, 2),
  new Producto("Alicate", 8000, 2),
  new Producto("Cajon 150 Piezas", 100000, 2),
  new Producto("Enchufe Exterior", 2000, 2),
  new Producto("Foco 15w", 1500, 3),
  new Producto("Foco Inteligente", 12000, 3),
  new Producto("Llaves", 6500, 2),
  new Producto("Pico de Loro", 11000, 2),
  new Producto("Triple", 2500, 3),
  new Producto("Zapatilla", 9000, 3),
  new Producto("Taladro Inalambrico", 160000, 0),
  new Producto("Caladora", 70000, 0),
];

//Función para calcular el stock aleatorio.
function rand_int(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function renderProductos(productosLista = productos) {
  const container_cards = d.querySelector("#container");
  container_cards.innerHTML = ""; // Limpia el contenedor antes de renderizar

  productosLista.forEach((producto) => {
    let copia_plantilla = d.querySelector("template").content.cloneNode(true);

    copia_plantilla.querySelector("h5").textContent = producto.nombre;
    copia_plantilla.querySelector(
      ".card-categoria"
    ).textContent = `Categoría: ${producto.categoria}`;
    copia_plantilla.querySelector(
      ".card-price"
    ).textContent = `Precio: $${producto.precio}`;
    copia_plantilla.querySelector(
      ".card-id"
    ).textContent = `Id: ${producto.id}`;
    copia_plantilla.querySelector(
      ".card-stock"
    ).textContent = `Stock: ${producto.stock}`;
    copia_plantilla.querySelector("img").setAttribute("src", producto.img);
    copia_plantilla.querySelector("img").setAttribute("alt", producto.nombre);

    const btnAgregar = copia_plantilla.querySelector("button");
    btnAgregar.addEventListener("click", () => {
      if (producto.stock > 0) {
        agregarAlCarrito(producto);
        renderProductos(); // Renderiza los productos para actualizar el stock
      }
    });
    if (producto.stock === 0) {
      copia_plantilla.querySelector(".card").style.opacity = "0.5"; // Para que se vea cuando algún producto se queda sin Stock
      btnAgregar.disabled = true;
      btnAgregar.textContent = "Sin Stock";
    }

    container_cards.append(copia_plantilla);
  });
}

function filtrarYOrdenarProductos() {
  const categoryFilter = d.querySelector("#category-filter").value;
  const priceFilter = d.querySelector("#price-filter").value;

  let productosFiltrados = productos;

  if (categoryFilter) {
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.categoria === categoryFilter
    );
  }

  if (priceFilter) {
    productosFiltrados.sort((a, b) => {
      if (priceFilter === "asc") {
        return a.precio - b.precio;
      } else if (priceFilter === "desc") {
        return b.precio - a.precio;
      }
      return 0;
    });
  }

  renderProductos(productosFiltrados);
}

// Escuchar eventos de los selectores para filtrar y ordenar
d.addEventListener("DOMContentLoaded", () => {
  d.querySelector("#category-filter").addEventListener("change", filtrarYOrdenarProductos);
  d.querySelector("#price-filter").addEventListener("change", filtrarYOrdenarProductos);

  // Renderizar productos iniciales
  renderProductos();
});

export { productos, renderProductos };
