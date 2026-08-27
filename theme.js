const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle?.querySelector(".theme-toggle-text");
const storageKey = "sunnah-theme";
const savedTheme = localStorage.getItem(storageKey) || "dark";

let isAnimating = false;

function applyTheme(theme, animate = false, event = null) {
  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن";
  }

  if (animate && event && !isAnimating) {
    isAnimating = true;

    const x = event.clientX;
    const y = event.clientY;
    const color = theme === "dark" ? "#020617" : "#f8fafc";

    const wipe = document.createElement("div");
    wipe.className = "theme-wipe";
    wipe.style.background = color;
    wipe.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    document.body.appendChild(wipe);

    wipe.offsetHeight;

    wipe.style.transition = "clip-path 0.5s cubic-bezier(0.3, 0, 0.35, 1)";
    wipe.style.clipPath = `circle(150% at ${x}px ${y}px)`;

    setTimeout(() => {
      document.body.dataset.theme = theme;
      wipe.style.transition = "opacity 0.3s ease";
      wipe.style.opacity = "0";
      setTimeout(() => {
        wipe.remove();
        isAnimating = false;
      }, 300);
    }, 500);
  } else {
    document.body.dataset.theme = theme;
  }
}

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", (e) => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme, true, e);
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

/* ---------- mobile hamburger menu ---------- */
const hamburgerBtn = document.getElementById("hamburger-btn");
const navPanel = document.getElementById("mobile-nav-panel");
const navOverlay = document.getElementById("mobile-nav-overlay");
const navCloseBtn = document.getElementById("mobile-nav-close");

function openMobileNav() {
  navPanel?.classList.add("open");
  navOverlay?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  navPanel?.classList.remove("open");
  navOverlay?.classList.remove("open");
  document.body.style.overflow = "";
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", openMobileNav);
}
if (navCloseBtn) {
  navCloseBtn.addEventListener("click", closeMobileNav);
}
if (navOverlay) {
  navOverlay.addEventListener("click", closeMobileNav);
}

// Close mobile nav when clicking a nav link
document.querySelectorAll(".mobile-nav-items .nav-link").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

/* ---------- mobile theme toggles ---------- */
const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
const mobilePanelThemeToggle = document.getElementById("mobile-panel-theme-toggle");

function handleMobileThemeToggle(e) {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme, true, e);
}

if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener("click", handleMobileThemeToggle);
}
if (mobilePanelThemeToggle) {
  mobilePanelThemeToggle.addEventListener("click", handleMobileThemeToggle);
}
