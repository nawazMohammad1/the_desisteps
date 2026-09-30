/* =========================================================
   DESISTEPS
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const preloader = document.getElementById("preloader");
  const navbar = document.getElementById("navbar");

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchSubmit = document.getElementById("searchSubmit");

  const backTop = document.getElementById("backTop");

  const cartCounter = document.querySelector(".cart-counter");
  const wishlistCounter = document.querySelector(".wishlist-counter");

  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastText = document.getElementById("toastText");

  const newsletterForm = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("emailInput");
  const newsletterMessage = document.getElementById("newsletterMessage");

  const heroProduct = document.querySelector(".hero-product");
  const hero = document.querySelector(".hero");

  /* =======================================================
     STATE
     ======================================================= */

  let cartCount = 0;
  let wishlistCount = 0;
  let toastTimer = null;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  /* =======================================================
     PRELOADER
     ======================================================= */

  const hidePreloader = () => {
    if (!preloader) return;

    preloader.classList.add("hide");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 700);
  };

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 400);
  });

  /* Fallback if loading takes too long */
  setTimeout(hidePreloader, 2500);

  /* =======================================================
     NAVBAR SCROLL
     ======================================================= */

  const handleNavbar = () => {
    if (!navbar) return;

    if (window.scrollY > 70) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (backTop) {
      if (window.scrollY > 600) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    }
  };

  window.addEventListener("scroll", handleNavbar, {
    passive: true,
  });

  handleNavbar();

  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const openMenu = () => {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.add("open");
    menuBtn.classList.add("active");

    menuBtn.setAttribute("aria-expanded", "true");

    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.remove("open");
    menuBtn.classList.remove("active");

    menuBtn.setAttribute("aria-expanded", "false");

    document.body.classList.remove("no-scroll");
  };

  const toggleMenu = () => {
    if (!navLinks) return;

    const isOpen = navLinks.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (menuBtn && navLinks) {
    menuBtn.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open") ? "true" : "false",
    );

    menuBtn.addEventListener("click", toggleMenu);

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }

  /* =======================================================
     SEARCH OVERLAY
     ======================================================= */

  const openSearch = () => {
    if (!searchOverlay) return;

    closeMenu();

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {
      searchInput?.focus();
    }, 250);
  };

  const closeSearch = () => {
    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");
  };

  searchBtn?.addEventListener("click", openSearch);

  searchClose?.addEventListener("click", closeSearch);

  searchOverlay?.addEventListener("click", (event) => {
    if (event.target === searchOverlay) {
      closeSearch();
    }
  });

  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeSearch();
    closeMenu();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  /* =======================================================
     SEARCH FUNCTION
     ======================================================= */

  const performSearch = () => {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      showToast("Search", "Type a footwear style, collection or product name.");
      searchInput.focus();
      return;
    }

    const cards = document.querySelectorAll(
      ".shoes-grid .product-card, .product-grid .product-card",
    );

    if (!cards.length) {
      showToast("Search", "No products are currently available to search.");
      return;
    }

    let foundCard = null;

    cards.forEach((card) => {
      const searchableText = (
        card.textContent +
        " " +
        (card.dataset.category || "") +
        " " +
        (card.dataset.product || "")
      ).toLowerCase();

      const matches = searchableText.includes(query);

      if (matches && !foundCard) {
        foundCard = card;
      }
    });

    if (foundCard) {
      cards.forEach((card) => {
        card.classList.remove("hidden");
      });

      closeSearch();

      setTimeout(() => {
        foundCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        foundCard.classList.add("search-highlight");

        setTimeout(() => {
          foundCard.classList.remove("search-highlight");
        }, 1800);
      }, 250);

      showToast("Product found", `Showing results for "${query}".`);
    } else {
      showToast("No results", `No footwear found for "${query}".`);
    }
  };

  searchSubmit?.addEventListener("click", performSearch);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealElement = (element) => {
    element.classList.add("visible");

    /* Compatibility with pages using .active */
    element.classList.add("active");
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          revealElement(entry.target);

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
      revealElement(element);
    });
  }

  /* =======================================================
     PRODUCT FILTER
     ======================================================= */

  const filterButtons = document.querySelectorAll(".filter-btn");

  const productCards = document.querySelectorAll(".shoes-grid .product-card");

  const applyProductFilter = (filter) => {
    productCards.forEach((card, index) => {
      const category = (card.dataset.category || "").toLowerCase();

      const currentFilter = (filter || "all").toLowerCase();

      const shouldShow = currentFilter === "all" || category === currentFilter;

      if (shouldShow) {
        card.classList.remove("hidden");

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 35);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(() => {
          card.classList.add("hidden");
        }, 250);
      }
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      applyProductFilter(filter);
    });
  });

  /* =======================================================
     WISHLIST
     ======================================================= */

  const wishlistButtons = document.querySelectorAll(".wishlist-product");

  const updateWishlistCounter = () => {
    if (wishlistCounter) {
      wishlistCounter.textContent = wishlistCount;
    }
  };

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");

      const isActive = button.classList.toggle("active");

      if (isActive) {
        wishlistCount++;

        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }

        button.setAttribute("aria-pressed", "true");

        showToast("Added to wishlist", "We'll keep it here for you.");
      } else {
        wishlistCount = Math.max(0, wishlistCount - 1);

        if (icon) {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }

        button.setAttribute("aria-pressed", "false");

        showToast("Removed from wishlist", "The item was removed.");
      }

      updateWishlistCounter();
    });
  });

  updateWishlistCounter();

  /* =======================================================
     ADD TO CART
     ======================================================= */

  const quickAddButtons = document.querySelectorAll(".quick-add");

  const updateCartCounter = () => {
    if (cartCounter) {
      cartCounter.textContent = cartCount;
    }
  };

  quickAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;

      const product =
        button.dataset.product ||
        button
          .closest(".product-card")
          ?.querySelector(".product-name")
          ?.textContent?.trim() ||
        "Footwear";

      cartCount++;

      updateCartCounter();

      showToast("Added to bag", `${product} is in your bag.`);

      const originalText = button.textContent;

      button.textContent = "ADDED ✓";
      button.disabled = true;
      button.classList.add("added");

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove("added");
      }, 1100);
    });
  });

  updateCartCounter();

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(title, message) {
    if (!toast) return;

    clearTimeout(toastTimer);

    if (toastTitle) {
      toastTitle.textContent = title;
    }

    if (toastText) {
      toastText.textContent = message;
    }

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  /* =======================================================
     NEWSLETTER
     ======================================================= */

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim() || "";

    if (!email) {
      if (newsletterMessage) {
        newsletterMessage.textContent = "Please enter your email address.";
      }

      emailInput?.focus();

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      if (newsletterMessage) {
        newsletterMessage.textContent = "Please enter a valid email address.";
      }

      emailInput?.focus();

      return;
    }

    if (newsletterMessage) {
      newsletterMessage.textContent =
        "You're officially in. Welcome to DesiSteps!";
    }

    newsletterForm.classList.add("is-success");

    showToast("You're in!", "Welcome to the DesiSteps community.");

    newsletterForm.reset();

    setTimeout(() => {
      newsletterForm.classList.remove("is-success");
    }, 2500);
  });

  emailInput?.addEventListener("input", () => {
    if (newsletterMessage) {
      newsletterMessage.textContent = "";
    }
  });

  /* =======================================================
     BACK TO TOP
     ======================================================= */

  backTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* =======================================================
     SMOOTH ANCHOR LINKS
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
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

      closeMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =======================================================
     HERO PARALLAX
     ======================================================= */

  if (finePointer && hero && heroProduct) {
    let heroFrame = null;

    hero.addEventListener("mousemove", (event) => {
      if (heroFrame) {
        cancelAnimationFrame(heroFrame);
      }

      heroFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width - 0.5;

        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroProduct.style.transform = `
          translate(
            calc(-50% + ${x * 15}px),
            calc(-50% + ${y * 15}px)
          )
          rotate(${x * 7 - 7}deg)
        `;
      });
    });

    hero.addEventListener("mouseleave", () => {
      if (heroFrame) {
        cancelAnimationFrame(heroFrame);
      }

      heroProduct.style.transform = "translate(-50%, -50%) rotate(-7deg)";
    });
  }

  /* =======================================================
     PRODUCT TILT
     ======================================================= */

  if (finePointer) {
    const tiltCards = document.querySelectorAll(".product-card");

    tiltCards.forEach((card) => {
      let tiltFrame = null;

      card.addEventListener("mousemove", (event) => {
        if (card.classList.contains("hidden")) {
          return;
        }

        if (tiltFrame) {
          cancelAnimationFrame(tiltFrame);
        }

        tiltFrame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const x = event.clientX - rect.left;

          const y = event.clientY - rect.top;

          const centerX = rect.width / 2;

          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 45;

          const rotateY = (centerX - x) / 45;

          card.style.transform = `
            perspective(900px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-3px)
          `;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (tiltFrame) {
          cancelAnimationFrame(tiltFrame);
        }

        card.style.transform = "";
      });
    });
  }

  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const sections = document.querySelectorAll("main section[id]");

  const navAnchors = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id;

          navAnchors.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.remove("active");

            if (href === `#${id}`) {
              link.classList.add("active");
            }
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     IMAGE ERROR HANDLING
     ======================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.background = "#eadfce";
      image.style.objectFit = "cover";

      image.alt = "DesiSteps footwear";
    });
  });

  /* =======================================================
     RESIZE HANDLING
     ======================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      /*
        Close mobile menu when moving
        back to desktop width.
      */
      if (window.innerWidth > 950) {
        closeMenu();
      }

      /*
        Reset hero image transform
        when switching layouts.
      */
      if (
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        heroProduct
      ) {
        heroProduct.style.transform = "";
      }
    }, 150);
  });

  /* =======================================================
     INITIAL HERO REVEAL
     ======================================================= */

  setTimeout(() => {
    document.querySelectorAll(".hero .reveal").forEach((element) => {
      element.classList.add("visible");
      element.classList.add("active");
    });
  }, 300);

  /* =======================================================
     INITIAL ARIA STATES
     ======================================================= */

  document.querySelectorAll(".wishlist-product").forEach((button) => {
    if (!button.hasAttribute("aria-pressed")) {
      button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false",
      );
    }
  });

  filterButtons.forEach((button) => {
    if (!button.hasAttribute("aria-pressed")) {
      button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false",
      );
    }
  });

  /* =======================================================
     REDUCED MOTION SUPPORT
     ======================================================= */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("visible");
      element.classList.add("active");
    });

    if (heroProduct) {
      heroProduct.style.transform = "";
    }
  }
});
