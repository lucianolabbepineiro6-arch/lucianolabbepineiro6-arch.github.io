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
    },
    
];

// Carrito de compras: array de objetos que representan cada artículo seleccionado.
let carrito = [];

// Utilidades de seguridad
const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sanitizeInput = (value) => escapeHtml(value.trim());

function setValidationState(input, isValid, message) {
    input.classList.toggle('is-invalid', !isValid);
    input.classList.toggle('is-valid', isValid);
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message || feedback.dataset.defaultMessage || feedback.textContent;
    }
}

function resetFormValidation(form) {
    form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
    const summary = form.querySelector('#form-error-summary');
    if (summary) {
        summary.classList.add('visually-hidden');
        summary.textContent = '';
    }
}

function showFormSummary(form, message, isError = true) {
    const summary = form.querySelector('#form-error-summary');
    if (!summary) return;
    summary.textContent = message;
    summary.classList.toggle('alert-danger', isError);
    summary.classList.toggle('alert-success', !isError);
    summary.classList.remove('visually-hidden');
}

// Función para renderizar catálogo
function renderizarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    juegos.forEach(juego => {
        const safeNombre = escapeHtml(juego.nombre);
        const safeDescripcion = escapeHtml(juego.descripcion);
        const divJuego = document.createElement('div');
        divJuego.className = 'col-6 col-md-4 col-lg-3 mb-4';
        divJuego.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${escapeHtml(juego.imagen)}" alt="${safeNombre}">
                </div>
                <div class="product-body">
                    <h6 class="product-title">${safeNombre}</h6>
                    <p class="product-description">${safeDescripcion}</p>
                    <div class="product-rating">
                        <i class="bi bi-star-fill text-warning"></i>
                        <span>${juego.rating}</span>
                        <span class="text-muted">(${Math.floor(Math.random() * 150) + 10} reseñas)</span>
                    </div>
                    <div class="product-price">$${juego.precio.toLocaleString('es-CL')}</div>
                    <button class="btn-add-to-cart btn-agregar" 
                            data-id="${juego.id}" 
                            data-nombre="${safeNombre}" 
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

    const producto = juegos.find(j => j.id === id);
    if (!producto) {
        alert('Producto no encontrado. Intenta nuevamente.');
        return;
    }

    const itemExistente = carrito.find(item => item.id === id);
    const stockDisponible = producto.stock;

    if (itemExistente) {
        if (itemExistente.cantidad >= stockDisponible) {
            alert(`No puedes agregar más unidades de ${nombre}. Solo hay ${stockDisponible} disponibles.`);
            return;
        }
        itemExistente.cantidad++;
    } else {
        if (stockDisponible <= 0) {
            alert(`El producto ${nombre} está agotado.`);
            return;
        }
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: producto.imagen
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
    const envioEl = document.getElementById('envio');
    
    const COSTO_ENVIO = 4990;
    const ENVIO_GRATIS_DESDE = 100000;

    // Actualizar badge
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag-check fs-1 text-muted mb-3"></i>
                <p class="text-muted">Tu carrito está vacío</p>
                <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Continuar Comprando</button>
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

    const carritoHTML = carrito.map(item => {
        const safeNombre = escapeHtml(item.nombre);
        const total = item.precio * item.cantidad;
        return `
            <tr>
                <td>
                    <div class="d-flex gap-2 align-items-center">
                        <img src="${escapeHtml(item.imagen)}" alt="${safeNombre}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <strong style="font-size: 0.9rem;">${safeNombre}</strong>
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
    }).join('');

    html += carritoHTML;
    html += '</tbody></table></div>';

    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    contenedor.innerHTML = html;

    // Calcular totales
    const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    const impuesto = Math.round(subtotal * 0.19);
    const total = subtotal + envio + impuesto;

    subtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    envioEl.textContent = envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-CL')}`;
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

    const producto = juegos.find(j => j.id === id);
    const stockDisponible = producto ? producto.stock : null;

    if (accion === 'incrementar') {
        if (stockDisponible !== null && item.cantidad >= stockDisponible) {
            alert(`No puedes aumentar más de ${stockDisponible} unidades de ${item.nombre}.`);
            return;
        }
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
            const COSTO_ENVIO = 4990;
            const ENVIO_GRATIS_DESDE = 100000;
            const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
            const impuesto = Math.round(subtotal * 0.19);
            const total = subtotal + envio + impuesto;
            alert(`¡Orden confirmada!\n\nSubtotal: $${subtotal.toLocaleString('es-CL')}\nEnvío: ${envio === 0 ? 'Gratis' : '$' + envio.toLocaleString('es-CL')}\nImpuesto (19%): $${impuesto.toLocaleString('es-CL')}\nTotal: $${total.toLocaleString('es-CL')}\n\nGracias por tu compra en GameBoard.`);
            console.log('Compra realizada:', {
                subtotal: subtotal,
                envio: envio,
                impuesto: impuesto,
                total: total,
                items: carrito.map(item => ({ id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad }))
            });
            carrito = [];
            actualizarCarrito();
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
            if (modal) modal.hide();
        });
    }

    // Renderizar catálogo inicial
    try {
        renderizarCatalogo();
    } catch (error) {
        console.error('Error al renderizar catálogo:', error);
    }

    // Manejo del formulario de contacto
    const formularioContacto = document.getElementById('formulario-contacto');
    if (formularioContacto) {
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const mensajeInput = document.getElementById('mensaje');

        [nombreInput, emailInput, telefonoInput, mensajeInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    setValidationState(input, true);
                }
                const summary = formularioContacto.querySelector('#form-error-summary');
                if (summary) {
                    summary.classList.add('visually-hidden');
                    summary.textContent = '';
                }
            });
        });

        formularioContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            resetFormValidation(formularioContacto);

            const nombre = sanitizeInput(nombreInput.value);
            const email = sanitizeInput(emailInput.value);
            const telefono = sanitizeInput(telefonoInput.value);
            const mensaje = sanitizeInput(mensajeInput.value);
            const errors = [];

            if (!nombre || nombre.length < 3 || nombre.length > 50 || !/^[A-Za-zÀ-ÿ\s]+$/.test(nombre)) {
                setValidationState(nombreInput, false, 'El nombre debe tener entre 3 y 50 caracteres y solo letras.');
                errors.push('nombre');
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email) || email.length > 100) {
                setValidationState(emailInput, false, 'Ingresa un correo electrónico válido.');
                errors.push('email');
            }

            const telefonoPattern = /^\+?(56\s?)?9\s?\d{4}\s?\d{4}$/;
            if (!telefono || !telefonoPattern.test(telefono) || telefono.length < 9 || telefono.length > 15) {
                setValidationState(telefonoInput, false, 'Ingresa un teléfono chileno válido, por ejemplo +56 9 1234 5678.');
                errors.push('telefono');
            }

            if (!mensaje || mensaje.length < 10 || mensaje.length > 500) {
                setValidationState(mensajeInput, false, 'El mensaje debe tener entre 10 y 500 caracteres.');
                errors.push('mensaje');
            }

            if (errors.length > 0) {
                showFormSummary(formularioContacto, 'Por favor corrige los campos marcados antes de enviar.');
                return;
            }

            try {
                alert('Tu mensaje fue enviado con éxito. Te responderemos a la brevedad.');
                console.log('Formulario de contacto enviado:', {
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    mensaje: mensaje
                });
                mostrarNotificacion(`¡Gracias ${nombre}! Tu mensaje ha sido recibido.`);
                formularioContacto.reset();
                resetFormValidation(formularioContacto);
            } catch (error) {
                console.error('Error al procesar el formulario de contacto:', error);
                showFormSummary(formularioContacto, 'Ocurrió un error inesperado. Intenta nuevamente más tarde.');
            }
        });
    }
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '9999';

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show';
    alerta.role = 'alert';

    const icono = document.createElement('i');
    icono.className = 'bi bi-check-circle';
    alerta.appendChild(icono);

    alerta.appendChild(document.createTextNode(' ' + mensaje));

    const botonCerrar = document.createElement('button');
    botonCerrar.type = 'button';
    botonCerrar.className = 'btn-close';
    botonCerrar.setAttribute('data-bs-dismiss', 'alert');
    botonCerrar.setAttribute('aria-label', 'Close');
    alerta.appendChild(botonCerrar);

    toast.appendChild(alerta);
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

