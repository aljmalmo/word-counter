/**
 * عداد الكلمات التفاعلي
 * أداة ويب لعد الكلمات والأحرف والفقرات بشكل فوري
 * 
 * الميزات:
 * - عد الكلمات والأحرف والفقرات والجمل
 * - حساب وقت القراءة
 * - لصق ومسح النص
 * - نسخ الإحصائيات
 * - تغيير المظهر (ليلي/نهاري)
 * - تصميم متجاوب
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const textInput = document.getElementById("textInput");
    const wordCount = document.getElementById("wordCount");
    const charCount = document.getElementById("charCount");
    const charNoSpaceCount = document.getElementById("charNoSpaceCount");
    const paragraphCount = document.getElementById("paragraphCount");
    const sentenceCount = document.getElementById("sentenceCount");
    const readingTime = document.getElementById("readingTime");
    const avgWordLength = document.getElementById("avgWordLength");
    const avgWordsPerSentence = document.getElementById("avgWordsPerSentence");
    const currentLength = document.getElementById("currentLength");

    const pasteBtn = document.getElementById("pasteBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyStatsBtn = document.getElementById("copyStatsBtn");
    const themeToggle = document.getElementById("themeToggle");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    // Event Listeners
    textInput.addEventListener("input", updateStatistics);
    pasteBtn.addEventListener("click", pasteText);
    clearBtn.addEventListener("click", clearText);
    copyStatsBtn.addEventListener("click", copyStatistics);
    themeToggle.addEventListener("click", toggleTheme);

    // Initial setup
    loadTheme();
    updateStatistics();

    // Functions
    function updateStatistics() {
        const text = textInput.value;

        // Word Count
        const words = text.trim() === '' ? [] : text.trim().match(/[\u0600-\u06FF\w]+/g) || [];
        const wordCountValue = words.length;
        animateCount(wordCount, wordCountValue);

        // Character Count (with spaces)
        const charCountValue = text.length;
        animateCount(charCount, charCountValue);
        currentLength.textContent = charCountValue;

        // Character Count (no spaces)
        const charNoSpaceCountValue = text.replace(/\s/g, "").length;
        animateCount(charNoSpaceCount, charNoSpaceCountValue);

        // Paragraph Count
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        const paragraphCountValue = paragraphs.length;
        animateCount(paragraphCount, paragraphCountValue);

        // Sentence Count
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const sentenceCountValue = sentences.length;
        animateCount(sentenceCount, sentenceCountValue);

        // Reading Time (assuming 200 words per minute)
        const readingTimeValue = Math.ceil(wordCountValue / 200);
        animateCount(readingTime, readingTimeValue);

        // Average Word Length
        const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
        const avgWordLengthValue = wordCountValue > 0 ? (totalWordLength / wordCountValue).toFixed(1) : 0;
        avgWordLength.textContent = avgWordLengthValue;

        // Average Words Per Sentence
        const avgWordsPerSentenceValue = sentenceCountValue > 0 ? (wordCountValue / sentenceCountValue).toFixed(1) : 0;
        avgWordsPerSentence.textContent = avgWordsPerSentenceValue;

        // Update Progress Bars
        updateProgressBar("wordProgress", wordCountValue, 1000);
        updateProgressBar("charProgress", charCountValue, 5000);
        updateProgressBar("charNoSpaceProgress", charNoSpaceCountValue, 4000);
        updateProgressBar("paragraphProgress", paragraphCountValue, 50);
        updateProgressBar("sentenceProgress", sentenceCountValue, 100);
        updateProgressBar("readingProgress", readingTimeValue, 10);
    }

    function animateCount(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        if (startValue === targetValue) return;

        element.classList.add("animate");
        setTimeout(() => element.classList.remove("animate"), 300);
        element.textContent = targetValue;
    }

    function updateProgressBar(id, value, max) {
        const progressBar = document.getElementById(id);
        if (progressBar) {
            const percentage = Math.min((value / max) * 100, 100);
            progressBar.style.width = `${percentage}%`;
        }
    }

    async function pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            textInput.value = text;
            updateStatistics();
            showToast("تم لصق النص بنجاح!");
        } catch (err) {
            showToast("فشل لصق النص.", true);
        }
    }

    function clearText() {
        textInput.value = "";
        updateStatistics();
        showToast("تم مسح النص.");
    }

    function copyStatistics() {
        const statsText = `
            إحصائيات النص:
            - الكلمات: ${wordCount.textContent}
            - الأحرف (مع المسافات): ${charCount.textContent}
            - الأحرف (بدون مسافات): ${charNoSpaceCount.textContent}
            - الفقرات: ${paragraphCount.textContent}
            - الجمل: ${sentenceCount.textContent}
            - وقت القراءة: ${readingTime.textContent} دقيقة
            - متوسط طول الكلمة: ${avgWordLength.textContent} حرف
            - متوسط الكلمات في الجملة: ${avgWordsPerSentence.textContent}
        `;

        navigator.clipboard.writeText(statsText.trim()).then(() => {
            showToast("تم نسخ الإحصائيات بنجاح!");
        }).catch(() => {
            showToast("فشل نسخ الإحصائيات.", true);
        });
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.innerHTML = newTheme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeToggle.innerHTML = savedTheme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
    }

    function showToast(message, isError = false) {
        toastMessage.textContent = message;
        toast.className = `toast show ${isError ? "error" : ""}`;
        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }
});

