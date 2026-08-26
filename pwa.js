// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}

// PWA Install Banner System
let deferredPrompt = null;
const PWA_DISMISSED_KEY = "pwa_banner_dismissed_v1";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function dismissPwaBanner() {
  localStorage.setItem(PWA_DISMISSED_KEY, "true");
  const banner = document.getElementById("pwa-install-banner");
  if (banner) {
    banner.remove();
  }
}
window.dismissPwaBanner = dismissPwaBanner;

function showPwaBanner(type = "android") {
  if (isStandalone() || localStorage.getItem(PWA_DISMISSED_KEY) === "true") {
    return;
  }

  let banner = document.getElementById("pwa-install-banner");
  if (banner) return;

  banner = document.createElement("div");
  banner.id = "pwa-install-banner";
  banner.className = "pwa-banner";

  if (type === "ios") {
    banner.innerHTML = `
      <div class="pwa-banner-icon">📲</div>
      <div class="pwa-banner-content">
        <span class="pwa-banner-title">تثبيت التطبيق على الآيفون</span>
        <span class="pwa-banner-desc">اضغط على زر المشاركة ⎋ أسفل الشاشة ثم اختر "الإضافة إلى الشاشة الرئيسية ➕"</span>
      </div>
      <div class="pwa-banner-actions">
        <button class="pwa-banner-close" onclick="dismissPwaBanner()" type="button" aria-label="إغلاق">✕</button>
      </div>
    `;
  } else {
    banner.innerHTML = `
      <div class="pwa-banner-icon">📱</div>
      <div class="pwa-banner-content">
        <span class="pwa-banner-title">تثبيت تطبيق السنن</span>
        <span class="pwa-banner-desc">تصفح السنن والأذكار بنقرة واحدة وبدون إنترنت</span>
      </div>
      <div class="pwa-banner-actions">
        <button class="pwa-banner-btn" id="pwa-install-btn" type="button">تثبيت 📥</button>
        <button class="pwa-banner-close" onclick="dismissPwaBanner()" type="button" aria-label="إغلاق">✕</button>
      </div>
    `;
  }

  document.body.appendChild(banner);

  const installBtn = document.getElementById("pwa-install-btn");
  if (installBtn && deferredPrompt) {
    installBtn.addEventListener("click", async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismissPwaBanner();
      }
      deferredPrompt = null;
    });
  }
}

// Android / Chrome / Edge Install Prompt Listener
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showPwaBanner("android");
});

// iOS Safari Installation Banner Listener
window.addEventListener("load", () => {
  if (isIOS() && !isStandalone()) {
    setTimeout(() => {
      showPwaBanner("ios");
    }, 3000);
  }
});
