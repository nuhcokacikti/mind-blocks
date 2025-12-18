// ===== FEATURES INTEGRATION =====
// Bu dosya features.js'deki sistemleri game.js ile entegre eder

// Sayfa yüklendiğinde init et
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatures();
});

function initializeFeatures() {
    console.log('🎮 Özellik sistemleri başlatılıyor...');

    // Başarım sistemini başlat
    AchievementSystem.init();

    // Başarımları ayarlar sayfasına ekle
    populateAchievementsGrid();

    // Başarımlar ekranı butonlarını ayarla
    setupAchievementsScreen();

    console.log('✅ Tüm özellik sistemleri hazır');
}

// Günlük ödül sistemi devre dışı bırakıldı

// ===== OYUN OLAYLARINA BAĞLAN =====

// showResult fonksiyonunu override et
setTimeout(() => {
    if (typeof window.showResult === 'function') {
        const originalShowResult = window.showResult;
        window.showResult = function(correct, time, points) {
            console.log('🎮 showResult çağrıldı:', { correct, time, points });

            if (correct) {
                // Combo artır
                ComboSystem.increaseCombo();

                // Yıldız hesapla
                const level = window.gameState.currentLevel;
                const moves = window.gameState.moves;
                const stars = StarSystem.calculateStars(level, moves, time);
                StarSystem.saveLevelStars(level, stars);

                // Başarım kontrolü
                AchievementSystem.checkLevelComplete(level);
                AchievementSystem.checkScore(window.gameState.score);

                if (moves <= StarSystem.getStarCriteria(level).star3.maxMoves && time <= StarSystem.getStarCriteria(level).star3.maxTime) {
                    AchievementSystem.checkPerfectGame();
                }

                // Combo başarımı
                if (ComboSystem.currentCombo >= 5) {
                    AchievementSystem.checkCombo(ComboSystem.currentCombo);
                }

                // Hız başarımı (15 saniyeden kısa)
                if (time < 15) {
                    AchievementSystem.checkSpeedRun();
                }

                // Yıldız toplayıcı başarımı
                const totalStars = StarSystem.getTotalStars();
                if (totalStars >= 50) {
                    AchievementSystem.checkStarCollector();
                }

                // Sonuç ekranında yıldızları göster
                setTimeout(() => {
                    showStarsOnResultScreen(stars);
                }, 500);
            } else {
                // Hata - combo sıfırla
                ComboSystem.breakCombo();
            }

            // Orijinal fonksiyonu çağır
            originalShowResult.call(this, correct, time, points);
        };
        console.log('✅ showResult override edildi');
    }
}, 1000);

// Touch end override'ını biraz gecikmeyle yap
setTimeout(() => {
    if (typeof window.handleTouchEnd === 'function') {
        const originalHandleTouchEnd = window.handleTouchEnd;
        window.handleTouchEnd = function(e) {
            const touchBlock = window.touchBlock;
            const gameState = window.gameState;

            // Orijinal fonksiyonu çağır
            originalHandleTouchEnd.call(this, e);

            // Eğer blok başarıyla yerleştirildi ise (usedBlocks'a eklendi)
            if (touchBlock && gameState && gameState.usedBlocks && gameState.usedBlocks.includes(touchBlock.id)) {
                // Doğru yerleştirme olup olmadığını kontrol et
                const touch = e.changedTouches[0];
                const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.grid-cell');

                if (cell) {
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);

                    // Yerleştirilen bloğun hedef pattern'e uygun olup olmadığını kontrol et
                    let isCorrectPlacement = true;
                    for (let i = 0; i < touchBlock.shape.length && isCorrectPlacement; i++) {
                        for (let j = 0; j < touchBlock.shape[i].length && isCorrectPlacement; j++) {
                            if (touchBlock.shape[i][j] === 1) {
                                const r = row + i;
                                const c = col + j;
                                if (r < gameState.gridSize && c < gameState.gridSize) {
                                    if (gameState.targetPattern[r][c] === 0) {
                                        isCorrectPlacement = false;
                                    }
                                }
                            }
                        }
                    }

                    if (isCorrectPlacement) {
                        ComboSystem.increaseCombo();
                    } else {
                        ComboSystem.breakCombo();
                    }
                }
            }
        };
        console.log('✅ handleTouchEnd override edildi');
    }
}, 1000);

// Sonuç ekranında yıldızları göster
function showStarsOnResultScreen(earnedStars) {
    const starsDisplay = document.getElementById('result-stars');
    if (!starsDisplay) return;

    const stars = starsDisplay.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.remove('earned');
        if (index < earnedStars) {
            setTimeout(() => {
                star.classList.add('earned');
            }, index * 200);
        }
    });
}

// ===== YARDIMCI FONKSİYONLAR =====

// Power-up kazandırma fonksiyonu (seviye tamamlandığında çağrılabilir)
window.awardPowerUp = function(type, amount = 1) {
    if (PowerUpSystem.powerUps[type]) {
        PowerUpSystem.powerUps[type].count += amount;
        PowerUpSystem.savePowerUps();
        updatePowerUpCounts();
    }
};

// Başarım sistemi event'lerini dışarıdan tetiklemek için
window.triggerAchievement = function(achievementId) {
    const achievement = AchievementSystem.achievements[achievementId];
    if (achievement && !achievement.unlocked) {
        AchievementSystem.unlockAchievement(achievementId);
    }
};

// Ayarlar sayfasındaki başarımlar grid'ini doldur
function populateAchievementsGrid() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;

    achievementsGrid.innerHTML = '';

    Object.keys(AchievementSystem.achievements).forEach(key => {
        const achievement = AchievementSystem.achievements[key];
        const card = document.createElement('div');
        card.className = 'achievement-card' + (achievement.unlocked ? ' unlocked' : '');

        card.innerHTML = `
            ${achievement.unlocked ? '' : '<div class="achievement-lock">🔒</div>'}
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.unlocked ? `<div class="achievement-date" style="font-size: 0.8rem; color: #94a3b8; margin-top: 8px;">Kazanıldı</div>` : ''}
        `;

        achievementsGrid.appendChild(card);
    });

    // İstatistikleri güncelle
    updateAchievementStats();
}

// Başarım istatistiklerini güncelle
function updateAchievementStats() {
    const totalStarsElement = document.getElementById('total-stars');
    const unlockedAchievementsElement = document.getElementById('unlocked-achievements');

    if (totalStarsElement) {
        totalStarsElement.textContent = StarSystem.getTotalStars();
    }

    if (unlockedAchievementsElement) {
        const unlocked = AchievementSystem.getUnlockedCount();
        const total = AchievementSystem.getTotalCount();
        unlockedAchievementsElement.textContent = `${unlocked}/${total}`;
    }
}

// Başarımlar ekranı fonksiyonları
function setupAchievementsScreen() {
    const achievementsBtn = document.getElementById('achievements-btn');
    const closeAchievementsBtn = document.getElementById('close-achievements-btn');
    const achievementsScreen = document.getElementById('achievements-screen');
    const splashScreen = document.getElementById('splash-screen');

    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', () => {
            if (splashScreen) splashScreen.classList.remove('active');
            if (achievementsScreen) achievementsScreen.classList.add('active');
            populateAchievementsGrid();
        });
    }

    if (closeAchievementsBtn) {
        closeAchievementsBtn.addEventListener('click', () => {
            if (achievementsScreen) achievementsScreen.classList.remove('active');
            if (splashScreen) splashScreen.classList.add('active');
        });
    }
}

// Başarım kazanıldığında grid'i güncelle
const originalUnlockAchievement = AchievementSystem.unlockAchievement;
AchievementSystem.unlockAchievement = function(achievementId) {
    originalUnlockAchievement.call(this, achievementId);
    populateAchievementsGrid();
};

console.log('✅ Features-integration.js yüklendi');
