// ===== FEATURES INTEGRATION =====
// Bu dosya features.js'deki sistemleri game.js ile entegre eder

// Sayfa yüklendiğinde init et
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatures();
});

function initializeFeatures() {
    console.log('🎮 Özellik sistemleri başlatılıyor...');

    // Power-up butonlarını bağla
    setupPowerUpButtons();

    // Power-up sayılarını güncelle
    updatePowerUpCounts();

    // Günlük ödülü kontrol et
    checkDailyReward();

    // Başarım sistemini başlat
    AchievementSystem.init();

    // Başarımları ayarlar sayfasına ekle
    populateAchievementsGrid();

    console.log('✅ Tüm özellik sistemleri hazır');
}

// ===== POWER-UP BUTONLARI =====
function setupPowerUpButtons() {
    const hintBtn = document.getElementById('hint-btn');
    const extraTimeBtn = document.getElementById('extra-time-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');

    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            if (PowerUpSystem.usePowerUp('hint')) {
                // İpucu kullan - ilk kullanılmayan bloğu vurgula
                const firstUnusedBlock = window.gameState.blocks.find(
                    b => !window.gameState.usedBlocks.includes(b.id)
                );

                if (firstUnusedBlock) {
                    // Bloğun doğru yerini bul ve vurgula
                    highlightCorrectPosition(firstUnusedBlock);
                }

                updatePowerUpCounts();
            }
        });
    }

    if (extraTimeBtn) {
        extraTimeBtn.addEventListener('click', () => {
            if (PowerUpSystem.usePowerUp('extraTime')) {
                // 5 saniye ekle
                if (window.gameState && window.gameState.phase === 'memorize') {
                    const timerElement = document.getElementById('memorize-timer');
                    if (timerElement) {
                        const currentTime = parseInt(timerElement.textContent) || 0;
                        timerElement.textContent = currentTime + 5;
                    }
                }
                updatePowerUpCounts();
            }
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            if (PowerUpSystem.usePowerUp('shuffle')) {
                // Blokları yeniden oluştur
                if (window.gameState && window.gameState.phase === 'play') {
                    regenerateBlocks();
                }
                updatePowerUpCounts();
            }
        });
    }
}

function updatePowerUpCounts() {
    const hintCount = document.getElementById('hint-count');
    const extraTimeCount = document.getElementById('extra-time-count');
    const shuffleCount = document.getElementById('shuffle-count');

    if (hintCount) hintCount.textContent = PowerUpSystem.powerUps.hint.count;
    if (extraTimeCount) extraTimeCount.textContent = PowerUpSystem.powerUps.extraTime.count;
    if (shuffleCount) shuffleCount.textContent = PowerUpSystem.powerUps.shuffle.count;

    // Disable buttons if count is 0
    const hintBtn = document.getElementById('hint-btn');
    const extraTimeBtn = document.getElementById('extra-time-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');

    if (hintBtn) hintBtn.disabled = PowerUpSystem.powerUps.hint.count === 0;
    if (extraTimeBtn) extraTimeBtn.disabled = PowerUpSystem.powerUps.extraTime.count === 0;
    if (shuffleBtn) shuffleBtn.disabled = PowerUpSystem.powerUps.shuffle.count === 0;
}

function highlightCorrectPosition(block) {
    // Hedef pattern'de bu bloğun gidebileceği ilk boş yeri bul
    const gridCells = document.querySelectorAll('#main-grid .grid-cell');
    const targetPattern = window.gameState.targetPattern;
    const currentPattern = window.gameState.currentPattern;

    // Bloğun şeklini kontrol et ve hedef pattern'de uygun bir yer bul
    for (let row = 0; row < window.gameState.gridSize; row++) {
        for (let col = 0; col < window.gameState.gridSize; col++) {
            // Bu pozisyonda block yerleştirilebilir mi kontrol et
            let canPlaceHere = true;

            for (let i = 0; i < block.shape.length && canPlaceHere; i++) {
                for (let j = 0; j < block.shape[i].length && canPlaceHere; j++) {
                    if (block.shape[i][j] === 1) {
                        const r = row + i;
                        const c = col + j;

                        if (r >= window.gameState.gridSize || c >= window.gameState.gridSize) {
                            canPlaceHere = false;
                        } else if (currentPattern[r][c] > 0) {
                            canPlaceHere = false;
                        } else if (targetPattern[r][c] === 0) {
                            canPlaceHere = false;
                        }
                    }
                }
            }

            if (canPlaceHere) {
                // Bu pozisyonu vurgula
                for (let i = 0; i < block.shape.length; i++) {
                    for (let j = 0; j < block.shape[i].length; j++) {
                        if (block.shape[i][j] === 1) {
                            const r = row + i;
                            const c = col + j;
                            const cellIndex = r * window.gameState.gridSize + c;
                            if (gridCells[cellIndex]) {
                                gridCells[cellIndex].classList.add('hint-glow');
                                setTimeout(() => {
                                    gridCells[cellIndex].classList.remove('hint-glow');
                                }, 3000);
                            }
                        }
                    }
                }
                return; // İlk uygun yeri bulduk, çık
            }
        }
    }
}

function regenerateBlocks() {
    // game.js'deki generateBlocks fonksiyonunu çağır
    if (window.generateBlocks) {
        window.generateBlocks();

        // Kullanılmış blokları temizle
        window.gameState.usedBlocks = [];

        // Blokları yeniden render et
        if (window.renderBlocks) {
            window.renderBlocks();
        }
    }
}

// ===== GÜNLÜK ÖDÜL =====
function checkDailyReward() {
    if (DailyRewardSystem.canClaimToday()) {
        // Splash screen gösterildikten sonra günlük ödülü göster
        setTimeout(() => {
            DailyRewardSystem.showDailyRewardModal();
        }, 1000);
    }
}

// ===== OYUN OLAYLARINA BAĞLAN =====

// Orijinal checkSolution fonksiyonunu override et
if (window.checkSolution) {
    const originalCheckSolution = window.checkSolution;
    window.checkSolution = function() {
        originalCheckSolution.call(this);
    };
}

// Orijinal showResult fonksiyonunu override et
if (window.showResult) {
    const originalShowResult = window.showResult;
    window.showResult = function(correct, time, points) {
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

            // Hız başarımı (30 saniyeden kısa)
            if (time < 30) {
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

        originalShowResult.call(this, correct, time, points);
    };
}

// Touch end'de combo kontrolü - doğru yerleştirme
const originalHandleTouchEnd = window.handleTouchEnd;
if (originalHandleTouchEnd) {
    window.handleTouchEnd = function(e) {
        const touchBlock = window.touchBlock;
        const gameState = window.gameState;

        // Orijinal fonksiyonu çağır
        originalHandleTouchEnd.call(this, e);

        // Eğer blok başarıyla yerleştirildi ise (usedBlocks'a eklendi)
        if (touchBlock && gameState.usedBlocks.includes(touchBlock.id)) {
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
}

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
}

// Başarım kazanıldığında grid'i güncelle
const originalUnlockAchievement = AchievementSystem.unlockAchievement;
AchievementSystem.unlockAchievement = function(achievementId) {
    originalUnlockAchievement.call(this, achievementId);
    populateAchievementsGrid();
};

console.log('✅ Features-integration.js yüklendi');
