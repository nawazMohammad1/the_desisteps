/* =========================================================
   DESISTEPS — NEW ARRIVALS JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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

  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".arrival-card");
  const productCount = document.querySelector("#productCount");

  const emptyState = document.querySelector("#emptyState");
  const showAllButton = document.querySelector("#showAll");

  const wishlistButtons = document.querySelectorAll(".wishlist-product");
  const wishlistCountElements = document.querySelectorAll(".wishlist-count");

  const cartToggle = document.querySelector(".cart-toggle");
  const cartPanel = document.querySelector(".cart-panel");
  const cartBackdrop = document.querySelector(".cart-backdrop");
  const closeCart = document.querySelector(".close-cart");
  const continueShopping = document.querySelector(".continue-shopping");

  const quickAddButtons = document.querySelectorAll(".quick-add");
  const cartCountElements = document.querySelectorAll(".cart-count");

  const newsletterForm = document.querySelector("#newsletterForm");
  const newsletterEmail = document.querySelector("#newsletterEmail");

  const toast = document.querySelector("#toast");
  const toastTitle = document.querySelector("#toastTitle");
  const toastMessage = document.querySelector("#toastMessage");

  const yearElements = document.querySelectorAll("[data-year]");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  /* =======================================================
     PRELOADER
     ======================================================= */

  function hidePreloader() {
    if (!preloader) return;

    preloader.classList.add("hide");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 900);
  }

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, prefersReducedMotion ? 200 : 900);
  });

  /* Fallback in case the load event has already fired */
  setTimeout(hidePreloader, 4000);

  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  /* =======================================================
     NAVBAR SCROLL
     ======================================================= */

  function handleNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", handleNavbar, {
    passive: true,
  });

  handleNavbar();

  /* =======================================================
     MOBILE MENU
     ======================================================= */

  function openMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.add("active");
    mobileMenu.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      closeSearchOverlay();
      closeCartPanel();
      openMobileMenu();
    }
  }

  menuToggle?.addEventListener("click", toggleMobileMenu);

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

    closeMobileMenu();
    closeCartPanel();

    searchOverlay.classList.add("open");
    document.body.classList.add("search-open");

    if (searchToggle) {
      searchToggle.setAttribute("aria-expanded", "true");
    }

    setTimeout(
      () => {
        searchInput?.focus();
      },
      prefersReducedMotion ? 0 : 350,
    );
  }

  function closeSearchOverlay() {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("open");
    document.body.classList.remove("search-open");

    if (searchToggle) {
      searchToggle.setAttribute("aria-expanded", "false");
    }
  }

  searchToggle?.addEventListener("click", openSearch);
  closeSearch?.addEventListener("click", closeSearchOverlay);

  /* =======================================================
     PRODUCT COUNT
     ======================================================= */

  function updateProductCount(count) {
    if (!productCount) return;

    productCount.textContent = String(count).padStart(2, "0");
  }

  function updateEmptyState(count) {
    if (!emptyState) return;

    emptyState.classList.toggle("show", count === 0);
  }

  /* =======================================================
     PRODUCT FILTER
     ======================================================= */

  function filterProducts(filter = "all") {
    let visible = 0;

    productCards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();

      const shouldShow =
        filter === "all" || category === String(filter).toLowerCase();

      if (shouldShow) {
        card.classList.remove("hidden");

        visible++;

        /*
          Re-enable reveal state for cards that become
          visible after filtering.
        */
        if (card.classList.contains("reveal")) {
          card.classList.add("active");
        }
      } else {
        card.classList.add("hidden");
      }
    });

    updateProductCount(visible);
    updateEmptyState(visible);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter || "all";

      filterProducts(filter);
    });
  });

  showAllButton?.addEventListener("click", () => {
    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });

    document.querySelector('[data-filter="all"]')?.classList.add("active");

    filterProducts("all");
  });

  /* =======================================================
     SEARCH PRODUCTS
     ======================================================= */

  function searchProducts(term) {
    const searchTerm = String(term || "")
      .trim()
      .toLowerCase();

    /*
      Empty search restores all products.
    */
    if (!searchTerm) {
      filterButtons.forEach((button) => {
        button.classList.remove("active");
      });

      document.querySelector('[data-filter="all"]')?.classList.add("active");

      filterProducts("all");
      return;
    }

    let found = 0;

    productCards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();

      const category = (card.dataset.category || "").toLowerCase();

      const productText = (card.textContent || "").toLowerCase();

      const matches =
        name.includes(searchTerm) ||
        category.includes(searchTerm) ||
        productText.includes(searchTerm);

      if (matches) {
        card.classList.remove("hidden");

        if (card.classList.contains("reveal")) {
          card.classList.add("active");
        }

        found++;
      } else {
        card.classList.add("hidden");
      }
    });

    /*
      Remove filter button active state because
      search results are not tied to one category.
    */
    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });

    updateProductCount(found);
    updateEmptyState(found);
  }

  /* =======================================================
     SEARCH SUBMIT
     ======================================================= */

  function executeSearch() {
    const value = searchInput?.value || "";

    searchProducts(value);
    closeSearchOverlay();

    const productsSection =
      document.querySelector("#new-products") ||
      document.querySelector(".products-section");

    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  searchButton?.addEventListener("click", executeSearch);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      executeSearch();
    }
  });

  /* =======================================================
     SEARCH SUGGESTIONS
     ======================================================= */

  document.querySelectorAll("[data-search]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.search || "";

      if (searchInput) {
        searchInput.value = value;
      }

      searchProducts(value);
      closeSearchOverlay();

      const productsSection =
        document.querySelector("#new-products") ||
        document.querySelector(".products-section");

      if (productsSection) {
        setTimeout(() => {
          productsSection.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  });

  /* =======================================================
     WISHLIST
     ======================================================= */

  let wishlistCount = 0;

  function updateWishlistCount() {
    wishlistCountElements.forEach((element) => {
      element.textContent = wishlistCount;
    });
  }

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");

      const isActive = button.classList.toggle("active");

      if (isActive) {
        icon?.classList.remove("fa-regular");
        icon?.classList.add("fa-solid");

        wishlistCount++;

        showToast("Added to wishlist", "This pair is now on your wishlist.");
      } else {
        icon?.classList.remove("fa-solid");
        icon?.classList.add("fa-regular");

        wishlistCount = Math.max(0, wishlistCount - 1);

        showToast(
          "Removed from wishlist",
          "The pair was removed from your wishlist.",
        );
      }

      updateWishlistCount();
    });
  });

  updateWishlistCount();

  /* =======================================================
     CART
     ======================================================= */

  let cartCount = 0;
  let cartTotal = 0;

  function updateCartUI() {
    cartCountElements.forEach((element) => {
      element.textContent = cartCount;
    });

    const totalElement = document.querySelector(".cart-total strong");

    if (totalElement) {
      totalElement.textContent = `₹${cartTotal.toLocaleString("en-IN")}`;
    }
  }

  function openCart() {
    if (!cartPanel) return;

    closeMobileMenu();
    closeSearchOverlay();

    cartPanel.classList.add("open");
    cartBackdrop?.classList.add("show");

    document.body.classList.add("cart-open");

    cartToggle?.setAttribute("aria-expanded", "true");
  }

  function closeCartPanel() {
    cartPanel?.classList.remove("open");
    cartBackdrop?.classList.remove("show");

    document.body.classList.remove("cart-open");

    cartToggle?.setAttribute("aria-expanded", "false");
  }

  cartToggle?.addEventListener("click", openCart);
  closeCart?.addEventListener("click", closeCartPanel);

  cartBackdrop?.addEventListener("click", closeCartPanel);

  continueShopping?.addEventListener("click", closeCartPanel);

  /* =======================================================
     QUICK ADD
     ======================================================= */

  quickAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName =
        button.dataset.product ||
        button.closest(".arrival-card")?.dataset.name ||
        "Product";

      const card = button.closest(".arrival-card");

      const priceElement = card?.querySelector(".product-bottom strong");

      let priceText = priceElement?.textContent || "0";

      /*
        Removes ₹, commas and any other
        non-numeric characters.
      */
      priceText = priceText.replace(/[^\d.]/g, "");

      const price = Number(priceText) || 0;

      cartCount++;
      cartTotal += price;

      updateCartUI();

      /*
        Small visual feedback on button.
      */
      const originalText =
        button.dataset.originalText || button.textContent.trim();

      button.dataset.originalText = originalText;

      button.classList.add("added");
      button.textContent = "ADDED ✓";

      setTimeout(() => {
        button.classList.remove("added");
        button.textContent = originalText;
      }, 1200);

      showToast("Added to bag", `${productName} has been added to your bag.`);

      openCart();
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
     NEWSLETTER
     ======================================================= */

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterEmail?.value.trim() || "";

    if (!email) {
      showToast("Email required", "Please enter your email address.");

      newsletterEmail?.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showToast("Invalid email", "Please enter a valid email address.");

      newsletterEmail?.focus();
      return;
    }

    showToast(
      "You're on the list!",
      "Watch your inbox for new DESISTEPS drops.",
    );

    newsletterForm.reset();
  });

  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

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
    revealElements.forEach((element) => {
      element.classList.add("active");
    });
  }

  /* =======================================================
     HERO PARALLAX
     ======================================================= */

  const heroImage = document.querySelector(".hero-image-card");

  if (heroImage && finePointer && !prefersReducedMotion) {
    let ticking = false;

    function updateHeroParallax() {
      if (window.innerWidth < 900) {
        heroImage.style.transform = "rotate(3deg)";
        ticking = false;
        return;
      }

      const scroll = Math.min(window.scrollY, 800);

      heroImage.style.transform = `rotate(3deg) translateY(${scroll * 0.05}px)`;

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeroParallax);

          ticking = true;
        }
      },
      {
        passive: true,
      },
    );
  }

  /* =======================================================
     IMAGE FALLBACK
     ======================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.removeAttribute("src");

      image.style.background = "linear-gradient(135deg, #eadfce, #f7f0e5)";

      image.style.objectFit = "contain";
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
     CLICK OUTSIDE SEARCH CONTENT
     ======================================================= */

  searchOverlay?.addEventListener("click", (event) => {
    if (event.target === searchOverlay) {
      closeSearchOverlay();
    }
  });

  /* =======================================================
     PREVENT BROKEN # LINKS
     ======================================================= */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  /* =======================================================
     SMOOTH INTERNAL ANCHORS
     ======================================================= */

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      closeMobileMenu();
    });
  });

  /* =======================================================
     RESIZE
     ======================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      /*
        Close mobile menu when moving back
        to desktop width.
      */
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }

      /*
        Restore hero transform on mobile.
      */
      if (heroImage && window.innerWidth < 900) {
        heroImage.style.transform = "rotate(3deg)";
      }
    }, 150);
  });

  /* =======================================================
     INITIAL UI STATE
     ======================================================= */

  updateWishlistCount();
  updateCartUI();

  /*
    Make "All" active initially.
  */
  const allFilter = document.querySelector('[data-filter="all"]');

  if (allFilter && !document.querySelector(".filter-btn.active")) {
    allFilter.classList.add("active");
  }

  /*
    Initial product count.
  */
  filterProducts("all");

  /* =======================================================
     ACCESSIBILITY INITIAL STATE
     ======================================================= */

  menuToggle?.setAttribute("aria-expanded", "false");

  searchToggle?.setAttribute("aria-expanded", "false");

  cartToggle?.setAttribute("aria-expanded", "false");
});
