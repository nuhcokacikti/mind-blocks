// ===== Giriş Ekranı ve Öğretici Fonksiyonları =====

// Öğretici durumu
const tutorialState = {
    currentStep: 1,
    totalSteps: 3
};

// ===== Mobil Scroll Engelleme =====
// Body scroll'unu tamamen engelle (mobil için)
function preventBodyScroll() {
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Touchmove eventini engelle (body üzerinde)
    document.body.addEventListener('touchmove', function(e) {
        // Eğer scroll edilebilir bir element değilse engelle
        const target = e.target;
        const scrollableParent = target.closest('.container, #settings-screen, #tutorial-screen, main');
        if (!scrollableParent) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Mobil scroll'u engelle
    preventBodyScroll();
    // Giriş ekranı elementleri
    const splashScreen = document.getElementById('splash-screen');
    const tutorialScreen = document.getElementById('tutorial-screen');
    const splashStartBtn = document.getElementById('splash-start-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    const startFromTutorialBtn = document.getElementById('start-from-tutorial-btn');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const bestScoreDisplay = document.getElementById('best-score');
    
    // En yüksek skoru yükle
    const savedBestScore = localStorage.getItem('blockPuzzleBestScore') || 0;
    if (bestScoreDisplay) {
        bestScoreDisplay.textContent = savedBestScore;
    }
    
    // Giriş ekranından oyuna başla
    if (splashStartBtn) {
        splashStartBtn.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            
            splashScreen.classList.remove('active');

            // Container'ı göster ve scroll'u düzelt
            const container = document.querySelector('.container');
            if (container) {
                container.style.display = 'flex';
                container.style.position = 'fixed';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.flexDirection = 'column';
            }

            // Body'nin scroll'unu tamamen kapat
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Tüm ekranları gizle
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Game screen'i göster
            const gameScreen = document.getElementById('game-screen');
            if (gameScreen) {
                gameScreen.classList.add('active');
            }
            
            // game.js'deki startGame fonksiyonunu çağır
            // Bu fonksiyon tüm oyun durumunu sıfırlar ve oyunu başlatır
            setTimeout(() => {
                if (typeof startGame === 'function') {
                    startGame();
                }
            }, 100);
        });
    }
    
    // Öğreticiyi aç
    if (tutorialBtn) {
        tutorialBtn.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            splashScreen.classList.remove('active');
            tutorialScreen.classList.add('active');
            showTutorialStep(1);
        });
    }
    
    // Öğreticiyi kapat
    if (closeTutorialBtn) {
        closeTutorialBtn.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            tutorialScreen.classList.remove('active');
            splashScreen.classList.add('active');
        });
    }
    
    // Öğreticiden oyuna başla
    if (startFromTutorialBtn) {
        startFromTutorialBtn.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            tutorialScreen.classList.remove('active');
            if (typeof showScreen === 'function') {
                showScreen('start');
            }
        });
    }
    
    // Önceki adım
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            if (tutorialState.currentStep > 1) {
                tutorialState.currentStep--;
                showTutorialStep(tutorialState.currentStep);
            }
        });
    }
    
    // Sonraki adım
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(err) {}

            if (tutorialState.currentStep < tutorialState.totalSteps) {
                tutorialState.currentStep++;
                showTutorialStep(tutorialState.currentStep);
            } else {
                // Son adımda, splash ekranına dön
                const tutScreen = document.getElementById('tutorial-screen');
                const splScreen = document.getElementById('splash-screen');
                if (tutScreen) tutScreen.classList.remove('active');
                if (splScreen) splScreen.classList.add('active');
                tutorialState.currentStep = 1;
            }
        });
    }
    
    // Adım göstergelerine tıklama
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach(dot => {
        dot.addEventListener('click', function() {
            try {
                if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
            } catch(e) {}
            const step = parseInt(this.dataset.step);
            tutorialState.currentStep = step;
            showTutorialStep(step);
        });
    });
    
    // Demo animasyonları başlat
    startDemoAnimations();
});

// Öğretici adımını göster
function showTutorialStep(step) {
    const steps = document.querySelectorAll('.tutorial-step');
    const dots = document.querySelectorAll('.step-dot');
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    
    // Tüm adımları gizle
    steps.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // Seçili adımı göster
    const currentStep = document.querySelector(`.tutorial-step[data-step="${step}"]`);
    const currentDot = document.querySelector(`.step-dot[data-step="${step}"]`);
    
    if (currentStep) currentStep.classList.add('active');
    if (currentDot) currentDot.classList.add('active');
    
    // Buton durumlarını güncelle
    if (prevBtn) {
        prevBtn.disabled = step === 1;
    }
    
    if (nextBtn) {
        if (step === tutorialState.totalSteps) {
            nextBtn.textContent = 'Tamamla ✓';
        } else {
            nextBtn.textContent = 'Sonraki ▶️';
        }
    }
}

// Demo animasyonlarını başlat
function startDemoAnimations() {
    // Adım 1: Blokların animasyonu
    setInterval(() => {
        const demoCells = document.querySelectorAll('.tutorial-step[data-step="1"] .demo-cell.filled');
        demoCells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.animation = 'none';
                setTimeout(() => {
                    cell.style.animation = 'cellPop 0.6s ease-out';
                }, 10);
            }, index * 200);
        });
    }, 3000);
    
    // Adım 1: Timer animasyonu
    let timerValue = 5;
    setInterval(() => {
        const demoTimer = document.querySelector('.tutorial-step[data-step="1"] .demo-timer');
        if (demoTimer) {
            timerValue--;
            if (timerValue < 0) timerValue = 5;
            demoTimer.textContent = `⏱️ ${timerValue}`;
        }
    }, 1000);
    
    // Adım 2: Highlight animasyonu
    setInterval(() => {
        const highlights = document.querySelectorAll('.tutorial-step[data-step="2"] .demo-cell.highlight');
        highlights.forEach(cell => {
            cell.style.animation = 'none';
            setTimeout(() => {
                cell.style.animation = 'cellGlow 1.5s ease-in-out infinite';
            }, 10);
        });
    }, 3000);
}

// En yüksek skoru kaydet
function saveBestScore(score) {
    const currentBest = parseInt(localStorage.getItem('blockPuzzleBestScore') || 0);
    if (score > currentBest) {
        localStorage.setItem('blockPuzzleBestScore', score);
        const bestScoreDisplay = document.getElementById('best-score');
        if (bestScoreDisplay) {
            bestScoreDisplay.textContent = score;
        }
    }
}

// Oyun bittiğinde en yüksek skoru güncelle
if (typeof showResult !== 'undefined') {
    const originalShowResult = showResult;
    showResult = function(correct, time, points) {
        originalShowResult(correct, time, points);
        if (typeof gameState !== 'undefined' && gameState.score) {
            saveBestScore(gameState.score);
        }
    };
}

// Ana sayfaya dön (splash ekranına)
if (typeof goToHome !== 'undefined') {
    const originalGoToHome = goToHome;
    goToHome = function() {
        try {
            if (typeof sounds !== 'undefined' && sounds.click) sounds.click();
        } catch(e) {}

        if (typeof gameState !== 'undefined') {
            if (gameState.memorizeTimer) clearInterval(gameState.memorizeTimer);
            if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        }

        // Container'ı gizle
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'none';
        }

        // Tüm ekranları gizle
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Splash ekranını göster
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.classList.add('active');
        }
    };
}

console.log('🎮 Block Puzzle - Giriş ekranı ve öğretici yüklendi!');
