# Publicación en GitHub Pages

Fecha: 1 de octubre de 2026.

## Actualización V5 — identidad fotográfica propia

- Código verificado: `44fde4db0eb784703863e943a253dcdbce69a3ee`.
- [Despliegue de V5](https://github.com/Ozzy-Barbosa/alexa-lara/actions/runs/36960320500): compilación y publicación `success` (2 de octubre de 2026, 03:28 UTC; 1 de octubre local).
- URL pública: [Alexa Lara Fotografía](https://ozzy-barbosa.github.io/alexa-lara/).
- Diez archivos de texto HTTP 200 y coincidentes con local, normalizando solo finales de línea: HTML, CSS, JavaScript, catálogo, privacidad, manifiesto, favicon, sitemap, robots y 404.
- Tres fotografías de portada en su variante grande y el retrato personal de Alexa en variante 800 respondieron HTTP 200 y coincidieron por SHA-256. El catálogo completo de 22 obras se conservó sin cambios.
- Navegador público a 1440 px: portada V5, tipografía DM Sans y fondo carbón `rgb(17,19,20)` confirmados visualmente. Captura local de producción: `.verification/pages-v5-portada.png`.
- Navegador público a 390 px: escena Editorial activada con Enter; menú abre y cierra; filtro Editorial muestra 6 fotografías; visor abre y Escape cierra. Sin desbordamiento horizontal.
- Formulario público probado con datos ficticios hasta la vista previa: servicio Retrato personal, fecha por definir y ubicación por sugerir. No se enviaron mensajes ni se creó ninguna reserva. Sin errores de consola ni imágenes cargadas con `src` real rotas observadas.
- La vista final vuelve a la portada sin datos de prueba; las funciones y pruebas locales de V5 constan en `VERIFICACION.md`.

El teléfono oficial de WhatsApp y los datos pendientes del aviso inicial siguen pendientes del cliente. Esta iteración no altera condiciones comerciales ni añade almacenamiento de consultas.

## Actualización V4 — identidad, consultas y movimiento

- Código verificado: `81f97ab4214ea90b1322dac9ec245c336d212a60`.
- [Despliegue de V4](https://github.com/Ozzy-Barbosa/alexa-lara/actions/runs/36957576391): `success`, incluidas compilación y publicación.
- URL pública: [Alexa Lara Fotografía](https://ozzy-barbosa.github.io/alexa-lara/).
- Se compararon nueve archivos de texto remotos con la copia local, normalizando únicamente finales de línea: HTML principal, CSS, JavaScript, catálogo, privacidad, manifiesto, sitemap, robots y 404. Todos HTTP 200 y coincidentes.
- Las dos variantes de la nueva foto de `@alexalrb` coincidieron byte a byte mediante SHA-256 y respondieron HTTP 200. Se conserva el catálogo anterior sin modificaciones.
- Navegador público a 1440 px: retrato personal nuevo visible en la biografía, cinta con animación `ribbon-travel`, FAQ desplegable, ningún desbordamiento horizontal y ninguna imagen con `src` real rota observada.
- Navegador público a 390 px: menú abre/cierra, formulario pasa por selección → nombre/consentimiento → mensaje preparado con datos ficticios. WhatsApp permanece oculto al no existir número confirmado. No se enviaron consultas a Alexa. Sin errores de consola observados.
- El enlace público al aviso abre correctamente `privacidad.html`, tiene canonical propio y no desborda en móvil. Declara expresamente los datos legales pendientes. Es una versión inicial, no un aviso integral validado.
- La página se dejó en su URL normal, sin datos de la prueba ni ajuste temporal de tamaño.

Las pruebas reproducibles de lógica y la revisión local completa figuran en [VERIFICACION.md](VERIFICACION.md). El ajuste real de movimiento del sistema operativo no se cambió: se verificó su lógica con simulación; la pausa manual sí se probó en navegador. Fotografías finales, teléfono de WhatsApp, correo y domicilio para privacidad siguen pendientes del cliente.

## Publicación anterior V3 (registro histórico)

- Sitio público: https://ozzy-barbosa.github.io/alexa-lara/
- Repositorio: https://github.com/Ozzy-Barbosa/alexa-lara
- Fuente: rama `main`, carpeta raíz `/`, HTTPS obligatorio, sin dominio propio configurado.
- Versión de código verificada: `5fad0155841ccfa817a8d9772a59b319e25af00b`.
- Despliegue confirmado como `success`: https://github.com/Ozzy-Barbosa/alexa-lara/actions/runs/36954043791
- El registro de compilación de Pages informó `built` para ese mismo commit, sin error.

## Comprobación de la publicación

Se descargaron desde la URL pública y compararon con los archivos locales: `index.html`, `styles.css`, `script.js`, `data.js`, `site.webmanifest`, `sitemap.xml`, `robots.txt` y `404.html`. Todos respondieron HTTP 200 y coincidieron, normalizando únicamente finales de línea.

Las 44 variantes WebP de las 22 fotografías publicadas respondieron HTTP 200 y coincidieron byte a byte mediante SHA-256. Una ruta inexistente respondió HTTP 404 con la página propia y el enlace de regreso dentro de `/alexa-lara/`.

La página pública se inspeccionó visualmente en escritorio (1440 px) y móvil (390 px). La portada mostró el rediseño V3, sin desbordamiento horizontal ni imágenes rotas observadas. El filtro Editorial mostró 6 fotografías y abrió el visor; Escape lo cerró. El menú móvil abrió, permitió navegar a sesiones y volvió a cerrarse. No se observaron errores de consola.

Canonical y Open Graph apuntan a la dirección pública de Pages. El sitemap contiene esa URL. En una publicación bajo subcarpeta, los buscadores consultan `robots.txt` en la raíz del dominio, no en la raíz de este proyecto; el sitemap se puede entregar directamente a Search Console cuando se configure la propiedad.

## Pendientes comerciales

Confirmar WhatsApp oficial, textos, selección definitiva de fotografías y, si se desea, dominio propio. No se enviaron mensajes reales ni se probaron reservas. La consulta sigue preparando un mensaje que el visitante debe enviar por el canal disponible.

Este registro documenta la verificación de esa versión; los cambios posteriores deben volver a comprobarse.
