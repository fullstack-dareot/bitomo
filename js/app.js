let juegos = [];  // Variable global para almacenar los juegos

// Función para manejar la búsqueda
function buscarJuegos(query, genero) {
  console.log('Buscando juegos con:', query, genero);  // Agregar log para ver los valores de búsqueda
  const juegosFiltrados = juegos.filter(juego => 
    juego.nombre.toLowerCase().includes(query.toLowerCase()) &&
    (genero === "" || juego.categoria === genero)
  );
  renderizarJuegos(juegosFiltrados);  // Renderizar los juegos filtrados
}

// Función para actualizar el contador del carrito
function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorCarrito = document.getElementById("contador-carrito");
  contadorCarrito.innerText = carrito.length;  // Actualizar el contador de productos en el carrito
}

// Función para agregar un juego al carrito
function agregarAlCarrito(idJuego) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si el juego ya está en el carrito
  const juegoExistente = carrito.find(juego => juego.id === idJuego);
  if (!juegoExistente) {
    carrito.push({ id: idJuego });
    localStorage.setItem("carrito", JSON.stringify(carrito));  // Guardamos el carrito en localStorage
    Swal.fire({
      title: '¡Juego agregado!',
      text: 'El juego ha sido añadido a tu carrito.',
      icon: 'success',
      confirmButtonText: '¡Genial!'
    });
  } else {
    Swal.fire({
      title: '¡Ya está en el carrito!',
      text: 'Este juego ya ha sido agregado a tu carrito.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  // Actualizar el contador del carrito
  actualizarCarrito();
}

// Función para manejar el clic en los botones de "Agregar al carrito"
function agregarEventosCarrito() {
  const botones = document.querySelectorAll(".agregar-carrito");

  botones.forEach(boton => {
    boton.addEventListener("click", (event) => {
      const idJuego = parseInt(event.target.getAttribute("data-id"));
      agregarAlCarrito(idJuego);
    });
  });
}

// Función para renderizar los juegos
function renderizarJuegos(juegos) {
  const contenedor = document.getElementById("contenedor-juegos");
  contenedor.innerHTML = '';  // Limpiar el contenedor antes de renderizar

  // Verificar si los juegos están disponibles
  if (juegos.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron juegos para mostrar.</p>';
  }

  // Mostrar todos los juegos
  juegos.forEach(juego => {
    const juegoDiv = document.createElement("div");
    juegoDiv.classList.add("col-12", "col-sm-6", "col-lg-3", "mb-4");

    juegoDiv.innerHTML = `
      <div class="card">
        <img src="${juego.imagen}" class="card-img-top" alt="${juego.nombre}">
        <div class="card-body">
          <h5 class="fw-bold card-title">${juego.nombre}</h5>
          <p class="card-text">${juego.descripcion}</p>
          <p class="card-text"><strong>$${juego.precio}</strong></p>
          <a href="#" class="btn btn-success agregar-carrito" data-id="${juego.id}">Agregar al carrito</a>
        </div>
      </div>
    `;

    contenedor.appendChild(juegoDiv);
  });
  agregarEventosCarrito();
}

// Función para cargar los juegos
function cargarJuegos() {
  fetch('data/juegos.json')
    .then(res => {
      if (!res.ok) {
        throw new Error('No se pudo cargar el archivo JSON');
      }
      return res.json();
    })
    .then(data => {
      juegos = data;
      console.log('Juegos cargados:', juegos);
      renderizarJuegos(juegos);
    })
    .catch(error => {
      console.error("Error al cargar los juegos:", error);
      const contenedor = document.getElementById("contenedor-juegos");
      contenedor.innerHTML = '<p>Error al cargar los juegos.</p>';
    });
}

// Cargar los juegos al iniciar la página
document.addEventListener("DOMContentLoaded", cargarJuegos);

// Escuchar el input del buscador
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', function(event) {
  const query = event.target.value;
  const genero = document.getElementById('filtro-genero').value;
  buscarJuegos(query, genero);
});

// Escuchar el cambio en el filtro de género
const filtroGenero = document.getElementById('filtro-genero');
filtroGenero.addEventListener('change', function(event) {
  const query = buscador.value; 
  const genero = event.target.value; 
  buscarJuegos(query, genero);
});