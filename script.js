(() => {
  "use strict";

  const init = () => {
    const config = window.ALEXA_SITE || {};
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px)");
    const categoryLabels = {
      retratos: "Retratos", editorial: "Editorial", familia: "Familia", exteriores: "Exteriores"
    };
    const instagramFallback = "https://www.instagram.com/aleroblesfotografia/";
    const instagramURL = (value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" && /^(www\.)?instagram\.com$/.test(url.hostname)
          ? url.href : null;
      } catch { return null; }
    };
    const mediaURL = (value) => {
      if (typeof value !== "string" || !value.trim()) return null;
      try {
        const url = new URL(value, document.baseURI);
        return ["https:", "http:", "file:"].includes(url.protocol) ? url.href : null;
      } catch { return null; }
    };
    const officialInstagram = instagramURL(config.instagram) || instagramFallback;
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
    const instagramContact = $("#instagram-contact");
    if (instagramContact) instagramContact.href = officialInstagram;

    // Closed mobile navigation must also leave the keyboard tab order.
    const menu = $("#main-menu") || $(".nav-links");
    const menuToggle = $(".menu-toggle");
    const setMenu = (open, returnFocus = false) => {
      const expanded = Boolean(open && !desktop.matches);
      menu?.classList.toggle("is-open", expanded);
      if (menu) {
        menu.inert = !desktop.matches && !expanded;
        if (desktop.matches) menu.removeAttribute("aria-hidden");
        else menu.setAttribute("aria-hidden", String(!expanded));
      }
      document.body.classList.toggle("menu-open", expanded);
      menuToggle?.setAttribute("aria-expanded", String(expanded));
      menuToggle?.setAttribute("aria-label", expanded ? "Cerrar menú" : "Abrir menú");
      if (returnFocus) menuToggle?.focus();
    };
    menuToggle?.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    menu?.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      const wasOpen = document.body.classList.contains("menu-open");
      setMenu(false);
      if (wasOpen && link.hash) {
        const section = document.getElementById(link.hash.slice(1));
        if (section) {
          if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
          section.focus({ preventScroll: true });
        }
      }
    });
    document.addEventListener("click", (event) => {
      if (document.body.classList.contains("menu-open") &&
          !menu?.contains(event.target) && !menuToggle?.contains(event.target)) setMenu(false);
    });
    desktop.addEventListener("change", () => { setMenu(false); requestScrollUpdate(); });
    setMenu(false);

    // Motion never overrides the visitor's system preference.
    const motionToggle = $(".motion-toggle");
    let manuallyPaused = false;
    const motionIsOff = () => reducedMotion.matches || manuallyPaused;
    let revealObserver;
    const reveal = (element) => {
      element.classList.add("is-visible");
      revealObserver?.unobserve(element);
    };
    const observeReveals = (elements) => {
      elements.forEach((element) => {
        if (motionIsOff() || !revealObserver) reveal(element);
        else {
          element.classList.add("reveal-ready");
          revealObserver.observe(element);
        }
      });
    };
    if ("IntersectionObserver" in window) {
      try {
        revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target); });
        }, { threshold: 0.06, rootMargin: "0px 0px 30px 0px" });
      } catch { /* Content remains visible if observation is unavailable. */ }
    }
    const applyMotionPreference = () => {
      const paused = motionIsOff();
      document.body.classList.toggle("motion-paused", paused);
      document.documentElement.dataset.motion = paused ? "reduced" : "full";
      if (motionToggle) {
        motionToggle.setAttribute("aria-pressed", String(paused));
        const label = reducedMotion.matches ? "Movimiento reducido" : paused ? "Activar movimiento" : "Pausar movimiento";
        const labelNode = $("[data-motion-label]", motionToggle);
        if (labelNode) labelNode.textContent = label;
        else motionToggle.textContent = label;
        motionToggle.setAttribute("aria-label", label);
        motionToggle.disabled = reducedMotion.matches;
      }
      if (paused) $$(".reveal-ready").forEach(reveal);
      requestScrollUpdate();
    };
    motionToggle?.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      applyMotionPreference();
    });
    reducedMotion.addEventListener("change", applyMotionPreference);

    const header = $(".site-header");
    const progress = $("#scroll-progress");
    const parallaxElements = $$("[data-parallax]");
    let scrollFrame = 0;
    function updateScroll() {
      scrollFrame = 0;
      header?.classList.toggle("scrolled", window.scrollY > 32);
      if (progress) {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
      }
      parallaxElements.forEach((element) => {
        const configuredFactor = Number(element.dataset.parallax);
        const factor = Number.isFinite(configuredFactor) ? configuredFactor : 0.035;
        const offset = motionIsOff() || !desktop.matches ? 0 : Math.min(40, Math.max(-30, window.scrollY * factor));
        element.style.setProperty("--parallax-y", `${offset}px`);
      });
    }
    function requestScrollUpdate() {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    }
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    applyMotionPreference();
    observeReveals($$("[data-reveal]"));

    // Only published records with an actual source image enter the portfolio.
    const photos = (Array.isArray(config.photos) ? config.photos : []).filter((photo) =>
      photo && photo.published === true && categoryLabels[photo.category] && mediaURL(photo.src)
    );
    const gallery = $("#gallery-grid");
    const galleryCount = $("#gallery-count");
    const galleryMore = $("#gallery-more");
    const galleryEmpty = $("#gallery-empty");
    const filterButtons = $$("[data-filter]");
    let filter = "all";
    let visibleCount = 12;
    let filteredPhotos = photos;
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightbox-image");
    const lightboxTitle = $("#lightbox-title");
    const lightboxCount = $("#lightbox-count");
    const lightboxSource = $("#lightbox-source");
    const lightboxClose = $("#lightbox-close");
    const lightboxPrevious = $("#lightbox-prev");
    const lightboxNext = $("#lightbox-next");
    let lightboxIndex = 0;
    let openingButton = null;

    const updateLightbox = () => {
      const photo = filteredPhotos[lightboxIndex];
      if (!photo || !lightboxImage) return;
      lightboxImage.src = mediaURL(photo.full) || mediaURL(photo.src);
      lightboxImage.alt = photo.alt || photo.title || "Fotografía de Alexa Lara";
      if (lightboxTitle) lightboxTitle.textContent = photo.title || categoryLabels[photo.category];
      if (lightboxCount) lightboxCount.textContent = `${lightboxIndex + 1} / ${filteredPhotos.length}`;
      if (lightboxSource) {
        lightboxSource.href = instagramURL(photo.source) || officialInstagram;
        lightboxSource.target = "_blank";
        lightboxSource.rel = "noopener noreferrer";
      }
      if (lightboxPrevious) lightboxPrevious.disabled = filteredPhotos.length < 2;
      if (lightboxNext) lightboxNext.disabled = filteredPhotos.length < 2;
    };
    const openLightbox = (index, trigger) => {
      if (!lightbox || !lightboxImage || typeof lightbox.showModal !== "function") return;
      openingButton = trigger;
      lightboxIndex = index;
      updateLightbox();
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
      lightboxClose?.focus({ preventScroll: true });
    };
    const closeLightbox = () => { if (lightbox?.open) lightbox.close(); };
    const stepLightbox = (direction) => {
      if (!filteredPhotos.length) return;
      lightboxIndex = (lightboxIndex + direction + filteredPhotos.length) % filteredPhotos.length;
      updateLightbox();
    };
    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrevious?.addEventListener("click", () => stepLightbox(-1));
    lightboxNext?.addEventListener("click", () => stepLightbox(1));
    lightbox?.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
      lightboxImage?.removeAttribute("src");
      if (openingButton?.isConnected) openingButton.focus({ preventScroll: true });
    });
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    let touchStart = null;
    lightboxImage?.addEventListener("touchstart", (event) => {
      touchStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    lightboxImage?.addEventListener("touchend", (event) => {
      if (!touchStart || !event.changedTouches.length) return;
      const deltaX = event.changedTouches[0].clientX - touchStart.x;
      const deltaY = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) stepLightbox(deltaX < 0 ? 1 : -1);
      touchStart = null;
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (lightbox?.open && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        stepLightbox(event.key === "ArrowRight" ? 1 : -1);
      } else if (event.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false, true);
    });

    const buildPhoto = (photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      figure.dataset.category = photo.category;
      figure.dataset.reveal = "";
      const width = Number(photo.width) || 1080;
      const height = Number(photo.height) || 1350;
      figure.style.setProperty("--photo-ratio", `${width} / ${height}`);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-open";
      button.setAttribute("aria-label", `Ampliar ${photo.title || categoryLabels[photo.category]}`);
      button.setAttribute("aria-haspopup", "dialog");
      const img = document.createElement("img");
      img.src = mediaURL(photo.src);
      const sourceWidth = Number(photo.srcWidth);
      const fullWidth = Number(photo.fullWidth);
      const fullSource = mediaURL(photo.full);
      if (Number.isFinite(sourceWidth) && sourceWidth > 0 && Number.isFinite(fullWidth) &&
          fullWidth > sourceWidth && fullSource) {
        img.srcset = `${mediaURL(photo.src)} ${sourceWidth}w, ${fullSource} ${fullWidth}w`;
        img.sizes = "(max-width:600px) calc((100vw - 54px)/2), (max-width:900px) calc((100vw - 84px)/2), (max-width:1100px) calc((100vw - 104px)/3), (min-width:1424px) 421px, calc((100vw - 160px)/3)";
      }
      img.alt = photo.alt || photo.title || "Fotografía de Alexa Lara";
      img.width = width;
      img.height = height;
      img.loading = "lazy";
      img.decoding = "async";
      if (photo.position) img.style.objectPosition = photo.position;
      img.addEventListener("error", () => {
        figure.classList.add("is-unavailable");
        button.disabled = true;
        button.setAttribute("aria-label", "Esta fotografía no está disponible por el momento");
      }, { once: true });
      const zoom = document.createElement("span");
      zoom.className = "gallery-zoom";
      zoom.setAttribute("aria-hidden", "true");
      zoom.textContent = "↗";
      button.append(img, zoom);
      button.addEventListener("click", () => openLightbox(index, button));
      const caption = document.createElement("figcaption");
      caption.className = "gallery-caption";
      const number = document.createElement("span");
      number.className = "gallery-index";
      number.textContent = String(index + 1).padStart(2, "0");
      number.setAttribute("aria-hidden", "true");
      const title = document.createElement("h3");
      title.className = "gallery-title";
      title.textContent = photo.title || categoryLabels[photo.category];
      const category = document.createElement("span");
      category.className = "gallery-category";
      category.textContent = categoryLabels[photo.category];
      caption.append(number, title, category);
      figure.append(button, caption);
      return figure;
    };
    const renderGallery = (append = false) => {
      if (!gallery) return;
      const start = append ? gallery.children.length : 0;
      if (!append) {
        [...gallery.children].forEach((child) => revealObserver?.unobserve(child));
        gallery.replaceChildren();
      }
      const fragment = document.createDocumentFragment();
      const newCards = [];
      filteredPhotos.slice(start, visibleCount).forEach((photo, offset) => {
        const card = buildPhoto(photo, start + offset);
        newCards.push(card);
        fragment.append(card);
      });
      gallery.append(fragment);
      observeReveals(newCards);
      const shown = Math.min(visibleCount, filteredPhotos.length);
      if (galleryCount) galleryCount.textContent = `${shown} de ${filteredPhotos.length} fotografías${filter === "all" ? "" : ` · ${categoryLabels[filter]}`}`;
      const moreFocused = document.activeElement === galleryMore;
      if (galleryMore) {
        galleryMore.hidden = shown >= filteredPhotos.length;
        galleryMore.textContent = `Ver más fotografías (${Math.max(0, filteredPhotos.length - shown)})`;
      }
      if (galleryEmpty) galleryEmpty.hidden = filteredPhotos.length > 0;
      if (append && moreFocused && newCards.length) {
        reveal(newCards[0]);
        $("button", newCards[0])?.focus({ preventScroll: true });
      }
      requestScrollUpdate();
    };
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;
        if (selected !== "all" && !categoryLabels[selected]) return;
        filter = selected;
        visibleCount = 12;
        filteredPhotos = filter === "all" ? photos : photos.filter((photo) => photo.category === filter);
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        renderGallery();
      });
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    galleryMore?.addEventListener("click", () => { visibleCount += 9; renderGallery(true); });
    renderGallery();

    const quoteForm = $("#quote-form");
    const formStatus = $("#form-status");
    const messageResult = $("#message-result");
    const messagePreview = $("#message-preview");
    const copyMessage = $("#copy-message");
    const sendWhatsApp = $("#send-whatsapp");
    const nameField = quoteForm?.elements.namedItem("nombre");
    const dateField = quoteForm?.elements.namedItem("fecha");
    const localDate = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    };
    if (dateField) dateField.min = localDate();
    [["nombre", 80], ["lugar", 180], ["mensaje", 1200]].forEach(([name, length]) => {
      const field = quoteForm?.elements.namedItem(name);
      if (field && !field.hasAttribute("maxlength")) field.maxLength = length;
    });
    nameField?.addEventListener("input", () => nameField.setCustomValidity(""));
    const invalidateMessage = () => {
      if (messageResult) messageResult.hidden = true;
      if (sendWhatsApp) { sendWhatsApp.hidden = true; sendWhatsApp.removeAttribute("href"); }
      if (formStatus) formStatus.textContent = "";
    };
    quoteForm?.addEventListener("input", (event) => {
      if (event.target !== messagePreview) invalidateMessage();
    });
    $$("[data-service]").forEach((link) => link.addEventListener("click", () => {
      const serviceField = quoteForm?.elements.namedItem("servicio");
      if (serviceField && [...serviceField.options].some((option) => option.value === link.dataset.service)) {
        serviceField.value = link.dataset.service;
        invalidateMessage();
      }
    }));
    quoteForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (nameField) {
        nameField.value = nameField.value.trim();
        nameField.setCustomValidity(nameField.value.length < 2 ? "Escribe tu nombre para preparar la consulta." : "");
      }
      if (dateField) dateField.min = localDate();
      if (!quoteForm.reportValidity()) return;
      const form = new FormData(quoteForm);
      const value = (name) => String(form.get(name) || "").trim();
      const rawDate = value("fecha");
      const formattedDate = rawDate
        ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(`${rawDate}T12:00:00`))
        : "Por definir";
      const message = [
        "Hola Alexa, vi tu portafolio y me gustaría conocer más sobre una sesión.", "",
        `Soy ${value("nombre")}.`, `Me interesa: ${value("servicio")}.`,
        `Fecha aproximada: ${formattedDate}.`, `Lugar: ${value("lugar") || "Me gustaría recibir sugerencias"}.`,
        "", value("mensaje") || "¿Podrías compartirme disponibilidad y opciones?"
      ].join("\n");
      if (messagePreview) messagePreview.value = message;
      if (messageResult) messageResult.hidden = false;
      const rawNumber = String(config.whatsapp || "").trim();
      const number = rawNumber.replace(/^\+/, "");
      const hasWhatsApp = /^[1-9]\d{9,14}$/.test(number);
      if (sendWhatsApp) {
        sendWhatsApp.hidden = !hasWhatsApp;
        if (hasWhatsApp) {
          sendWhatsApp.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
          sendWhatsApp.target = "_blank";
          sendWhatsApp.rel = "noopener noreferrer";
        } else sendWhatsApp.removeAttribute("href");
      }
      if (formStatus) formStatus.textContent = hasWhatsApp
        ? "Tu mensaje está listo. Revísalo y abre WhatsApp para enviarlo. Aún no se ha enviado nada."
        : "Tu mensaje está listo. Cópialo y envíaselo a Alexa por Instagram para consultar disponibilidad.";
      if (messageResult) {
        messageResult.tabIndex = -1;
        messageResult.focus({ preventScroll: true });
        messageResult.scrollIntoView({ behavior: motionIsOff() ? "auto" : "smooth", block: "nearest" });
      }
    });
    copyMessage?.addEventListener("click", async () => {
      if (!messagePreview?.value) return;
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(messagePreview.value);
        if (formStatus) formStatus.textContent = "Mensaje copiado. Ya puedes pegarlo en tu conversación con Alexa.";
      } catch {
        messagePreview.focus();
        messagePreview.select();
        messagePreview.setSelectionRange(0, messagePreview.value.length);
        if (formStatus) formStatus.textContent = "Seleccionamos tu mensaje. Usa la opción Copiar de tu dispositivo y pégalo en Instagram.";
      }
    });

    // Keep the header's section indicator in sync without changing the URL.
    if ("IntersectionObserver" in window && menu) {
      const links = $$("a[href^='#']", menu);
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
      links.forEach((link) => {
        const section = document.getElementById(link.hash.slice(1));
        if (section) sectionObserver.observe(section);
      });
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
