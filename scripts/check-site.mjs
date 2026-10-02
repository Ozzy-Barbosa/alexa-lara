import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// Static contracts for this hand-authored site, not browser or external-account verification.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = filename => fs.readFileSync(path.join(root, filename), "utf8");
const html = read("index.html");
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const tags = (document, name) => [...document.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(match => attributes(match[0]));
const meta = (document, key) => tags(document, "meta").find(tag => tag.property === key || tag.name === key)?.content;
const canonical = document => tags(document, "link").find(tag => tag.rel === "canonical")?.href;
const base = new URL(canonical(html));
assert.equal(base.protocol, "https:", "La base canónica debe utilizar HTTPS.");
assert(base.pathname.endsWith("/"), "La base canónica debe terminar en /.");

function checkLocalReference(value, filename, requireLocal = false) {
  const url = new URL(value.replaceAll("&amp;", "&"), new URL(filename, base));
  if (!["http:", "https:"].includes(url.protocol) || url.origin !== base.origin) {
    assert(!requireLocal, "Se esperaba un archivo local: " + value);
    return;
  }
  assert(url.pathname.startsWith(base.pathname), "Ruta fuera del subdirectorio publicado: " + value);
  const relative = decodeURIComponent(url.pathname.slice(base.pathname.length)) || "index.html";
  const target = path.resolve(root, relative);
  assert(target.startsWith(root + path.sep), "Ruta fuera del proyecto: " + value);
  assert(fs.existsSync(target) && fs.statSync(target).isFile(), "Archivo local ausente: " + value);
  if (url.hash && /\.html$/.test(target)) {
    const targetIds = [...fs.readFileSync(target, "utf8").matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert(targetIds.includes(decodeURIComponent(url.hash.slice(1))), "Ancla inexistente: " + value);
  }
}

const sandbox = { window: {} };
vm.runInNewContext(read("data.js"), sandbox);
const data = sandbox.window.ALEXA_SITE;
const photos = data.photos.filter(photo => photo.published);
const categories = ["retratos", "editorial", "familia", "exteriores", "producto"];
assert(photos.length >= 32, "La colección V6 debe conservar al menos 32 fotografías publicadas.");
assert.equal(new Set(photos.map(photo => photo.id)).size, photos.length, "IDs de fotografías repetidos.");
assert.equal(new Set(photos.map(photo => photo.src)).size, photos.length, "Fotografías repetidas.");
for (const photo of photos) {
  assert(photo.alt && photo.title && photo.width > 0 && photo.height > 0, "Ficha incompleta: " + photo.id);
  assert(categories.includes(photo.category), "Categoría desconocida: " + photo.id);
  assert(photo.srcWidth > 0 && photo.fullWidth >= photo.srcWidth, "Anchos de srcset incorrectos: " + photo.id);
  if (photo.provenance === "client") {
    assert.equal(photo.source, "", "Una foto entregada no debe inventar una publicación fuente: " + photo.id);
    assert.equal(photo.provisional, false, "Una foto entregada no es provisional: " + photo.id);
  } else {
    const source = new URL(photo.source);
    assert.equal(source.origin, "https://www.instagram.com", "Fuente de Instagram inválida: " + photo.id);
    assert(source.pathname.length > 1, "Falta la publicación original: " + photo.id);
  }
  for (const field of ["src", "full"]) checkLocalReference(photo[field], "index.html", true);
}
assert(photos.some(photo => photo.category === "producto" && photo.provenance === "client"), "Faltan fotografías de producto entregadas por el cliente.");
assert(data.futureSlots.every(slot => slot.published === false), "Las posiciones futuras no deben publicarse vacías.");

const documents = new Map(["index.html", "privacidad.html", "tarjeta.html"].map(filename => [filename, read(filename)]));
for (const [filename, document] of documents) {
  const ids = [...document.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, "IDs HTML duplicados: " + filename);
  assert.equal((document.match(/<h1\b/g) || []).length, 1, "Debe existir un único H1: " + filename);
  assert(!/unsplash|example\.com/i.test(document), "Referencias provisionales incorrectas: " + filename);
  for (const match of document.matchAll(/\b(src|href)="([^"]+)"/g)) checkLocalReference(match[2], filename, match[1] === "src");
  for (const match of document.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) {
      const [url, descriptor] = candidate.trim().split(/\s+/);
      assert(/^[1-9]\d*w$/.test(descriptor), "Descriptor srcset inválido: " + candidate);
      checkLocalReference(url, filename, true);
    }
  }
  assert.equal(canonical(document), new URL(filename === "index.html" ? "./" : filename, base).href, "Canónica incoherente: " + filename);
}
for (const filename of ["styles.css", "assets/card/card.css"]) {
  for (const match of read(filename).matchAll(/url\(["']?([^\s)'";]+)["']?\)/g)) checkLocalReference(match[1], filename, true);
}

const cover = html.match(/<figure\b[^>]*class="[^"]*\bcover-photograph\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/)?.[1];
assert(cover, "Falta la fotografía única de portada V6.");
assert.equal(tags(cover, "img").length, 1, "La portada debe mostrar una sola fotografía.");
assert.equal(tags(cover, "img")[0].fetchpriority, "high", "La imagen principal debe tener carga prioritaria.");
assert(!/data-hero-(?:scene|panel|controls)/.test(html), "Quedan controles de la portada anterior.");
assert(/family=Cormorant\+Garamond/.test(html), "Falta la tipografía Cormorant de V6.");
for (const category of categories) assert(html.includes(`data-filter="${category}"`), "Falta filtro: " + category);
const serviceOptions = html.match(/<select\b[^>]*name="servicio"[^>]*>([\s\S]*?)<\/select>/)?.[1] || "";
assert(/<option(?:\s[^>]*)?>Fotografía de producto<\/option>/.test(serviceOptions), "Falta el servicio Fotografía de producto en el formulario.");
assert(html.includes('data-service="Fotografía de producto"'), "Falta la consulta desde la sección de producto.");
const faqs = [...html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
assert.equal(faqs.length, 6, "Se esperan seis preguntas frecuentes.");
assert(faqs.filter(match => /\bopen\b/.test(match[1])).length <= 1, "Solo una respuesta puede iniciar abierta.");
for (const [, attrs, content] of faqs) {
  assert.equal(attributes(attrs).name, "alexa-faq", "Las FAQ necesitan el grupo nativo como alternativa sin JavaScript.");
  assert(/<summary\b/.test(content) && /class="faq-answer"/.test(content), "Falta summary o respuesta para la animación de FAQ.");
}
for (const id of ["form-next", "form-back", "edit-message", "form-step-label", "message-count"]) assert(html.includes(`id="${id}"`), "Falta control del formulario: " + id);
assert(html.includes("assets/alexa/b796915b4d08c4fb-800.webp"), "La biografía debe usar el perfil personal confirmado.");
assert(!html.includes('class="about-detail" src="assets/instagram/4431622a34d5865a'), "La modelo no debe presentarse como Alexa.");
assert.equal(meta(documents.get("privacidad.html"), "robots"), "noindex,follow", "El aviso inicial no debe indexarse.");

const phone = "+526121044559";
const email = "alexalarar17@gmail.com";
assert.equal(data.whatsapp, "5216121044559", "WhatsApp no coincide con el número confirmado.");
assert.equal(data.email, email, "El correo no coincide con el contacto confirmado.");
assert.equal(data.instagram, "https://www.instagram.com/aleroblesfotografia/", "Perfil profesional incorrecto.");
const structured = JSON.parse(html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || "null");
assert.equal(structured?.telephone, phone, "Teléfono de datos estructurados incoherente.");
assert.equal(structured?.email, email, "Correo de datos estructurados incoherente.");
assert(structured?.sameAs?.includes(data.instagram), "Perfil profesional ausente de los datos estructurados.");
for (const [filename, document] of documents) {
  const anchors = tags(document, "a");
  for (const { href } of anchors) {
    if (href?.startsWith("tel:")) assert.equal(href, "tel:" + phone, "Teléfono incoherente: " + filename);
    if (href?.startsWith("mailto:")) assert.equal(href, "mailto:" + email, "Correo incoherente: " + filename);
    if (href?.startsWith("https://wa.me/")) assert.equal(new URL(href).pathname, "/" + data.whatsapp, "WhatsApp incoherente: " + filename);
  }
  if (filename !== "privacidad.html") {
    for (const href of ["tel:" + phone, "mailto:" + email, "https://wa.me/" + data.whatsapp, data.instagram]) {
      assert(anchors.some(anchor => anchor.href === href), "Falta contacto directo: " + filename + " " + href);
    }
  }
}
const vcard = read("assets/card/alexa-lara.vcf");
assert(vcard.includes("TEL;TYPE=CELL:" + phone), "La vCard tiene un teléfono diferente.");
assert(vcard.includes("EMAIL;TYPE=INTERNET:" + email), "La vCard tiene un correo diferente.");
assert(vcard.includes("URL:" + new URL("tarjeta.html", base).href), "La vCard enlaza otra tarjeta.");
assert(read("assets/card/alexa-lara-qr.svg").includes(new URL("tarjeta.html", base).href), "La descripción del QR apunta a otra tarjeta.");

// Inspect JPEG's SOF segment so metadata matches the actual sharing asset.
function jpegDimensions(filename) {
  const image = fs.readFileSync(path.join(root, filename));
  assert.equal(image.readUInt16BE(0), 0xffd8, "La imagen social no es JPEG.");
  let offset = 2;
  while (offset + 3 < image.length) {
    assert.equal(image[offset], 0xff, "Marcador JPEG inválido.");
    while (image[offset] === 0xff) offset++;
    const marker = image[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = image.readUInt16BE(offset);
    assert(length >= 2 && offset + length <= image.length, "Segmento JPEG inválido.");
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: image.readUInt16BE(offset + 5), height: image.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  assert.fail("No se encontraron las dimensiones de la imagen social.");
}
assert.deepEqual(jpegDimensions("assets/card/alexa-lara-social-v7.jpg"), { width: 1200, height: 630 }, "El archivo social debe medir 1200 × 630.");
for (const filename of ["index.html", "tarjeta.html"]) {
  const document = documents.get(filename);
  const socialURL = new URL("assets/card/alexa-lara-social-v7.jpg", base).href;
  assert.equal(meta(document, "og:image"), socialURL, "Imagen Open Graph incoherente: " + filename);
  assert.equal(meta(document, "og:image:secure_url"), socialURL, "Imagen HTTPS de Open Graph incoherente: " + filename);
  assert(meta(document, "og:image:alt")?.trim(), "Falta una descripción de la imagen Open Graph: " + filename);
  assert.equal(meta(document, "twitter:image"), socialURL, "Imagen Twitter incoherente: " + filename);
  assert(meta(document, "twitter:image:alt")?.trim(), "Falta una descripción de la imagen Twitter: " + filename);
  assert.equal(meta(document, "og:image:width"), "1200", "Ancho social incorrecto: " + filename);
  assert.equal(meta(document, "og:image:height"), "630", "Alto social incorrecto: " + filename);
  assert.equal(meta(document, "og:image:type"), "image/jpeg", "Tipo social incorrecto: " + filename);
  const imageMetadata = tags(document, "meta").filter(tag => tag.property === "og:image" || tag.property?.startsWith("og:image:"));
  assert.equal(imageMetadata[0]?.property, "og:image", "Las propiedades de la imagen deben seguir a og:image: " + filename);
  assert.equal(new Set(imageMetadata.map(tag => tag.property)).size, imageMetadata.length, "Metadatos de imagen duplicados: " + filename);
  assert(!document.includes("assets/card/alexa-lara-social.jpg"), "Queda la miniatura anterior en los metadatos: " + filename);
  checkLocalReference(socialURL, filename, true);
}
assert(!/example\.com/.test(read("robots.txt")), "Robots conserva un dominio ficticio.");
console.log(`OK: ${photos.length} fotografías únicas y locales (${photos.filter(photo => photo.provenance === "client").length} entregadas por cliente), fuentes y srcset.`);
console.log(`OK: portada V6, producto, seis FAQ exclusivas y ${data.futureSlots.length} posiciones futuras sin publicar.`);
console.log("OK: páginas, recursos, anclas, contactos, vCard, metadatos y JPEG social de 1200 × 630.");
