// Logic-contract tests for script.js, not a browser/DOM implementation.
// The small fixture models only event delivery, native constraint results and
// disabled fieldsets and animation callbacks used by these flows. Browser QA must
// still cover rendering, real animation geometry, focus scrolling, native
// validation UI, keyboard submission and clipboard access.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const script = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

function makeFixture({ reduced = false, whatsapp = "", clipboardFailure = false, animatedFaq = true, photos = [] } = {}) {
  let document;
  let now = new Date(2026, 9, 1, 12).getTime();
  const frames = new Map();
  let nextFrame = 0;
  class Element {
    constructor(name) {
      this.name = name;
      this.dataset = {};
      this.attributes = new Map();
      this.hidden = false;
      this.disabled = false;
      this.textContent = "";
      this.children = [];
      this.isConnected = true;
      this.listeners = new Map();
      this.classes = new Set();
      this.classList = {
        add: (...values) => values.forEach(value => this.classes.add(value)),
        remove: (...values) => values.forEach(value => this.classes.delete(value)),
        contains: value => this.classes.has(value),
        toggle: (value, force = !this.classes.has(value)) => {
          if (force) this.classes.add(value); else this.classes.delete(value);
          return force;
        }
      };
      this.styles = new Map();
      this.style = {
        setProperty: (key, value) => this.styles.set(key, value),
        removeProperty: key => { delete this.style[key]; this.styles.delete(key); }
      };
    }
    setAttribute(key, value) { this.attributes.set(key, String(value)); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    hasAttribute(key) { return this.attributes.has(key); }
    removeAttribute(key) { this.attributes.delete(key); if (key === "href") delete this.href; }
    addEventListener(type, listener) {
      this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
    }
    emit(type, details = {}) {
      const event = { target: this, preventDefault() { this.defaultPrevented = true; }, ...details };
      return (this.listeners.get(type) || []).map(listener => listener(event));
    }
    focus() { document.activeElement = this; }
    scrollIntoView(options) { this.scrollOptions = options; }
    append(...elements) { elements.forEach(element => this.children.push(...(element.isFragment ? element.children : [element]))); }
    replaceChildren(...elements) { this.children = []; this.append(...elements); }
    querySelector(selector) { return this.children.find(child => child.name === selector) || null; }
    querySelectorAll() { return []; }
    getBoundingClientRect() { return { left: 0, top: 0, width: 400, height: 500 }; }
  }
  class Field extends Element {
    constructor(name, { required = false, type = "text", maxLength = -1 } = {}) {
      super(name);
      Object.assign(this, { required, type, maxLength, value: "", checked: false, customError: "" });
      if (maxLength > 0) this.setAttribute("maxlength", maxLength);
    }
    get willValidate() { return !this.disabled && !this.parentFieldset?.disabled && !this.readOnly; }
    get validationMessage() {
      if (this.customError) return this.customError;
      if (this.required && (this.type === "checkbox" ? !this.checked : !this.value)) return "Completa este campo.";
      if (this.type === "date" && this.value && this.value < this.min) return "Elige una fecha igual o posterior al mínimo.";
      return "";
    }
    setCustomValidity(message) { this.customError = message; }
    checkValidity() { return !this.willValidate || !this.validationMessage; }
    reportValidity() { this.reported = true; return this.checkValidity(); }
    select() { this.selected = true; }
    setSelectionRange(start, end) { this.selection = [start, end]; }
  }
  const controls = {
    servicio: new Field("servicio", { required: true }),
    lugar: new Field("lugar"),
    fecha: new Field("fecha", { type: "date" }),
    mensaje: new Field("mensaje", { maxLength: 1200 }),
    nombre: new Field("nombre", { required: true, maxLength: 80 }),
    consentimiento: new Field("consentimiento", { required: true, type: "checkbox" })
  };
  controls.servicio.options = ["", "Retrato personal", "Editorial y estudio", "Familia y celebraciones", "Fotografía de producto", "Otra idea"].map(value => ({ value }));
  const steps = [1, 2].map(number => {
    const step = new Element(`step-${number}`);
    step.dataset.formStep = String(number);
    step.fields = (number === 1 ? ["servicio", "lugar", "fecha", "mensaje"] : ["nombre", "consentimiento"]).map(name => controls[name]);
    step.fields.forEach(field => { field.parentFieldset = step; });
    step.querySelectorAll = selector => selector === "input,select,textarea" ? step.fields : [];
    step.querySelector = selector => selector === "input,select,textarea" ? step.fields[0] : null;
    return step;
  });
  const form = new Element("quote-form");
  form.elements = { namedItem: name => controls[name] || null };
  form.querySelectorAll = selector => selector === "fieldset[data-form-step]" ? steps : selector === "input,select,textarea" ? Object.values(controls) : [];
  const result = new Element("message-result");
  const preview = new Field("message-preview");
  preview.readOnly = true;
  const ids = new Map([
    ["quote-form", form], ["message-result", result], ["message-preview", preview],
    ...["form-next", "form-back", "form-step-label", "form-status", "message-count", "copy-message", "send-whatsapp", "instagram-contact", "edit-message"].map(id => [id, new Element(id)])
  ]);
  const indicators = [1, 2].map(number => {
    const indicator = new Element(`indicator-${number}`);
    indicator.dataset.stepIndicator = String(number);
    return indicator;
  });
  const toggles = [new Element("motion-hero"), new Element("motion-footer")];
  const nestedMotionLabel = new Element("motion-label");
  toggles[0].querySelector = selector => selector === "[data-motion-label]" ? nestedMotionLabel : null;
  const faqs = [0, 1, 2].map(index => {
    const details = new Element(`faq-${index}`);
    const summary = new Element("summary");
    const answer = new Element("answer");
    details.setAttribute("name", "alexa-faq");
    details.open = index === 0;
    details.animations = [];
    details.activeAnimation = null;
    details.querySelector = selector => selector === "summary" ? summary : selector === ".faq-answer" ? answer : null;
    summary.getBoundingClientRect = () => ({ height: 60 });
    details.getBoundingClientRect = () => ({ height: details.activeAnimation?.currentHeight
      ?? (parseFloat(details.style.height) || (details.open ? 241 + index * 40 : 61)) });
    if (animatedFaq) details.animate = (keyframes, options) => {
      const animation = {
        keyframes, options, currentHeight: parseFloat(keyframes[0].height), canceled: false,
        cancel() {
          this.canceled = true;
          if (details.activeAnimation === this) details.activeAnimation = null;
          this.oncancel?.();
        },
        finish() { if (!this.canceled) this.onfinish?.(); }
      };
      details.animations.push(animation);
      details.activeAnimation = animation;
      return animation;
    };
    return { details, summary, answer };
  });
  const filterButtons = ["all", "producto"].map(category => {
    const button = new Element(`filter-${category}`);
    button.dataset.filter = category;
    return button;
  });
  const gallery = new Element("gallery-grid");
  const lightbox = new Element("lightbox");
  lightbox.showModal = () => { lightbox.open = true; };
  lightbox.close = () => { lightbox.open = false; lightbox.emit("close"); };
  if (photos.length) {
    ids.set("gallery-grid", gallery);
    ids.set("lightbox", lightbox);
    for (const id of ["gallery-count", "lightbox-image", "lightbox-title", "lightbox-count", "lightbox-source", "lightbox-close", "lightbox-prev", "lightbox-next"]) {
      ids.set(id, new Element(id));
    }
  }
  const serviceLink = new Element("service-link");
  serviceLink.dataset.service = "Editorial y estudio";
  const groups = new Map([
    [".motion-toggle", toggles],
    ['details[name="alexa-faq"]', faqs.map(faq => faq.details)],
    ["[data-filter]", photos.length ? filterButtons : []],
    ["[data-step-indicator]", indicators], ["[data-service]", [serviceLink]]
  ]);
  document = new Element("document");
  Object.assign(document, {
    readyState: "complete", baseURI: "https://ozzy-barbosa.github.io/alexa-lara/",
    body: new Element("body"), documentElement: new Element("html"), activeElement: null,
    querySelector: selector => ids.get(selector.slice(1)) || null,
    querySelectorAll: selector => groups.get(selector) || [],
    getElementById: id => ids.get(id) || null,
    createElement: name => new Element(name),
    createDocumentFragment: () => Object.assign(new Element("fragment"), { isFragment: true })
  });
  document.documentElement.scrollHeight = 2000;
  const media = new Map();
  for (const [query, matches] of [
    ["(prefers-reduced-motion: reduce)", reduced],
    ["(min-width: 901px)", true]
  ]) {
    const match = new Element(query);
    match.matches = matches;
    match.change = value => { match.matches = value; match.emit("change", { matches: value }); };
    media.set(query, match);
  }
  const window = new Element("window");
  Object.assign(window, {
    ALEXA_SITE: { instagram: "https://www.instagram.com/aleroblesfotografia/", whatsapp, photos },
    scrollY: 0, innerHeight: 900,
    matchMedia: query => media.get(query),
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
    getComputedStyle: () => ({ borderTopWidth: "0px", borderBottomWidth: "1px", paddingTop: "0px", paddingBottom: "0px" })
  });
  const clipboard = [];
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  vm.runInNewContext(script, {
    window, document, URL, Date: ClockDate, Intl,
    navigator: { clipboard: { async writeText(value) {
      if (clipboardFailure) throw new Error("Browser permission unavailable");
      clipboard.push(value);
    } } }
  }, { filename: "script.js" });
  const flushFrames = () => {
    for (const [id, callback] of [...frames]) { frames.delete(id); callback(); }
  };
  flushFrames();
  const input = (name, value) => {
    const field = controls[name];
    if (field.type === "checkbox") field.checked = value; else field.value = value;
    form.emit("input", { target: field });
  };
  const click = id => ids.get(id).emit("click");
  const submit = () => form.emit("submit");
  const fillFirstStep = (date = "2026-10-15") => {
    input("servicio", "Retrato personal");
    input("lugar", "La Paz, BCS");
    input("fecha", date);
    input("mensaje", "Una sesión al atardecer.");
    click("form-next");
  };
  const complete = () => { input("nombre", "  Vera  "); input("consentimiento", true); submit(); };
  return {
    controls, steps, form, ids, preview, result, indicators, document, window,
    toggles, nestedMotionLabel, serviceLink, media, clipboard,
    faqs, gallery, lightbox, filterButtons,
    input, click, submit, flushFrames, fillFirstStep, complete,
    advanceDay: () => { now += 24 * 60 * 60 * 1000; }
  };
}

test("HTML exposes both fieldsets and non-submitting navigation controls", () => {
  for (const [step, names] of [[1, ["servicio", "lugar", "fecha", "mensaje"]], [2, ["nombre", "consentimiento"]]]) {
    const fieldset = html.match(new RegExp(`<fieldset\\b[^>]*data-form-step="${step}"[^>]*>([\\s\\S]*?)</fieldset>`))?.[1];
    assert.ok(fieldset, `Missing fieldset ${step}`);
    for (const name of names) assert.match(fieldset, new RegExp(`name="${name}"`));
  }
  for (const name of ["servicio", "nombre", "consentimiento"]) {
    const control = html.match(new RegExp(`<(?:input|select)\\b[^>]*name="${name}"[^>]*>`))?.[0];
    assert.ok(control, `Missing required control ${name}`);
    assert.match(control, /\brequired\b/);
  }
  for (const id of ["form-next", "form-back", "edit-message"]) {
    const tag = html.match(new RegExp(`<button\\b[^>]*id="${id}"[^>]*>`))?.[0];
    assert.ok(tag, `Missing button ${id}`);
    assert.match(tag, /type="button"/);
  }
});

test("FAQ closes the current answer smoothly before opening the next, retaining summary focus", () => {
  const f = makeFixture();
  const [first, second] = f.faqs;
  f.faqs.forEach(faq => assert.equal(faq.details.hasAttribute("name"), false));
  second.summary.focus();
  second.summary.emit("click");
  assert.equal(first.details.open, true, "The closing answer remains rendered during collapse");
  assert.equal(second.details.open, false, "The new answer waits until collapse finishes");
  assert.equal(first.answer.inert, true);
  const collapse = first.details.activeAnimation;
  assert.equal(collapse.options.duration, 300);
  assert.deepEqual(Array.from(collapse.keyframes, frame => frame.height), ["241px", "61px"]);
  collapse.finish();
  assert.equal(first.details.open, false);
  assert.equal(first.details.style.height, undefined);
  assert.equal(second.details.open, true);
  assert.equal(f.faqs.filter(faq => faq.details.open).length, 1);
  assert.equal(f.document.activeElement, second.summary);
  second.details.activeAnimation.finish();
  assert.equal(second.details.style.height, undefined);
  assert.equal(second.details.style.overflow, undefined);
  second.summary.emit("click");
  second.details.activeAnimation.finish();
  assert.equal(f.faqs.filter(faq => faq.details.open).length, 0);
});

test("FAQ reverses from the current height and ignores obsolete animation callbacks", () => {
  const f = makeFixture();
  const [first, second, third] = f.faqs;
  second.summary.emit("click");
  const previous = first.details.activeAnimation;
  const staleFinish = previous.onfinish;
  previous.currentHeight = 155;
  first.summary.emit("click");
  const reversed = first.details.activeAnimation;
  assert.equal(previous.canceled, true);
  assert.equal(reversed.keyframes[0].height, "155px");
  staleFinish();
  assert.equal(first.details.activeAnimation, reversed);
  reversed.finish();
  assert.equal(first.details.open, true);
  second.summary.emit("click");
  const closing = first.details.activeAnimation;
  third.summary.emit("click");
  assert.equal(first.details.activeAnimation, closing, "Changing the pending answer does not restart collapse");
  closing.finish();
  assert.equal(second.details.open, false);
  assert.equal(third.details.open, true);
  third.details.activeAnimation.finish();
  assert.equal(f.faqs.filter(faq => faq.details.open).length, 1);
});

test("FAQ immediately settles and clears dimensions with reduced motion, pause or missing WAAPI", () => {
  for (const preference of ["system", "manual", "unsupported"]) {
    const f = makeFixture({ reduced: preference === "system", animatedFaq: preference !== "unsupported" });
    if (preference === "manual") f.toggles[0].emit("click");
    f.faqs[1].summary.emit("click");
    assert.equal(f.faqs[0].details.open, false);
    assert.equal(f.faqs[1].details.open, true);
    f.faqs.forEach(faq => {
      assert.equal(faq.details.animations.length, 0);
      assert.equal(faq.details.style.height, undefined);
      assert.equal(faq.details.style.overflow, undefined);
    });
  }
  for (const preference of ["system", "manual"]) {
    const f = makeFixture();
    f.faqs[1].summary.emit("click");
    const collapse = f.faqs[0].details.activeAnimation;
    if (preference === "system") f.media.get("(prefers-reduced-motion: reduce)").change(true);
    else f.toggles[1].emit("click");
    assert.equal(collapse.canceled, true);
    assert.equal(f.faqs[1].details.open, true);
    assert.equal(f.faqs.filter(faq => faq.details.open).length, 1);
    f.faqs.forEach(faq => assert.equal(faq.details.style.height, undefined));
  }
});

test("FAQ cancellation and viewport resize cannot leave a clipped or stuck answer", () => {
  const f = makeFixture();
  f.faqs[1].summary.emit("click");
  f.faqs[0].details.activeAnimation.cancel();
  assert.equal(f.faqs[0].details.open, false);
  assert.equal(f.faqs[1].details.open, true);
  f.window.emit("resize");
  assert.equal(f.faqs[1].details.activeAnimation, null);
  assert.equal(f.faqs[1].details.style.overflow, undefined);
  assert.equal(f.faqs[1].details.style.height, undefined);
});

test("product photos are included and the lightbox never invents an Instagram source", () => {
  const common = { published: true, width: 800, height: 1000, src: "assets/sample.webp", alt: "Fotografía" };
  const f = makeFixture({ photos: [
    { ...common, id: "instagram", title: "Retrato", category: "retratos", source: "https://www.instagram.com/p/real-post/" },
    { ...common, id: "client", title: "Producto", category: "producto", source: "", provenance: "client" }
  ] });
  assert.equal(f.gallery.children.length, 2);
  f.gallery.children[0].children[0].emit("click");
  const source = f.ids.get("lightbox-source");
  assert.equal(source.hidden, false);
  assert.equal(source.href, "https://www.instagram.com/p/real-post/");
  f.ids.get("lightbox-next").emit("click");
  assert.equal(source.hidden, true);
  assert.equal(source.href, undefined);
  f.lightbox.close();
  f.filterButtons[1].emit("click");
  assert.equal(f.gallery.children.length, 1);
  assert.equal(f.gallery.children[0].dataset.category, "producto");
  assert.equal(f.ids.get("gallery-count").textContent, "1 de 1 fotografías · Producto");
});

test("system reduced motion and both pause controls stay synchronized", () => {
  const f = makeFixture({ reduced: true });
  assert.equal(f.document.documentElement.dataset.motion, "reduced");
  f.toggles.forEach(toggle => {
    assert.equal(toggle.disabled, true);
    assert.equal(toggle.getAttribute("aria-pressed"), "true");
  });
  assert.equal(f.document.body.classList.contains("motion-paused"), true);
  f.media.get("(prefers-reduced-motion: reduce)").change(false);
  assert.equal(f.nestedMotionLabel.textContent, "Pausar movimiento");
  f.toggles.forEach(toggle => assert.equal(toggle.disabled, false));
  f.toggles[0].emit("click");
  assert.equal(f.toggles[1].textContent, "Activar movimiento");
  f.media.get("(prefers-reduced-motion: reduce)").change(true);
  f.media.get("(prefers-reduced-motion: reduce)").change(false);
  assert.equal(f.toggles[0].getAttribute("aria-pressed"), "true", "Manual pause survives OS preference changes");
  f.toggles[1].emit("click");
  f.toggles.forEach(toggle => assert.equal(toggle.getAttribute("aria-pressed"), "false"));
  assert.equal(f.document.body.classList.contains("motion-paused"), false);
  f.media.get("(prefers-reduced-motion: reduce)").change(true);
  assert.equal(f.document.body.classList.contains("motion-paused"), true);
  assert.equal(f.document.documentElement.dataset.motion, "reduced");
});

test("step one validates service and local date, then preserves disabled values", () => {
  const f = makeFixture();
  assert.equal(f.form.noValidate, true);
  assert.equal(f.form.dataset.formState, "step-1");
  assert.equal(f.steps[1].disabled, true);
  f.click("form-next");
  assert.equal(f.document.activeElement, f.controls.servicio);
  assert.equal(f.controls.servicio.getAttribute("aria-invalid"), "true");
  f.input("servicio", "Retrato personal");
  f.input("fecha", "2026-09-30");
  f.click("form-next");
  assert.equal(f.controls.fecha.min, "2026-10-01");
  assert.equal(f.document.activeElement, f.controls.fecha);
  assert.equal(f.form.dataset.formState, "step-1");
  f.fillFirstStep();
  assert.equal(f.form.dataset.formState, "step-2");
  assert.equal(f.steps[0].disabled, true);
  assert.equal(f.steps[0].hidden, true);
  assert.equal(f.document.activeElement, f.controls.nombre);
  assert.equal(f.ids.get("message-count").textContent, "24 / 1200");
  assert.equal(f.form.scrollOptions.block, "start");
  f.click("form-back");
  assert.equal(f.controls.mensaje.value, "Una sesión al atardecer.");
  assert.equal(f.controls.fecha.value, "2026-10-15");
  assert.equal(f.document.activeElement, f.controls.servicio);
});

test("step two rejects blank/short names and missing consent before preparing a result", () => {
  const f = makeFixture();
  f.fillFirstStep();
  for (const name of ["   ", "V"]) {
    f.input("nombre", name);
    f.submit();
    assert.equal(f.form.dataset.formState, "step-2");
    assert.equal(f.document.activeElement, f.controls.nombre);
    assert.equal(f.controls.nombre.getAttribute("aria-invalid"), "true");
  }
  f.input("nombre", "  Vera  ");
  f.submit();
  assert.equal(f.document.activeElement, f.controls.consentimiento);
  assert.equal(f.result.hidden, true);
  f.input("consentimiento", true);
  f.submit();
  assert.equal(f.controls.nombre.value, "Vera");
  assert.equal(f.form.dataset.formState, "ready");
  assert.equal(f.result.hidden, false);
  assert.equal(f.document.activeElement, f.result);
  assert.match(f.preview.value, /Soy Vera\./);
  assert.match(f.preview.value, /Retrato personal/);
  assert.match(f.preview.value, /15 de octubre de 2026/);
  assert.match(f.preview.value, /La Paz, BCS/);
  assert.match(f.preview.value, /Una sesión al atardecer/);
  f.steps.forEach(step => { assert.equal(step.hidden, true); assert.equal(step.disabled, true); });
  assert.equal(f.ids.get("send-whatsapp").hidden, true);
  assert.equal(f.ids.get("send-whatsapp").href, undefined);
});

test("an expired first-step date is rechecked when preparing the final message", () => {
  const f = makeFixture();
  f.fillFirstStep("2026-10-01");
  f.advanceDay();
  f.complete();
  assert.equal(f.controls.fecha.min, "2026-10-02");
  assert.equal(f.form.dataset.formState, "step-1");
  assert.equal(f.document.activeElement, f.controls.fecha);
  assert.equal(f.controls.nombre.value, "  Vera  ");
  assert.equal(f.preview.value, "");
});

test("editing removes prepared WhatsApp URLs while preserving input and service selection", () => {
  const f = makeFixture({ whatsapp: "+526121234567" });
  f.fillFirstStep();
  f.complete();
  const link = f.ids.get("send-whatsapp");
  assert.equal(link.hidden, false);
  const url = new URL(link.href);
  assert.equal(url.origin + url.pathname, "https://wa.me/526121234567");
  assert.equal(url.searchParams.get("text"), f.preview.value);
  f.click("edit-message");
  assert.equal(f.form.dataset.formState, "step-1");
  assert.equal(f.controls.nombre.value, "Vera");
  assert.equal(f.controls.mensaje.value, "Una sesión al atardecer.");
  assert.equal(link.hidden, true);
  assert.equal(link.href, undefined);
  assert.equal(f.preview.value, "");
  f.click("form-next");
  f.submit();
  f.serviceLink.emit("click");
  assert.equal(f.form.dataset.formState, "step-1");
  assert.equal(f.controls.servicio.value, "Editorial y estudio");
  assert.equal(link.href, undefined);
});

test("copying is explicit, with manual selection if browser clipboard access fails", async () => {
  const f = makeFixture({ whatsapp: "123" });
  f.fillFirstStep();
  f.complete();
  assert.equal(f.ids.get("send-whatsapp").hidden, true);
  assert.deepEqual(f.clipboard, []);
  await Promise.all(f.click("copy-message"));
  assert.deepEqual(f.clipboard, [f.preview.value]);
  const fallback = makeFixture({ clipboardFailure: true });
  fallback.fillFirstStep();
  fallback.complete();
  await Promise.all(fallback.click("copy-message"));
  assert.equal(fallback.document.activeElement, fallback.preview);
  assert.equal(fallback.preview.selected, true);
  assert.deepEqual(fallback.preview.selection, [0, fallback.preview.value.length]);
});

test("product consultation prepares the confirmed WhatsApp link without sending or copying", () => {
  const f = makeFixture({ whatsapp: "5216121044559" });
  f.serviceLink.dataset.service = "Fotografía de producto";
  f.serviceLink.emit("click");
  assert.equal(f.controls.servicio.value, "Fotografía de producto");
  assert.equal(f.form.dataset.formState, "step-1");
  assert.equal(f.ids.get("send-whatsapp").href, undefined);
  f.input("mensaje", "Fotografías para mi catálogo.");
  f.click("form-next");
  f.complete();
  assert.equal(f.form.dataset.formState, "ready");
  const link = f.ids.get("send-whatsapp");
  assert.equal(link.hidden, false);
  const url = new URL(link.href);
  assert.equal(url.origin + url.pathname, "https://wa.me/5216121044559");
  assert.equal(url.searchParams.get("text"), f.preview.value);
  assert.match(f.preview.value, /Me interesa: Fotografía de producto\./);
  assert.match(f.preview.value, /Fotografías para mi catálogo\./);
  assert.match(f.ids.get("form-status").textContent, /Aún no se ha enviado nada/);
  assert.deepEqual(f.clipboard, []);
  assert.equal(link.target, "_blank");
  assert.equal(link.rel, "noopener noreferrer");
});
