import scrollTopButton from "./boton_scroll.js";
import hamburgerMenu from "./menu_hamburger.js";
import responsiveMedia from "./objetos_responsivos.js";
import darkTheme from "./tema_oscuro.js";

const d = document;

d.addEventListener("DOMContentLoaded", (e) =>{
  hamburgerMenu(".boton",".panel",".menu a");
  scrollTopButton(".scroll-top-btn");
  responsiveMedia("gmaps","(min-width:1024px)",`<a href="https://maps.app.goo.gl/yF3b6CoydTLLYPEu6" target="_blank" rel="noopener">Ver la dirección en el Mapa</a>`, `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.1328573754286!2d-57.566476023541696!3d-38.020682071924334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584df30baf02d5f%3A0x7aa6b8286e15be49!2sVictorNillo%20Ferreteria!5e0!3m2!1ses!2sar!4v1722391836348!5m2!1ses!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
  responsiveMedia("","(min-width:1024px)",``, ``);
});


darkTheme(".dark-theme-btn","dark-mode");

class Sistema {
  constructor(productos){
    this.productos = productos;
    this.categoria = ['Maquinaria','Clavos y Tornillos', 'Herramientas']
  }
}

