// ===== Ayarlar Sistemi =====
const GameSettings = {
    sound: true,
    vibration: true,
    animations: true,
    skin: 'default',
    theme: 'light' // 'light' veya 'dark'
};

// ===== Ses Efektleri =====
const SoundEffects = {
    click: () => {
        if (!GameSettings.sound) return;
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    },
    
    success: () => {
        if (!GameSettings.sound) return;
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    },
    
    error: () => {
        if (!GameSettings.sound) return;
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
        audio.volume = 0.4;
        audio.play().catch(() => {});
    },
    
    levelComplete: () => {
        if (!GameSettings.sound) return;
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
        audio.volume = 0.6;
        audio.play().catch(() => {});
    }
};

// ===== Titreşim Fonksiyonu =====
const Vibrate = {
    short: () => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },
    
    medium: () => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    },
    
    long: () => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    },
    
    pattern: (pattern) => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },
    
    success: () => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 50, 50]);
        }
    },
    
    error: () => {
        if (!GameSettings.vibration) return;
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }
};

// ===== Ayarları Yükle =====
function loadSettings() {
    const saved = localStorage.getItem('mindBlocksSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        GameSettings.sound = settings.sound !== undefined ? settings.sound : true;
        GameSettings.vibration = settings.vibration !== undefined ? settings.vibration : true;
        GameSettings.animations = settings.animations !== undefined ? settings.animations : true;
        GameSettings.skin = settings.skin || 'default';
        GameSettings.theme = settings.theme || 'light';
    }
    // else - Hiç kayıtlı ayar yoksa GameSettings'teki varsayılan değerler kullanılacak (hepsi true)

    // UI'yi güncelle (her zaman çalışmalı)
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');
    const animationsToggle = document.getElementById('animations-toggle');

    if (soundToggle) soundToggle.checked = GameSettings.sound;
    if (vibrationToggle) vibrationToggle.checked = GameSettings.vibration;
    if (animationsToggle) animationsToggle.checked = GameSettings.animations;

    // Skin'i uygula
    applySkin(GameSettings.skin);

    // Temayı uygula
    applyTheme(GameSettings.theme);

    // Aktif skin kartını işaretle
    document.querySelectorAll('.skin-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.skin === GameSettings.skin) {
            card.classList.add('active');
        }
    });

    // Aktif tema butonunu işaretle
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === GameSettings.theme) {
            btn.classList.add('active');
        }
    });

    console.log('🔊 Ses ayarları yüklendi:', GameSettings);
}

// ===== Ayarları Kaydet =====
function saveSettings() {
    localStorage.setItem('mindBlocksSettings', JSON.stringify(GameSettings));
    SoundEffects.success();
    Vibrate.short();
    
    // Bildirim göster
    showNotification('✅ Ayarlar kaydedildi!');
}

// ===== Skin Uygula =====
function applySkin(skinName) {
    document.body.setAttribute('data-skin', skinName);
    GameSettings.skin = skinName;
}

// ===== Tema Uygula =====
function applyTheme(themeName) {
    if (themeName === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    GameSettings.theme = themeName;
}

// ===== Bildirim Göster =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== Ayarlar Ekranı Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    // Ayarları yükle
    loadSettings();
    
    // Ayarlar ikonu butonu
    const settingsIconBtn = document.getElementById('settings-icon-btn');
    if (settingsIconBtn) {
        settingsIconBtn.addEventListener('click', () => {
            SoundEffects.click();
            Vibrate.short();
            showSettingsScreen();
        });
    }
    
    // Ayarları kapat butonu
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            SoundEffects.click();
            Vibrate.short();
            hideSettingsScreen();
        });
    }
    
    // Ana sayfaya dön butonu
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            SoundEffects.click();
            Vibrate.short();
            hideSettingsScreen();
        });
    }
    
    // Ses toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            GameSettings.sound = e.target.checked;
            if (e.target.checked) {
                SoundEffects.click();
            }
            Vibrate.short();
        });
    }
    
    // Titreşim toggle
    const vibrationToggle = document.getElementById('vibration-toggle');
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', (e) => {
            GameSettings.vibration = e.target.checked;
            SoundEffects.click();
            if (e.target.checked) {
                Vibrate.medium();
            }
        });
    }
    
    // Animasyon toggle
    const animationsToggle = document.getElementById('animations-toggle');
    if (animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
            GameSettings.animations = e.target.checked;
            SoundEffects.click();
            Vibrate.short();
            
            if (!e.target.checked) {
                document.body.style.setProperty('--animation-duration', '0s');
            } else {
                document.body.style.removeProperty('--animation-duration');
            }
        });
    }
    
    // Skin seçimi
    const skinCards = document.querySelectorAll('.skin-card');
    skinCards.forEach(card => {
        card.addEventListener('click', () => {
            SoundEffects.click();
            Vibrate.short();
            
            // Tüm kartlardan active sınıfını kaldır
            skinCards.forEach(c => c.classList.remove('active'));
            
            // Seçili karta active ekle
            card.classList.add('active');
            
            // Skin'i uygula
            const skinName = card.dataset.skin;
            applySkin(skinName);
        });
    });
    
    // Tema seçimi
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            SoundEffects.click();
            Vibrate.short();
            
            // Tüm butonlardan active sınıfını kaldır
            themeButtons.forEach(b => b.classList.remove('active'));
            
            // Seçili butona active ekle
            btn.classList.add('active');
            
            // Temayı uygula
            const themeName = btn.dataset.theme;
            applyTheme(themeName);
        });
    });
    
    // Ayarları kaydet butonu
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            saveSettings();
            setTimeout(() => {
                hideSettingsScreen();
            }, 500);
        });
    }
});

// ===== Ayarlar Ekranını Göster/Gizle =====
function showSettingsScreen() {
    const settingsScreen = document.getElementById('settings-screen');
    const splashScreen = document.getElementById('splash-screen');
    
    if (settingsScreen && splashScreen) {
        splashScreen.classList.remove('active');
        settingsScreen.classList.add('active');
    }
}

function hideSettingsScreen() {
    const settingsScreen = document.getElementById('settings-screen');
    const splashScreen = document.getElementById('splash-screen');
    
    if (settingsScreen && splashScreen) {
        settingsScreen.classList.remove('active');
        splashScreen.classList.add('active');
    }
}

// ===== Animasyon Stilleri =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Export (Diğer dosyalarda kullanmak için) =====
window.GameSettings = GameSettings;
window.SoundEffects = SoundEffects;
window.Vibrate = Vibrate;
window.showSettingsScreen = showSettingsScreen;
window.hideSettingsScreen = hideSettingsScreen;
