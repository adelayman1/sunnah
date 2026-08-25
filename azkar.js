const azkarCategoryGrid = document.getElementById("azkar-category-grid");

const azkarIcons = {
    sabah: "M6.76 4.84 4.34 2.42 2.93 3.83l2.42 2.42zM4 10.5H1v2h3zM13 1h-2v3h2zm7.24 3.83-1.41-1.41-2.42 2.42 1.41 1.41zM17.24 18.16l2.42 2.42 1.41-1.41-2.42-2.42zM20 10.5v2h3v-2zM12 5.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-1 15h2v3h-2zm-7.66-2.11 1.41 1.41 2.42-2.42-1.41-1.41z",
    masaa: "M12.3 2a10 10 0 1 0 9.7 15.1c-.3 0-.7.05-1 .05a9 9 0 0 1-9-9c0-3.2 1.7-6 4.3-7.7-.7-.15-1.3-.25-2-.35z",
    istiqaz: "M12 6a1 1 0 0 1 1 1v4.59l3.7 3.71-1.41 1.41L11 12.41V7a1 1 0 0 1 1-1m0-4a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
    "baad-salah": "M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6zm0 2.2 6 3v4.8c0 3.9-2.6 6.7-6 7.8-3.4-1.1-6-3.9-6-7.8V7.2zm-1.2 9.4-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4z",
    thanaa: "m12 3 2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 14.8l-4.7 2.4.9-5.1-3.7-3.6 5.2-.8z",
};

function azkarCategoryCard(cat) {
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

if (azkarCategoryGrid && typeof azkarCategories !== "undefined") {
    azkarCategoryGrid.innerHTML = azkarCategories.map(azkarCategoryCard).join("");
}

const homeAzkarGrid = document.getElementById("home-azkar-grid");
if (homeAzkarGrid && typeof azkarCategories !== "undefined") {
    homeAzkarGrid.innerHTML = azkarCategories.map(azkarCategoryCard).join("");
}
