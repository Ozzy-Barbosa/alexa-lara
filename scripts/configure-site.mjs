// Local publishing helper; never deploys. See --help for Python/preview options.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const pattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const usage = "npm run configure -- https://tu-dominio.com/subcarpeta/ [--python ruta/al/python] [--dry-run]";

async function optionalFile(name) {
  try { return await readFile(new URL(name, root), "utf8"); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

function meta(html, attribute, name, content) {
  const tag = `<meta ${attribute}="${name}" content="${escape(content)}">`;
  const matcher = new RegExp(`<meta\\s+${attribute}="${pattern(name)}"[^>]*>`, "g");
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function canonical(html, url) {
  const tag = `<link rel="canonical" href="${escape(url)}">`;
  return /<link rel="canonical"[^>]*>/.test(html)
    ? html.replace(/<link rel="canonical"[^>]*>/g, tag)
    : html.replace("</head>", `  ${tag}\n</head>`);
}

function socialMetadata(html, pageUrl, imageUrl) {
  html = canonical(html, pageUrl);
  for (const [name, value] of [["og:url", pageUrl], ["og:image", imageUrl], ["og:image:width", "1200"], ["og:image:height", "630"], ["og:image:type", "image/jpeg"]]) {
    html = meta(html, "property", name, value);
  }
  html = meta(html, "name", "twitter:card", "summary_large_image");
  return meta(html, "name", "twitter:image", imageUrl);
}

async function brandAssetsCurrent(site) {
  try {
    const manifest = JSON.parse(await readFile(new URL("assets/card/manifest.json", root), "utf8"));
    const cardUrl = new URL("tarjeta.html", site).href;
    if (manifest.cardUrl !== cardUrl || manifest.portfolioUrl !== site.href) return false;
    for (const name of ["alexa-lara-qr.svg", "alexa-lara-qr.png", "alexa-lara-tarjeta.png", "alexa-lara-social.jpg", "alexa-lara.vcf"]) {
      const buffer = await readFile(new URL(`assets/card/${name}`, root));
      if (createHash("sha256").update(buffer).digest("hex") !== manifest.files?.[name]?.sha256) return false;
    }
    const contact = await readFile(new URL("assets/card/alexa-lara.vcf", root), "utf8");
    return contact.split(/\r?\n/).includes(`URL:${cardUrl}`);
  } catch { return false; }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(usage + "\n--dry-run muestra los cambios sin escribir. Al cambiar de dominio, se regeneran QR, tarjeta PNG y VCF con Pillow y ReportLab. Usa --python o la variable PYTHON para seleccionar el intérprete.");
    return;
  }
  const input = args.shift();
  if (!input) throw new Error("Indica la URL final del sitio: " + usage);
  let python = process.env.PYTHON || "python";
  let dryRun = false;
  while (args.length) {
    const option = args.shift();
    if (option === "--dry-run") dryRun = true;
    else if (option === "--python" && args[0]) python = args.shift();
    else throw new Error("Opción desconocida o incompleta: " + option + "\n" + usage);
  }
  let site;
  try {
    site = new URL(input);
    if (site.protocol !== "https:" || site.username || site.password || site.search || site.hash) throw new Error();
    if (!site.pathname.endsWith("/")) site.pathname += "/";
  } catch { throw new Error("Usa una URL HTTPS sin credenciales, parámetros ni fragmentos."); }

  // Prepare all text changes before regenerating assets or touching publishing files.
  const [index, privacy, errorPage, card] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("privacidad.html", root), "utf8"),
    readFile(new URL("404.html", root), "utf8"),
    optionalFile("tarjeta.html")
  ]);
  const imageUrl = new URL("assets/card/alexa-lara-social.jpg", site).href;
  const cardUrl = new URL("tarjeta.html", site).href;
  const changes = new Map();
  changes.set("index.html", socialMetadata(index, site.href, imageUrl));
  changes.set("privacidad.html", canonical(privacy, new URL("privacidad.html", site).href));
  changes.set("404.html", errorPage.replace(/<a href="[^"]*">/, `<a href="${escape(site.href)}">`).replace(/href="[^"]*assets\/favicon.svg"/, `href="${escape(new URL("assets/favicon.svg", site).href)}"`));
  if (card !== null) {
    const previousCardUrl = card.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    // Update the visible QR destination as well as its metadata, preserving local links.
    let nextCard = previousCardUrl ? card.replaceAll(previousCardUrl, escape(cardUrl)) : card;
    nextCard = socialMetadata(nextCard, cardUrl, imageUrl);
    changes.set("tarjeta.html", nextCard);
  }
  const urls = [site.href, ...(card !== null ? [cardUrl] : [])];
  changes.set("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(url => `<url><loc>${escape(url)}</loc></url>`).join("") + "</urlset>\n");
  changes.set("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: " + new URL("sitemap.xml", site).href + "\n");
  const regenerate = !await brandAssetsCurrent(site);
  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, site: site.href, cardUrl, socialImage: imageUrl, files: [...changes.keys()], regenerateQrCardAndVcf: regenerate, python }, null, 2));
    return;
  }

  if (regenerate) {
    if (await optionalFile("scripts/build-brand-assets.py") === null) {
      throw new Error("Falta scripts/build-brand-assets.py: no se cambió la configuración. El QR y el VCF deben regenerarse para " + cardUrl + ".");
    }
    console.log("Regenerando QR, tarjeta, imagen social y VCF para " + cardUrl);
    const result = spawnSync(python, [fileURLToPath(new URL("scripts/build-brand-assets.py", root)), "--site-url", site.href], { cwd: fileURLToPath(root), encoding: "utf8", shell: false, windowsHide: true, timeout: 120000 });
    if (result.error || result.status !== 0) {
      throw new Error("No se pudo regenerar la tarjeta. La configuración HTML todavía no se ha escrito; no publiques assets parciales. Repite el comando con --python y un intérprete que tenga Pillow y ReportLab.\n" + (result.error?.message || result.stderr || result.stdout || "Error desconocido."));
    }
    if (!await brandAssetsCurrent(site)) throw new Error("La verificación del QR/VCF y su manifiesto no coincide con la URL. No se cambió el HTML; revisa los assets antes de publicar.");
  }
  for (const [name, contents] of changes) await writeFile(new URL(name, root), contents);
  console.log("Configurados canonical, Open Graph/Twitter, tarjeta, privacidad, 404, sitemap y robots para " + site.href);
  console.log("QR y VCF verificados para " + cardUrl + ". Si cambia el proveedor de hosting, actualiza su identificación en el aviso de privacidad.");
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
