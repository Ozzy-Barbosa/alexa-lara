# Tarjeta digital y vista previa al compartir

La tarjeta vive en `tarjeta.html` y usa una hoja de estilo propia, `assets/card/card.css`. Sus enlaces permiten abrir el portafolio, consultar por WhatsApp, llamar, escribir por correo, abrir Instagram, descargar la tarjeta PNG y guardar el contacto VCF. No necesita JavaScript ni un servicio externo de códigos QR.

## Datos confirmados por el usuario

- Nombre: Alexa Lara.
- Teléfono visible: +52 612 104 4559.
- Enlace telefónico y VCF: `+526121044559`.
- WhatsApp: `https://wa.me/5216121044559`. El enlace usa el prefijo `521` indicado para México en la [guía oficial de WhatsApp](https://faq.whatsapp.com/640432094208718/?locale=ca_ES); no se añade ese `1` al teléfono visible, `tel:` ni VCF.
- Correo: `alexalarar17@gmail.com`.
- Instagram profesional: `https://www.instagram.com/aleroblesfotografia/`.
- Destino exacto del QR: `https://ozzy-barbosa.github.io/alexa-lara/tarjeta.html`.

No se incorporaron domicilio, precios, horarios ni campos personales no confirmados. Los botones abren la plataforma correspondiente; no se envió ningún mensaje ni se llamó a ningún número durante la generación de estos recursos.

## Archivos entregados

| Archivo dentro de `assets/card/` | Formato / dimensiones | Peso generado |
| --- | --- | --- |
| `alexa-lara-tarjeta.png` | Tarjeta vertical, 1080 × 1350 px | 294,949 bytes |
| `alexa-lara-social.jpg` | Vista previa, 1200 × 630 px | 117,131 bytes |
| `alexa-lara-qr.png` | QR, 656 × 656 px | 2,915 bytes |
| `alexa-lara-qr.svg` | QR vectorial, escalable | 7,994 bytes |
| `alexa-lara.vcf` | Contacto vCard 3.0, UTF-8 y finales CRLF | 202 bytes |
| `manifest.json` | Destino, tamaños, hashes y resultado del lector independiente | Variable |

La tarjeta descargable combina vino `#65283d`, vino oscuro `#20151b`, marfil `#f5f0e8`, Cormorant Garamond y DM Sans. El nombre, teléfono, correo, Instagram, QR y URL aparecen como parte de la imagen. El VCF contiene nombre, teléfono, correo y URL de la tarjeta; no intenta importar el contacto automáticamente.

La imagen social muestra la fotografía profesional real `assets/instagram/6c7e0558e37a9d13-800.webp`, con la cámara visible, junto al nombre y la ubicación. Se conserva el cuadrado completo, con redimensionado proporcional: no se cambió la cara, el color ni el encuadre. La tarjeta emplea esa misma fotografía. Las tipografías se descargaron de Google Fonts y se sirven localmente con sus licencias OFL dentro de `assets/card/fonts/`.

## Generación reproducible

El generador es `scripts/build-brand-assets.py`. Utiliza Pillow para la composición y ReportLab para construir la matriz QR. No hace peticiones de red.

```sh
python scripts/build-brand-assets.py
python scripts/build-brand-assets.py --site-url https://tu-dominio.com/
```

Requiere Pillow y ReportLab instalados en el entorno Python. La opción de base pública admite una subcarpeta y vuelve a generar los dos QR, la URL impresa de la tarjeta, la URL del VCF y el manifiesto. El HTML y sus metadatos se actualizan por separado mediante la configuración del sitio. Si cambia el dominio, hay que regenerar y redistribuir las tarjetas descargables; un QR ya impreso conserva su destino anterior.

La verificación independiente es opcional al generar, con `zxing-cpp` disponible:

```sh
python scripts/build-brand-assets.py --verify
```

En Windows, ZXing-C++ necesita su runtime C++ accesible. Para esta entrega se usó el runtime ya incluido en el entorno de trabajo y el lector se instaló en una carpeta temporal, fuera del proyecto. No es una dependencia del sitio publicado.

## Evidencia del QR

El QR usa una matriz de **33 × 33 módulos**, corrección de errores **M** y margen blanco de **4 módulos en los cuatro lados**. No tiene logotipos, esquinas recortadas ni decoración sobre los módulos.

ZXing-C++ decodificó de forma independiente estos dos archivos:

| Entrada | Texto obtenido |
| --- | --- |
| `alexa-lara-qr.png` | `https://ozzy-barbosa.github.io/alexa-lara/tarjeta.html` |
| `alexa-lara-tarjeta.png` | `https://ozzy-barbosa.github.io/alexa-lara/tarjeta.html` |

El resultado y los hashes SHA-256 quedan en `assets/card/manifest.json`. La variante SVG se construye a partir de la misma matriz, incluyendo la misma zona de silencio. Se inspeccionaron visualmente la tarjeta PNG y la vista previa social para comprobar fotografía completa, legibilidad y ausencia de recortes de texto.

## Integración y comprobación pública

Para el panel del footer, enlazar `tarjeta.html`, mostrar `assets/card/alexa-lara-qr.svg` y ofrecer la descarga de `assets/card/alexa-lara-tarjeta.png`. Mantener un enlace de texto al destino para quien no escanee el QR.

La página de tarjeta incorpora canonical, Open Graph, dimensiones de la imagen y Twitter Card de tipo `summary_large_image`. La imagen social para la portada principal es `https://ozzy-barbosa.github.io/alexa-lara/assets/card/alexa-lara-social.jpg`; debe usarse en sus propios metadatos. Las plataformas pueden conservar una vista previa anterior en caché.

Estos recursos fueron generados y verificados localmente y después publicados en GitHub Pages. La tarjeta, los archivos descargables y la imagen social respondieron HTTP 200; QR, PNG, JPG y VCF coincidieron byte a byte con los originales verificados. El destino del QR se abrió en el navegador público y la tarjeta se revisó en móvil. El PNG y el VCF se descargaron correctamente desde la página local durante el QA; no se importó el contacto a una agenda ni se probó con una cámara física. Algunos navegadores permiten visualizar el PNG o VCF antes de guardarlo. Véase `PUBLICACION.md` para la versión comprobada.
