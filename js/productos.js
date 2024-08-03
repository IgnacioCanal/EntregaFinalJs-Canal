let id_productos = 1;
const d = document;

class Producto {
  constructor (nombre,precio,categoria ='') {
    let tipos_categoria = [
      'Maquinas',
      'Clavos y Tornillos',
      'Herramientas'
    ]

    this.nombre = nombre
    this.categoria = tipos_categoria[categoria]
    this.precio = precio
    this.id = id_productos++
    this.img = `./assets/img/${nombre.toLowerCase()}.jpg`
    this.stock = rand_int(1, 30)
  }
}

let productos =[
  new Producto('Martillo', 10000,2),
  new Producto('Destornillador_Philips',4000,2),
  new Producto('Destornillador_Paleta',4000,2),
  new Producto('Agujereadora', 50000,0),
  new Producto('Cinta_Metrica', 6000,2),
]

let container_cards = d.querySelector('#container')

function rand_int(min, max) {
  return Math.ceil((Math.random() * (max - min)) + min)
}

productos.forEach((producto) => {
  let copia_plantilla = document.querySelector('template').content.cloneNode(true);

  copia_plantilla.querySelector('h5').textContent = producto.nombre;
  copia_plantilla.querySelector('.card-categoria').textContent = `Categoría: ${producto.categoria}`;
  copia_plantilla.querySelector('.card-price').textContent = `Precio: $${producto.precio}.`;
  copia_plantilla.querySelector('.card-id').textContent = `Id: ${producto.id}.`;
  copia_plantilla.querySelector('.card-stock').textContent = `Stock: ${producto.stock}.`;
  copia_plantilla.querySelector('img').setAttribute('src', producto.img);
  copia_plantilla.querySelector('img').setAttribute('alt', producto.nombre);

  container_cards.append(copia_plantilla);
});
