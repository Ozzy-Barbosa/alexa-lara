# Prompt V5 — identidad de estudio fotográfico contemporáneo

Aplica esta dirección al sitio de **Alexa Lara Fotografía**. Sustituye la dirección visual de V3 y conserva las funciones y los criterios de contenido de V4. El objetivo es que Alexa tenga una identidad propia reconocible, con la fotografía como lenguaje principal y una experiencia de consulta sencilla.

## Punto de partida y diferenciación

La revisión del sitio de referencia `https://ozzy-barbosa.github.io/ampersonalizados/` identificó varios recursos compartidos con la versión anterior de Alexa. Usa esta comparación para transformar el sistema completo:

| Recurso compartido en la dirección anterior | Dirección propia para Alexa V5 |
| --- | --- |
| Verde oscuro, marfil y oro | Negro carbón, blanco frío, grises plata y salvia fría discreta |
| Titulares Cormorant con cursivas recurrentes | DM Sans grande, compacta y de trazos claros |
| Texto a la izquierda y tres impresiones inclinadas a la derecha | Escena fotográfica dominante a sangre con selector manual |
| Órbitas, estrellas, sellos y secciones numeradas | Retícula ortogonal, separadores, metadatos fotográficos y espacio negativo |
| Collage decorativo de polaroids | Díptico de retratos y hoja de contacto contemporánea |

No basta recolorear la composición existente. Cambia la estructura de la portada, el sistema tipográfico, la relación imagen/texto y el ritmo de secciones. La comparación es una instrucción de diseño interna: no debe aparecer en el sitio público.

## Identidad visual

Trabaja con carbón `#111314`, blanco frío `#F2F3EF`, gris plata `#E3E7E3` y salvia fría `#C4DCD0` para estados y pequeños acentos. Usa `#385E53` como variante oscura para estados que requieran contraste sobre fondos claros. Comprueba el contraste en cada combinación utilizada. Evita superficies verdes dominantes, marfil amarillento y efectos dorados.

Usa **DM Sans** como voz principal: titulares grandes de líneas compactas, pesos definidos, interlineado cercano y espaciado ligeramente ajustado sin comprometer la lectura. Conserva texto normal cómodo, etiquetas pequeñas legibles y jerarquía consistente. Retira el patrón de una palabra en cursiva en cada titular. No emplees logotipos caligráficos, sellos florales, estrellas decorativas, órbitas ni marcos de polaroid.

La profundidad nace de la escala fotográfica y la composición, con imágenes a sangre dentro de sus áreas, bordes rectos y alineaciones precisas. Respeta color, firma y composición originales. Los márgenes que ya forman parte de una fotografía se conservan; no son una excusa para añadir marcos decorativos a toda la colección.

## Portada con tres escenas

Diseña una portada fotográfica inmersiva dominada por una imagen real del catálogo y un titular sans breve. Incluye un selector **manual de tres escenas** representativas: Exteriores, Editorial y Retratos, ajustadas a las imágenes disponibles. Usa etiquetas descriptivas y un estado activo visible, no solo puntos anónimos.

Cada control debe funcionar con teclado y tener nombre accesible y estado inequívoco, mediante botones con `aria-pressed` o un patrón de pestañas completo. La selección cambia únicamente la escena y su leyenda; no mueve el foco, el scroll ni las acciones principales. No hay reproducción automática.

Respeta rostros y sujetos en escritorio y móvil: sitúa el texto en espacio negativo o en una franja propia. Puedes usar un degradado controlado para reforzar la legibilidad, conservando visible la fotografía y dejando el rostro libre de texto. Ajusta su intensidad y dirección a cada encuadre. Prepara una escena inicial completa sin JavaScript y carga con prioridad solo la imagen principal; evita descargar variantes grandes innecesarias de las otras escenas.

## Galería y recorrido

**Portafolio:** fondo oscuro y composición de hoja de contacto. Fotografías alineadas con intervalos regulares, variación controlada de tamaños y captions con categoría y título existente. La numeración puede servir para recorrer fotografías, explicar pasos del proceso o distinguir preguntas frecuentes; elimina los números decorativos de las etiquetas de sección. Conserva las 22 obras reales, filtros, carga progresiva, contador y visor accesible. No agregues copias para llenar huecos.

**Alexa:** díptico ortogonal, sin inclinaciones ni superposiciones, con los dos retratos confirmados: el profesional `assets/instagram/6c7e0558e37a9d13-800.webp` y el personal `assets/alexa/b796915b4d08c4fb-800.webp`. Acompáñalos con una presentación breve. Las demás personas del portafolio no deben identificarse como Alexa.

**Sesiones:** tríptico fotográfico con una imagen protagonista por experiencia, texto conciso y acción clara. Mantén la preselección de servicio en el formulario. En móvil convierte el tríptico en una secuencia vertical cómoda, no en tres tarjetas estrechas ni un desplazamiento horizontal obligatorio.

**Preguntas y contacto:** integra las seis FAQ existentes, el formulario de dos pasos y el aviso de privacidad con el nuevo lenguaje. Mantén fecha e idea opcionales, validación por paso, valores al volver, revisión, corrección y copia. No inventes WhatsApp, correo, tarifas, tiempos, disponibilidad o políticas. La consulta prepara un mensaje y no crea una reserva ni un registro en CRM.

## Movimiento y comportamiento

Usa microanimaciones finitas: revelados breves, cambio de escena suave y respuestas discretas de controles. Evita cintas continuas, desplazamiento secuestrado y parallax ornamental. Conserva la pausa manual y `prefers-reduced-motion`, incluyendo cambios del sistema con la página abierta. Al pausar, los controles siguen funcionando y el contenido permanece visible; la escena seleccionada puede cambiar inmediatamente.

## Aceptación y publicación

- La portada, galería y presentación deben diferenciarse estructuralmente de la referencia: sin polaroids, cursivas recurrentes, estrellas ni predominio verde y oro.
- Comprueba 1440, 768, 390 y 360 px: imágenes bien encuadradas, titulares legibles, ningún desbordamiento y controles táctiles accesibles.
- Verifica las tres escenas con teclado y puntero, selección manual, pausa y reducción de movimiento. Ningún cambio desplaza el foco o modifica la consulta.
- Repite las comprobaciones de galería, visor, FAQ, formulario y aviso. Conserva SEO, rutas locales, dimensiones de imagen, procedencia y alternativas sin JavaScript.
- Revisa capturas de escritorio y móvil y ejecuta las comprobaciones disponibles. Distingue resultados de navegador de pruebas simuladas y documenta cualquier límite.
- Publica únicamente archivos comprobados dentro del flujo ya autorizado por el usuario. Confirma el despliegue y abre la URL pública antes de declarar V5 publicada; un commit o push no demuestra que el sitio nuevo esté visible. Mantén documentados los datos de contacto y privacidad todavía pendientes.

Entrega una implementación estática coherente y su evidencia visual. Este prompt define el encargo; no constituye evidencia de que las pruebas o la publicación ya se hayan realizado.
