/* =========================================================
   DESISTEPS
   CONTACT PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =======================================================
     PRELOADER
  ======================================================= */

  const preloader = $("#preloader");

  const hidePreloader = () => {
    if (!preloader) return;

    preloader.classList.add("hide");
  };

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 450);
  });

  setTimeout(hidePreloader, 2500);

  /* =======================================================
     NAVBAR SCROLL
  ======================================================= */

  const navbar = $("#navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 35);
  };

  updateNavbar();

  window.addEventListener("scroll", updateNavbar, { passive: true });

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  const openMenu = () => {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");

    menuToggle.setAttribute("aria-label", "Close navigation menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.contains("active");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();

      $$(".faq-item.open").forEach((item) => {
        item.classList.remove("open");

        const button = $(".faq-question", item);

        button?.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* =======================================================
     FAQ ACCORDION
  ======================================================= */

  $$(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");

      if (!item) return;

      const isOpen = item.classList.contains("open");

      // Close all other FAQ items

      $$(".faq-item.open").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("open");

          const otherButton = $(".faq-question", otherItem);

          otherButton?.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle selected item

      item.classList.toggle("open", !isOpen);

      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* =======================================================
     REVEAL ANIMATIONS
  ======================================================= */

  const revealItems = $$(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => {
      element.classList.add("active");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealItems.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =======================================================
     CONTACT CARD STAGGER
  ======================================================= */

  if (!prefersReducedMotion) {
    $$(".contact-card").forEach((card, index) => {
      card.style.transitionDelay = `${index * 80}ms`;
    });
  }

  /* =======================================================
     HERO IMAGE PARALLAX
  ======================================================= */

  const heroImage = $(".hero-image-wrap img");

  const canParallax = window.matchMedia("(pointer: fine)").matches;

  if (heroImage && canParallax && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      const hero = $(".contact-hero");

      if (!hero) return;

      const rect = hero.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;

        return;
      }

      const movement = Math.max(-20, Math.min(20, scrollY * 0.05));

      heroImage.style.transform = `translateY(${movement}px) scale(1.03)`;

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);

          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* =======================================================
     IMAGE FALLBACK
  ======================================================= */

  $$("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });

  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",

        block: "start",
      });
    });
  });

  /* =======================================================
     RESIZE
  ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
      closeMenu();
    }
  });

  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const currentYear = new Date().getFullYear();

  $$("[data-year]").forEach((element) => {
    element.textContent = currentYear;
  });

  /* =======================================================
     GOOGLE FORM LINKS
     
     No JavaScript is required here.
     They are regular external links.
  ======================================================= */

  const googleFormURL =
    "https://docs.google.com/forms/d/e/1FAIpQLSeVi7H_4viI_qknM3I5aGoMzQg_nb0Ivj_2zgHNUkM_BTxi_A/viewform";

  $$(`a[href="${googleFormURL}"]`).forEach((link) => {
    link.setAttribute("target", "_blank");

    link.setAttribute("rel", "noopener noreferrer");
  });

  /* =======================================================
     ACCESSIBILITY
  ======================================================= */

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }

  /* =======================================================
     PAGE READY
  ======================================================= */

  document.body.classList.add("page-ready");
});
