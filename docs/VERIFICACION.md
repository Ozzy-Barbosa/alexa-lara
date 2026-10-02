# Verificación del rediseño

Revisión del 1 de octubre de 2026, sobre el sitio servido localmente.

## Fuente de fotografías

Acceso comprobado al perfil de Instagram y a las imágenes renderizadas de su cuadrícula: nombre «Alexa Lara Fotógrafa», 28 publicaciones y ubicación Ensenada–La Paz. Se guardaron copias locales de 24 imágenes de ese perfil, incluidas colaboraciones visibles. 22 integran la galería, una es el retrato de perfil y una tarjeta informativa se excluye. Véase [trazabilidad](ASSETS-INSTAGRAM.md).

## Pruebas realizadas

- `npm run check`: sintaxis JavaScript, catálogo de 22 fotos únicas, 44 rutas de imágenes válidas, identificadores HTML sin duplicados, anclas, recursos locales, un H1 y JSON-LD válido.
- Navegador en escritorio y anchuras de 390 y 360 px: diseño visible y sin desbordamiento horizontal.
- Galería: 12 de 22 al iniciar, 21 después de una ampliación y 22 al completar; el botón se oculta cuando no quedan fotos.
- Filtro Editorial: 6 fotos, visor 1/6; siguiente cambia título y contador a 2/6.
- Filtro Familia en móvil: 6 fotos.
- Visor: imagen cargada, controles móviles visibles, Escape cierra y restituye el foco al botón de la fotografía.
- Menú móvil: cambia `aria-expanded`, retira/restaura `inert` y cierra al elegir sección.
- Regreso al inicio: el logotipo apunta a un ancla independiente de la cabecera fija; se comprobó que devuelve el desplazamiento a cero.
- Tarjeta de sesión: preselecciona el servicio en el formulario.
- Formulario local con datos ficticios: genera la consulta con nombre, servicio, lugar y mensaje; conserva acentos y “&”. No se enviaron mensajes a ninguna persona.
- WhatsApp sin configurar: el enlace permanece oculto; se ofrece copiar el mensaje y abrir el Instagram confirmado.
- Control “Pausar movimiento”: cambia al estado reducido. También se revisó el tratamiento CSS y JavaScript de `prefers-reduced-motion`.
- Sin errores en los registros del navegador observados; sin imágenes rotas detectadas en la página.
- Revisión sin JavaScript del código: navegación alternativa, galería de respaldo y contacto directo. El formulario queda oculto para impedir un envío GET accidental.
- Configuración de dominio probada dos veces en una copia aislada: genera canonical y Open Graph sin duplicados, sitemap y robots coherentes para una URL HTTPS con subcarpeta. No modifica el dominio pendiente del proyecto real.
- Ruta inexistente en el servidor local: respuesta HTTP 404 y página de error propia.

## Límites

El WhatsApp real y el dominio siguen pendientes. No se probó un envío real por WhatsApp, no se activó un backend ni se desplegó el hosting. La activación automática del ajuste de movimiento del sistema se revisó en código; el botón manual sí se probó en navegador.

Las comprobaciones visuales se realizaron con el navegador integrado. La herramienta de navegador independiente no pudo iniciar su motor instalado, por lo que se utilizó el navegador disponible sin alterar sus protecciones.

Los textos de presentación y servicios son editables y deben recibir la revisión final de Alexa junto con las fotografías definitivas.
