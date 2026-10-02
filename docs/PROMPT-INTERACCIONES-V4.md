# Prompt V4 — consultas, claridad y movimiento

Aplica estas mejoras al sitio de Alexa Lara preservando la dirección editorial cinematográfica de `PROMPT-ESTILO-EDITORIAL-V3.md`, las 22 fotografías verificadas, el catálogo, la galería, sus filtros, el visor y el SEO. Mejora la experiencia dentro del sistema visual existente. No añadas dependencias ni datos comerciales inventados.

## Formulario en dos pasos

Divide la consulta en «Tu idea» y «Tu mensaje». Muestra el progreso con texto y un indicador accesible. El primer paso recoge tipo de sesión, lugar, fecha opcional y mensaje opcional; el segundo recoge nombre, lectura del aviso de privacidad y consentimiento para preparar la consulta. Permite regresar sin perder valores.

Valida los campos del paso activo antes de continuar. Al preparar el mensaje, valida todos los campos pertinentes y enfoca el primer error en su paso correspondiente. Evita que los campos obligatorios ocultos bloqueen la validación sin poder recibir foco. Si deshabilitas un grupo oculto, recuerda que sus valores no entran en `FormData`: recupera todos los datos correctamente al preparar la consulta.

Conserva la preselección desde las tarjetas de servicio. La tecla Enter no debe omitir pasos ni enviar datos. Cambiar cualquier campo debe invalidar el mensaje preparado y su enlace de WhatsApp. Comprueba nombre compuesto, espacios, acentos, ampersand, fecha sin definir y regreso entre pasos.

La revisión final genera el mensaje únicamente en el navegador. Permite corregirlo desde el resultado mediante «Editar mi idea», regresando a los campos correspondientes con los valores conservados; al prepararlo de nuevo, actualiza la vista previa y el enlace de contacto. Explica que no se envió nada y no se reservó una fecha. Mantén copiar, su alternativa manual y el enlace al Instagram profesional confirmado. WhatsApp aparece solo con un número válido configurado; nunca inventes uno. Sin JavaScript, conserva el contacto directo y evita envíos GET del formulario.

## Preguntas frecuentes útiles

Usa acordeones semánticos, preferiblemente `details`/`summary`, con foco visible y respuestas legibles sin JavaScript. Responde dudas que el contenido comprobado permite resolver:

- **¿En dónde puedo consultar una sesión?** El perfil indica Ensenada–La Paz; la fecha y locación se consultan directamente. No prometas disponibilidad permanente en ambas ciudades ni viajes incluidos.
- **¿Qué fotografías puedo explorar?** Retratos, trabajo editorial y momentos familiares visibles en el portafolio. No conviertas cada imagen en una oferta comercial garantizada.
- **¿Necesito saber la fecha?** No: el formulario permite dejarla por definir.
- **¿La consulta reserva mi fecha?** No: prepara un mensaje; los detalles se acuerdan directamente con Alexa.
- **¿Cómo conozco las opciones y el precio?** Comparte tu idea para consultarlos. No publiques tarifas, anticipos, descuentos ni condiciones sin confirmación.

No inventes tiempos de entrega o respuesta, duración, cantidad de fotografías, derechos de uso, retoques incluidos o políticas de cancelación. Evita añadir marcado de preguntas frecuentes con la promesa de un resultado especial en buscadores.

## Información de privacidad fiel al funcionamiento

Añade el aviso simple solicitado por el cliente, accesible desde el formulario y el footer. El usuario confirmó a **Alexa Lara como fotógrafa freelance**; el correo permanece pendiente. Usa su nombre y el contacto profesional ya verificado, sin inventar un correo o una razón social. Describe qué campos se preparan, que el código actual no los envía a un servidor propio ni los guarda de forma persistente y que la persona decide copiarlos o abrir una plataforma externa. La copia utiliza el portapapeles del dispositivo.

Reconoce los servicios que sí intervienen: alojamiento, fuentes externas si continúan usándose y plataformas de contacto al abrirlas. No afirmes «ningún dato se recopila» ni «no hay terceros»; tampoco inventes plazos de conservación, domicilio legal, email o procedimientos que no existen. Esta explicación técnica debe corresponder al código y no presentarse como una certificación legal.

## Movimiento e identidad

Conserva la pausa manual y `prefers-reduced-motion`, también cuando cambia la preferencia con la página abierta. Desactiva nuevos desplazamientos, parallax y ciclos decorativos bajo esa preferencia; revela inmediatamente cualquier contenido pendiente. Conserva inclinaciones estáticas si son parte de la composición.

Puedes identificar visualmente a Alexa con ambos retratos de perfil confirmados: `assets/instagram/6c7e0558e37a9d13-800.webp`, del perfil profesional, y `assets/alexa/b796915b4d08c4fb-800.webp`, del perfil personal `https://www.instagram.com/alexalrb/`. El usuario confirmó la fuente personal y el navegador la identificó como foto del perfil `alexalrb`; su original es cuadrado, de 1080 × 1080 px. La nueva fotografía puede ocupar la figura superpuesta del collage, con una descripción que indique su procedencia. No la cuentes entre las 22 obras de galería. Las demás personas son sujetos fotografiados, no retratos de la autora. Mantén esa distinción en titulares, textos alternativos y captions. El perfil personal sirve para conocer a Alexa; las consultas comerciales mantienen el perfil profesional.

## Comprobaciones de aceptación

1. A 360 px y escritorio, preguntas, formulario y mensajes no desbordan ni quedan tapados por cabeceras o controles flotantes.
2. Teclado: abrir/cerrar FAQ; recorrer solo el paso activo; continuar, volver, corregir errores y revisar mensaje con foco visible y orden lógico.
3. El paso 1 conserva servicio, lugar, fecha y mensaje; el paso 2 conserva nombre y consentimiento. La revisión incluye todos los datos correctos. «Editar mi idea» permite corregirlos y preparar una versión nueva sin conservar resultados o enlaces obsoletos.
4. Preparar, volver y copiar no generan solicitudes con datos personales. El contacto externo solo se abre por una acción explícita.
5. Movimiento reducido del sistema y pausa manual afectan también los efectos nuevos. Ningún contenido desaparece por desactivar animaciones.
6. La galería sigue mostrando 22 fotografías reales, conserva filtros y visor, y Escape devuelve el foco. No cambian identidad, procedencia ni rutas válidas.

Registra las pruebas efectivamente ejecutadas y sus límites. No confundas esta lista de aceptación con evidencia de una comprobación realizada.
