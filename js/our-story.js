/* =========================================================
   DESISTEPS — OUR STORY JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTS
     ======================================================= */

  const preloader = document.querySelector(".preloader");
  const navbar = document.querySelector(".navbar");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const searchToggle = document.querySelector(".search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const searchInput = document.querySelector("#searchInput");
  const searchButton = document.querySelector("#searchButton");

  const cartToggle = document.querySelector(".cart-toggle");
  const cartPanel = document.querySelector(".cart-panel");
  const closeCart = document.querySelector(".close-cart");
  const cartBackdrop = document.querySelector(".cart-backdrop");
  const continueShopping = document.querySelector(".continue-shopping");

  const wishlistToggle = document.querySelector(".wishlist-toggle");
  const wishlistCount = document.querySelectorAll(".wishlist-count");
  const cartCount = document.querySelectorAll(".cart-count");

  const toast = document.querySelector(".toast");
  const toastTitle = document.querySelector("#toastTitle");
  const toastMessage = document.querySelector("#toastMessage");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =======================================================
     PRELOADER
     ======================================================= */

  function hidePreloader() {
    if (!preloader) return;

    preloader.classList.add("hide");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 700);
  }

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, prefersReducedMotion ? 100 : 700);
  });

  // Fallback in case load event is delayed
  setTimeout(hidePreloader, 3000);

  /* =======================================================
     NAVBAR SCROLL
     ======================================================= */

  function handleNavbar() {
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbar, {
    passive: true,
  });

  handleNavbar();

  /* =======================================================
     MOBILE MENU
     ======================================================= */

  function openMobileMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("open");
    menuToggle?.classList.add("active");

    menuToggle?.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove("open");
    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* =======================================================
     SEARCH OVERLAY
     ======================================================= */

  function openSearch() {
    if (!searchOverlay) return;

    searchOverlay.classList.add("open");
    document.body.classList.add("search-open");

    setTimeout(() => {
      searchInput?.focus();
    }, 250);
  }

  function closeSearchOverlay() {
    searchOverlay?.classList.remove("open");
    document.body.classList.remove("search-open");
  }

  searchToggle?.addEventListener("click", openSearch);
  closeSearch?.addEventListener("click", closeSearchOverlay);

  /* =======================================================
     SEARCH
     ======================================================= */

  function performSearch(value) {
    const term = value.trim().toLowerCase();

    if (!term) {
      searchInput?.focus();
      return;
    }

    const pages = {
      jutti: "collection.html",
      juttis: "collection.html",

      kolhapuri: "collection.html",
      kolhapuris: "collection.html",

      mojari: "collection.html",
      mojaris: "collection.html",

      sandals: "collection.html",

      sneaker: "shoes.html",
      sneakers: "shoes.html",
      shoes: "shoes.html",

      new: "new-arrivals.html",
      arrival: "new-arrivals.html",
      arrivals: "new-arrivals.html",

      best: "best-sellers.html",
      bestseller: "best-sellers.html",
      "best sellers": "best-sellers.html",

      gift: "gift-cards.html",
      "gift card": "gift-cards.html",
      "gift cards": "gift-cards.html",

      story: "our-story.html",
      "our story": "our-story.html",

      craft: "craftsmanship.html",
      craftsmanship: "craftsmanship.html",

      shipping: "shipping.html",
      delivery: "shipping.html",

      return: "returns.html",
      returns: "returns.html",

      size: "size-guide.html",
      "size guide": "size-guide.html",

      faq: "faq.html",

      contact: "contact.html",

      journal: "journal.html",
    };

    let destination = "collection.html";

    for (const keyword in pages) {
      if (term.includes(keyword)) {
        destination = pages[keyword];
        break;
      }
    }

    closeSearchOverlay();

    window.location.href = destination;
  }

  searchButton?.addEventListener("click", () => {
    performSearch(searchInput?.value || "");
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      performSearch(searchInput.value || "");
    }
  });

  /* =======================================================
     SEARCH SUGGESTIONS
     ======================================================= */

  document.querySelectorAll("[data-search]").forEach((button) => {
    button.addEventListener("click", () => {
      const searchValue = button.dataset.search || "";

      if (searchInput) {
        searchInput.value = searchValue;
      }

      performSearch(searchValue);
    });
  });

  /* =======================================================
     WISHLIST
     ======================================================= */

  let wishlistValue = 0;

  function updateWishlistCount() {
    wishlistCount.forEach((element) => {
      element.textContent = wishlistValue;
    });
  }

  wishlistToggle?.addEventListener("click", () => {
    wishlistValue = wishlistValue === 0 ? 1 : 0;

    const icon = wishlistToggle.querySelector("i");

    if (wishlistValue === 1) {
      icon?.classList.remove("fa-regular");
      icon?.classList.add("fa-solid");

      showToast("Wishlist", "Your wishlist is ready.");
    } else {
      icon?.classList.remove("fa-solid");
      icon?.classList.add("fa-regular");

      showToast("Wishlist", "Removed from your wishlist.");
    }

    updateWishlistCount();
  });

  /* =======================================================
     CART
     ======================================================= */

  let cartValue = 0;

  function updateCartCount() {
    cartCount.forEach((element) => {
      element.textContent = cartValue;
    });
  }

  function openCart() {
    if (!cartPanel) return;

    cartPanel.classList.add("open");
    cartBackdrop?.classList.add("show");

    document.body.classList.add("cart-open");
  }

  function closeCartPanel() {
    cartPanel?.classList.remove("open");
    cartBackdrop?.classList.remove("show");

    document.body.classList.remove("cart-open");
  }

  cartToggle?.addEventListener("click", openCart);
  closeCart?.addEventListener("click", closeCartPanel);
  cartBackdrop?.addEventListener("click", closeCartPanel);
  continueShopping?.addEventListener("click", closeCartPanel);

  /* =======================================================
     ADD TO CART
     ======================================================= */

  const addToCartButtons = document.querySelectorAll(
    ".add-to-cart, .quick-add",
  );

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartValue += 1;

      updateCartCount();

      const originalText =
        button.dataset.originalText || button.textContent.trim();

      button.dataset.originalText = originalText;

      button.classList.add("added");

      if (button.tagName === "BUTTON") {
        button.textContent = "Added ✓";
      }

      showToast("Added to Bag", "Your selection has been added to the bag.");

      setTimeout(() => {
        button.classList.remove("added");

        if (button.tagName === "BUTTON") {
          button.textContent = originalText;
        }
      }, 1800);
    });
  });

  /* =======================================================
     TOAST
     ======================================================= */

  let toastTimer;

  function showToast(title, message) {
    if (!toast) return;

    clearTimeout(toastTimer);

    if (toastTitle) {
      toastTitle.textContent = title;
    }

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          /*
            Supports both class names:
            .visible → older CSS/JS
            .active  → newer CSS
          */

          entry.target.classList.add("visible");
          entry.target.classList.add("active");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.classList.add("active");
    });
  }

  /* =======================================================
     HERO PARALLAX
     ======================================================= */

  const heroFrame = document.querySelector(".hero-frame");

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  function handleHeroParallax() {
    if (
      !heroFrame ||
      window.innerWidth < 900 ||
      prefersReducedMotion ||
      !finePointer
    ) {
      return;
    }

    const scroll = window.scrollY;

    heroFrame.style.transform = `rotate(3deg) translateY(${scroll * 0.035}px)`;
  }

  window.addEventListener("scroll", handleHeroParallax, {
    passive: true,
  });

  handleHeroParallax();

  /* =======================================================
     IMAGE MOUSE MOVEMENT
     ======================================================= */

  const imageCards = document.querySelectorAll(
    ".image-story-image, .split-image, .craft-image",
  );

  if (finePointer && !prefersReducedMotion) {
    imageCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        if (window.innerWidth < 900) return;

        const rect = card.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = event.clientX - rect.left;

        const y = event.clientY - rect.top;

        const rotateX = (y / rect.height - 0.5) * -2;

        const rotateY = (x / rect.width - 0.5) * 2;

        card.style.transform = `perspective(900px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =======================================================
     SMOOTH ANCHOR LINKS
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      let target;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeMobileMenu();
    closeSearchOverlay();
    closeCartPanel();
  });

  /* =======================================================
     CLICK OUTSIDE SEARCH
     ======================================================= */

  searchOverlay?.addEventListener("click", (event) => {
    if (event.target === searchOverlay) {
      closeSearchOverlay();
    }
  });

  /* =======================================================
     RESIZE
     ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }

    if (window.innerWidth > 900) {
      document.body.classList.remove("menu-open");
    }
  });

  /* =======================================================
     IMAGE FALLBACK
     ======================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");

      /*
        Prevents broken-image icons from looking messy.
        CSS can style .image-error if needed.
      */

      image.alt = image.alt || "DESISTEPS footwear";
    });
  });

  /* =======================================================
     INITIAL COUNTS
     ======================================================= */

  updateWishlistCount();
  updateCartCount();

  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =======================================================
     ACCESSIBILITY
     ======================================================= */

  menuToggle?.setAttribute("aria-expanded", "false");

  menuToggle?.setAttribute("aria-controls", mobileMenu?.id || "mobileMenu");

  searchToggle?.setAttribute("aria-expanded", "false");

  /* =======================================================
     PAGE READY
     ======================================================= */

  document.documentElement.classList.add("js-ready");
});
