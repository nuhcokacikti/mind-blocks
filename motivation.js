// ===== Motivasyon Mesajları =====

// Farklı seviyeler için motivasyon mesajları
const motivationMessages = {
    5: { text: "LET'S GO!", subtext: "İlk 5 seviyeyi tamamladın!" },
    10: { text: "ON FIRE!", subtext: "Harika gidiyorsun! 🔥" },
    15: { text: "UNSTOPPABLE!", subtext: "Kimse seni durduramaz! 💪" },
    20: { text: "LEGENDARY!", subtext: "Sen bir efsanesin! ⭐" },
    25: { text: "AMAZING!", subtext: "İnanılmaz performans! 🎯" },
    30: { text: "GODLIKE!", subtext: "Tanrısal oyun! ⚡" },
    35: { text: "PHENOMENAL!", subtext: "Olağanüstü başarı! 🌟" },
    40: { text: "MASTERFUL!", subtext: "Usta seviyesindesin! 👑" },
    45: { text: "INCREDIBLE!", subtext: "İnanılmaz bir yolculuk! 🚀" },
    50: { text: "CHAMPION!", subtext: "Gerçek bir şampiyon! 🏆" }
};

// Motivasyon mesajını göster
function showMotivation(level) {
    // Sadece 5'in katlarında göster
    if (level % 5 !== 0 || level === 0) return;

    const message = motivationMessages[level] || motivationMessages[50];
    const overlay = document.getElementById('motivation-overlay');
    const textElement = document.getElementById('motivation-text');
    const subtextElement = document.getElementById('motivation-subtext');
    const starsContainer = document.getElementById('motivation-stars');

    if (!overlay || !textElement || !subtextElement) return;

    // Mesajları ayarla
    textElement.textContent = message.text;
    subtextElement.textContent = message.subtext;

    // Yıldızları temizle
    starsContainer.innerHTML = '';

    // Yıldızlar oluştur
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'motivation-star';

        // Rastgele pozisyon
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        star.style.left = '50%';
        star.style.top = '50%';
        star.style.setProperty('--tx', tx + 'px');
        star.style.setProperty('--ty', ty + 'px');
        star.style.animationDelay = (i * 0.05) + 's';

        starsContainer.appendChild(star);
    }

    // Overlay'i göster
    overlay.classList.add('active');

    // HEYECANLI SES EFEKTLERİ!
    if (window.motivationSounds) {
        // Tam ses paketi - patlama, whoosh, power-up, fanfare!
        window.motivationSounds.playMotivationSequence();
    }

    // Ekstra efekt sesi (varsa)
    try {
        if (typeof sounds !== 'undefined' && sounds.success) {
            sounds.success();
        }
    } catch(e) {}

    // 2.5 saniye sonra gizle (sesler bitsin)
    setTimeout(() => {
        overlay.classList.remove('active');

        // Yıldızları temizle
        setTimeout(() => {
            starsContainer.innerHTML = '';
        }, 300);
    }, 2500);
}

// Export fonksiyon
window.showMotivation = showMotivation;

console.log('💪 Motivasyon sistemi yüklendi!');
