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
      ".hero-card, .card, .timeline-item, .portfolio-item"
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
  const previewButtons = document.querySelectorAll("[data-preview-src]");
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

  const portfolioModalVideo = portfolioModal
    ? portfolioModal.querySelector("video")
    : null;

  const openPortfolioModal = (src, alt, caption) => {
    if (!portfolioModal || !portfolioModalImg || !portfolioModalCaption) return;
    if (portfolioModalVideo) {
      portfolioModalVideo.pause();
      portfolioModalVideo.hidden = true;
    }
    portfolioModalImg.hidden = false;
    portfolioModalImg.src = src;
    portfolioModalImg.alt = alt || "Dashboard em Power BI";
    portfolioModalCaption.textContent = caption || "";
    portfolioModal.classList.add("is-open");
    portfolioModal.setAttribute("aria-hidden", "false");
  };

  const openVideoModal = (src, caption) => {
    if (!portfolioModal || !portfolioModalVideo || !portfolioModalCaption) return;
    if (portfolioModalImg) portfolioModalImg.hidden = true;
    portfolioModalVideo.hidden = false;
    if (portfolioModalVideo.getAttribute("src") !== src) {
      portfolioModalVideo.src = src;
    }
    portfolioModalCaption.textContent = caption || "";
    portfolioModal.classList.add("is-open");
    portfolioModal.setAttribute("aria-hidden", "false");
    portfolioModalVideo.currentTime = 0;
    portfolioModalVideo.play().catch(() => {});
  };

  const closePortfolioModal = () => {
    if (!portfolioModal) return;
    portfolioModal.classList.remove("is-open");
    portfolioModal.setAttribute("aria-hidden", "true");
    if (portfolioModalVideo) portfolioModalVideo.pause();
  };

  // Real fullscreen for the project videos; falls back to the modal
  const isFullscreen = () => document.fullscreenElement || document.webkitFullscreenElement;

  const enterFullscreen = video => {
    video.currentTime = 0;
    video.controls = true;
    video.play().catch(() => {});
    if (video.requestFullscreen) {
      return video.requestFullscreen().then(() => true).catch(() => false);
    }
    if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
      return Promise.resolve(true);
    }
    if (video.webkitEnterFullscreen) {
      // iOS Safari
      video.webkitEnterFullscreen();
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  };

  const onFullscreenExit = () => {
    if (isFullscreen()) return;
    document.querySelectorAll(".feature-video").forEach(video => {
      video.controls = false;
      video.play().catch(() => {});
    });
  };
  document.addEventListener("fullscreenchange", onFullscreenExit);
  document.addEventListener("webkitfullscreenchange", onFullscreenExit);
  document.querySelectorAll(".feature-video").forEach(video => {
    video.addEventListener("webkitendfullscreen", onFullscreenExit);
  });

  const openVideo = (trigger, src, caption) => {
    const card = trigger.closest(".feature-card");
    const video = card ? card.querySelector(".feature-video") : null;
    if (!video) {
      openVideoModal(src, caption);
      return;
    }
    enterFullscreen(video).then(ok => {
      if (!ok) {
        video.controls = false;
        openVideoModal(src, caption);
      }
    });
  };

  document.querySelectorAll("[data-video-src]").forEach(button => {
    button.addEventListener("click", () => {
      openVideo(
        button,
        button.getAttribute("data-video-src") || "",
        button.getAttribute("data-preview-caption") || ""
      );
    });
  });

  // Clicking the video itself also opens it fullscreen
  document.querySelectorAll(".feature-video").forEach(video => {
    video.addEventListener("click", () => {
      if (isFullscreen()) return;
      openVideo(video, video.getAttribute("src") || "", "");
    });
  });

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

  if (previewButtons.length > 0 && portfolioModal) {
    previewButtons.forEach(button => {
      button.addEventListener("click", () => {
        const fullSrc = button.getAttribute("data-preview-src") || "";
        const alt = button.getAttribute("data-preview-alt") || "";
        const caption = button.getAttribute("data-preview-caption") || "";

        if (fullSrc) {
          openPortfolioModal(fullSrc, alt, caption);
        }
      });
    });
  }
  // Glass spotlight: soft light follows the cursor on glass surfaces
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
    document.addEventListener(
      "pointermove",
      event => {
        const glass = event.target.closest && event.target.closest(".glass");
        if (!glass) return;
        const rect = glass.getBoundingClientRect();
        glass.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        glass.style.setProperty("--my", `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
  }

  // Highlight the nav link of the section currently in view
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  if (navLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(navLinks.map(link => [link.getAttribute("href").slice(1), link]));
    const navObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => link.classList.remove("is-active"));
          const active = byId.get(entry.target.id);
          if (active) {
            active.classList.add("is-active");
            // Scroll only the nav strip (mobile) — never the page, so it
            // doesn't interrupt the smooth scroll triggered by anchor clicks
            const nav = active.parentElement;
            if (nav && nav.scrollWidth > nav.clientWidth) {
              nav.scrollTo({
                left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
                behavior: "smooth",
              });
            }
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }

  // Only play the featured videos while they are on screen
  const featureVideos = document.querySelectorAll(".feature-video");
  if (prefersReducedMotion) {
    featureVideos.forEach(video => {
      video.removeAttribute("autoplay");
      video.pause();
      video.controls = true;
    });
  } else if (featureVideos.length && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    featureVideos.forEach(video => videoObserver.observe(video));
  }
});
