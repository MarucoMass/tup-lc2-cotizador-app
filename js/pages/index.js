const padre = document.querySelector("#ver-moneda");
const selectorMoneda = document.getElementById("moneda");
const favoritosBtns = document.querySelectorAll(".starCheckbox");
let listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let monedas = [];
// const API = "https://dolarapi.com/v1/dolares";

const endpoints = {
  oficial: "https://dolarapi.com/v1/dolares/oficial",
  blue: "https://dolarapi.com/v1/dolares/blue",
  bolsa: "https://dolarapi.com/v1/dolares/bolsa",
  contadoconliqui: "https://dolarapi.com/v1/dolares/contadoconliqui",
  tarjeta: "https://dolarapi.com/v1/dolares/tarjeta",
  mayorista: "https://dolarapi.com/v1/dolares/mayorista",
  cripto: "https://dolarapi.com/v1/dolares/cripto",
  eur: "https://dolarapi.com/v1/cotizaciones/eur",
  brl: "https://dolarapi.com/v1/cotizaciones/brl",
  clp: "https://dolarapi.com/v1/cotizaciones/clp",
  uyu: "https://dolarapi.com/v1/cotizaciones/uyu"
};

window.addEventListener("load", () => renderMonedas(endpoints));

async function llamadaAPI(endpoints) {
  try {
    const response = await fetch(endpoints);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function renderMonedas(endpoints) {
  // document.getElementById("actualizacion").innerHTML = "Fecha de la cotización: " + formatearFecha(monedas[0].fechaActualizacion);

  for (const url of Object.values(endpoints)) {
    const monedita = await llamadaAPI(url);
    monedas.push(monedita)
    armarHTML(monedita)
  }
  // padre.innerHTML = "";
  // if (monedas.length > 1) {
  //   for (let i = 0; i < monedas.length; i++) {
  //     armarHTML(monedas[i]);
  //   }
  // } else {
  //   armarHTML(monedas);
  // }
}

function formatearFecha(fecha) {
  const opciones = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  };
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", opciones);
  const horaFormateada = new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return fechaFormateada + " a las " + horaFormateada;
}

function armarHTML(moneda) {
  padre.innerHTML += `
  <div class="contenido_main--box--card">
    <h3>${moneda.nombre}</h3>
    <div class="contenido_main--box--precios">
      <div class="compra">
        <h4>COMPRA</h4>
        <p>$${moneda.compra}</p>
      </div>
      <div class="venta">
        <h4>VENTA</h4>
        <p>$${moneda.venta}</p>
      </div>
      <input type="checkbox"
            id="starCheckbox-${moneda.nombre}" 
            data-nombre=${moneda.nombre} 
            data-compra=${moneda.compra} 
            data-venta=${moneda.venta} 
            data-fecha=${moneda.fechaActualizacion} 
            onclick="agregarAlStorage(this)" 
            class="starCheckbox"
      >
      <label for="starCheckbox-${moneda.nombre}" class="starCheckboxLabel"></label>
    </div>
  </div>`;
}

selectorMoneda.addEventListener("change", (event) => {
  const monedaElegida = event.target.value;
  padre.innerHTML = "";

  if (monedaElegida == "all") {
    for (const moneda of monedas) {
      armarHTML(moneda);
    }
  } else {
    for (const moneda of monedas) {
      if (monedaElegida == moneda.nombre) {
        armarHTML(moneda);
      }
    }
  }
});

function agregarAlStorage(e) {
  const favorito = {
    nombre: e.dataset.nombre,
    compra: e.dataset.compra,
    venta: e.dataset.venta,
    fechaActualizacion: e.dataset.fecha,
  };
  setearStorage(favorito);
}

function setearStorage(favorito) {
  listaFavoritos.push(favorito);
  localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));
}

// setInterval(() => {
//   renderMonedas();
//   console.log("holis")
// }, 300000);
