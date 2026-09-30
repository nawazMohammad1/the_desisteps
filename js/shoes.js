/* =====================================================
   DESISTEPS — SHOES PAGE JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     HELPERS
     ===================================================== */

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  /* =====================================================
     PRELOADER
     ===================================================== */

  const preloader = $(".preloader");

  const hidePreloader = () => {
    if (!preloader) return;

    preloader.classList.add("hide");

    setTimeout(() => {
      preloader.setAttribute("aria-hidden", "true");
    }, 500);
  };

  window.addEventListener("load", hidePreloader);

  // Fallback in case images take too long to load
  setTimeout(hidePreloader, 2500);

  /* =====================================================
     NAVBAR
     ===================================================== */

  const navbar = $(".navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };

  window.addEventListener("scroll", updateNavbar, { passive: true });

  updateNavbar();

  /* =====================================================
     MOBILE MENU
     ===================================================== */

  const menuToggle = $(".menu-toggle");
  const mobileMenu = $(".mobile-menu");

  const openMobileMenu = () => {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  };

  const closeMobileMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.contains("active");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  $$(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* =====================================================
     SEARCH OVERLAY
     ===================================================== */

  const searchOverlay = $(".search-overlay");
  const searchInput = $("#shoeSearch");
  const searchTrigger = $(".search-trigger");
  const closeSearch = $(".close-search");
  const searchButton = $("#searchButton");

  const openSearch = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.add("active");
    document.body.classList.add("search-open");

    setTimeout(() => {
      searchInput?.focus();
    }, 200);
  };

  const hideSearch = () => {
    searchOverlay?.classList.remove("active");
    document.body.classList.remove("search-open");
  };

  searchTrigger?.addEventListener("click", openSearch);

  closeSearch?.addEventListener("click", hideSearch);

  /* =====================================================
     PRODUCT FILTERING + SEARCH
     ===================================================== */

  const productCards = $$(".product-card");
  const filterButtons = $$(".filter-btn");
  const productCount = $("#productCount");
  const noResults = $(".no-results");

  let activeCategory = "all";
  let searchTerm = "";

  const updateProducts = () => {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();

      const name = (card.dataset.name || "").toLowerCase();

      const searchableText = card.textContent.toLowerCase();

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        category.includes(searchTerm) ||
        searchableText.includes(searchTerm);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    if (productCount) {
      productCount.textContent = visibleCount;
    }

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  };

  /* =====================================================
     FILTER BUTTONS
     ===================================================== */

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";

      // Clear search when changing category
      searchTerm = "";

      if (searchInput) {
        searchInput.value = "";
      }

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      updateProducts();

      // Move to product section on mobile/tablet
      if (window.innerWidth <= 850) {
        $("#all-shoes")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =====================================================
     SEARCH
     ===================================================== */

  const runSearch = () => {
    if (!searchInput) return;

    searchTerm = searchInput.value.trim().toLowerCase();

    updateProducts();
    hideSearch();

    $("#all-shoes")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  searchButton?.addEventListener("click", runSearch);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });

  /* =====================================================
     CATEGORY SHORTCUTS
     ===================================================== */

  $$("[data-category-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const category = link.dataset.categoryLink;

      if (!category) return;

      activeCategory = category;
      searchTerm = "";

      if (searchInput) {
        searchInput.value = "";
      }

      filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === category);
      });

      updateProducts();

      $("#all-shoes")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      closeMobileMenu();
    });
  });

  /* =====================================================
     WISHLIST
     ===================================================== */

  const wishlistCount = $(".wishlist-count");
  const wishlistButtons = $$(".wishlist-product");

  const wishlist = new Set();

  const updateWishlistCount = () => {
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.size;
    }

    $$(".wishlist-count").forEach((element) => {
      element.textContent = wishlist.size;
    });
  };

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");

      const productName = card?.dataset.name;

      if (!productName) return;

      const icon = $("i", button);

      if (wishlist.has(productName)) {
        wishlist.delete(productName);

        button.classList.remove("active");

        icon?.classList.remove("fa-solid");
        icon?.classList.add("fa-regular");

        button.setAttribute("aria-pressed", "false");
      } else {
        wishlist.add(productName);

        button.classList.add("active");

        icon?.classList.remove("fa-regular");
        icon?.classList.add("fa-solid");

        button.setAttribute("aria-pressed", "true");
      }

      updateWishlistCount();

      // Small interaction animation
      if (typeof button.animate === "function") {
        button.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 250,
            easing: "ease-out",
          },
        );
      }
    });
  });

  /* =====================================================
     BAG / ADD TO BAG
     ===================================================== */

  let bagTotal = 0;

  const bagCount = $(".bag-count");
  const cartToast = $(".cart-toast");
  const toastProduct = $(".toast-product");

  let toastTimer;

  const updateBagCount = () => {
    $$(".bag-count, .cart-count").forEach((element) => {
      element.textContent = bagTotal;
    });
  };

  const showCartToast = (message) => {
    if (!cartToast) return;

    if (toastProduct && message) {
      toastProduct.textContent = message;
    }

    cartToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      cartToast.classList.remove("show");
    }, 2600);
  };

  /* =====================================================
     QUICK ADD
     ===================================================== */

  $$(".quick-add").forEach((button) => {
    button.addEventListener("click", () => {
      // Prevent repeated clicks during feedback animation
      if (button.dataset.processing === "true") {
        return;
      }

      button.dataset.processing = "true";

      const productName =
        button.dataset.product ||
        button.closest(".product-card")?.dataset.name ||
        "Selected shoes";

      bagTotal++;

      updateBagCount();

      showCartToast(`${productName} added to your bag`);

      const originalText =
        button.dataset.originalText || button.textContent.trim();

      button.dataset.originalText = originalText;

      button.textContent = "ADDED ✓";

      button.classList.add("added");

      button.setAttribute("aria-label", `${productName} added to bag`);

      setTimeout(() => {
        button.textContent = originalText;

        button.classList.remove("added");

        button.removeAttribute("aria-label");

        button.dataset.processing = "false";
      }, 1200);
    });
  });

  /* =====================================================
     BAG LINK
     ===================================================== */

  $("#bagLink")?.addEventListener("click", (event) => {
    // Keep normal link behavior if it points
    // to a real bag/cart page.
    const href = event.currentTarget.getAttribute("href");

    if (href && href !== "#") {
      return;
    }

    event.preventDefault();

    const message =
      bagTotal === 0
        ? "Your bag is currently empty"
        : `${bagTotal} item(s) added`;

    showCartToast(message);
  });

  /* =====================================================
     WISHLIST LINK
     ===================================================== */

  $("#wishlistLink")?.addEventListener("click", (event) => {
    const href = event.currentTarget.getAttribute("href");

    // If it is a real wishlist page,
    // allow normal navigation.
    if (href && href !== "#") {
      return;
    }

    event.preventDefault();

    const firstWishlisted = productCards.find((card) =>
      wishlist.has(card.dataset.name),
    );

    if (firstWishlisted) {
      firstWishlisted.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      $("#all-shoes")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Support both CSS naming conventions
          entry.target.classList.add("visible");

          entry.target.classList.add("active");

          revealObserver.unobserve(entry.target);
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
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.classList.add("active");
    });
  }

  /* =====================================================
     NEWSLETTER
     ===================================================== */

  const newsletterForm = $("#newsletterForm");

  const newsletterEmail = $("#newsletterEmail");

  const newsletterMessage = $(".newsletter-message");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!newsletterEmail) return;

    if (!newsletterEmail.checkValidity()) {
      newsletterEmail.reportValidity();
      return;
    }

    if (newsletterMessage) {
      newsletterMessage.textContent =
        "Thank you for joining the DesiSteps list!";
      newsletterMessage.classList.add("show");
    }

    newsletterForm.reset();

    setTimeout(() => {
      newsletterMessage?.classList.remove("show");
    }, 5000);
  });

  /* =====================================================
     IMAGE FALLBACK
     ===================================================== */

  $$("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-unavailable");

      image.alt = "DesiSteps product image unavailable";
    });
  });

  /* =====================================================
     SMOOTH ANCHOR LINKS
     ===================================================== */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      let target = null;

      try {
        target = document.querySelector(href);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      closeMobileMenu();
    });
  });

  /* =====================================================
     ESCAPE KEY
     ===================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    hideSearch();
    closeMobileMenu();

    // Remove focus from active element
    if (
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }
  });

  /* =====================================================
     RESIZE HANDLING
     ===================================================== */

  window.addEventListener(
    "resize",
    () => {
      // Close mobile menu when returning
      // to desktop layout.
      if (window.innerWidth > 850) {
        closeMobileMenu();
      }
    },
    { passive: true },
  );

  /* =====================================================
     ACCESSIBILITY — MENU STATE
     ===================================================== */

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");

    if (!menuToggle.getAttribute("aria-label")) {
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  }

  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute(
      "aria-label",
      expanded ? "Close navigation menu" : "Open navigation menu",
    );
  });

  /* =====================================================
     INITIAL PRODUCT STATE
     ===================================================== */

  updateProducts();
  updateWishlistCount();
  updateBagCount();
});
