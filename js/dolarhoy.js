export let valorDolar = 0;
export function obtenerPrecioDolar() {
  fetch("https://dolarapi.com/v1/dolares/blue")
    .then(response => response.json())
    .then(data => {
      valorDolar = data.venta; // Ajusta esto según el formato de la respuesta de la API
      document.getElementById('valor-dolar').textContent = `$${valorDolar.toFixed(2)}`; // Muestra el valor con 2 decimales
    })
    .catch(error => {
      console.error('Error al obtener el precio del dólar:', error);
      document.getElementById('valor-dolar').textContent = 'Error al cargar';
    });
}

// Actualiza el precio del dólar cada un minuto (60000 ms)
setInterval(obtenerPrecioDolar, 60000);

// También actualiza el precio cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerPrecioDolar);
