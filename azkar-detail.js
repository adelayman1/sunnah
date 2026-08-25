const azkarDetailPage = document.getElementById("azkar-detail-page");
const azkarParams = new URLSearchParams(window.location.search);
const azkarCatId = azkarParams.get("cat");

const azkarCategory =
    (typeof azkarCategories !== "undefined" &&
        azkarCategories.find((cat) => cat.id === azkarCatId)) ||
    (typeof azkarCategories !== "undefined" ? azkarCategories[0] : null);

if (!azkarCategory) {
    azkarDetailPage.innerHTML = `
    <a class="back-link" href="azkar.html">العودة إلى الأذكار</a>
    <div class="empty-state">تعذّر إيجاد هذا القسم.</div>
  `;
} else {
    const total = azkarCategory.items.length;
    const storageKey = `azkar-progress-${azkarCategory.id}`;

    let currentIndex = 0;
    let currentCount = 0;
    let finished = false;

    function currentItem() {
        return azkarCategory.items[currentIndex];
    }

    function saveProgress() {
        try {
            localStorage.setItem(storageKey, String(currentIndex));
        } catch (error) {
            /* ignore storage errors */
        }
    }

    function loadProgress() {
        try {
            const saved = parseInt(localStorage.getItem(storageKey), 10);
            if (!Number.isNaN(saved) && saved >= 0 && saved < total) {
                currentIndex = saved;
            }
        } catch (error) {
            /* ignore storage errors */
        }
    }

    function otherCategories() {
        return azkarCategories.filter((cat) => cat.id !== azkarCategory.id);
    }

    function renderComplete() {
        finished = true;
        azkarDetailPage.innerHTML = `
      <a class="back-link" href="azkar.html">العودة إلى الأذكار</a>
      <section class="alt-hero azkar-hero">
        <div class="alt-hero-box">
          <div>
            <div class="detail-meta">تم بحمد الله</div>
            <h2>${azkarCategory.title}</h2>
            <p>أتممت جميع أذكار هذا القسم</p>
          </div>
          <div class="alt-logo">✓</div>
        </div>
        <div class="alt-copy">
          <div class="alt-breadcrumbs">
            <span>الرئيسية</span>
            <span>›</span>
            <span>الأذكار</span>
            <span>›</span>
            <span>${azkarCategory.title}</span>
          </div>
          <h1>تقبّل الله منك</h1>
          <p>أتممت قراءة ${total} ذكرًا من "${azkarCategory.title}". يمكنك إعادتها أو الانتقال إلى قسم آخر.</p>
          <div class="alt-hero-actions">
            <button class="pill-link" id="azkar-restart">إعادة من البداية</button>
            <a class="pill-link" href="azkar.html">كل الأقسام</a>
          </div>
        </div>
      </section>
      <section class="alt-content">
        <div class="alt-sections" id="azkar-other-grid"></div>
      </section>
    `;

        const otherGrid = document.getElementById("azkar-other-grid");
        if (otherGrid) {
            otherGrid.innerHTML = otherCategories()
                .map(
                    (cat) => `
          <a class="alt-grid-card azkar-category-card" href="azkar-detail.html?cat=${cat.id}">
            <h3>${cat.title}</h3>
            <p class="azkar-category-count">${cat.items.length} ذكرًا</p>
            <span class="read-more">ابدأ القراءة ←</span>
          </a>
        `
                )
                .join("");
        }

        document.getElementById("azkar-restart")?.addEventListener("click", () => {
            currentIndex = 0;
            currentCount = 0;
            finished = false;
            saveProgress();
            render();
        });
    }

    function goToIndex(index) {
        currentIndex = Math.max(0, Math.min(total - 1, index));
        currentCount = 0;
        saveProgress();
        render();
    }

    function handleTap() {
        if (finished) return;
        const item = currentItem();
        currentCount += 1;

        if (currentCount >= item.repeat) {
            const card = document.getElementById("azkar-tap-card");
            card?.classList.add("azkar-card-done");
            setTimeout(() => {
                if (currentIndex >= total - 1) {
                    currentIndex = total - 1;
                    saveProgress();
                    renderComplete();
                } else {
                    currentIndex += 1;
                    currentCount = 0;
                    saveProgress();
                    render();
                }
            }, 420);
            renderTapState();
        } else {
            renderTapState();
        }
    }

    function renderTapState() {
        const item = currentItem();
        const remaining = Math.max(item.repeat - currentCount, 0);
        const countBadge = document.getElementById("azkar-count-badge");
        const progressFill = document.getElementById("azkar-progress-fill");
        const tapHint = document.getElementById("azkar-tap-hint");
        if (countBadge) countBadge.textContent = remaining > 0 ? `×${remaining}` : "✓";
        if (tapHint) {
            tapHint.textContent =
                item.repeat > 1 ? `اضغط ${remaining} مرة أخرى` : "اضغط للمتابعة";
        }
        if (progressFill) {
            const itemProgress = currentCount / item.repeat;
            const overall = ((currentIndex + itemProgress) / total) * 100;
            progressFill.style.width = `${Math.min(overall, 100)}%`;
        }
    }

    function render() {
        if (finished) return;
        const item = currentItem();
        const remaining = Math.max(item.repeat - currentCount, 0);

        azkarDetailPage.innerHTML = `
      <a class="back-link" href="azkar.html">العودة إلى الأذكار</a>

      <section class="azkar-detail-head">
        <h1>${azkarCategory.title}</h1>
        <div class="azkar-progress-track">
          <div class="azkar-progress-fill" id="azkar-progress-fill"></div>
        </div>
        <div class="azkar-progress-label">${currentIndex + 1} من ${total}</div>
      </section>

      <section class="azkar-tap-wrap">
        <button class="azkar-tap-card" id="azkar-tap-card" type="button">
          <span class="azkar-count-badge" id="azkar-count-badge">${item.repeat > 1 ? `×${remaining}` : "✓"}</span>
          <p class="azkar-tap-text">${item.text}</p>
          ${item.extra ? `<p class="azkar-tap-extra">${item.extra}</p>` : ""}
        </button>
        <p class="azkar-tap-hint" id="azkar-tap-hint">${item.repeat > 1 ? `اضغط ${remaining} مرة أخرى` : "اضغط للمتابعة"}</p>
      </section>

      ${
          item.noteTitle
              ? `
      <section class="alt-content">
        <article class="alt-grid-card">
          <h3>${item.noteTitle}</h3>
          <div class="detail-text soft">${item.noteBody}</div>
        </article>
      </section>`
              : ""
      }

      <section class="azkar-controls">
        <button class="button ghost" id="azkar-prev" ${currentIndex === 0 ? "disabled" : ""}>السابق</button>
        <button class="button ghost" id="azkar-skip">تخطي</button>
        <button class="button primary" id="azkar-next">${currentIndex >= total - 1 ? "إنهاء القسم" : "التالي"}</button>
      </section>
    `;

        document.getElementById("azkar-tap-card")?.addEventListener("click", handleTap);
        document.getElementById("azkar-prev")?.addEventListener("click", () => goToIndex(currentIndex - 1));
        document.getElementById("azkar-skip")?.addEventListener("click", () => {
            if (currentIndex >= total - 1) {
                renderComplete();
            } else {
                goToIndex(currentIndex + 1);
            }
        });
        document.getElementById("azkar-next")?.addEventListener("click", () => {
            if (currentIndex >= total - 1) {
                renderComplete();
            } else {
                goToIndex(currentIndex + 1);
            }
        });

        renderTapState();
    }

    loadProgress();
    render();
}
