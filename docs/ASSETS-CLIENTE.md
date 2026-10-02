# Fotografías entregadas para el sitio

Carpeta de origen indicada por el usuario: `C:/Users/oscar/Biblioteca-LocalPC/Imagenes-PC/Proyectos-Reales/Alexa-Lara/imagenes para el sitio`.

Los originales se consultaron sin modificarlos. La carpeta contiene 15 archivos: 14 imágenes distintas por SHA-256 y un duplicado exacto. Se generaron 28 WebP locales, dos variantes por imagen, con un peso total de 2,194,946 bytes (aproximadamente 2.09 MiB).

La selección se revisó visualmente en `assets/portfolio/contact-sheet.jpg`. Esta hoja conserva los 15 nombres recibidos, incluido el duplicado, para que la correspondencia sea comprobable. `assets/portfolio/inventory.json` contiene los nombres de origen, hash completo, dimensiones, pesos, procedencia y clasificación; `assets/portfolio/curation.json` conserva la selección editorial y las coincidencias con el catálogo anterior.

## Tratamiento y catálogo

- Se respetan el encuadre completo y los colores. El proceso aplica la orientación EXIF, convierte perfiles de color incrustados a sRGB cuando existen y exporta sin EXIF, GPS, comentarios, XMP ni perfil incrustado. No usa IA, retoque, filtros o recortes.
- Cada imagen tiene variantes `-800.webp` y `-1600.webp`: el número indica el lado máximo, no necesariamente el ancho. Las originales pequeñas no se amplían. `srcset` debe usar los anchos reales registrados en el inventario.
- Los identificadores `client-<primeros 16 caracteres de SHA-256>` son ASCII y estables aunque se cambie el nombre del archivo original.
- El catálogo mantiene 32 composiciones únicas: 11 variantes entregadas por el cliente y 21 fotografías provisionales del catálogo anterior de Instagram. Son 10 composiciones nuevas y una sustitución de la copia provisional de una fotografía ya existente.
- Las 11 entradas entregadas usan `provenance: "client"`, `provisional: false` y `source: ""` en `data.js`. No se les inventa una publicación de Instagram. El visor debe ocultar el enlace de publicación original cuando `source` esté vacío.
- `producto` reúne cuatro composiciones centradas en ropa, abrigo y botas. Los retratos de cuerpo completo con sombrero se clasifican como `editorial`; esta clasificación describe la selección visual y no inventa el nombre de una campaña o una marca.

## Correspondencia y selección

| Archivo original | ID local | Categoría | Decisión |
|---|---|---|---|
| `IMG_2566.JPG.jpeg` | `client-0e241686bc2190ec` | exteriores | Sustituye la copia provisional `6c7baf05c3cd4e0c`; misma composición, una sola entrada |
| `IMG_2579.JPG.jpeg` | `client-eb564a12cb2ba25d` | retratos | Nueva; retrato horizontal de playa, recomendado para portada |
| `IMG_2586.JPG.jpeg` | `client-ef8e6eae51b8005e` | exteriores | Nueva; retrato vertical al atardecer |
| `IMG_4640.PNG` | `client-31ef8e0be15acc42` | editorial | Nueva; retrato sentado junto a ventana |
| `IMG_4641.PNG` | `client-c6ce56d54bcea129` | editorial | Nueva; retrato sentado con sombrero |
| `IMG_4643.PNG` | `client-fe0e54cb54c35a27` | editorial | Nueva; retrato en escalones de madera |
| `WhatsApp Image 2026-10-01 at 8.13.23 PM.jpeg` | `client-317deed13d63c35f` | retratos | Nueva; pose con prenda estampada junto a plantas |
| `WhatsApp Image 2026-10-01 at 8.15.28 PM.jpeg` | `client-317deed13d63c35f` | retratos | Duplicado exacto del archivo de las 8.13.23; no genera segunda copia |
| `WhatsApp Image 2026-10-01 at 8.13.50 PM.jpeg` | `client-a0a9a70ed47c7686` | retratos | Misma fotografía que `0691c1a207ac7375`; se mantiene la versión anterior de mayor resolución y no se duplica la entrada |
| `WhatsApp Image 2026-10-01 at 8.14.14 PM.jpeg` | `client-f23552b6773fb9f7` | exteriores | Encuadre de la fotografía `2d306aeaa0b33a09`, con firma; se conserva el archivo recibido, pero no se duplica la entrada anterior |
| `WhatsApp Image 2026-10-01 at 8.19.54 PM.jpeg` | `client-c68bec2cce94660d` | exteriores | Encuadre de la fotografía `e157d921d65da218`; se conserva el archivo recibido, pero no se duplica la entrada anterior |
| `WhatsApp Image 2026-10-01 at 8.30.19 PM.jpeg` | `client-3b2595626fbf508d` | producto | Nueva; detalle horizontal de jeans y botas |
| `WhatsApp Image 2026-10-01 at 8.30.55 PM.jpeg` | `client-dda36444dea92a62` | producto | Nueva; abrigo en percha, recomendada para servicio de producto |
| `WhatsApp Image 2026-10-01 at 8.31.28 PM.jpeg` | `client-6adccfb9dd6283d8` | producto | Nueva; detalle de prendas puestas y estampado |
| `WhatsApp Image 2026-10-01 at 8.31.54 PM.jpeg` | `client-9f39881809abc738` | producto | Nueva; detalle horizontal de botas |

## Preparar nuevas entregas de manera incremental

Ejecutar desde la raíz del proyecto con Python y Pillow:

```powershell
python scripts/import-client-images.py "C:/ruta/a/nuevas-originales"
```

El script genera borradores de assets, actualiza el inventario y la hoja de contacto. **No edita `data.js`, no publica las fotos nuevas automáticamente y no borra fotografías previas.** En futuras entregas:

1. Revisar la nueva hoja de contacto y comparar composiciones con el portafolio ya publicado. La detección SHA elimina únicamente duplicados de archivo exactos; las copias con recorte o recomprimidas se revisan visualmente.
2. Añadir la clasificación, título descriptivo y texto alternativo en `assets/portfolio/curation.json`. Volver a ejecutar el script refleja esos datos en el inventario.
3. Elegir las entradas que deben verse en la web y añadirlas manualmente a `data.js`, con dimensiones reales, `provenance: "client"`, `source: ""`, `provisional: false` y `published: true`.
4. Reemplazar las entradas correspondientes cuando la fotografía ya exista; no crear otra entrada de la misma composición.

Repetir la importación de la misma entrega no vuelve a generar los WebP. Los nuevos hashes se añaden; las entradas existentes y sus archivos permanecen. Si hay una colisión de identificador o un archivo de salida que no pertenece al inventario, el script se detiene sin sobrescribirlo. Las carpetas de originales y de salida deben estar separadas.

La sección «Sobre mí» conserva su procedencia propia, documentada en `ASSETS-INSTAGRAM.md`; las modelos de este lote son sujetos del trabajo fotográfico, no se identifican como Alexa.
