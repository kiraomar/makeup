// إعدادات نافذة التنبيه
const modal = document.getElementById('security-modal');
const modalMessage = document.getElementById('modal-message');
const mainContent = document.getElementById('main-content');

function showModal(msg) {
    modalMessage.textContent = msg;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// 1. منع النقر بزر الماوس الأيمن
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showModal('عذراً، حفظ الصور أو فحص العنصر غير مسموح به.');
});

// 2. منع اختصارات لوحة المفاتيح
document.onkeydown = function(e) {
    // منع F12 أو أدوات المطور
    if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) || (e.ctrlKey && e.keyCode == 85)) {
        e.preventDefault();
        showModal('أدوات المطور معطلة.');
        return false;
    }
    // منع النسخ
    if(e.ctrlKey && (e.keyCode == 67 || e.keyCode == 88)) {
        e.preventDefault();
        showModal('عذراً، ميزة النسخ معطلة لحماية المحتوى.');
        return false;
    }
    // منع تصوير الشاشة (Print Screen) وتغبيش الصفحة فجأة
    if (e.key == 'PrintScreen' || e.keyCode == 44) {
        navigator.clipboard.writeText('المحتوى محمي بحقوق النشر - makeup by Asoo'); // إفراغ الحافظة
        mainContent.classList.add('blurred-content'); // تغبيش المحتوى
        showModal('تم حظر التقاط الشاشة للحفاظ على خصوصية العملاء.');
        
        // إزالة التغبيش بعد 3 ثواني
        setTimeout(() => {
            mainContent.classList.remove('blurred-content');
        }, 3000);
    }
};

// 3. تغبيش الصفحة عند خروج المستخدم منها (لمنع استخدام أداة Snipping Tool)
window.addEventListener('blur', function() {
    mainContent.classList.add('blurred-content');
});

// إزالة التغبيش عند عودة المستخدم للصفحة
window.addEventListener('focus', function() {
    mainContent.classList.remove('blurred-content');
});

// 4. منع النسخ من خلال الماوس
document.addEventListener('copy', function(e) {
    e.preventDefault();
    showModal('عذراً، ميزة النسخ معطلة.');
});

// 5. تأثيرات ظهور البطاقات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
});
