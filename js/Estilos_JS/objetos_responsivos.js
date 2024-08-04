const d = document, w = window;

//Función para hacer que el mapa de la ultima sección se va como un enlace cuando se vuelve más chica la pantalla.
export default function responsiveMedia(id, mq, mobileContent, desktopContent) {
  let breakpoint = w.matchMedia(mq);

  const responsive = (e) => {
    if (e.matches) {
      d.getElementById(id).innerHTML = desktopContent;
    } else {
      d.getElementById(id).innerHTML = mobileContent;
    }
  };
  breakpoint.addListener(responsive);
  responsive(breakpoint);
}
