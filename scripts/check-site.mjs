import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root,"index.html"),"utf8");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root,"data.js"),"utf8"),sandbox);
const data = sandbox.window.ALEXA_SITE;
const photos = data.photos.filter(p => p.published);
assert(photos.length >= 18, "La galería debe tener al menos 18 fotografías publicadas.");
assert.equal(new Set(photos.map(p=>p.id)).size, photos.length, "IDs repetidos.");
assert.equal(new Set(photos.map(p=>p.src)).size, photos.length, "Fotografías repetidas.");
for(const photo of photos) {
  assert(photo.alt && photo.title && photo.width > 0 && photo.height > 0, "Ficha incompleta: " + photo.id);
  assert(["retratos","editorial","familia","exteriores"].includes(photo.category), "Categoría desconocida: " + photo.id);
  assert(/^https:\/\/www\.instagram\.com\/.+/.test(photo.source), "Falta fuente de Instagram: " + photo.id);
  for(const field of ["src","full"]) assert(fs.existsSync(path.join(root,photo[field])), "Archivo ausente: " + photo[field]);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,"IDs HTML duplicados.");
for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if(value.startsWith("#")) assert(ids.includes(value.slice(1)),"Ancla inexistente: " + value);
  else if(!/^(?:https?:|mailto:|tel:|data:)/.test(value)) assert(fs.existsSync(path.join(root,value)),"Recurso HTML ausente: " + value);
}
assert.equal((html.match(/<h1\b/g)||[]).length,1,"Debe existir un único H1.");
assert(!/unsplash|example\.com/i.test(html),"El HTML conserva referencias provisionales incorrectas.");
assert(!/example\.com/.test(fs.readFileSync(path.join(root,"robots.txt"),"utf8")),"Robots conserva dominio ficticio.");
JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
console.log("OK: " + photos.length + " fotografías únicas, archivos locales, anclas, metadatos e IDs.");
console.log("OK: " + data.futureSlots.length + " posiciones reservadas, no publicadas.");
