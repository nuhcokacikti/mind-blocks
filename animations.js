// ===== Oyun Animasyonları =====

// Oyun başlangıcında bloklar aşağıdan yukarı çıkıp tekrar iner (seviyedeki blok renkleri)
function animateGameStart() {
    const mainGrid = document.getElementById('main-grid');
    if (!mainGrid) return;

    const cells = mainGrid.querySelectorAll('.grid-cell');
    const gridSize = window.gameState ? window.gameState.gridSize : 4;

    // Seviyedeki blokların renklerini al
    let blockColors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'cyan'];
    if (window.gameState && window.gameState.blocks && window.gameState.blocks.length > 0) {
        blockColors = window.gameState.blocks.map(block => block.color);
    }

    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const reverseRow = gridSize - 1 - row; // Aşağıdan yukarı
        const delay = reverseRow * 80; // Her satır 80ms gecikmeli

        // Blok renklerinden birini seç
        const color = blockColors[index % blockColors.length];

        setTimeout(() => {
            // Yukarı çıkma animasyonu - oyun bloklarıyla aynı renkler
            cell.classList.add('animate-bounce-up', 'filled', `color-${color}`);

            // 600ms sonra aşağı inme ve yok olma
            setTimeout(() => {
                cell.classList.add('animate-bounce-down');

                // 400ms sonra temizle
                setTimeout(() => {
                    cell.classList.remove('animate-bounce-up', 'animate-bounce-down', 'filled', `color-${color}`);
                }, 400);
            }, 600);
        }, delay);
    });
}

// Seviye geçişinde patlama animasyonu
function animateLevelComplete(callback) {
    const mainGrid = document.getElementById('main-grid');
    if (!mainGrid) {
        if (callback) callback();
        return;
    }
    
    const cells = mainGrid.querySelectorAll('.grid-cell.filled');
    
    if (cells.length === 0) {
        if (callback) callback();
        return;
    }
    
    // Her hücreyi rastgele sırayla patlat
    const cellsArray = Array.from(cells);
    cellsArray.sort(() => Math.random() - 0.5);
    
    cellsArray.forEach((cell, index) => {
        setTimeout(() => {
            // Patlama animasyonu
            cell.classList.add('explode');
            
            // Parçacık efekti oluştur
            createExplosionParticles(cell);
            
            // Son hücrede callback çağır
            if (index === cellsArray.length - 1) {
                setTimeout(() => {
                    if (callback) callback();
                }, 600);
            }
        }, index * 50);
    });
}

// Patlama parçacıkları oluştur
function createExplosionParticles(cell) {
    const mainGrid = document.getElementById('main-grid');
    if (!mainGrid) return;
    
    const rect = cell.getBoundingClientRect();
    const gridRect = mainGrid.getBoundingClientRect();
    const particleCount = 8;
    
    // Hücrenin rengini al
    const computedStyle = window.getComputedStyle(cell);
    const bgColor = computedStyle.background || computedStyle.backgroundColor;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        // Rengi ayarla
        if (bgColor.includes('gradient')) {
            // Gradient varsa ilk rengi kullan
            const colors = ['#FF6B9D', '#4FACFE', '#43E97B', '#FFD93D', '#A8EDEA', '#FD79A8', '#FF9A56', '#00D2FF'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        } else {
            particle.style.background = bgColor;
        }
        
        // Pozisyonu ayarla (grid'e göre)
        const cellX = rect.left - gridRect.left + rect.width / 2;
        const cellY = rect.top - gridRect.top + rect.height / 2;
        particle.style.left = cellX + 'px';
        particle.style.top = cellY + 'px';
        
        // Rastgele yön
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        mainGrid.appendChild(particle);
        
        // Animasyon bitince kaldır
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Oyun kaybında aşağıdan yukarı doldur
function animateGameOver(callback) {
    const mainGrid = document.getElementById('main-grid');
    if (!mainGrid) {
        if (callback) callback();
        return;
    }
    
    const cells = mainGrid.querySelectorAll('.grid-cell');
    const gridSize = window.gameState ? window.gameState.gridSize : 4;
    
    // Animasyonları temizle
    cells.forEach(cell => {
        cell.classList.remove('animate-fill', 'explode', 'filled', 'target');
        cell.className = 'grid-cell';
    });
    
    // Aşağıdan yukarıya doldur
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const reverseRow = gridSize - 1 - row;
        const delay = reverseRow * 50; // Aşağıdan yukarı
        
        setTimeout(() => {
            cell.classList.add('animate-fail');
        }, delay);
    });
    
    // Tüm animasyon bitince callback
    const totalDelay = gridSize * 50 + 400;
    setTimeout(() => {
        if (callback) callback();
    }, totalDelay);
}

// Grid animasyonlarını temizle
function clearGridAnimations() {
    const mainGrid = document.getElementById('main-grid');
    if (!mainGrid) return;
    
    const cells = mainGrid.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('animate-fill', 'explode', 'animate-fail');
    });
}

// Export fonksiyonlar
window.animateGameStart = animateGameStart;
window.animateLevelComplete = animateLevelComplete;
window.animateGameOver = animateGameOver;
window.clearGridAnimations = clearGridAnimations;

console.log('🎬 Animasyon sistemi yüklendi!');
