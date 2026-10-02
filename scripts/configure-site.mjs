// Local publishing helper. Usage: npm run configure -- https://your-domain.com[/subfolder/]
import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const input = process.argv[2];
if (!input) {
  console.error("Indica la URL final del sitio: npm run configure -- https://tu-dominio.com");
  process.exit(1);
}
let site;
try {
  site = new URL(input);
  if (site.protocol !== "https:" || site.username || site.password || site.search || site.hash) throw new Error();
  if (!site.pathname.endsWith("/")) site.pathname += "/";
} catch {
  console.error("Usa una URL HTTPS sin credenciales, parámetros ni fragmentos.");
  process.exit(1);
}
const escape = value => value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const home = escape(site.href);
const indexFile = new URL("index.html", root);
let html = await readFile(indexFile, "utf8");
html = html.replace(/\s*<link rel="canonical"[^>]*>/g, "").replace(/\s*<meta property="og:url"[^>]*>/g, "");
html = html.replace("</head>", '  <link rel="canonical" href="' + home + '">\n  <meta property="og:url" content="' + home + '">\n</head>');
html = html.replace(/<meta property="og:image"[^>]*>/, '<meta property="og:image" content="' + escape(new URL("assets/instagram/6c7baf05c3cd4e0c-1600.webp", site).href) + '">');
await writeFile(indexFile, html);
await writeFile(new URL("sitemap.xml", root), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + home + '</loc></url></urlset>\n');
await writeFile(new URL("robots.txt", root), "User-agent: *\nAllow: /\n\nSitemap: " + new URL("sitemap.xml", site).href + "\n");
let errorPage = await readFile(new URL("404.html", root), "utf8");
errorPage = errorPage.replace(/<a href="[^"]*">/, '<a href="' + home + '">');
errorPage = errorPage.replace(/href="[^"]*assets\/favicon.svg"/, 'href="' + escape(new URL("assets/favicon.svg", site).href) + '"');
await writeFile(new URL("404.html", root), errorPage);
const privacyFile = new URL("privacidad.html", root);
let privacy = await readFile(privacyFile, "utf8");
privacy = privacy.replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="' + escape(new URL("privacidad.html", site).href) + '">');
await writeFile(privacyFile, privacy);
console.log("Configurados canonical, Open Graph, privacidad, 404, sitemap y robots para " + site.href);
console.log("Revisa las imágenes, los servicios y el WhatsApp en data.js antes de subir a hosting.");
