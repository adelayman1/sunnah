const azkarDetailPage = document.getElementById("azkar-detail-page");

// ============================================================
// حالة الصفحة
// ============================================================

let azkarCategory = null;
let finished = false;
let total = 0;
let currentIndex = 0;
let currentCount = 0;

try {
    // ============================================================
    // قراءة القسم من الرابط
    // ============================================================

    const azkarParams = new URLSearchParams(
        window.location.search
    );

    const azkarCatId = azkarParams.get("cat");

    // ============================================================
    // الحصول على بيانات الأذكار
    // ============================================================

    const categories = window.azkarCategories;

    if (!Array.isArray(categories)) {
        throw new Error(
            "بيانات الأذكار غير محملة. تأكد من تحميل azkar-data.js قبل azkar-detail.js وأنه يحتوي على window.azkarCategories."
        );
    }

    // ============================================================
    // تحديد القسم
    // ============================================================

    azkarCategory =
        categories.find(function (cat) {
            return String(cat.id) === String(azkarCatId);
        }) || categories[0];

    // ============================================================
    // إذا لم يوجد قسم
    // ============================================================

    if (!azkarCategory) {
        azkarDetailPage.innerHTML = `
            <a
                class="back-link"
                href="azkar.html"
            >
                العودة إلى الأذكار
            </a>

            <div class="empty-state">
                تعذّر إيجاد هذا القسم.
            </div>
        `;
    } else {

        // ========================================================
        // التأكد من وجود items
        // ========================================================

        if (!Array.isArray(azkarCategory.items)) {
            throw new Error(
                'القسم "' +
                (azkarCategory.title || azkarCategory.id) +
                '" لا يحتوي على items صحيحة.'
            );
        }

        total = azkarCategory.items.length;

        // ========================================================
        // إذا كان القسم فارغًا
        // ========================================================

        if (total === 0) {
            azkarDetailPage.innerHTML = `
                <a
                    class="back-link"
                    href="azkar.html"
                >
                    العودة إلى الأذكار
                </a>

                <div class="empty-state">
                    لا توجد أذكار في هذا القسم.
                </div>
            `;
        } else {

            // ====================================================
            // العنصر الحالي
            // ====================================================

            function currentItem() {
                return azkarCategory.items[currentIndex];
            }

            // ====================================================
            // الأقسام الأخرى
            // ====================================================

            function otherCategories() {
                return categories.filter(function (cat) {
                    return cat.id !== azkarCategory.id;
                });
            }

            // ====================================================
            // شاشة إتمام القسم
            // ====================================================

            function renderComplete() {

                finished = true;

                azkarDetailPage.innerHTML = `
                    <a
                        class="back-link"
                        href="azkar.html"
                    >
                        العودة إلى الأذكار
                    </a>

                    <section class="alt-hero azkar-hero">

                        <div class="alt-hero-box">

                            <div>

                                <div class="detail-meta">
                                    تم بحمد الله
                                </div>

                                <h2>
                                    ${azkarCategory.title}
                                </h2>

                                <p>
                                    أتممت جميع أذكار هذا القسم
                                </p>

                            </div>

                            <div class="alt-logo">
                                ✓
                            </div>

                        </div>

                        <div class="alt-copy">

                            <div class="alt-breadcrumbs">

                                <span>
                                    الرئيسية
                                </span>

                                <span>›</span>

                                <span>
                                    الأذكار
                                </span>

                                <span>›</span>

                                <span>
                                    ${azkarCategory.title}
                                </span>

                            </div>

                            <h1>
                                تقبّل الله منك
                            </h1>

                            <p>
                                أتممت قراءة ${total} ذكرًا من
                                "${azkarCategory.title}".
                                يمكنك إعادتها أو الانتقال إلى قسم آخر.
                            </p>

                            <div class="alt-hero-actions">

                                <button
                                    class="pill-link"
                                    id="azkar-restart"
                                    type="button"
                                >
                                    إعادة من البداية
                                </button>

                                <a
                                    class="pill-link"
                                    href="azkar.html"
                                >
                                    كل الأقسام
                                </a>

                            </div>

                        </div>

                    </section>

                    <section class="alt-content">

                        <div
                            class="alt-sections"
                            id="azkar-other-grid"
                        ></div>

                    </section>
                `;

                // =================================================
                // الأقسام الأخرى
                // =================================================

                const otherGrid =
                    document.getElementById(
                        "azkar-other-grid"
                    );

                if (otherGrid) {

                    otherGrid.innerHTML =
                        otherCategories()
                            .map(function (cat) {

                                return `
                                    <a
                                        class="alt-grid-card azkar-category-card"
                                        href="azkar-detail.html?cat=${encodeURIComponent(cat.id)}"
                                    >

                                        <h3>
                                            ${cat.title}
                                        </h3>

                                        <p class="azkar-category-count">
                                            ${cat.items.length} ذكرًا
                                        </p>

                                        <span class="read-more">
                                            ابدأ القراءة ←
                                        </span>

                                    </a>
                                `;

                            })
                            .join("");
                }

                // =================================================
                // إعادة من البداية
                // =================================================

                const restartButton =
                    document.getElementById(
                        "azkar-restart"
                    );

                if (restartButton) {

                    restartButton.addEventListener(
                        "click",
                        function () {

                            currentIndex = 0;
                            currentCount = 0;
                            finished = false;

                            render();
                        }
                    );
                }
            }

            // ====================================================
            // الانتقال إلى ذكر
            // ====================================================

            function goToIndex(index) {

                currentIndex = Math.max(
                    0,
                    Math.min(
                        total - 1,
                        index
                    )
                );

                currentCount = 0;
                finished = false;

                render();
            }

            // ====================================================
            // الضغط على بطاقة الذكر
            // ====================================================

            function handleTap() {

                if (finished) {
                    return;
                }

                const item = currentItem();

                if (!item) {
                    return;
                }

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(22);
                }

                const repeat =
                    Number(item.repeat) || 1;

                currentCount += 1;

                // =================================================
                // اكتمل عدد التكرارات
                // =================================================

                if (currentCount >= repeat) {

                    if (navigator.vibrate) {
                        navigator.vibrate([30, 40, 30]);
                    }

                    const card =
                        document.getElementById(
                            "azkar-tap-card"
                        );

                    if (card) {
                        card.classList.add(
                            "azkar-card-done"
                        );
                    }

                    setTimeout(
                        function () {

                            // =====================================
                            // آخر ذكر
                            // =====================================

                            if (
                                currentIndex >=
                                total - 1
                            ) {

                                currentIndex =
                                    total - 1;

                                currentCount = repeat;

                                renderComplete();

                            } else {

                                // =================================
                                // الذكر التالي
                                // =================================

                                currentIndex += 1;
                                currentCount = 0;

                                render();
                            }

                        },
                        420
                    );

                    renderTapState();

                } else {

                    renderTapState();
                }
            }

            // ====================================================
            // تحديث العداد وشريط التقدم
            // ====================================================

            function renderTapState() {

                const item = currentItem();

                if (!item) {
                    return;
                }

                const repeat =
                    Number(item.repeat) || 1;

                const remaining =
                    Math.max(
                        repeat - currentCount,
                        0
                    );

                // =================================================
                // العداد
                // =================================================

                const countBadge =
                    document.getElementById(
                        "azkar-count-badge"
                    );

                if (countBadge) {

                    countBadge.textContent =
                        remaining > 0
                            ? "×" + remaining
                            : "✓";
                }

                // =================================================
                // النص المساعد
                // =================================================

                const tapHint =
                    document.getElementById(
                        "azkar-tap-hint"
                    );

                if (tapHint) {

                    tapHint.textContent =
                        repeat > 1
                            ? "اضغط " +
                              remaining +
                              " مرة أخرى"
                            : "اضغط للمتابعة";
                }

                // =================================================
                // شريط التقدم
                // =================================================

                const progressFill =
                    document.getElementById(
                        "azkar-progress-fill"
                    );

                if (progressFill) {

                    const itemProgress =
                        repeat > 0
                            ? currentCount / repeat
                            : 1;

                    const overall =
                        (
                            (
                                currentIndex +
                                itemProgress
                            ) /
                            total
                        ) *
                        100;

                    progressFill.style.width =
                        Math.min(
                            overall,
                            100
                        ) + "%";
                }
            }

            // ====================================================
            // رسم الصفحة
            // ====================================================

            function render() {

                if (finished) {
                    return;
                }

                const item = currentItem();

                if (!item) {
                    renderComplete();
                    return;
                }

                const repeat =
                    Number(item.repeat) || 1;

                const remaining =
                    Math.max(
                        repeat - currentCount,
                        0
                    );

                // =================================================
                // بناء الصفحة
                // =================================================

                azkarDetailPage.innerHTML = `

                    <a
                        class="back-link"
                        href="azkar.html"
                    >
                        العودة إلى الأذكار
                    </a>

                    <section
                        class="azkar-detail-head"
                    >

                        <h1>
                            ${azkarCategory.title}
                        </h1>

                        <div
                            class="azkar-progress-track"
                        >

                            <div
                                class="azkar-progress-fill"
                                id="azkar-progress-fill"
                            ></div>

                        </div>

                        <div
                            class="azkar-progress-label"
                        >
                            ${currentIndex + 1}
                            من
                            ${total}
                        </div>

                    </section>

                    <section
                        class="azkar-tap-wrap"
                    >

                        <button
                            class="azkar-tap-card"
                            id="azkar-tap-card"
                            type="button"
                        >

                            <span
                                class="azkar-count-badge"
                                id="azkar-count-badge"
                            >
                                ${
                                    repeat > 1
                                        ? "×" + remaining
                                        : "✓"
                                }
                            </span>

                            <p
                                class="azkar-tap-text"
                            >
                                ${item.text || ""}
                            </p>

                            ${
                                item.extra
                                    ? `
                                        <p
                                            class="azkar-tap-extra"
                                        >
                                            ${item.extra}
                                        </p>
                                    `
                                    : ""
                            }

                        </button>

                        <p
                            class="azkar-tap-hint"
                            id="azkar-tap-hint"
                        >
                            ${
                                repeat > 1
                                    ? "اضغط " +
                                      remaining +
                                      " مرة أخرى"
                                    : "اضغط للمتابعة"
                            }
                        </p>

                    </section>

                    ${
                        item.noteTitle
                            ? `
                                <section
                                    class="alt-content"
                                >

                                    <details
                                        class="alt-grid-card azkar-note"
                                    >

                                        <summary>
                                            ${item.noteTitle}
                                        </summary>

                                        <div
                                            class="detail-text soft"
                                        >
                                            ${
                                                item.noteBody ||
                                                ""
                                            }
                                        </div>

                                    </details>

                                </section>
                            `
                            : ""
                    }

                    <section
                        class="azkar-controls"
                    >

                        <button
                            class="button ghost"
                            id="azkar-prev"
                            ${
                                currentIndex === 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            السابق
                        </button>

                        <button
                            class="button ghost"
                            id="azkar-skip"
                        >
                            تخطي
                        </button>

                        <button
                            class="button primary"
                            id="azkar-next"
                        >
                            ${
                                currentIndex >=
                                total - 1
                                    ? "إنهاء القسم"
                                    : "التالي"
                            }
                        </button>

                    </section>
                `;

                // =================================================
                // زر الذكر
                // =================================================

                const tapCard =
                    document.getElementById(
                        "azkar-tap-card"
                    );

                if (tapCard) {

                    tapCard.addEventListener(
                        "click",
                        handleTap
                    );
                }

                // =================================================
                // زر السابق
                // =================================================

                const prevButton =
                    document.getElementById(
                        "azkar-prev"
                    );

                if (prevButton) {

                    prevButton.addEventListener(
                        "click",
                        function () {

                            goToIndex(
                                currentIndex - 1
                            );

                        }
                    );
                }

                // =================================================
                // زر تخطي
                // =================================================

                const skipButton =
                    document.getElementById(
                        "azkar-skip"
                    );

                if (skipButton) {

                    skipButton.addEventListener(
                        "click",
                        function () {

                            if (
                                currentIndex >=
                                total - 1
                            ) {

                                renderComplete();

                            } else {

                                goToIndex(
                                    currentIndex + 1
                                );
                            }

                        }
                    );
                }

                // =================================================
                // زر التالي
                // =================================================

                const nextButton =
                    document.getElementById(
                        "azkar-next"
                    );

                if (nextButton) {

                    nextButton.addEventListener(
                        "click",
                        function () {

                            if (
                                currentIndex >=
                                total - 1
                            ) {

                                renderComplete();

                            } else {

                                goToIndex(
                                    currentIndex + 1
                                );
                            }

                        }
                    );
                }

                // =================================================
                // تحديث الحالة
                // =================================================

                renderTapState();
            }

            // ====================================================
            // بدء الصفحة
            // ====================================================

            currentIndex = 0;
            currentCount = 0;
            finished = false;

            render();
        }
    }

} catch (error) {

    // ============================================================
    // معالجة الأخطاء
    // ============================================================

    console.error(
        "azkar-detail.js error:",
        error
    );

    if (azkarDetailPage) {

        const errorMessage =
            error &&
            error.message
                ? String(error.message)
                : String(error);

        azkarDetailPage.innerHTML = `
            <a
                class="back-link"
                href="azkar.html"
            >
                العودة إلى الأذكار
            </a>

            <div class="empty-state">

                <p>
                    حدث خطأ أثناء تحميل هذه الصفحة.
                </p>

                <p
                    style="
                        font-family: monospace;
                        font-size: 0.85rem;
                        opacity: 0.8;
                        direction: ltr;
                        text-align: left;
                        margin-top: 0.8rem;
                        word-break: break-word;
                    "
                >
                    ${errorMessage.replace(
                        /</g,
                        "&lt;"
                    )}
                </p>

            </div>
        `;
    }
}