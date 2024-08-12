//Función para la barra buscadora de productos.
export default function searchFilters(input, selector) {
  document.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      const searchValue = e.target.value.toLowerCase();
      document.querySelectorAll(selector).forEach((el) => {
        const textContent = el.textContent.toLowerCase();
        el.classList.toggle("filter", !textContent.includes(searchValue));
      });
    }
  });
}
