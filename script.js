let priceData = null;

// ✅ تحميل الأسعار من ملف JSON
fetch('prices.json')
    .then(response => response.json())
    .then(data => {
        priceData = data.prices;
        updatePlaceholders();
    })
    .catch(() => { priceData = []; });

// ✅ اختيار كمية وسعر افتراضيين
function updatePlaceholders() {
    if (!priceData || priceData.length === 0) return;

    let randomIndex = Math.floor(Math.random() * priceData.length);
    let selectedRange = priceData[randomIndex];
    let randomQuantity = Math.floor(Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min);
    let estimatedPrice = Math.ceil((randomQuantity / 1000) * selectedRange.pricePer1000);

    document.getElementById("a").placeholder = `مثال: ${randomQuantity}`;
    document.getElementById("y").placeholder = `مثال: ${estimatedPrice}`;
}

// ✅ الحصول على سعر الفئة المناسبة لكل 1000 عملة
function getPricePer1000(quantity) {
    if (!priceData) return null;
    return priceData.find(range => quantity >= range.min && quantity <= range.max)?.pricePer1000 || null;
}

// ✅ حساب الكمية بناءً على السعر المدخل مع التقريب
function getQuantityFromPrice(price) {
    if (!priceData) return null;

    for (let i = priceData.length - 1; i >= 0; i--) {
        let { min, max, pricePer1000 } = priceData[i];
        let possibleQuantity = (price / pricePer1000) * 1000;

        if (possibleQuantity >= min && possibleQuantity <= max) {
            return Math.floor(possibleQuantity);
        }
    }
    return null;
}

// ✅ تحديث الحقول عند الإدخال
function validateInput(input, value, min, max) {
    if (!isNaN(value) && value >= min && value <= max) {
        input.classList.remove("error");
    } else {
        input.classList.add("error");
    }
}

document.getElementById("a").addEventListener("input", function () {
    let quantity = parseInt(this.value);
    let priceInput = document.getElementById("y");

    validateInput(this, quantity, 100, 100000);
    let pricePer1000 = getPricePer1000(quantity);
    priceInput.value = pricePer1000 ? Math.ceil((quantity / 1000) * pricePer1000) : "";
    validateOrderButton();
});

document.getElementById("y").addEventListener("input", function () {
    let price = parseInt(this.value);
    let quantityInput = document.getElementById("a");

    validateInput(this, price, 1, 100000);
    quantityInput.value = getQuantityFromPrice(price) || "";
    validateOrderButton();
});

// ✅ تفعيل زر الطلب فقط عند إدخال بيانات صحيحة
function validateOrderButton() {
    let quantity = parseInt(document.getElementById("a").value);
    let price = parseInt(document.getElementById("y").value);
    let orderButton = document.getElementById("orderButton");

    if (!isNaN(quantity) && !isNaN(price) && quantity >= 100 && quantity <= 100000) {
        orderButton.disabled = false;
    } else {
        orderButton.disabled = true;
    }
}

// ✅ جعل الوضع الداكن يتبع نظام الهاتف دائمًا
function applyDarkModePreference() {
    let systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.body.classList.toggle("dark-mode", systemPreference);
    document.getElementById("darkModeToggle").textContent = systemPreference ? "☀️" : "🌙";
}

// ✅ تحديث الوضع الداكن عند تغيير إعدادات النظام في الوقت الفعلي
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDarkModePreference);

// ✅ تحميل إعدادات الوضع الداكن عند تشغيل الصفحة
document.addEventListener("DOMContentLoaded", applyDarkModePreference);

// ✅ تبديل الوضع الداكن يدويًا (لكن لن يتم حفظ التفضيل)
document.getElementById("darkModeToggle").addEventListener("click", function () {
    let isDark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", isDark);
    this.textContent = isDark ? "☀️" : "🌙";
});

// ✅ إضافة تأثير فتح القائمة المتموج
document.getElementById("paymentSelect").addEventListener("focus", function () {
    this.classList.add("open");
});

document.getElementById("paymentSelect").addEventListener("blur", function () {
    this.classList.remove("open");
});

// ✅ إرسال الطلب إلى واتساب
document.getElementById("orderButton").addEventListener("click", function () {
    let quantity = document.getElementById("a").value;
    let price = document.getElementById("y").value;
    let paymentMethod = document.getElementById("paymentSelect").value;

    if (!quantity || !price || isNaN(quantity) || isNaN(price)) {
        return;
    }

    let whatsappMessage = `مرحبا، أرغب في طلب ${quantity} عملة تيك توك بسعر ${price} ج.م عبر ${paymentMethod}.`;
    let whatsappUrl = `https://wa.me/201060795179?text=${encodeURIComponent(whatsappMessage)}`;

    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1000);
});
