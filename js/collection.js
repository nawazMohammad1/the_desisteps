/* =========================================================
   DESISTEPS
   COLLECTION PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const preloader = $(".preloader");

  const navbar = $(".navbar");

  const menuToggle = $("#menuToggle") || $(".menu-toggle");

  const mobileMenu = $("#mobileMenu") || $(".mobile-menu");

  const searchTrigger = $(".search-trigger");

  const searchOverlay = $("#searchOverlay") || $(".search-overlay");

  const closeSearch = $(".close-search");

  const searchInput = $("#searchInput");

  const searchButton = $("#searchButton");

  const searchSuggestions = $(".search-suggestions");

  const productCards = $$(".product-card");

  const filterButtons = $$(".filter-btn");

  const productCount = $("#productCount");

  const emptyState = $("#emptyState");

  const wishlistButtons = $$(".wishlist-product");

  const quickAddButtons = $$(".quick-add");

  const cartToast = $(".cart-toast");

  const toastProduct = $(".toast-product");

  const newsletterForm = $("#newsletterForm");

  const newsletterEmail = $("#newsletterEmail");

  const newsletterStatus = $("#newsletterStatus");

  /* =======================================================
     STATE
  ======================================================= */

  let currentFilter = "all";

  let currentSearch = "";

  let wishlistTotal = 0;

  let bagTotal = 0;

  let toastTimer = null;

  let searchSuggestionsTimer = null;

  /* =======================================================
     PRELOADER
  ======================================================= */

  const hidePreloader = () => {
    if (!preloader) return;

    preloader.classList.add("hide");
  };

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 500);
  });

  /* Fallback if page load event has already happened */

  setTimeout(() => {
    if (preloader && !preloader.classList.contains("hide")) {
      hidePreloader();
    }
  }, 2500);

  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =======================================================
     NAVBAR SCROLL
  ======================================================= */

  const handleNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", handleNavbar, { passive: true });

  handleNavbar();

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const closeMobileMenu = () => {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
    }

    mobileMenu.setAttribute("aria-hidden", "true");
  };

  const openMobileMenu = () => {
    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    document.body.classList.add("menu-open");

    if (menuToggle) {
      menuToggle.classList.add("active");

      menuToggle.setAttribute("aria-expanded", "true");
    }

    mobileMenu.setAttribute("aria-hidden", "false");
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

  /* =======================================================
     SEARCH OVERLAY
  ======================================================= */

  const openSearch = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.add("active");

    searchOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("search-open");

    searchTrigger?.setAttribute("aria-expanded", "true");

    setTimeout(() => {
      searchInput?.focus();
    }, 350);
  };

  const closeSearchOverlay = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");

    searchOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("search-open");

    searchTrigger?.setAttribute("aria-expanded", "false");
  };

  searchTrigger?.addEventListener("click", openSearch);

  closeSearch?.addEventListener("click", closeSearchOverlay);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeSearchOverlay();
    closeMobileMenu();

    if (cartToast) {
      cartToast.classList.remove("show");
    }
  });

  /* =======================================================
     SEARCH SUGGESTIONS
  ======================================================= */

  const renderSearchSuggestions = (query = "") => {
    if (!searchSuggestions) return;

    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      searchSuggestions.innerHTML = "";
      return;
    }

    const suggestions = productCards
      .map((card) => ({
        name: card.dataset.name || card.querySelector("h3")?.textContent || "",
        category: card.dataset.category || "",
      }))
      .filter((item) => {
        const text = `${item.name} ${item.category}`.toLowerCase();

        return text.includes(cleanQuery);
      })
      .slice(0, 5);

    searchSuggestions.innerHTML = "";

    suggestions.forEach((item) => {
      const button = document.createElement("button");

      button.type = "button";

      button.textContent = item.name;

      button.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = item.name;
        }

        searchProducts();
      });

      searchSuggestions.appendChild(button);
    });
  };

  searchInput?.addEventListener("input", () => {
    clearTimeout(searchSuggestionsTimer);

    searchSuggestionsTimer = setTimeout(() => {
      renderSearchSuggestions(searchInput.value);
    }, 100);
  });

  /* =======================================================
     PRODUCT VISIBILITY
  ======================================================= */

  const getProductName = (card) => {
    return (card.dataset.name || $(".product-info h3", card)?.textContent || "")
      .trim()
      .toLowerCase();
  };

  const getProductCategory = (card) => {
    return (card.dataset.category || "").trim().toLowerCase();
  };

  const productMatches = (card) => {
    const name = getProductName(card);

    const category = getProductCategory(card);

    const filterMatches = currentFilter === "all" || category === currentFilter;

    const searchMatches =
      !currentSearch ||
      name.includes(currentSearch) ||
      category.includes(currentSearch);

    return filterMatches && searchMatches;
  };

  const updateEmptyState = (visibleCount) => {
    if (!emptyState) return;

    emptyState.style.display = visibleCount === 0 ? "" : "none";
  };

  const updateProductCount = (visibleCount) => {
    if (!productCount) return;

    productCount.textContent = visibleCount;
  };

  const updateProducts = () => {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const shouldShow = productMatches(card);

      if (shouldShow) {
        card.classList.remove("hide");

        card.style.display = "";

        visibleCount++;
      } else {
        card.classList.add("hide");

        setTimeout(() => {
          if (card.classList.contains("hide")) {
            card.style.display = "none";
          }
        }, 400);
      }
    });

    updateProductCount(visibleCount);

    updateEmptyState(visibleCount);
  };

  /* =======================================================
     SEARCH PRODUCTS
  ======================================================= */

  const searchProducts = () => {
    currentSearch = searchInput?.value.trim().toLowerCase() || "";

    updateProducts();

    closeSearchOverlay();

    if (searchInput) {
      searchInput.value = currentSearch;
    }

    if (searchSuggestions) {
      searchSuggestions.innerHTML = "";
    }

    const collection = $("#collection");

    if (collection) {
      setTimeout(() => {
        collection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  searchButton?.addEventListener("click", searchProducts);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    searchProducts();
  });

  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter || "all";

      filterButtons.forEach((btn) => {
        const active = btn === button;

        btn.classList.toggle("active", active);

        btn.setAttribute("aria-pressed", String(active));
      });

      updateProducts();
    });
  });

  /* =======================================================
     RESET FILTER
  ======================================================= */

  $$(".reset-filter").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = "all";

      currentSearch = "";

      if (searchInput) {
        searchInput.value = "";
      }

      filterButtons.forEach((btn) => {
        const active = btn.dataset.filter === "all";

        btn.classList.toggle("active", active);

        btn.setAttribute("aria-pressed", String(active));
      });

      updateProducts();
    });
  });

  /* =======================================================
     WISHLIST
  ======================================================= */

  const updateWishlistCounters = () => {
    $(".wishlist-count") &&
      $$(".wishlist-count").forEach((counter) => {
        counter.textContent = wishlistTotal;
      });
  };

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.toggle("active");

      const icon = $("i", button);

      button.setAttribute("aria-pressed", String(isActive));

      if (isActive) {
        if (icon) {
          icon.classList.remove("fa-regular");

          icon.classList.add("fa-solid");
        }

        wishlistTotal++;
      } else {
        if (icon) {
          icon.classList.remove("fa-solid");

          icon.classList.add("fa-regular");
        }

        wishlistTotal = Math.max(0, wishlistTotal - 1);
      }

      updateWishlistCounters();

      if (!prefersReducedMotion && button.animate) {
        button.animate(
          [
            {
              transform: "scale(1)",
            },
            {
              transform: "scale(1.25)",
            },
            {
              transform: "scale(1)",
            },
          ],
          {
            duration: 350,
            easing: "ease-out",
          },
        );
      }
    });
  });

  /* =======================================================
     BAG COUNTERS
  ======================================================= */

  const updateBagCounters = () => {
    $$(".bag-count, .cart-count").forEach((counter) => {
      counter.textContent = bagTotal;
    });
  };

  /* =======================================================
     CART TOAST
  ======================================================= */

  const showCartToast = (productName) => {
    if (!cartToast) return;

    if (toastProduct) {
      toastProduct.textContent = productName || "Product";
    }

    cartToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      cartToast.classList.remove("show");
    }, 2500);
  };

  /* =======================================================
     ADD TO BAG
  ======================================================= */

  quickAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product =
        button.dataset.product ||
        button.closest(".product-card")?.querySelector("h3")?.textContent ||
        "Product";

      bagTotal++;

      updateBagCounters();

      showCartToast(product);

      const originalText = button.dataset.originalText || button.textContent;

      button.dataset.originalText = originalText;

      button.classList.add("added");

      button.textContent = "ADDED ✓";

      setTimeout(() => {
        button.classList.remove("added");

        button.textContent = originalText;
      }, 1200);
    });
  });

  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements = $$(".reveal");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("active");

          entry.target.classList.add("visible");

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
      element.classList.add("active");

      element.classList.add("visible");
    });
  }

  /* =======================================================
     STAGGER PRODUCT ANIMATION
  ======================================================= */

  if (!prefersReducedMotion) {
    productCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 70}ms`;
    });
  }

  /* =======================================================
     NEWSLETTER
  ======================================================= */

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterEmail?.value.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      if (newsletterStatus) {
        newsletterStatus.textContent = "Please enter your email address.";
      }

      newsletterEmail?.focus();

      return;
    }

    if (!emailPattern.test(email)) {
      if (newsletterStatus) {
        newsletterStatus.textContent = "Please enter a valid email address.";
      }

      newsletterEmail?.focus();

      return;
    }

    const button = $("button", newsletterForm);

    if (!button) return;

    const original = button.innerHTML;

    button.disabled = true;

    button.innerHTML = 'SUBSCRIBED <i class="fa-solid fa-check"></i>';

    if (newsletterStatus) {
      newsletterStatus.textContent = "Thank you for joining DESISTEPS.";
    }

    if (newsletterEmail) {
      newsletterEmail.value = "";
    }

    setTimeout(() => {
      button.innerHTML = original;

      button.disabled = false;

      if (newsletterStatus) {
        newsletterStatus.textContent = "";
      }
    }, 3000);
  });

  newsletterEmail?.addEventListener("input", () => {
    if (newsletterStatus) {
      newsletterStatus.textContent = "";
    }
  });

  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      let target = null;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      closeMobileMenu();
      closeSearchOverlay();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* =======================================================
     CLOSE SEARCH WHEN CLICKING BACKDROP
  ======================================================= */

  searchOverlay?.addEventListener("click", (event) => {
    if (event.target === searchOverlay) {
      closeSearchOverlay();
    }
  });

  /* =======================================================
     HERO PARALLAX
  ======================================================= */

  const hero = $(".collection-hero");

  if (hero && finePointer && !prefersReducedMotion) {
    let parallaxTicking = false;

    const updateHeroParallax = () => {
      const scroll = window.scrollY;

      if (scroll < window.innerHeight) {
        hero.style.backgroundPosition = `center ${scroll * 0.15}px`;
      }

      parallaxTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (parallaxTicking) return;

        parallaxTicking = true;

        requestAnimationFrame(updateHeroParallax);
      },
      { passive: true },
    );
  }

  /* =======================================================
     PRODUCT CARD TILT
  ======================================================= */

  if (finePointer && !prefersReducedMotion) {
    productCards.forEach((card) => {
      let frame = null;

      card.addEventListener("mousemove", (event) => {
        if (frame) {
          cancelAnimationFrame(frame);
        }

        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const x = event.clientX - rect.left;

          const y = event.clientY - rect.top;

          const rotateY = (x / rect.width - 0.5) * 4;

          const rotateX = (y / rect.height - 0.5) * -4;

          card.style.transform = `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (frame) {
          cancelAnimationFrame(frame);
        }

        card.style.transform = "";
      });
    });
  }

  /* =======================================================
     IMAGE FALLBACK
  ======================================================= */

  $$(".product-image img, .heritage-image img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.display = "none";

      image.parentElement?.classList.add("image-error");
    });
  });

  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    }, 150);
  });

  /* =======================================================
     INITIAL UI STATE
  ======================================================= */

  filterButtons.forEach((button) => {
    const isActive =
      button.classList.contains("active") || button.dataset.filter === "all";

    button.setAttribute("aria-pressed", String(isActive));
  });

  wishlistButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active")),
    );
  });

  if (searchOverlay) {
    searchOverlay.setAttribute(
      "aria-hidden",
      searchOverlay.classList.contains("active") ? "false" : "true",
    );
  }

  if (mobileMenu) {
    mobileMenu.setAttribute(
      "aria-hidden",
      mobileMenu.classList.contains("active") ? "false" : "true",
    );
  }

  if (menuToggle) {
    menuToggle.setAttribute(
      "aria-expanded",
      String(mobileMenu?.classList.contains("active") || false),
    );
  }

  if (searchTrigger) {
    searchTrigger.setAttribute("aria-expanded", "false");
  }

  updateBagCounters();

  updateWishlistCounters();

  updateProducts();
});
