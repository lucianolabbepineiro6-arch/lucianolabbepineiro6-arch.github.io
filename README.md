# GameBoard - Tienda de Juegos de Mesa

Una tienda online moderna y responsiva para vender juegos de mesa, construida con **Bootstrap 5** y JavaScript vanilla.

## 🎮 Características

✅ **Diseño 100% Responsivo** - Se adapta perfectamente a dispositivos móviles, tablets y escritorio
✅ **Catálogo Dinámico** - 6 juegos de mesa con descripción, precio y rating
✅ **Carrito de Compras Funcional** - Agregar, eliminar, modificar cantidad
✅ **LocalStorage** - El carrito se guarda automáticamente en el navegador
✅ **Formulario de Contacto** - Para consultas de clientes
✅ **Interfaz Intuitiva** - Navegación fluida y notificaciones visuales
✅ **Íconos Bootstrap Icons** - Interfaz moderna y profesional

## 📁 Estructura del Proyecto

```
demo front End/
├── index.html          # Página principal
├── js/
│   └── main.js        # Lógica del carrito y catálogo
├── css/
│   └── styles.css     # Estilos personalizados
├── imagenes/          # Carpeta de imágenes
├── README.md          # Este archivo
```

## 🚀 Cómo Usar

1. **Abrir el Sitio**
   - Abre el archivo `index.html` en tu navegador web

2. **Explorar el Catálogo**
   - Desplázate a la sección "CATÁLOGO"
   - Verás 6 juegos de mesa diferentes

3. **Agregar al Carrito**
   - Haz clic en "Agregar" en cualquier juego
   - El contador en la navegación se actualizará

4. **Gestionar el Carrito**
   - Ve a la sección "CARRITO"
   - Aumenta/disminuye cantidades
   - Elimina productos con el botón de basura
   - Vacía todo el carrito si lo deseas

5. **Comprar**
   - Haz clic en "Proceder a Comprar"
   - Confirma tu pedido

6. **Contactar**
   - Completa el formulario en la sección "CONTACTO"
   - Recibirás una confirmación

## 🛠️ Personalización

### Agregar Nuevos Juegos

Edita el array `juegos` en `js/main.js`:

```javascript
{
    id: 7,
    nombre: "Tu Juego Aquí",
    precio: 35000,
    descripcion: "Descripción del juego",
    imagen: "imagenes/tu-imagen.jpeg",
    rating: 4.5
}
```

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #0d6efd;  /* Color principal */
    --secondary-color: #6c757d;
    --success-color: #198754;
    /* ... */
}
```

### Actualizar Información de Contacto

En `index.html`, busca la sección "Contacto" (línea ~170) y actualiza:
- Dirección
- Teléfono
- Email

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Tablets y teléfonos móviles
- ✅ Resoluciones desde 320px hasta 4K

## 💡 Funcionalidades JavaScript

### Carrito
- Agregar/quitar productos
- Modificar cantidades
- Calcular totales automáticamente
- Guardar en localStorage

### Notificaciones
- Confirmación al agregar productos
- Validación de formularios
- Mensajes de éxito

### Validaciones
- Campo requerido en formulario de contacto
- Cantidad mínima de 1 producto

## 🎨 Tecnologías Usadas

- **Bootstrap 5.3.8** - Framework CSS responsivo
- **Bootstrap Icons** - Iconografía moderna
- **JavaScript ES6** - Lógica interactiva
- **CSS3** - Animaciones y estilos personalizados
- **LocalStorage API** - Persistencia de datos

## 📝 Notas

- Las imágenes deben estar en la carpeta `imagenes/`
- El carrito se guarda automáticamente en el navegador
- Los datos se limpian cuando cierras la sesión (opcional)
- El formulario de contacto es solo visual (no envía emails)

## 🔧 Mejoras Futuras

- Implementar backend con Node.js/Express
- Integrar pasarela de pagos (PayPal, Stripe)
- Sistema de usuarios y login
- Búsqueda y filtros avanzados
- Reseñas y comentarios
- Integración con base de datos

---

**Hecho con ❤️ para tu tienda de juegos de mesa**
