(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const modal = document.querySelector("[data-contact-modal]");
  const modalDialog = modal ? modal.querySelector(".modal-dialog") : null;
  const openContactButtons = document.querySelectorAll("[data-open-contact]");
  const closeContactButtons = document.querySelectorAll("[data-close-contact]");
  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  const workSlides = [
    {
      src: "assets/images/work-2.jpg",
      alt: "Euro Forum stage and auditorium",
      caption: "Euro Forum"
    },
    {
      src: "assets/images/work-1.jpg",
      alt: "Corporate event with red stage lighting",
      caption: "Corporate show"
    },
    {
      src: "assets/images/work-3.jpg",
      alt: "Dark stage with light beams and performers",
      caption: "Stage production"
    },
    {
      src: "assets/images/work-4.jpg",
      alt: "Live performance with flags and stage lights",
      caption: "Show performance"
    }
  ];

  const heroBackgrounds = [
    "assets/images/work-2.jpg",
    "assets/images/work-4.jpg",
    "assets/images/work-1.jpg",
    "assets/images/work-5.jpg",
    "assets/images/work-7.jpg"
  ];

  let lastFocusedElement = null;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    header.classList.remove("nav-active");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  }

  function toggleNav() {
    if (!nav || !navToggle) return;
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("nav-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("nav-open", isOpen);
  }

  function openContactModal() {
    if (!modal || !modalDialog) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    body.classList.add("modal-open");
    closeNav();
    requestAnimationFrame(() => modalDialog.focus());
  }

  function closeContactModal() {
    if (!modal) return;
    modal.hidden = true;
    body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function setupWorkGallery() {
    const image = document.querySelector("[data-work-image]");
    const caption = document.querySelector("[data-work-caption]");
    const thumbs = Array.from(document.querySelectorAll("[data-work-thumb]"));
    if (!image || !caption || !thumbs.length) return;

    let index = 0;
    let timer = null;

    function render(nextIndex) {
      index = (nextIndex + workSlides.length) % workSlides.length;
      const slide = workSlides[index];
      image.classList.add("is-switching");
      window.setTimeout(() => {
        image.src = slide.src;
        image.alt = slide.alt;
        caption.textContent = slide.caption;
        thumbs.forEach((thumb, thumbIndex) => {
          thumb.classList.toggle("active", thumbIndex === index);
        });
        image.classList.remove("is-switching");
      }, 140);
    }

    function start() {
      stop();
      timer = window.setInterval(() => render(index + 1), 4200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        render(Number(thumb.dataset.workThumb));
        start();
      });
    });

    start();
  }

  function setupHeroBackground() {
    const layers = [document.querySelector("[data-hero-bg-a]"), document.querySelector("[data-hero-bg-b]")];
    if (!layers[0] || !layers[1]) return;

    let index = 0;
    let activeLayer = 0;
    layers[0].style.setProperty("--hero-image", `url("${heroBackgrounds[0]}")`);
    layers[1].style.setProperty("--hero-image", `url("${heroBackgrounds[1]}")`);

    window.setInterval(() => {
      index = (index + 1) % heroBackgrounds.length;
      const nextLayer = activeLayer === 0 ? 1 : 0;
      layers[nextLayer].style.setProperty("--hero-image", `url("${heroBackgrounds[index]}")`);
      layers[nextLayer].classList.add("is-active");
      layers[activeLayer].classList.remove("is-active");
      activeLayer = nextLayer;
    }, 4600);
  }

  function setupWhyAnimation() {
    const badges = Array.from(document.querySelectorAll(".why-grid span"));
    if (!badges.length) return;
    const variants = ["is-lit", "is-pink", "is-green"];

    function resetBadge(badge) {
      variants.forEach((className) => badge.classList.remove(className));
    }

    window.setInterval(() => {
      badges.forEach(resetBadge);
      const count = Math.min(2, badges.length);
      const used = new Set();
      for (let i = 0; i < count; i += 1) {
        let badgeIndex = Math.floor(Math.random() * badges.length);
        while (used.has(badgeIndex)) {
          badgeIndex = Math.floor(Math.random() * badges.length);
        }
        used.add(badgeIndex);
        const variant = variants[Math.floor(Math.random() * variants.length)];
        badges[badgeIndex].classList.add(variant);
      }
    }, 4500);
  }

  function submitContactForm(event) {
    event.preventDefault();
    if (!contactForm || !formStatus) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const eventType = String(formData.get("event") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`EventBerry request from ${name || "website"}`);
    const bodyText = [
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Event type: ${eventType}`,
      "",
      message || "Message:"
    ].join("\n");

    formStatus.textContent = "Your request is ready in an email draft.";
    window.location.href = `mailto:letsdoit@eventberry.agency?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  navToggle && navToggle.addEventListener("click", toggleNav);
  nav && nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) closeNav();
  });

  openContactButtons.forEach((button) => button.addEventListener("click", openContactModal));
  closeContactButtons.forEach((button) => button.addEventListener("click", closeContactModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeContactModal();
      closeNav();
    }
  });

  contactForm && contactForm.addEventListener("submit", submitContactForm);

  setupReveal();
  setupWorkGallery();
  setupHeroBackground();
  setupWhyAnimation();
})();
