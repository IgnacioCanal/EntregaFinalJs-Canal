//Función para la barra buscadora de productos.
export default function searchFilters(input, selector) {
  document.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      const searchValue = e.target.value.toLowerCase();
      let found = false;

      document.querySelectorAll(selector).forEach((el) => {
        const textContent = el.textContent.toLowerCase();
        if (textContent.includes(searchValue)) {
          el.classList.remove("filter");
          found = true;
        } else {
          el.classList.add("filter");
        }
      });

      const noResultMessage = document.querySelector("#no-result-message");

      if (!found) {
        if (!noResultMessage) {
          const message = document.createElement("p");
          message.id = "no-result-message";
          message.className = "no-result";
          message.textContent = "No encontrado, por favor busque de nuevo";
          document.querySelector("#container").appendChild(message);
        }
      } else {
        if (noResultMessage) {
          noResultMessage.remove();
        }
      }
    }
  });
}

