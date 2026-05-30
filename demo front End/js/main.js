// Base de datos de juegos de mesa
const juegos = [
    {
        id: 1,
        nombre: "Catan",
        precio: 35000,
        descripcion: "Estrategia clásica donde construyes asentamientos y rutas.",
        imagen: "imagenes/catan.webp",
        rating: 4.8,
        stock: 12
    },
    {
        id: 2,
        nombre: "Ticket to Ride",
        precio: 45000,
        descripcion: "Conecta ciudades a través de rutas ferroviarias. ¡Gana puntos!",
        imagen: "imagenes/tickettoride.jpg",
        rating: 4.7,
        stock: 8
    },
    {
        id: 3,
        nombre: "Splendor",
        precio: 28000,
        descripcion: "Juego de comercio rápido y adictivo para 2-4 jugadores.",
        imagen: "imagenes/splendor.jpg",
        rating: 4.6,
        stock: 15
    },
    {
        id: 4,
        nombre: "Carcassonne",
        precio: 32000,
        descripcion: "Construcción de paisajes medievales. Colaborativo y divertido.",
        imagen: "imagenes/carcassonne.jpg",
        rating: 4.5,
        stock: 10
    },
    {
        id: 5,
        nombre: "7 Wonders",
        precio: 42000,
        descripcion: "Construcción épica de civilizaciones antiguas. 3-7 jugadores.",
        imagen: "imagenes/7wonders.png",
        rating: 4.9,
        stock: 6
    },
    {
        id: 6,
        nombre: "Azul",
        precio: 25000,
        descripcion: "Colocación de fichas coloridas. Hermoso y accesible.",
        imagen: "imagenes/azul.webp",
        rating: 4.7,
        stock: 20
    }
];

// Carrito de compras
let carrito = [];

// Función para renderizar catálogo
function renderizarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    juegos.forEach(juego => {
        const divJuego = document.createElement('div');
        divJuego.className = 'col-6 col-md-4 col-lg-3 mb-4';
        divJuego.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${juego.imagen}" alt="${juego.nombre}">
                </div>
                <div class="product-body">
                    <h6 class="product-title">${juego.nombre}</h6>
                    <p class="product-description">${juego.descripcion}</p>
                    <div class="product-rating">
                        <i class="bi bi-star-fill text-warning"></i>
                        <span>${juego.rating}</span>
                        <span class="text-muted">(${Math.floor(Math.random() * 150) + 10} reseñas)</span>
                    </div>
                    <div class="product-price">$${juego.precio.toLocaleString('es-CL')}</div>
                    <button class="btn-add-to-cart btn-agregar" 
                            data-id="${juego.id}" 
                            data-nombre="${juego.nombre}" 
                            data-precio="${juego.precio}">
                        <i class="bi bi-bag-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(divJuego);
    });

    // Agregar event listeners
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(e) {
    const btn = e.target.closest('.btn-agregar');
    const id = parseInt(btn.getAttribute('data-id'));
    const nombre = btn.getAttribute('data-nombre');
    const precio = parseInt(btn.getAttribute('data-precio'));

    // Buscar si el producto ya existe
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: juegos.find(j => j.id === id).imagen
        });
    }

    actualizarCarrito();
    mostrarNotificacion(`${nombre} agregado al carrito`);
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const contenedor = document.getElementById('contenedor-carrito');
    const resumenCarrito = document.getElementById('resumen-carrito');
    const carritoVacioResumen = document.getElementById('carrito-vacio-resumen');
    const badge = document.getElementById('badge-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const subtotalEl = document.getElementById('subtotal');
    const impuestoEl = document.getElementById('impuesto');

    // Actualizar badge
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag-check fs-1 text-muted mb-3"></i>
                <p class="text-muted">Tu carrito está vacío</p>
                <a href="#catalogo" class="btn btn-primary btn-sm">Continuar Comprando</a>
            </div>
        `;
        resumenCarrito.style.display = 'none';
        carritoVacioResumen.style.display = 'block';
        return;
    }

    resumenCarrito.style.display = 'block';
    carritoVacioResumen.style.display = 'none';

    let html = '<div class="table-responsive"><table class="table table-sm">';
    html += '<thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th><th></th></tr></thead><tbody>';

    let subtotal = 0;

    carrito.forEach(item => {
        const total = item.precio * item.cantidad;
        subtotal += total;
        html += `
            <tr>
                <td>
                    <div class="d-flex gap-2 align-items-center">
                        <img src="${item.imagen}" alt="${item.nombre}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <strong style="font-size: 0.9rem;">${item.nombre}</strong>
                        </div>
                    </div>
                </td>
                <td class="text-nowrap">$${item.precio.toLocaleString('es-CL')}</td>
                <td style="width: 100px;">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary btn-cambiar-cantidad" data-id="${item.id}" data-accion="decrementar">−</button>
                        <input type="text" class="form-control text-center" value="${item.cantidad}" readonly style="padding: 0.35rem;">
                        <button class="btn btn-outline-secondary btn-cambiar-cantidad" data-id="${item.id}" data-accion="incrementar">+</button>
                    </div>
                </td>
                <td class="text-nowrap"><strong>$${total.toLocaleString('es-CL')}</strong></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    contenedor.innerHTML = html;

    // Calcular totales
    const impuesto = Math.round(subtotal * 0.19);
    const total = subtotal + impuesto;

    subtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    impuestoEl.textContent = `$${impuesto.toLocaleString('es-CL')}`;
    totalCarrito.textContent = `$${total.toLocaleString('es-CL')}`;

    // Event listeners para cantidad
    document.querySelectorAll('.btn-cambiar-cantidad').forEach(btn => {
        btn.addEventListener('click', cambiarCantidad);
    });

    // Event listeners para eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarDelCarrito);
    });
}

// Cambiar cantidad
function cambiarCantidad(e) {
    const btn = e.target.closest('.btn-cambiar-cantidad');
    const id = parseInt(btn.getAttribute('data-id'));
    const accion = btn.getAttribute('data-accion');

    const item = carrito.find(item => item.id === id);
    if (!item) return;

    if (accion === 'incrementar') {
        item.cantidad++;
    } else if (accion === 'decrementar') {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            eliminarItemDelCarrito(id);
        }
    }

    actualizarCarrito();
}

// Eliminar del carrito
function eliminarDelCarrito(e) {
    const btn = e.target.closest('.btn-eliminar');
    const id = parseInt(btn.getAttribute('data-id'));
    eliminarItemDelCarrito(id);
}

function eliminarItemDelCarrito(id) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        mostrarNotificacion(`${item.nombre} eliminado del carrito`);
    }
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

// Vaciar carrito
document.addEventListener('DOMContentLoaded', () => {
    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                carrito = [];
                actualizarCarrito();
                mostrarNotificacion('Carrito vaciado');
            }
        });
    }

    // Botón comprar
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            const impuesto = Math.round(subtotal * 0.19);
            const total = subtotal + impuesto;
            alert(`¡Orden confirmada!\n\nSubtotal: $${subtotal.toLocaleString('es-CL')}\nImpuesto (19%): $${impuesto.toLocaleString('es-CL')}\nTotal: $${total.toLocaleString('es-CL')}\n\nGracias por tu compra en GameBoard.`);
            carrito = [];
            actualizarCarrito();
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
            if (modal) modal.hide();
        });
    }

    // Renderizar catálogo inicial
    renderizarCatalogo();

    // Manejo del formulario de contacto
    const formularioContacto = document.getElementById('formulario-contacto');
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor completa todos los campos obligatorios.');
                return;
            }

            alert(`¡Gracias ${nombre}!\n\nTu mensaje ha sido recibido.\nNos pondremos en contacto a ${email} en menos de 24 horas.`);
            formularioContacto.reset();
        });
    }
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle"></i> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Guardar carrito en localStorage
window.addEventListener('beforeunload', () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
});

// Cargar carrito desde localStorage
window.addEventListener('load', () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        } catch (e) {
            console.error('Error al cargar carrito:', e);
        }
    }
});

