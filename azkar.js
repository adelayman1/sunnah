const azkarCategoryGrid = document.getElementById("azkar-category-grid");
const homeAzkarGrid = document.getElementById("home-azkar-grid");

const azkarIcons = {
    sabah: "M6.76 4.84 4.34 2.42 2.93 3.83l2.42 2.42zM4 10.5H1v2h3zM13 1h-2v3h2zm7.24 3.83-1.41-1.41-2.42 2.42 1.41 1.41zM17.24 18.16l2.42 2.42 1.41-1.41-2.42-2.42zM20 10.5v2h3v-2zM12 5.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-1 15h2v3h-2zm-7.66-2.11 1.41 1.41 2.42-2.42-1.41-1.41z",
    masaa: "M12.3 2a10 10 0 1 0 9.7 15.1c-.3 0-.7.05-1 .05a9 9 0 0 1-9-9c0-3.2 1.7-6 4.3-7.7-.7-.15-1.3-.25-2-.35z",
    istiqaz: "M12 6a1 1 0 0 1 1 1v4.59l3.7 3.71-1.41 1.41L11 12.41V7a1 1 0 0 1 1-1m0-4a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
    "baad-salah": "M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6zm0 2.2 6 3v4.8c0 3.9-2.6 6.7-6 7.8-3.4-1.1-6-3.9-6-7.8V7.2zm-1.2 9.4-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4z",
    thanaa: "m12 3 2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 14.8l-4.7 2.4.9-5.1-3.7-3.6 5.2-.8z",
};

function azkarCategoryCardLuxury(cat) {
    const icon = azkarIcons[cat.id] || azkarIcons.thanaa;
    return `
    <a class="azkar-card-luxury" href="azkar-detail.html?cat=${cat.id}">
      <div class="azkar-card-top">
        <div class="azkar-card-icon-minimal">
          <svg viewBox="0 0 24 24"><path d="${icon}"/></svg>
        </div>
        <span class="azkar-card-count-pill">${cat.items.length} ذكرًا</span>
      </div>

      <div class="azkar-card-body-minimal">
        <h3 class="azkar-card-title-minimal">${cat.title}</h3>
        ${cat.description ? `<p class="azkar-card-desc-minimal">${cat.description}</p>` : ""}
      </div>

      <div class="azkar-card-bottom">
        <span class="azkar-card-action-text">ابدأ الذكر ←</span>
      </div>
    </a>
  `;
}

// Legacy fallback for home page grid
function azkarCategoryCardLegacy(cat) {
    const icon = azkarIcons[cat.id] || azkarIcons.thanaa;
    return `
    <a class="alt-grid-card azkar-category-card" href="azkar-detail.html?cat=${cat.id}">
      <span class="azkar-category-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="${icon}"/></svg>
      </span>
      <h3>${cat.title}</h3>
      <p class="azkar-category-count">${cat.items.length} ذكرًا</p>
      ${cat.description ? `<div class="detail-text soft azkar-category-desc">${cat.description}</div>` : ""}
      <span class="read-more">ابدأ القراءة ←</span>
    </a>
  `;
}

function initAzkarPage() {
    if (typeof azkarCategories === "undefined") return;

    if (homeAzkarGrid) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        // أذكار الصباح حتى 3:30 عصراً، وبعد 3:30 عصراً تبدأ أذكار المساء
        const isMorning = currentMinutes >= (4 * 60) && currentMinutes < (15 * 60 + 30);
        const targetCatId = isMorning ? "sabah" : "masaa";
        const currentCat = azkarCategories.find(c => c.id === targetCatId) || azkarCategories[0];

        if (currentCat) {
            homeAzkarGrid.innerHTML = azkarCategoryCardLegacy(currentCat);
        }

        const homeAzkarBtn = document.getElementById("home-azkar-btn");
        if (homeAzkarBtn) {
            homeAzkarBtn.textContent = isMorning ? "عرض كل الأذكار" : "عرض كل الأقسام";
        }
    }

    if (!azkarCategoryGrid) return;

    renderAzkarCategories(azkarCategories);

    const searchInput = document.getElementById("azkar-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                renderAzkarCategories(azkarCategories);
                return;
            }
            const filtered = azkarCategories.filter(cat => {
                const titleMatch = cat.title && cat.title.toLowerCase().includes(query);
                const descMatch = cat.description && cat.description.toLowerCase().includes(query);
                const itemsMatch = cat.items && cat.items.some(item => item.text && item.text.includes(query));
                return titleMatch || descMatch || itemsMatch;
            });
            renderAzkarCategories(filtered);
        });
    }
}

function renderAzkarCategories(list) {
    if (!azkarCategoryGrid) return;

    if (list.length === 0) {
        azkarCategoryGrid.innerHTML = `
            <div class="azkar-empty-search" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--muted);">
                <p>لم يتم العثور على أذكار تطابق نتائج البحث.</p>
            </div>
        `;
        return;
    }

    azkarCategoryGrid.innerHTML = list.map(azkarCategoryCardLuxury).join("");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAzkarPage);
} else {
    initAzkarPage();
}
