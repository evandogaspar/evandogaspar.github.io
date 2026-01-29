document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

   const ageSpan = document.getElementById("hero-age");
   if (ageSpan) {
     const birthDate = new Date(1985, 3, 1); // 01/04/1985 (mês 3 = abril)
     const today = new Date();

     let age = today.getFullYear() - birthDate.getFullYear();
     const monthDiff = today.getMonth() - birthDate.getMonth();
     const dayDiff = today.getDate() - birthDate.getDate();

     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
       age--;
     }

     ageSpan.textContent = age.toString();
   }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const animatedSections = document.querySelectorAll(
      ".section, .hero-card, .card, .timeline-item"
    );

    animatedSections.forEach(el => {
      el.classList.add("will-animate");
      observer.observe(el);
    });
  }

  const avatarTrigger = document.querySelector(".avatar-zoom-trigger");
  const avatarModal = document.getElementById("avatar-modal");
  const avatarModalClose = avatarModal
    ? avatarModal.querySelector(".avatar-modal-close")
    : null;
  const avatarBackdrop = avatarModal
    ? avatarModal.querySelector(".avatar-modal-backdrop")
    : null;

  const openAvatarModal = () => {
    if (!avatarModal) return;
    avatarModal.classList.add("is-open");
    avatarModal.setAttribute("aria-hidden", "false");
  };

  const closeAvatarModal = () => {
    if (!avatarModal) return;
    avatarModal.classList.remove("is-open");
    avatarModal.setAttribute("aria-hidden", "true");
  };

  if (avatarTrigger && avatarModal) {
    avatarTrigger.addEventListener("click", () => {
      openAvatarModal();
    });

    avatarTrigger.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openAvatarModal();
      }
    });

    if (avatarModalClose) {
      avatarModalClose.addEventListener("click", () => {
        closeAvatarModal();
      });
    }

    if (avatarBackdrop) {
      avatarBackdrop.addEventListener("click", () => {
        closeAvatarModal();
      });
    }

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeAvatarModal();
      }
    });
  }

  const portfolioThumbs = document.querySelectorAll(".portfolio-thumb");
  const portfolioModal = document.getElementById("portfolio-modal");
  const portfolioModalImg = portfolioModal
    ? portfolioModal.querySelector("img")
    : null;
  const portfolioModalCaption = portfolioModal
    ? portfolioModal.querySelector(".portfolio-modal-caption")
    : null;
  const portfolioModalClose = portfolioModal
    ? portfolioModal.querySelector(".portfolio-modal-close")
    : null;
  const portfolioBackdrop = portfolioModal
    ? portfolioModal.querySelector(".portfolio-modal-backdrop")
    : null;

  const openPortfolioModal = (src, alt, caption) => {
    if (!portfolioModal || !portfolioModalImg || !portfolioModalCaption) return;
    portfolioModalImg.src = src;
    portfolioModalImg.alt = alt || "Dashboard em Power BI";
    portfolioModalCaption.textContent = caption || "";
    portfolioModal.classList.add("is-open");
    portfolioModal.setAttribute("aria-hidden", "false");
  };

  const closePortfolioModal = () => {
    if (!portfolioModal) return;
    portfolioModal.classList.remove("is-open");
    portfolioModal.setAttribute("aria-hidden", "true");
  };

  if (portfolioThumbs.length > 0 && portfolioModal) {
    portfolioThumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        const fullSrc = thumb.getAttribute("data-full") || "";
        const imgEl = thumb.querySelector("img");
        const alt = imgEl ? imgEl.alt : "";
        const captionEl = thumb.parentElement
          ? thumb.parentElement.querySelector("figcaption")
          : null;
        const caption = captionEl ? captionEl.textContent : "";
        if (fullSrc) {
          openPortfolioModal(fullSrc, alt, caption);
        }
      });
    });

    if (portfolioModalClose) {
      portfolioModalClose.addEventListener("click", () => {
        closePortfolioModal();
      });
    }

    if (portfolioBackdrop) {
      portfolioBackdrop.addEventListener("click", () => {
        closePortfolioModal();
      });
    }

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closePortfolioModal();
      }
    });
  }
});
