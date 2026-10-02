# Dirección creativa y desarrollo — Alexa Lara Fotografía

Prompt reutilizable para diseñar, ampliar y mantener este sitio. Copia el bloque siguiente como encargo de trabajo, o referencia este documento al solicitar cambios. Aplícalo al código existente y entrega una implementación comprobable.

---

Actúa como director de arte y desarrollador web especializado en portafolios fotográficos. Mejora el sitio de **Alexa Lara Fotografía**, dirigido a personas que buscan una fotógrafa en La Paz, Baja California Sur. Construye una experiencia editorial elegante, actual y expresiva donde las fotografías sean protagonistas y consultar una sesión resulte sencillo.

Antes de modificar archivos, lee las instrucciones del repositorio, identifica su estructura y conserva los cambios existentes. Trabaja sobre el sitio estático actual, compatible con hosting convencional y sin exigir compilación o servicios nuevos para funciones básicas.

## 1. Identidad, fuentes y fotografías

- La marca solicitada por el cliente es **Alexa Lara Fotografía**. El cliente proporcionó `https://www.instagram.com/aleroblesfotografia/` como fuente de imágenes. No cambies el nombre comercial ni deduzcas la identidad de las personas retratadas a partir del nombre de usuario.
- Comprueba el acceso real al perfil y a publicaciones concretas. Distingue entre ver el nombre del perfil, ver miniaturas públicas, abrir una publicación y poder descargar su imagen. Solo afirma aquello que observaste.
- Registra para cada imagen su publicación o fuente verificable, fecha de consulta, archivo local, descripción, dimensiones y uso en el sitio. Informa al cliente de cualquier límite de acceso con evidencia concreta.
- Usa únicamente fotografías provisionales procedentes del perfil proporcionado y verificadas. No añadas imágenes de stock, de otras cuentas ni imágenes generadas presentadas como trabajo de Alexa. No confundas una miniatura de video con una fotografía de portafolio sin indicarlo en el registro de medios.
- Para una imagen presentada como retrato de la fotógrafa, exige una identificación inequívoca del cliente o de la publicación. Si no existe, usa una composición tipográfica o una fotografía de su trabajo sin atribuirle la identidad de la persona retratada.
- Cuando sea posible, conserva copias locales optimizadas para evitar depender de direcciones temporales de Instagram. Mantén un registro de procedencia fuera de la interfaz comercial.
- Si Instagram no permite ver u obtener imágenes suficientes, continúa el diseño con espacios editoriales honestos y enlaces al perfil. Explica la limitación al entregar. No afirmes haber importado fotografías inaccesibles, no eludas barreras de acceso y no llenes la galería con duplicados para aparentar una colección mayor.

## 2. Dirección de arte

Construye una identidad visual coherente a partir de estos criterios:

- **Paleta:** marfil cálido `#F3EFE7`, carbón `#191917`, gris cálido `#AAA49B` y borgoña apagado `#744B50` como acento. Verifica el contraste de cada combinación utilizada; los tonos son una intención visual, no una excepción de accesibilidad.
- **Tipografía:** una serif refinada para titulares grandes y una sans serif discreta para navegación, formularios y detalles. Usa escala fluida, interlineado controlado y suficiente espacio en blanco. Limita familias y pesos; conserva alternativas del sistema si no cargan las fuentes.
- **Composición:** alterna superficies claras con una galería oscura y un cierre fotográfico profundo. Combina imágenes verticales y horizontales, numeración editorial, titulares asimétricos y márgenes generosos. Evita convertir todo el sitio en tarjetas idénticas.
- **Tratamiento fotográfico:** respeta el color, encuadre y estilo del trabajo original. No apliques desaturación o filtros intensos globales. Ajusta el punto de enfoque por imagen y no coloques texto sobre rostros.
- **Interfaz:** enlaces expresivos y botones legibles; acentos finos, divisores sutiles y estados de interacción claros. El diseño debe sentirse cuidado tanto en una pantalla de 1440 px como en un teléfono de 360 px.

## 3. Recorrido del sitio

1. **Cabecera:** marca legible, navegación compacta, acceso al portafolio y llamada a consultar una sesión. Menú móvil accesible y operable con teclado.
2. **Portada:** una frase breve con personalidad, fotografía verificada o composición editorial alternativa, ubicación y dos acciones claras: explorar fotografías y consultar disponibilidad. Evita promesas grandilocuentes y datos comerciales no confirmados.
3. **Selección destacada:** presenta distintas facetas de su trabajo con imágenes temáticas coherentes y enlaces a categorías. No inventes servicios a partir de una fotografía aislada.
4. **Galería principal:** amplia, de fondo carbón, con composiciones variadas y espacio para apreciar cada imagen. Debe ser el centro del sitio.
5. **Acerca de Alexa:** texto corto, humano y editable. Usa únicamente datos confirmados; no inventes años de experiencia, premios, testimonios, publicaciones ni una biografía personal.
6. **Experiencias:** servicios existentes que el cliente haya confirmado, con una imagen pertinente cuando exista y una acción que pueda preseleccionar la consulta.
7. **Contacto y cierre:** transición elegante hacia un fondo oscuro, frase final memorable, formulario breve y enlace al Instagram proporcionado. Integra el footer dentro de la composición.

## 4. Galería y futuras sesiones

- Prepara un catálogo editable con **al menos 18 posiciones** para futuras fotografías, incluyendo identificador, estado, categoría, título, descripción alternativa, archivo, dimensiones, punto de enfoque y procedencia. El catálogo puede contener posiciones pendientes sin publicarlas.
- Publica únicamente imágenes reales disponibles y verificadas. Calcula los contadores a partir de fotografías publicadas; nunca cuentes posiciones reservadas como obras visibles.
- Usa filtros claros que correspondan al material real, además de “Todas”. Conserva el estado seleccionado y un mensaje accesible si una categoría todavía no tiene fotografías.
- Muestra una primera selección de aproximadamente 9 a 12 fotografías, cuando existan, y una acción “Ver más fotografías” para ampliar la colección. Si hay menos imágenes verificadas, muestra la cantidad real sin duplicarlas.
- Implementa un visor ampliado con nombre o descripción, contador real, anterior/siguiente, cierre con Escape, navegación por teclado, foco contenido y devolución del foco al abrirlo/cerrarlo. En móviles, los controles deben poder tocarse cómodamente; no dependas solo de gestos.
- Mantén el orden de lectura coherente con el orden visual. El filtrado no debe romper el visor, dejar huecos desconcertantes ni mover el foco inesperadamente.
- Reserva dimensiones y proporciones antes de cargar las fotografías. Usa carga diferida fuera de portada, imágenes optimizadas y tamaños adecuados al contenedor.
- Incluye una presentación sobria de “Nuevas historias, próximamente” solo cuando encaje en el recorrido. Las rutas de archivos, instrucciones de reemplazo y avisos técnicos pertenecen a la documentación del proyecto.

## 5. Movimiento con intención

- Añade entradas suaves al desplazarse, transiciones de filtros, acercamientos muy discretos al interactuar con fotografías y cambios sutiles de cabecera. Mantén duraciones aproximadas de 180 a 600 ms, según la distancia recorrida.
- Prioriza `transform` y `opacity`, observadores de intersección y eventos ligeros. No fuerces scroll, no ocultes el cursor y no introduzcas animaciones que retrasen la navegación.
- Respeta `prefers-reduced-motion`: elimina desplazamientos, parallax, desplazamiento suave y ciclos decorativos. El contenido y las funciones deben seguir disponibles.
- Las entradas no pueden dejar texto o fotografías invisibles si JavaScript falla. Evita carruseles automáticos y movimiento continuo que compita con la fotografía.

## 6. Consultas, contenido y búsqueda local

- Facilita una consulta mediante nombre, tipo de sesión, fecha opcional y una idea breve. Genera un mensaje de WhatsApp correctamente codificado y explica que la persona revisará y enviará su mensaje en WhatsApp.
- Usa solo el número que entregue el cliente. Mientras no exista, ofrece una alternativa de contacto verificable con Instagram y un estado claro; no simules que una solicitud fue enviada ni abras una conversación con un número inventado.
- No prometas reserva, respuesta en un plazo concreto, disponibilidad ni almacenamiento de solicitudes si esas funciones no existen. No guardes información personal en almacenamiento persistente sin necesidad.
- Mantén español natural y una jerarquía semántica con un H1. Incluye La Paz, Baja California Sur de forma contextual; no repitas palabras clave artificialmente ni garantices posiciones de Google.
- Revisa título, descripción, metadatos sociales, enlaces internos y datos estructurados. Usa exclusivamente nombre, ubicación, contacto, dominio y servicios confirmados. No publiques valoraciones, precios o direcciones inventados.
- Separa los valores pendientes de configuración de los datos listos para publicación. Documenta cómo actualizar dominio, WhatsApp e imágenes sociales antes de subir a hosting.

## 7. Criterios de aceptación

Entrega solo después de comprobar lo siguiente y describe con precisión cualquier límite:

- La portada, la galería y el cierre tienen una dirección visual consistente y fotografía legible, sin recortes accidentales ni desbordamiento horizontal.
- El sitio funciona en escritorio y móvil; navegación, formulario, filtros, carga progresiva y visor responden a las acciones esperadas.
- Se puede recorrer con teclado. El foco es visible y se restituye tras cerrar el visor; las etiquetas y los nombres accesibles son comprensibles.
- La preferencia de movimiento reducido desactiva efectos innecesarios. El contenido principal sigue disponible sin animaciones y sin depender de que termine una transición.
- No aparecen imágenes rotas, URLs inventadas, fotografías externas a la fuente autorizada ni identidades sin verificar. Existe un registro de las imágenes utilizadas y de la evidencia de acceso a Instagram.
- Los contadores representan fotografías reales; los espacios para nuevas imágenes están preparados y no aparentan trabajo ya publicado.
- No hay errores nuevos de JavaScript ni solicitudes locales fallidas atribuibles al cambio. Se inspeccionaron visualmente al menos una vista de escritorio y una de móvil.
- El proyecto conserva un despliegue estático sencillo. No afirma enviar, almacenar, reservar o medir acciones que no implementa.

## 8. Entrega y reemplazo de fotografías

Entrega los cambios en los archivos del proyecto, una explicación breve de las decisiones visuales, las comprobaciones realizadas y los datos pendientes del cliente. Conserva este prompt para futuras iteraciones.

Prepara una guía de medios que permita incorporar las fotos nuevas sin rediseñar el sitio: dónde guardar cada archivo, cómo completar su entrada del catálogo, qué estado publica una posición, cómo elegir categoría y punto de enfoque, cómo redactar un `alt` descriptivo y cómo comprobar el resultado. El cambio de fotografías no debe exigir modificar la lógica del visor o los filtros.

Solicita para la entrega final de imágenes: archivos originales o exportaciones de calidad, selección aprobada, categoría, orden preferido, autoría o créditos que deban mostrarse y confirmación del retrato personal de Alexa. Optimiza versiones web sin sobrescribir los originales. Cuando la colección definitiva esté lista, sustituye las provisionales, actualiza el registro y verifica otra vez los encuadres en móvil.

---

Este documento define criterios para trabajar; no constituye por sí mismo evidencia de acceso a Instagram ni certifica que las comprobaciones ya se hayan realizado. La implementación y su informe de entrega deben aportar esa evidencia.
