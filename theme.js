const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle?.querySelector(".theme-toggle-text");
const storageKey = "sunnah-theme";
const savedTheme = localStorage.getItem(storageKey) || "dark";

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن";
  }
}

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

/* ---------- cursor-following background glow ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let raf = null;

  function setGlue(x, y) {
    document.body.style.setProperty("--glue-x", `${x}px`);
    document.body.style.setProperty("--glue-y", `${y}px`);
  }

  function tick() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    setGlue(currentX, currentY);
    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.body.classList.add("glue-active");
    if (!raf) {
      raf = requestAnimationFrame(tick);
    }
  });

  setGlue(targetX, targetY);
}

/* ---------- auto-hide bottom nav bar on scroll (mobile) ---------- */
const navLinksEl = document.querySelector(".nav-links");
const mobileNavQuery = window.matchMedia("(max-width: 900px)");

if (navLinksEl) {
  let lastScrollY = window.scrollY;
  let ticking = false;

  function setNavHidden(hidden) {
    navLinksEl.classList.toggle("nav-hidden", hidden);
    themeToggle?.classList.toggle("nav-hidden", hidden);
  }

  function handleScroll() {
    const currentY = Math.max(window.scrollY, 0);

    if (!mobileNavQuery.matches) {
      setNavHidden(false);
    } else if (currentY < 80) {
      setNavHidden(false);
    } else if (currentY > lastScrollY) {
      setNavHidden(true);
    } else if (currentY < lastScrollY) {
      setNavHidden(false);
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  mobileNavQuery.addEventListener("change", () => setNavHidden(false));
}