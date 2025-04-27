// Cargar carrito desde localStorage o inicializarlo vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contenedor = document.getElementById("carrito-contenido");

// Cargar juegos desde el archivo JSON
async function cargarJuegos() {
  try {
    const response = await fetch('../data/juegos.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo juegos.json');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Renderizar carrito como lista
function renderizarCarrito() {
  contenedor.innerHTML = '';
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="text-center">El carrito está vacío</p>';
    return;
  }

  // Crear lista de juegos en el carrito
  carrito.forEach((juego, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center"; // Clase para la lista

    li.innerHTML = `
      <span><strong>${juego.nombre}</strong> - $${juego.precio}</span>
      <button class="btn btn-danger btn-sm eliminar-btn" onclick="eliminarJuego(${index})">Eliminar</button>
    `;
    contenedor.appendChild(li);
  });

  // Calcular y mostrar el total
  const total = carrito.reduce((acc, juego) => acc + juego.precio, 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "total";
  totalDiv.innerHTML = `<h5 class="fw-bold text-center">Total: $${total}</h5>`;
  contenedor.appendChild(totalDiv);
}

// Eliminar juego del carrito
function eliminarJuego(index) {
  carrito.splice(index, 1);  // Elimina el juego del carrito
  localStorage.setItem('carrito', JSON.stringify(carrito));  // Actualiza el carrito en localStorage
  renderizarCarrito();  // Vuelve a renderizar el carrito con los cambios
}

// Finalizar compra
document.getElementById("finalizar-compra").addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agrega juegos antes de comprar", "warning");
    return;
  }

  Swal.fire({
    title: "¿Confirmar compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar"
  }).then((res) => {
    if (res.isConfirmed) {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
      Swal.fire("¡Gracias por tu compra!", "Recibirás un correo pronto", "success");
    }
  });
});

// Cargar y renderizar los juegos en el carrito (cuando se carga la página)
document.addEventListener("DOMContentLoaded", async () => {
  const juegos = await cargarJuegos();
  
  // Actualizamos el carrito con los juegos seleccionados
  carrito.forEach(itemCarrito => {
    if (itemCarrito && itemCarrito.id) {
      const juegoExistente = juegos.find(juego => juego.id === itemCarrito.id);
      if (juegoExistente) {
        itemCarrito.nombre = juegoExistente.nombre;
        itemCarrito.precio = juegoExistente.precio;
      }
    }
  });

  // Guardar los datos actualizados en el localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderizarCarrito();
});