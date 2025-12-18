// ===== OYUN ÖZELLİKLERİ SİSTEMİ =====

// ===== YILDIZ SİSTEMİ =====
const StarSystem = {
    // Her seviye için yıldız kriterleri
    getStarCriteria(level) {
        return {
            star1: { condition: 'complete', description: 'Seviyeyi tamamla' },
            star2: { maxMoves: level <= 10 ? 5 : level <= 30 ? 7 : 10, description: 'Az hamle ile tamamla' },
            star3: { maxTime: level <= 10 ? 30 : level <= 30 ? 45 : 60, description: 'Hızlı tamamla' }
        };
    },

    // Seviye bittiğinde yıldız hesapla
    calculateStars(level, moves, timeInSeconds) {
        const criteria = this.getStarCriteria(level);
        let stars = 1; // Her zaman en az 1 yıldız (seviyeyi tamamladı)

        if (moves <= criteria.star2.maxMoves) stars = 2;
        if (moves <= criteria.star2.maxMoves && timeInSeconds <= criteria.star3.maxTime) stars = 3;

        return stars;
    },

    // Seviye yıldızlarını kaydet
    saveLevelStars(level, stars) {
        const saved = JSON.parse(localStorage.getItem('levelStars') || '{}');
        // Sadece daha yüksek yıldız varsa kaydet
        if (!saved[level] || saved[level] < stars) {
            saved[level] = stars;
            localStorage.setItem('levelStars', JSON.stringify(saved));
        }
        return saved[level];
    },

    // Seviye yıldızlarını al
    getLevelStars(level) {
        const saved = JSON.parse(localStorage.getItem('levelStars') || '{}');
        return saved[level] || 0;
    },

    // Toplam yıldız sayısı
    getTotalStars() {
        const saved = JSON.parse(localStorage.getItem('levelStars') || '{}');
        return Object.values(saved).reduce((sum, stars) => sum + stars, 0);
    }
};

// ===== COMBO SİSTEMİ =====
const ComboSystem = {
    currentCombo: 0,
    maxCombo: 0,
    comboMultiplier: 1,

    // Combo artır
    increaseCombo() {
        this.currentCombo++;
        if (this.currentCombo > this.maxCombo) {
            this.maxCombo = this.currentCombo;
        }

        // Combo çarpanı hesapla
        if (this.currentCombo >= 10) this.comboMultiplier = 5;
        else if (this.currentCombo >= 7) this.comboMultiplier = 4;
        else if (this.currentCombo >= 5) this.comboMultiplier = 3;
        else if (this.currentCombo >= 3) this.comboMultiplier = 2;
        else this.comboMultiplier = 1;

        this.showComboEffect();
        return this.comboMultiplier;
    },

    // Combo sıfırla
    resetCombo() {
        this.currentCombo = 0;
        this.comboMultiplier = 1;
    },

    // Combo kırıldı (hata yapıldığında)
    breakCombo() {
        if (this.currentCombo > 0) {
            this.resetCombo();
            // Combo kırıldı bildirimi göster
            const comboDiv = document.getElementById('combo-display') || this.createComboDisplay();
            comboDiv.textContent = '💔 Combo Kırıldı!';
            comboDiv.style.display = 'block';
            comboDiv.style.background = 'linear-gradient(135deg, #FF6B9D, #FF416C)';
            comboDiv.className = 'combo-display combo-animate';

            setTimeout(() => {
                comboDiv.style.display = 'none';
            }, 1500);
        }
    },

    // Combo efekti göster
    showComboEffect() {
        if (this.currentCombo < 2) return;

        const comboDiv = document.getElementById('combo-display') || this.createComboDisplay();
        comboDiv.textContent = `🔥 COMBO x${this.currentCombo}`;
        comboDiv.style.display = 'block';
        comboDiv.className = 'combo-display combo-animate';

        // Combo seviyesine göre renk
        if (this.currentCombo >= 10) comboDiv.style.background = 'linear-gradient(135deg, #FF6B9D, #FEC163)';
        else if (this.currentCombo >= 5) comboDiv.style.background = 'linear-gradient(135deg, #43E97B, #38F9D7)';
        else comboDiv.style.background = 'linear-gradient(135deg, #4FACFE, #00F2FE)';

        // Ses çal
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.success();
        }

        setTimeout(() => comboDiv.classList.remove('combo-animate'), 500);
    },

    createComboDisplay() {
        const div = document.createElement('div');
        div.id = 'combo-display';
        div.className = 'combo-display';
        document.body.appendChild(div);
        return div;
    },

    getComboBonus() {
        return this.currentCombo * 10; // Her combo için +10 puan
    }
};

// ===== POWER-UP SİSTEMİ =====
const PowerUpSystem = {
    powerUps: {
        hint: { count: 3, cost: 0, icon: '💡', name: 'İpucu' },
        extraTime: { count: 2, cost: 0, icon: '⏱️', name: 'Ekstra Süre' },
        shuffle: { count: 2, cost: 0, icon: '🔄', name: 'Karıştır' }
    },

    // LocalStorage'dan yükle
    load() {
        const saved = localStorage.getItem('powerUps');
        if (saved) {
            this.powerUps = JSON.parse(saved);
        }
    },

    // LocalStorage'a kaydet
    save() {
        localStorage.setItem('powerUps', JSON.stringify(this.powerUps));
    },

    // Power-up kullan
    use(type) {
        if (this.powerUps[type] && this.powerUps[type].count > 0) {
            this.powerUps[type].count--;
            this.save();
            return true;
        }
        return false;
    },

    // Power-up kullan (alternatif isim)
    usePowerUp(type) {
        return this.use(type);
    },

    // Power-up kaydet (alternatif isim)
    savePowerUps() {
        this.save();
    },

    // Power-up ekle
    add(type, amount = 1) {
        if (this.powerUps[type]) {
            this.powerUps[type].count += amount;
            this.save();
        }
    },

    // Hint kullan - bir bloğun doğru yerini göster
    useHint() {
        if (!this.use('hint')) {
            alert('💡 İpucu kalmadı!');
            return false;
        }

        // İlk kullanılmamış bloğu bul ve yerini göster
        if (typeof gameState !== 'undefined' && gameState.blocks) {
            const unusedBlock = gameState.blocks.find(b => !gameState.usedBlocks.includes(b.id));
            if (unusedBlock) {
                // Bloğun yerleştirilebileceği ilk konumu bul
                for (let row = 0; row < gameState.gridSize; row++) {
                    for (let col = 0; col < gameState.gridSize; col++) {
                        if (canPlaceShape && canPlaceShape(gameState.currentPattern, unusedBlock.shape, row, col)) {
                            // Bu konumu parlat
                            this.highlightHintPosition(row, col, unusedBlock.shape);
                            if (typeof SoundEffects !== 'undefined') SoundEffects.success();
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    highlightHintPosition(row, col, shape) {
        const grid = document.getElementById('main-grid');
        if (!grid) return;

        const cells = grid.querySelectorAll('.grid-cell');

        // Hint pozisyonunu göster
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    const targetRow = row + i;
                    const targetCol = col + j;
                    const cellIndex = targetRow * gameState.gridSize + targetCol;
                    const cell = cells[cellIndex];
                    if (cell) {
                        cell.classList.add('hint-glow');
                        setTimeout(() => cell.classList.remove('hint-glow'), 3000);
                    }
                }
            }
        }
    },

    // Ekstra süre ekle
    useExtraTime() {
        if (!this.use('extraTime')) {
            alert('⏱️ Ekstra süre kalmadı!');
            return false;
        }

        // Memorize timer'a +5 saniye ekle
        if (typeof gameState !== 'undefined' && gameState.phase === 'memorize') {
            const timerDisplay = document.getElementById('memorize-timer');
            if (timerDisplay) {
                let currentTime = parseInt(timerDisplay.textContent) || 0;
                currentTime += 5;
                timerDisplay.textContent = currentTime;
                if (typeof SoundEffects !== 'undefined') SoundEffects.success();
                return true;
            }
        }
        return false;
    },

    // Blokları karıştır
    useShuffle() {
        if (!this.use('shuffle')) {
            alert('🔄 Karıştırma kalmadı!');
            return false;
        }

        // Blokları yeniden oluştur
        if (typeof generateBlocks !== 'undefined') {
            generateBlocks();
            if (typeof renderBlocks !== 'undefined') renderBlocks();
            if (typeof SoundEffects !== 'undefined') SoundEffects.click();
            return true;
        }
        return false;
    }
};

// ===== BAŞARIM SİSTEMİ =====
const AchievementSystem = {
    achievements: {
        firstWin: {
            id: 'firstWin',
            name: 'İlk Zafer',
            description: 'İlk seviyeni tamamla',
            icon: '🏆',
            unlocked: false
        },
        level10: {
            id: 'level10',
            name: 'Acemi Usta',
            description: '10. seviyeye ulaş',
            icon: '⭐',
            unlocked: false
        },
        level25: {
            id: 'level25',
            name: 'Profesyonel',
            description: '25. seviyeye ulaş',
            icon: '💎',
            unlocked: false
        },
        perfectGame: {
            id: 'perfectGame',
            name: 'Kusursuz',
            description: 'Bir seviyeyi 3 yıldızla bitir',
            icon: '✨',
            unlocked: false
        },
        comboMaster: {
            id: 'comboMaster',
            name: 'Combo Ustası',
            description: '10x combo yap',
            icon: '🔥',
            unlocked: false
        },
        speedRunner: {
            id: 'speedRunner',
            name: 'Hız Canavarı',
            description: 'Bir seviyeyi 15 saniyede bitir',
            icon: '⚡',
            unlocked: false
        },
        score10k: {
            id: 'score10k',
            name: 'Puan Avcısı',
            description: '10.000 puan topla',
            icon: '💰',
            unlocked: false
        },
        starCollector: {
            id: 'starCollector',
            name: 'Yıldız Toplayıcı',
            description: '50 yıldız topla',
            icon: '🌟',
            unlocked: false
        }
    },

    // LocalStorage'dan yükle
    load() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const savedData = JSON.parse(saved);
            Object.keys(savedData).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = savedData[key].unlocked;
                }
            });
        }
    },

    // LocalStorage'a kaydet
    save() {
        const toSave = {};
        Object.keys(this.achievements).forEach(key => {
            toSave[key] = { unlocked: this.achievements[key].unlocked };
        });
        localStorage.setItem('achievements', JSON.stringify(toSave));
    },

    // Başarım kilidi aç
    unlock(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.save();
            this.showUnlockNotification(achievement);
            return true;
        }
        return false;
    },

    // Başarım kilit açma bildirimi
    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">Başarım Kazanıldı!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Ses çal
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.levelComplete();
        }
        if (typeof Vibrate !== 'undefined') {
            Vibrate.long();
        }

        // 4 saniye sonra kaldır
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },

    // Kontroller
    checkAchievements() {
        if (typeof gameState === 'undefined') return;

        // İlk zafer
        if (gameState.currentLevel >= 1 && gameState.levelsCompleted >= 1) {
            this.unlock('firstWin');
        }

        // Seviye başarımları
        if (gameState.currentLevel >= 10) this.unlock('level10');
        if (gameState.currentLevel >= 25) this.unlock('level25');

        // Puan başarımı
        if (gameState.score >= 10000) this.unlock('score10k');

        // Combo başarımı
        if (typeof ComboSystem !== 'undefined' && ComboSystem.maxCombo >= 10) {
            this.unlock('comboMaster');
        }

        // Yıldız başarımı
        if (typeof StarSystem !== 'undefined' && StarSystem.getTotalStars() >= 50) {
            this.unlock('starCollector');
        }
    },

    // Tüm başarımları göster
    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    },

    getTotalCount() {
        return Object.keys(this.achievements).length;
    },

    // Init fonksiyonu
    init() {
        this.load();
        console.log('🏆 Başarım sistemi başlatıldı');
    },

    // Başarım kilidi aç (alternatif isim)
    unlockAchievement(achievementId) {
        return this.unlock(achievementId);
    },

    // Seviye tamamlama kontrolü
    checkLevelComplete(level) {
        if (level >= 1) this.unlock('firstWin');
        if (level >= 10) this.unlock('level10');
        if (level >= 25) this.unlock('level25');
    },

    // Skor kontrolü
    checkScore(score) {
        if (score >= 10000) this.unlock('score10k');
    },

    // Mükemmel oyun kontrolü
    checkPerfectGame() {
        this.unlock('perfectGame');
    },

    // Combo kontrolü
    checkCombo(combo) {
        if (combo >= 10) this.unlock('comboMaster');
    },

    // Hız kontrolü
    checkSpeedRun() {
        this.unlock('speedRunner');
    },

    // Yıldız toplayıcı kontrolü
    checkStarCollector() {
        this.unlock('starCollector');
    }
};

// ===== GÜNLÜK HEDİYE SİSTEMİ =====
const DailyRewardSystem = {
    // Son hediye alınma zamanı
    getLastClaimDate() {
        return localStorage.getItem('lastDailyReward') || null;
    },

    // Bugün hediye alındı mı?
    canClaimToday() {
        const lastClaim = this.getLastClaimDate();
        if (!lastClaim) return true;

        const today = new Date().toDateString();
        const lastClaimDate = new Date(lastClaim).toDateString();
        return today !== lastClaimDate;
    },

    // Streak sayısı (ardışık gün)
    getStreak() {
        return parseInt(localStorage.getItem('dailyStreak') || '0');
    },

    setStreak(streak) {
        localStorage.setItem('dailyStreak', streak.toString());
    },

    // Günlük hediye al
    claimDaily() {
        if (!this.canClaimToday()) {
            return { success: false, message: 'Bugün zaten hediye aldınız!' };
        }

        const streak = this.getStreak();
        const newStreak = streak + 1;
        this.setStreak(newStreak);

        // Hediye ver
        const reward = this.getRewardForDay(newStreak);
        if (typeof PowerUpSystem !== 'undefined') {
            Object.keys(reward).forEach(key => {
                PowerUpSystem.add(key, reward[key]);
            });
        }

        // Son alım tarihini kaydet
        localStorage.setItem('lastDailyReward', new Date().toISOString());

        return {
            success: true,
            streak: newStreak,
            reward: reward,
            message: `${newStreak} gün üst üste! ${this.formatReward(reward)}`
        };
    },

    // Güne göre ödül
    getRewardForDay(day) {
        const dayMod = ((day - 1) % 7) + 1; // 1-7 arası döngü

        const rewards = {
            1: { hint: 1 },
            2: { extraTime: 1 },
            3: { shuffle: 1 },
            4: { hint: 2 },
            5: { extraTime: 1, shuffle: 1 },
            6: { hint: 3 },
            7: { hint: 3, extraTime: 2, shuffle: 2 } // 7. gün özel!
        };

        return rewards[dayMod];
    },

    formatReward(reward) {
        const parts = [];
        if (reward.hint) parts.push(`${reward.hint}x 💡 İpucu`);
        if (reward.extraTime) parts.push(`${reward.extraTime}x ⏱️ Ekstra Süre`);
        if (reward.shuffle) parts.push(`${reward.shuffle}x 🔄 Karıştır`);
        return parts.join(', ');
    },

    // Günlük ödül modalını göster
    showDailyRewardModal() {
        if (!this.canClaimToday()) return;

        const streak = this.getStreak() + 1;
        const reward = this.getRewardForDay(streak);

        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'daily-reward-modal';
        modal.innerHTML = `
            <div class="daily-reward-content">
                <div class="daily-reward-icon">🎁</div>
                <h2 class="daily-reward-title">Günlük Hediye!</h2>
                <p class="daily-reward-streak">🔥 ${streak} Gün Üst Üste!</p>
                <div class="daily-reward-items">
                    ${this.formatReward(reward).split(', ').map(r => `<div class="reward-item">${r}</div>`).join('')}
                </div>
                <button class="daily-reward-btn" id="claim-reward-btn">Ödülü Al!</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Butona tıklanınca
        const claimBtn = modal.querySelector('#claim-reward-btn');
        claimBtn.addEventListener('click', () => {
            const result = this.claimDaily();
            if (result.success) {
                modal.remove();
                // Power-up sayılarını güncelle
                if (typeof updatePowerUpCounts === 'function') {
                    updatePowerUpCounts();
                }
            }
        });
    }
};

// ===== BAŞLATMA =====
window.addEventListener('DOMContentLoaded', function() {
    // Sistemleri yükle
    PowerUpSystem.load();
    AchievementSystem.load();

    console.log('✨ Özellik sistemleri yüklendi!');
    console.log('⭐ Toplam Yıldız:', StarSystem.getTotalStars());
    console.log('🏆 Açılan Başarımlar:', AchievementSystem.getUnlockedCount(), '/', AchievementSystem.getTotalCount());
    console.log('🎁 Günlük Hediye:', DailyRewardSystem.canClaimToday() ? 'Alınabilir!' : 'Bugün alındı');
    console.log('🔥 Combo Sistemi Hazır');
});
