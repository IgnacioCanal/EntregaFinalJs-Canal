import scrollTopButton from "./boton_scroll.js";
import hamburgerMenu from "./menu_hamburger.js";
import darkTheme from "./tema_oscuro.js";

const d = document;

d.addEventListener("DOMContentLoaded", (e) =>{
  hamburgerMenu(".boton",".panel",".menu a");
  scrollTopButton(".scroll-top-btn");
  darkTheme(".dark-theme-btn","dark-mode");
});
