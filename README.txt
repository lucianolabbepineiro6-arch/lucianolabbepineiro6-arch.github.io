GAMEBOARD - TIENDA DE JUEGOS DE MESA
====================================

DESCRIPCIÓN
-----------
Tienda online de juegos de mesa con HTML5, CSS3 (Bootstrap) y JavaScript.
Incluye: catálogo dinámico, carrito persistente en localStorage, validación 
segura y cálculo automático de totales.

Tecnologías: HTML5, CSS3, Bootstrap 5.3.8, JavaScript ES6, LocalStorage API


PROMPTS IA - CRITERIO 2.1.2 (Seguridad)
========================================

PROMPT #1: Validación de Formularios
"¿Cómo validar un formulario en JavaScript? Necesito validar: nombre (3-50 chars, 
solo letras), email (válido), teléfono (formato chileno), mensaje (10-500 chars)."

RESPUESTA: Validación multinivel (HTML5 + JS + regex)
- HTML5 nativo: required, minlength, maxlength, pattern, type
- JavaScript: validación con regex y lógica personalizada
- Retroalimentación visual: clases CSS is-valid/is-invalid (Bootstrap)
- Mensajes contextuales por campo

POR QUÉ SE ADOPTÓ: Es crítico entender que validación no es feature, es
RESPONSABILIDAD del desarrollador. La combinación HTML5+JS garantiza defensa
en capas. En producción, el servidor TAMBIÉN valida (defensa en profundidad).


PROMPT #2: Prevención XSS
"¿Cómo prevenir inyección XSS en innerHTML? ¿Sanitizar o textContent?"

RESPUESTA: Función escapeHtml()
const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Uso:
const safeNombre = escapeHtml(juego.nombre);
divJuego.innerHTML = `<h6>${safeNombre}</h6>`;

POR QUÉ SE ADOPTÓ: La función es simple (5 .replace()) pero PODEROSA. Implementa
"defensa por desconfianza": datos de usuario = amenaza potencial. Es el patrón
estándar en React, Angular, Vue. Ubicación: js/main.js líneas 64-72.


PROMPT #3: Manejo de Errores
"¿Debería usar try...catch? ¿En qué situaciones? ¿Cómo estructurar?"

RESPUESTA: try...catch en operaciones que PUEDEN fallar
- Parsing JSON desde localStorage
- Acceso al DOM
- Operaciones con datos externos

POR QUÉ SE ADOPTÓ: Código "pesimista" (esperar que falle) > código "optimista".
En producción ALGO SIEMPRE falla. Console.error() es aliado para diagnosticar.
Ubicación: js/main.js líneas 475-485.


PROMPTS IA - CRITERIO 2.1.3 (Eficiencia Estructuras de Datos)
==============================================================

PROMPT #4: Estructura de Catálogo
"¿Cómo estructurar 6 juegos? ¿Array de objetos, objeto con IDs, o clase?
¿Cuál es más eficiente? ¿Cuál escala mejor?"

RESPUESTA: Array de objetos
const juegos = [
    {
        id: 1,
        nombre: "Catan",
        precio: 35000,
        imagen: "imagenes/catan.webp",
        stock: 12
    }
];

VENTAJAS: .forEach(), .find() O(n), .reduce(), JSON-compatible, escala hasta 10k+.

POR QUÉ SE ADOPTÓ: Elegimos estructuras según CÓMO LAS USAMOS. Métodos
funcionales (map, filter, find) son herramientas poderosas.
Ubicación: js/main.js líneas 3-59.


PROMPT #5: Estructura de Carrito
"¿Cómo estructurar carrito? ¿Guardar solo ID o clonar datos?
¿Cómo calcular totales eficientemente?"

RESPUESTA: Array de objetos con datos clonados + .reduce()
const subtotal = carrito.reduce((sum, item) => 
    sum + (item.precio * item.cantidad), 0);

POR QUÉ .reduce(): Recorre UNA VEZ, es declarativo, no modifica el array,
es programación funcional (tendencia actual).

POR QUÉ CLONAR DATOS: Si precio cambia después, el usuario paga por lo que VIO
(snapshot de estado). Ubicación: js/main.js línea 252.


PROMPT #6: Persistencia de Datos
"¿Guardar carrito en localStorage? ¿Cifrar datos? ¿Riesgos?"

RESPUESTA: localStorage sin cifrado (JSON.stringify/parse + try...catch)

¿POR QUÉ NO CIFRAR?
- localStorage ya protegido por Same-Origin Policy
- Si atacante accede a localStorage, probablemente tiene navegador entero
- Cifrado NO lo salvaría

POR QUÉ SE ADOPTÓ: Seguridad NO es "cifrar todo". Es entender DÓNDE están
datos y QUÉ los amenaza. localStorage = datos no-sensibles. Tokens/contraseñas
van en HTTP-only cookies. Ubicación: js/main.js líneas 475-485.


ESTRUCTURA ARCHIVOS
===================
PAG_LIMPIA/
├── index.html           (estructura)
├── README.txt          (este archivo)
├── css/
│   └── styles.css      (estilos personalizados)
├── js/
│   └── main.js         (lógica JavaScript)
└── imagenes/           (6 juegos)


CRITERIOS CUMPLIDOS
====================
✓ 2.1.2 SEGURIDAD: Validación multinivel, escapeHtml (XSS), try...catch
✓ 2.1.3 EFICIENCIA: Array de objetos, .reduce(), .find(), O(n)


EJECUCIÓN
=========
1. Descargar proyecto
2. Abrir index.html en navegador moderno
3. Sin servidor/instalación requerida
4. Funciona offline (Bootstrap CDN cacheado)


REFERENCIAS EVALUACIÓN
======================
- Validación: js/main.js líneas 385-434
- XSS Prevention: js/main.js líneas 64-72
- Error Handling: js/main.js líneas 475-485
- Estructuras Datos: js/main.js líneas 3-59
- Cálculos eficientes: js/main.js línea 252

PRUEBA: Intenta inyectar código en inputs. Nada se ejecutará (escapeHtml protege).

Junio 2026
