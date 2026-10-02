# Verificación del rediseño

Revisión del 1 de octubre de 2026, sobre el sitio servido localmente.

## Iteración V4 — interacciones y claridad, revisión local

**Estado: todavía no publicada.** Las comprobaciones siguientes corresponden a la implementación local. La publicación previa de V3 en GitHub Pages no acredita la presencia de V4 en la URL pública.

### Comprobado en navegador

- Sitio principal en escritorio a 1440 px y aviso de privacidad a 390 px.
- La fotografía superpuesta de presentación corresponde al perfil personal de Alexa, confirmado por el usuario: `assets/alexa/b796915b4d08c4fb-800.webp`, procedente de `@alexalrb`. No se añade como obra a la galería de 22 imágenes.
- Seis FAQ nativas: apertura con Enter y cierre con Espacio. El enlace de navegación lleva a la sección de preguntas.
- Formulario, paso 1: servicio vacío bloquea el avance y recibe foco; una fecha pasada también bloquea y recibe foco. Los campos opcionales pueden quedar vacíos. El contador del mensaje reflejó 63 de 1200 caracteres en la prueba.
- Formulario, paso 2: nombre formado por espacios se rechaza; pulsar Enter sin consentimiento no prepara la consulta. Volver al paso anterior conserva los valores.
- La consulta preparada conserva correctamente «María José», acentos y ampersand; una fecha vacía se presenta como «Por definir». Con WhatsApp sin configurar, su enlace sigue oculto y sin `href`.
- «Copiar mensaje» muestra el estado de copia completada. «Editar mi idea» vacía la vista previa anterior y conserva el nombre para corregir la consulta.
- Los dos controles de movimiento sincronizan `aria-pressed="true"` al pausar. La cinta deja de animarse y los marcos mantienen su inclinación estática.
- No aparecieron errores en los registros del navegador observados durante estas comprobaciones. No se enviaron mensajes a Alexa ni a terceros.

### Comprobado con entorno simulado

Siete pruebas de `scripts/test-interactions.mjs` superadas en Node.js, con DOM, eventos y preferencias simulados: estructura de los dos pasos, sincronización del movimiento, validación del servicio y fecha, nombre y consentimiento, revisión de una fecha que pasa a estar vencida, edición y preselección de servicio, y copia con alternativa manual.

Estas pruebas verifican lógica y estados. **No equivalen a ejecutar un navegador ni a cambiar la preferencia de movimiento del sistema operativo.** La interfaz nativa de validación, foco visual y portapapeles deben contrastarse con las pruebas de navegador.

### Revisión móvil final de V4

- Sitio principal comprobado a 360, 390 y 768 px, sin desbordamiento horizontal. A 768 px no se detectaron imágenes rotas con un `src` real (se excluye el visor aún no abierto).
- Menú a 390 px: abre, navega a Preguntas y vuelve a cerrar. FAQ de precios abre correctamente en móvil. En escritorio se probaron Enter y Space sobre el acordeón.
- Tarjeta «Tengo una idea» preselecciona Editorial y estudio; Continuar abre el segundo paso y enfoca Nombre. El inicio del formulario queda a 97.8 px con la cabecera terminando en 78.8 px, sin tapar el indicador de pasos. Se eliminó la traslación de entrada del panel para evitar desajustes al navegar durante su animación.
- Filtro Editorial en móvil: 6 fotografías. Visor abierto, imagen completa con `object-fit: contain`, Escape cierra y devuelve el foco al botón de origen.
- Galería completa comprobada de nuevo: 12 → 21 → 22 y botón de ampliación oculto al terminar.
- El formulario permanece oculto hasta instalar sus manejadores. Una carga fallida de JavaScript no expone un formulario nativo que envíe los datos por GET. Sin JavaScript, la cinta tampoco queda animándose sin control de pausa; revisión de código, no una sesión de navegador con JavaScript deshabilitado.
- Capturas: `previews/v4-biografia-desktop.png`, `previews/v4-preguntas-desktop.png`, `previews/v4-formulario-desktop.png`, `previews/v4-formulario-movil.png`.

### Pendiente de publicación

La comprobación pública de esta iteración se registrará por separado en `PUBLICACION.md` después del despliegue.

### Datos y límites de esta iteración

El usuario confirmó a Alexa Lara como fotógrafa independiente y la identidad del perfil personal `@alexalrb`. El aviso de privacidad añadido es inicial: faltan correo de privacidad, domicilio para notificaciones y procedimiento formal de atención; no se presenta como aviso integral terminado.

La revisión de privacidad contrastó el artículo 15 de la [ley mexicana vigente publicada por la Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf) y la [declaración de privacidad de GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). No se certifica cumplimiento legal ni se inventaron plazos de conservación o datos de contacto. El aviso describe el código actual y requiere completar los datos pendientes con Alexa.

WhatsApp continúa sin número real configurado. No hay CRM, reserva automática ni almacenamiento de consultas por parte del código del sitio. La preparación es local y la persona decide compartir el mensaje por la plataforma externa. Se mantienen pendientes la revisión comercial final de los textos y las fotografías definitivas.

## Iteración visual V3 — editorial cinematográfica

- Portada oscura, tipografía de gran escala, composiciones de impresiones superpuestas, marcos de galería, collage biográfico, tarjetas fotográficas y campos del formulario rediseñados.
- Inspección en navegador a 1440, 768, 390 y 360 px. El ancho del documento no supera el de la ventana. Los elementos decorativos que salen de su contenedor no producen desplazamiento horizontal de la página.
- Filtro Editorial: 6 fotos; visor avanza de 1/6 a 2/6; Escape cierra y devuelve el foco a «Ampliar Luz y color».
- Galería completa: 12 → 21 → 22 fotografías, con botón de ampliación oculto al terminar.
- Menú móvil abre y cierra al navegar. Formulario con nombre ficticio prepara el mensaje; WhatsApp permanece oculto sin número real. No se enviaron consultas.
- Botón de pausa: elimina animaciones y desplazamiento parallax, conservando las inclinaciones estáticas de los marcos.
- Se conserva el catálogo, el SEO y el contacto; no se añadieron fotografías externas ni dependencias. Se ajustó `sizes` al nuevo margen interior de las fotografías.
- Capturas de esta iteración: `previews/v3-portada-desktop.png`, `previews/v3-portada-movil.png`, `previews/v3-galeria-desktop.png` y `previews/v3-contacto-desktop.png`.
- Esta revisión visual se realizó inicialmente en local. El despliegue en GitHub Pages y su comprobación remota se registran por separado.

## Fuente de fotografías

Acceso comprobado al perfil de Instagram y a las imágenes renderizadas de su cuadrícula: nombre «Alexa Lara Fotógrafa», 28 publicaciones y ubicación Ensenada–La Paz. Se guardaron copias locales de 24 imágenes de ese perfil, incluidas colaboraciones visibles. 22 integran la galería, una es el retrato de perfil y una tarjeta informativa se excluye. Véase [trazabilidad](ASSETS-INSTAGRAM.md).

## Pruebas de la versión anterior

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

El WhatsApp real y el dominio propio siguen pendientes. No se probó un envío real por WhatsApp ni se activó un backend. La versión anterior se publicó en GitHub Pages; véase el [registro de publicación](PUBLICACION.md). Eso no confirma la publicación de V4, cuyo estado local figura al comienzo de este documento. La activación automática del ajuste de movimiento del sistema se revisó en código y en un entorno simulado; los controles manuales sí se probaron en navegador.

Las comprobaciones visuales se realizaron con el navegador integrado. La herramienta de navegador independiente no pudo iniciar su motor instalado, por lo que se utilizó el navegador disponible sin alterar sus protecciones.

Los textos de presentación y servicios son editables y deben recibir la revisión final de Alexa junto con las fotografías definitivas.
