// ===== Oyun Durumu =====
const gameState = window.gameState = {
    currentLevel: 1,
    score: 0,
    moves: 0,
    gridSize: 4,
    targetPattern: [],
    currentPattern: [],
    blocks: [],
    usedBlocks: [],
    moveHistory: [], // Geri alma için
    startTime: null,
    timerInterval: null,
    memorizeTimer: null,
    phase: 'start', // start, memorize, play, result
    hintsAvailable: 0, // Kullanılabilir ipucu sayısı
    adsWatched: 0, // İzlenen reklam sayısı
    levelsCompleted: 0 // Tamamlanan seviye sayısı
};

// ===== Blok Şekilleri (Tetris benzeri) =====
const blockShapes = {
    single: { shape: [[1]], color: 'red' },
    horizontal2: { shape: [[1, 1]], color: 'blue' },
    vertical2: { shape: [[1], [1]], color: 'green' },
    square: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    lShape: { shape: [[1, 0], [1, 0], [1, 1]], color: 'purple' },
    tShape: { shape: [[1, 1, 1], [0, 1, 0]], color: 'pink' },
    zShape: { shape: [[1, 1, 0], [0, 1, 1]], color: 'orange' },
    horizontal3: { shape: [[1, 1, 1]], color: 'cyan' }
};

// ===== Seviye Konfigürasyonu (İlk 30 Seviye 4x4, Sonra Yavaş Yavaş Zorlaşır) =====
const levelConfig = [
    // Seviye 1-10: 4x4 Grid - Çok Kolay
    { level: 1, gridSize: 4, blockCount: 2, memorizeTime: 8, difficulty: 'easy' },
    { level: 2, gridSize: 4, blockCount: 2, memorizeTime: 7, difficulty: 'easy' },
    { level: 3, gridSize: 4, blockCount: 3, memorizeTime: 7, difficulty: 'easy' },
    { level: 4, gridSize: 4, blockCount: 3, memorizeTime: 7, difficulty: 'easy' },
    { level: 5, gridSize: 4, blockCount: 3, memorizeTime: 6, difficulty: 'easy' },
    { level: 6, gridSize: 4, blockCount: 3, memorizeTime: 6, difficulty: 'easy' },
    { level: 7, gridSize: 4, blockCount: 3, memorizeTime: 6, difficulty: 'easy' },
    { level: 8, gridSize: 4, blockCount: 3, memorizeTime: 6, difficulty: 'easy' },
    { level: 9, gridSize: 4, blockCount: 3, memorizeTime: 5, difficulty: 'easy' },
    { level: 10, gridSize: 4, blockCount: 3, memorizeTime: 5, difficulty: 'easy' },
    
    // Seviye 11-20: 4x4 Grid - Kolay
    { level: 11, gridSize: 4, blockCount: 3, memorizeTime: 5, difficulty: 'easy' },
    { level: 12, gridSize: 4, blockCount: 3, memorizeTime: 5, difficulty: 'easy' },
    { level: 13, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 14, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 15, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 16, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 17, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 18, gridSize: 4, blockCount: 4, memorizeTime: 5, difficulty: 'easy' },
    { level: 19, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'easy' },
    { level: 20, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'easy' },
    
    // Seviye 21-30: 4x4 Grid - Orta Zorluk
    { level: 21, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 22, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 23, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 24, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 25, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 26, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 27, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 28, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 29, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    { level: 30, gridSize: 4, blockCount: 4, memorizeTime: 4, difficulty: 'medium' },
    
    // Seviye 31-40: 5x5 Grid - Orta Zorluk
    { level: 31, gridSize: 5, blockCount: 4, memorizeTime: 5, difficulty: 'medium' },
    { level: 32, gridSize: 5, blockCount: 4, memorizeTime: 5, difficulty: 'medium' },
    { level: 33, gridSize: 5, blockCount: 4, memorizeTime: 5, difficulty: 'medium' },
    { level: 34, gridSize: 5, blockCount: 5, memorizeTime: 5, difficulty: 'medium' },
    { level: 35, gridSize: 5, blockCount: 5, memorizeTime: 5, difficulty: 'medium' },
    { level: 36, gridSize: 5, blockCount: 5, memorizeTime: 4, difficulty: 'medium' },
    { level: 37, gridSize: 5, blockCount: 5, memorizeTime: 4, difficulty: 'medium' },
    { level: 38, gridSize: 5, blockCount: 5, memorizeTime: 4, difficulty: 'medium' },
    { level: 39, gridSize: 5, blockCount: 5, memorizeTime: 4, difficulty: 'medium' },
    { level: 40, gridSize: 5, blockCount: 5, memorizeTime: 4, difficulty: 'medium' },
    
    // Seviye 41-50: 6x6 Grid - Zor
    { level: 41, gridSize: 6, blockCount: 5, memorizeTime: 5, difficulty: 'hard' },
    { level: 42, gridSize: 6, blockCount: 5, memorizeTime: 5, difficulty: 'hard' },
    { level: 43, gridSize: 6, blockCount: 5, memorizeTime: 4, difficulty: 'hard' },
    { level: 44, gridSize: 6, blockCount: 5, memorizeTime: 4, difficulty: 'hard' },
    { level: 45, gridSize: 6, blockCount: 6, memorizeTime: 4, difficulty: 'hard' },
    { level: 46, gridSize: 6, blockCount: 6, memorizeTime: 4, difficulty: 'hard' },
    { level: 47, gridSize: 6, blockCount: 6, memorizeTime: 4, difficulty: 'hard' },
    { level: 48, gridSize: 6, blockCount: 6, memorizeTime: 3, difficulty: 'hard' },
    { level: 49, gridSize: 6, blockCount: 6, memorizeTime: 3, difficulty: 'hard' },
    { level: 50, gridSize: 6, blockCount: 6, memorizeTime: 3, difficulty: 'hard' },
    
    // Seviye 51+: 7x7 ve 8x8 Grid - Çok Zor
    { level: 51, gridSize: 7, blockCount: 6, memorizeTime: 4, difficulty: 'expert' },
    { level: 52, gridSize: 7, blockCount: 6, memorizeTime: 4, difficulty: 'expert' },
    { level: 53, gridSize: 7, blockCount: 6, memorizeTime: 3, difficulty: 'expert' },
    { level: 54, gridSize: 7, blockCount: 7, memorizeTime: 3, difficulty: 'expert' },
    { level: 55, gridSize: 7, blockCount: 7, memorizeTime: 3, difficulty: 'expert' },
    { level: 56, gridSize: 8, blockCount: 7, memorizeTime: 3, difficulty: 'expert' },
    { level: 57, gridSize: 8, blockCount: 7, memorizeTime: 3, difficulty: 'expert' },
    { level: 58, gridSize: 8, blockCount: 7, memorizeTime: 2, difficulty: 'expert' },
    { level: 59, gridSize: 8, blockCount: 8, memorizeTime: 2, difficulty: 'expert' },
    { level: 60, gridSize: 8, blockCount: 8, memorizeTime: 2, difficulty: 'expert' }
];

// ===== Modern Ses Efektleri =====
const sounds = { place: null, success: null, fail: null, click: null, hint: null, unlock: null };

function initSounds() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Modern blok yerleştirme sesi (synth pop)
    sounds.place = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.05);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.15);
    };
    
    // Modern başarı sesi (elektronik fanfare)
    sounds.success = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const notes = [
            { freq: 523.25, time: 0, duration: 0.15 },
            { freq: 659.25, time: 0.08, duration: 0.15 },
            { freq: 783.99, time: 0.16, duration: 0.15 },
            { freq: 1046.50, time: 0.24, duration: 0.3 }
        ];
        
        notes.forEach(note => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.type = 'triangle';
            osc.frequency.value = note.freq;
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, audioContext.currentTime + note.time);
            filter.Q.value = 5;
            
            const startTime = audioContext.currentTime + note.time;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
            
            osc.start(startTime);
            osc.stop(startTime + note.duration);
        });
    };
    
    // Modern başarısızlık sesi (glitch effect)
    sounds.fail = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        
        osc1.frequency.setValueAtTime(300, audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
        
        osc2.frequency.setValueAtTime(297, audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(99, audioContext.currentTime + 0.4);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        osc1.start(audioContext.currentTime);
        osc2.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.4);
        osc2.stop(audioContext.currentTime + 0.4);
    };
    
    // Modern tıklama sesi (UI beep)
    sounds.click = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.value = 1200;
        
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.04);
    };
    
    // Modern ipucu sesi (notification)
    sounds.hint = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
        
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 10;
        
        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.25);
    };
    
    // İpucu kilidi açma sesi
    sounds.unlock = () => {
        if (window.GameSettings && !window.GameSettings.sound) return;
        const notes = [659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const startTime = audioContext.currentTime + (i * 0.06);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    };
}

// ===== DOM Elementleri =====
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),
    startBtn: document.getElementById('start-btn'),
    checkBtn: document.getElementById('check-btn'),
    undoBtn: document.getElementById('undo-btn'),
    skipTimerBtn: document.getElementById('skip-timer-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    hintBtn: document.getElementById('hint-btn'),
    mainGrid: document.getElementById('main-grid'),
    gridTitle: document.getElementById('grid-title'),
    blocksContainer: document.getElementById('blocks-container'),
    timer: document.getElementById('timer'),
    memorizeTimer: document.getElementById('memorize-timer'),
    levelDisplay: document.getElementById('level'),
    scoreDisplay: document.getElementById('score'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    finalScore: document.getElementById('final-score'),
    finalTime: document.getElementById('final-time'),
    finalMoves: document.getElementById('final-moves')
};

// Element kontrolü - Opsiyonel elementler için uyarı verme
console.log('🔍 Element Kontrolü:');
const optionalElements = ['hintBtn']; // Opsiyonel elementler
Object.keys(elements).forEach(key => {
    if (!elements[key]) {
        if (!optionalElements.includes(key)) {
            console.error(`❌ Element bulunamadı: ${key}`);
        }
        // Opsiyonel elementler için sessizce atla
    } else {
        console.log(`✅ ${key}: OK`);
    }
});

function init() {
    attachEventListeners();
    updateDisplay();
    initSounds();
}

function attachEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.checkBtn.addEventListener('click', checkSolution);
    elements.undoBtn.addEventListener('click', undoLastMove);
    elements.skipTimerBtn.addEventListener('click', skipMemorizeTimer);
    elements.nextLevelBtn.addEventListener('click', nextLevel);
    elements.playAgainBtn.addEventListener('click', restartGame);
    if (elements.hintBtn) {
        elements.hintBtn.addEventListener('click', showHint);
    }
    
    // Ana sayfa butonu
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', goToHome);
    }
}

// Ana sayfaya git
function goToHome() {
    if (sounds.click) sounds.click();
    clearInterval(gameState.memorizeTimer);
    clearInterval(gameState.timerInterval);
    showScreen('start');
}

function startGame() {
    if (sounds.click) sounds.click();
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.moves = 0;
    gameState.hintsAvailable = 0;
    gameState.adsWatched = 0;
    gameState.levelsCompleted = 0;
    loadLevel(1);
    showScreen('game');
    startMemorizePhase();
    updateHintButton();
}

function loadLevel(level) {
    const config = levelConfig[Math.min(level - 1, levelConfig.length - 1)];
    gameState.currentLevel = level;
    gameState.gridSize = config.gridSize;
    gameState.moves = 0;
    gameState.usedBlocks = [];
    createGrid(elements.mainGrid, config.gridSize);
    generateTargetPattern(config.blockCount, config.difficulty);
    generateBlocks(config.blockCount);
    gameState.currentPattern = Array(config.gridSize).fill(null).map(() => Array(config.gridSize).fill(0));
    updateDisplay();

    // Her 5 seviyede bir motivasyon mesajı göster
    if (level > 1 && typeof window.showMotivation === 'function') {
        window.showMotivation(level);
    }
}

function createGrid(container, size) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = Math.floor(i / size);
        cell.dataset.col = i % size;
        container.appendChild(cell);
    }
}

function generateTargetPattern(blockCount, difficulty) {
    const size = gameState.gridSize;
    gameState.targetPattern = Array(size).fill(null).map(() => Array(size).fill(0));
    const availableShapes = Object.keys(blockShapes);
    const selectedShapes = [];
    
    for (let i = 0; i < blockCount; i++) {
        let shapeKey;
        if (difficulty === 'easy') {
            shapeKey = ['single', 'horizontal2', 'vertical2'][Math.floor(Math.random() * 3)];
        } else if (difficulty === 'medium') {
            shapeKey = availableShapes[Math.floor(Math.random() * Math.min(5, availableShapes.length))];
        } else {
            shapeKey = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        }
        selectedShapes.push(shapeKey);
    }
    
    gameState.selectedShapes = selectedShapes;
    
    selectedShapes.forEach((shapeKey, index) => {
        const shape = blockShapes[shapeKey].shape;
        let placed = false, attempts = 0;
        while (!placed && attempts < 100) {
            const row = Math.floor(Math.random() * (size - shape.length + 1));
            const col = Math.floor(Math.random() * (size - shape[0].length + 1));
            if (canPlaceShape(gameState.targetPattern, shape, row, col)) {
                placeShape(gameState.targetPattern, shape, row, col, index + 1);
                placed = true;
            }
            attempts++;
        }
    });
    
    displayPattern(elements.mainGrid, gameState.targetPattern, true);
}

function canPlaceShape(grid, shape, startRow, startCol) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                const row = startRow + i, col = startCol + j;
                if (row >= grid.length || col >= grid[0].length || grid[row][col] !== 0) return false;
            }
        }
    }
    return true;
}

function placeShape(grid, shape, startRow, startCol, value) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) grid[startRow + i][startCol + j] = value;
        }
    }
}

function displayPattern(container, pattern, isTarget = false) {
    const cells = container.querySelectorAll('.grid-cell');
    const colors = ['', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'cyan'];
    pattern.forEach((row, i) => {
        row.forEach((value, j) => {
            const cell = cells[i * pattern.length + j];
            if (value > 0) {
                cell.classList.add('filled', `color-${colors[value]}`);
                if (isTarget) cell.classList.add('target');
            } else {
                cell.className = 'grid-cell';
            }
        });
    });
}

function generateBlocks(count) {
    gameState.blocks = [];
    if (gameState.selectedShapes) {
        gameState.selectedShapes.forEach((shapeKey, i) => {
            gameState.blocks.push({
                id: i,
                shapeKey: shapeKey,
                shape: blockShapes[shapeKey].shape,
                color: blockShapes[shapeKey].color
            });
        });
    }
    gameState.blocks.sort(() => Math.random() - 0.5);
    renderBlocks();
}

function renderBlocks() {
    elements.blocksContainer.innerHTML = '';
    gameState.blocks.forEach(block => {
        elements.blocksContainer.appendChild(createBlockElement(block));
    });
}

function createBlockElement(block) {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block';
    blockDiv.dataset.blockId = block.id;
    blockDiv.draggable = true;
    if (gameState.usedBlocks.includes(block.id)) blockDiv.classList.add('used');
    
    const blockGrid = document.createElement('div');
    blockGrid.className = 'block-grid';
    blockGrid.style.gridTemplateColumns = `repeat(${block.shape[0].length}, 1fr)`;
    
    block.shape.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'block-cell';
            if (cell === 1) cellDiv.classList.add('filled', `color-${block.color}`);
            blockGrid.appendChild(cellDiv);
        });
    });
    
    blockDiv.appendChild(blockGrid);
    blockDiv.addEventListener('dragstart', handleDragStart);
    blockDiv.addEventListener('dragend', handleDragEnd);
    blockDiv.addEventListener('touchstart', handleTouchStart);
    blockDiv.addEventListener('touchmove', handleTouchMove);
    blockDiv.addEventListener('touchend', handleTouchEnd);
    return blockDiv;
}

let draggedBlock = null, touchBlock = null;

function handleDragStart(e) {
    // Ezber fazında sürüklemeyi engelle
    if (gameState.phase === 'memorize') {
        e.preventDefault();
        return;
    }
    
    const blockElement = e.target.closest('.block');
    if (!blockElement) return;
    draggedBlock = gameState.blocks.find(b => b.id == blockElement.dataset.blockId);
    if (!draggedBlock || gameState.usedBlocks.includes(draggedBlock.id)) {
        e.preventDefault();
        return;
    }
    blockElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    clearPlacementPreview();
    draggedBlock = null;
}

elements.mainGrid.addEventListener('dragover', handleDragOver);
elements.mainGrid.addEventListener('drop', handleDrop);
elements.mainGrid.addEventListener('dragleave', handleDragLeave);

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedBlock || gameState.usedBlocks.includes(draggedBlock.id)) return;
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;
    showPlacementPreview(parseInt(cell.dataset.row), parseInt(cell.dataset.col), draggedBlock.shape);
}

function handleDragLeave(e) {
    if (e.target === elements.mainGrid) clearPlacementPreview();
}

function handleDrop(e) {
    e.preventDefault();
    clearPlacementPreview();
    if (!draggedBlock || gameState.usedBlocks.includes(draggedBlock.id)) return;
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;
    const row = parseInt(cell.dataset.row), col = parseInt(cell.dataset.col);
    if (canPlaceShape(gameState.currentPattern, draggedBlock.shape, row, col)) {
        gameState.moveHistory.push({
            blockId: draggedBlock.id,
            pattern: JSON.parse(JSON.stringify(gameState.currentPattern))
        });
        placeShape(gameState.currentPattern, draggedBlock.shape, row, col, draggedBlock.id + 1);
        gameState.usedBlocks.push(draggedBlock.id);
        gameState.moves++;
        if (sounds.place) sounds.place();
        updateDisplay();
        displayPattern(elements.mainGrid, gameState.currentPattern);
        renderBlocks();
        elements.undoBtn.disabled = false;
    }
}

function showPlacementPreview(startRow, startCol, shape) {
    clearPlacementPreview();
    const canPlace = canPlaceShape(gameState.currentPattern, shape, startRow, startCol);
    const cells = elements.mainGrid.querySelectorAll('.grid-cell');
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                const row = startRow + i, col = startCol + j;
                if (row < gameState.gridSize && col < gameState.gridSize) {
                    cells[row * gameState.gridSize + col].classList.add(canPlace ? 'preview-valid' : 'preview-invalid');
                }
            }
        }
    }
}

function clearPlacementPreview() {
    elements.mainGrid.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid');
    });
}

function handleTouchStart(e) {
    // Ezber fazında dokunmayı engelle
    if (gameState.phase === 'memorize') {
        e.preventDefault();
        return;
    }
    
    touchBlock = gameState.blocks.find(b => b.id == e.target.closest('.block').dataset.blockId);
    e.target.closest('.block').classList.add('dragging');
}

function handleTouchMove(e) { e.preventDefault(); }

function handleTouchEnd(e) {
    e.target.closest('.block').classList.remove('dragging');
    if (!touchBlock || gameState.usedBlocks.includes(touchBlock.id)) return;
    const touch = e.changedTouches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.grid-cell');
    if (cell) {
        const row = parseInt(cell.dataset.row), col = parseInt(cell.dataset.col);
        if (canPlaceShape(gameState.currentPattern, touchBlock.shape, row, col)) {
            placeShape(gameState.currentPattern, touchBlock.shape, row, col, touchBlock.id + 1);
            gameState.usedBlocks.push(touchBlock.id);
            gameState.moves++;
            updateDisplay();
            displayPattern(elements.mainGrid, gameState.currentPattern);
            renderBlocks();
        }
    }
    touchBlock = null;
}

function startMemorizePhase() {
    gameState.phase = 'memorize';
    gameState.moveHistory = [];
    elements.gridTitle.textContent = '🎯 Hedef Şekli Ezberleyin!';
    elements.memorizeTimer.style.display = 'flex';
    elements.undoBtn.disabled = true;
    elements.checkBtn.disabled = true;
    if (elements.hintBtn) {
        elements.hintBtn.disabled = true; // İpucu butonunu devre dışı bırak
    }

    // "Süreyi Geç" butonunu göster
    elements.skipTimerBtn.style.display = 'block';

    // Blokları devre dışı bırak (görsel olarak)
    elements.blocksContainer.style.opacity = '0.5';
    elements.blocksContainer.style.pointerEvents = 'none';

    const memorizeTime = levelConfig[Math.min(gameState.currentLevel - 1, levelConfig.length - 1)].memorizeTime;

    // Timer'ı direkt başlat (animasyon varsa da yoksa da)
    startMemorizeTimer(memorizeTime);

    // Oyun başlangıç animasyonu (varsa)
    if (window.animateGameStart) {
        setTimeout(() => {
            window.animateGameStart();
        }, 100);
    }
}

// Ezber timer'ını başlat
function startMemorizeTimer(memorizeTime) {
    console.log('⏰ Timer başlatılıyor, süre:', memorizeTime);

    // Timer elementini kontrol et
    if (!elements.memorizeTimer) {
        console.error('❌ memorizeTimer elementi bulunamadı!');
        return;
    }

    let timeLeft = memorizeTime;
    elements.memorizeTimer.textContent = timeLeft;
    elements.memorizeTimer.style.display = 'flex';
    console.log('✅ Timer gösteriliyor:', timeLeft);

    // Önceki timer'ı temizle
    if (gameState.memorizeTimer) {
        clearInterval(gameState.memorizeTimer);
    }

    gameState.memorizeTimer = setInterval(() => {
        timeLeft--;
        console.log('⏰ Geri sayım:', timeLeft);
        elements.memorizeTimer.textContent = timeLeft;

        if (timeLeft <= 0) {
            console.log('✅ Timer bitti, oyun fazı başlıyor');
            clearInterval(gameState.memorizeTimer);
            startPlayPhase();
        }
    }, 1000);
}

function startPlayPhase() {
    gameState.phase = 'play';
    elements.gridTitle.textContent = '📍 Blokları Yerleştirin';
    elements.memorizeTimer.style.display = 'none';
    elements.checkBtn.disabled = false; // Butonu aktif et
    if (elements.hintBtn) {
        elements.hintBtn.disabled = false; // İpucu butonunu aktif et
    }

    // "Süreyi Geç" butonunu gizle
    elements.skipTimerBtn.style.display = 'none';

    // Blokları aktif et
    elements.blocksContainer.style.opacity = '1';
    elements.blocksContainer.style.pointerEvents = 'auto';
    
    displayPattern(elements.mainGrid, gameState.currentPattern);
    gameState.startTime = Date.now();
    startTimer();
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        elements.timer.textContent = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`;
    }, 1000);
}

function checkSolution() {
    // Eğer zaten kontrol ediyorsak veya oyun fazı 'play' değilse, çık
    if (gameState.phase !== 'play') {
        return;
    }
    
    // Fazı 'checking' olarak ayarla (tekrar basılmasını engelle)
    gameState.phase = 'checking';
    
    // Butonu devre dışı bırak
    elements.checkBtn.disabled = true;
    
    clearInterval(gameState.timerInterval);
    let correct = true;
    for (let i = 0; i < gameState.gridSize; i++) {
        for (let j = 0; j < gameState.gridSize; j++) {
            if ((gameState.targetPattern[i][j] > 0) !== (gameState.currentPattern[i][j] > 0)) {
                correct = false;
                break;
            }
        }
        if (!correct) break;
    }
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const earnedPoints = correct ? (100 + Math.max(0, 100 - elapsed) + Math.max(0, 50 - gameState.moves * 5)) : 0;
    gameState.score += earnedPoints;
    showResult(correct, elapsed, earnedPoints);
}

function showResult(correct, time, points) {
    const timeStr = `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
    if (correct) {
        // Başarılı - Patlama animasyonu ve otomatik sonraki seviye
        if (sounds.success) sounds.success();
        gameState.levelsCompleted++;
        gameState.score += points;
        
        // Her 3 seviyede bir ipucu hakkı kazan
        if (gameState.levelsCompleted % 3 === 0) {
            gameState.hintsAvailable++;
            if (sounds.unlock) sounds.unlock();
        }
        
        // Patlama animasyonu ile sonraki seviyeye geç
        if (window.animateLevelComplete) {
            window.animateLevelComplete(() => {
                // Animasyon bittikten sonra direkt sonraki seviyeye geç
                // Fazı 'play' olarak ayarla ki sonraki seviyede buton çalışsın
                nextLevel();
            });
        } else {
            // Animasyon yoksa kısa bir gecikme ile geç
            setTimeout(() => {
                nextLevel();
            }, 1000);
        }
    } else {
        // Başarısız - Oyun kaybı animasyonu ve skor gösterimi
        if (sounds.fail) sounds.fail();
        
        if (window.animateGameOver) {
            window.animateGameOver(() => {
                // Animasyon bittikten sonra skor ekranını göster
                showGameOverScreen();
            });
        } else {
            // Animasyon yoksa kısa bir gecikme ile skor ekranını göster
            setTimeout(() => {
                showGameOverScreen();
            }, 1000);
        }
    }
}

// Oyun kaybı skor ekranı
function showGameOverScreen() {
    // Overlay oluştur
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
        animation: fadeIn 0.5s ease-out;
    `;
    
    // Logo (animasyonlu)
    const logo = document.createElement('div');
    logo.style.cssText = `
        font-size: 4rem;
        margin-bottom: 30px;
        animation: logoPulse 2s ease-in-out infinite;
    `;
    logo.textContent = '🧠';
    
    // Oyun Bitti yazısı
    const gameOverText = document.createElement('div');
    gameOverText.style.cssText = `
        font-size: 2.5rem;
        font-weight: bold;
        color: white;
        margin-bottom: 40px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `;
    gameOverText.textContent = 'Oyun Bitti!';
    
    // Skor container
    const scoreContainer = document.createElement('div');
    scoreContainer.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        padding: 30px 60px;
        border-radius: 20px;
        backdrop-filter: blur(10px);
        margin-bottom: 30px;
    `;
    
    const scoreLabel = document.createElement('div');
    scoreLabel.style.cssText = `
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 10px;
        text-align: center;
    `;
    scoreLabel.textContent = 'Toplam Skor';
    
    const scoreValue = document.createElement('div');
    scoreValue.id = 'animated-score';
    scoreValue.style.cssText = `
        font-size: 4rem;
        font-weight: bold;
        color: white;
        text-align: center;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    `;
    scoreValue.textContent = '0';
    
    scoreContainer.appendChild(scoreLabel);
    scoreContainer.appendChild(scoreValue);
    
    // Tıklama talimatı
    const tapText = document.createElement('div');
    tapText.style.cssText = `
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        animation: tapPulse 1.5s ease-in-out infinite;
    `;
    tapText.textContent = '👆 Devam etmek için ekrana dokunun';
    
    // Elementleri ekle
    overlay.appendChild(logo);
    overlay.appendChild(gameOverText);
    overlay.appendChild(scoreContainer);
    overlay.appendChild(tapText);
    document.body.appendChild(overlay);
    
    // CSS animasyonlarını ekle
    if (!document.getElementById('game-over-styles')) {
        const style = document.createElement('style');
        style.id = 'game-over-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes logoPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes tapPulse {
                0%, 100% { opacity: 0.8; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Skor animasyonu
    animateScore(scoreValue, gameState.score);
    
    // Tıklama ile ana sayfaya dön
    overlay.addEventListener('click', function() {
        if (sounds.click) sounds.click();
        document.body.removeChild(overlay);
        goToHome();
    });
}

// Skor animasyonu fonksiyonu
function animateScore(element, targetScore) {
    let currentScore = 0;
    const duration = 2000; // 2 saniye
    const steps = 60;
    const increment = targetScore / steps;
    const stepDuration = duration / steps;
    
    const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        element.textContent = Math.floor(currentScore);
    }, stepDuration);
}

function showResultScreen(correct, timeStr, points) {
    if (correct) {
        if (sounds.success) sounds.success();
        gameState.levelsCompleted++;
        
        // Konfeti animasyonu başlat
        createConfetti();
        
        // Her 3 seviyede bir ipucu hakkı kazan
        if (gameState.levelsCompleted % 3 === 0) {
            gameState.hintsAvailable++;
            if (sounds.unlock) sounds.unlock();
            elements.resultMessage.textContent = `Seviyeyi başarıyla tamamladınız! ${points} puan kazandınız. 🎁 Bonus: 1 İpucu Hakkı Kazandınız!`;
        } else {
            elements.resultMessage.textContent = `Seviyeyi başarıyla tamamladınız! ${points} puan kazandınız.`;
        }
        
        elements.resultIcon.textContent = '🎉';
        elements.resultTitle.textContent = 'Mükemmel!';
        elements.nextLevelBtn.style.display = 'inline-block';
        elements.playAgainBtn.style.display = 'none';
    } else {
        if (sounds.fail) sounds.fail();
        elements.resultIcon.textContent = '😔';
        elements.resultTitle.textContent = 'Oyun Bitti!';
        elements.resultMessage.textContent = 'Bloklar doğru yerleştirilmedi. Tekrar denemek ister misiniz?';
        elements.nextLevelBtn.style.display = 'none';
        elements.playAgainBtn.style.display = 'inline-block';
    }
    elements.finalScore.textContent = gameState.score;
    elements.finalTime.textContent = timeStr;
    elements.finalMoves.textContent = gameState.moves;
    updateDisplay();
    showScreen('result');
}

// Konfeti animasyonu oluştur
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
    
    const colors = ['#FF6B9D', '#C44569', '#4FACFE', '#43E97B', '#FFD93D', '#A8EDEA', '#FD79A8'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // 5 saniye sonra konfetileri temizle
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

function resetLevel() {
    clearInterval(gameState.memorizeTimer);
    clearInterval(gameState.timerInterval);
    gameState.usedBlocks = [];
    gameState.moves = 0;
    gameState.moveHistory = [];
    gameState.currentPattern = Array(gameState.gridSize).fill(null).map(() => Array(gameState.gridSize).fill(0));
    displayPattern(elements.mainGrid, gameState.currentPattern);
    renderBlocks();
    updateDisplay();
    elements.undoBtn.disabled = true;
    startMemorizePhase();
}

function nextLevel() {
    // Animasyonları temizle
    if (window.clearGridAnimations) {
        window.clearGridAnimations();
    }
    
    loadLevel(gameState.currentLevel + 1);
    showScreen('game');
    startMemorizePhase();
    updateHintButton();
}

function restartGame() {
    clearInterval(gameState.memorizeTimer);
    clearInterval(gameState.timerInterval);
    startGame();
}

function skipMemorizeTimer() {
    if (sounds.click) sounds.click();

    // Timer'ı temizle
    if (gameState.memorizeTimer) {
        clearInterval(gameState.memorizeTimer);
    }

    // Direkt oyun fazına geç
    startPlayPhase();
}

function undoLastMove() {
    if (gameState.moveHistory.length === 0) return;
    if (sounds.click) sounds.click();
    const lastMove = gameState.moveHistory.pop();
    gameState.currentPattern = lastMove.pattern;
    const blockIndex = gameState.usedBlocks.indexOf(lastMove.blockId);
    if (blockIndex > -1) gameState.usedBlocks.splice(blockIndex, 1);
    if (gameState.moves > 0) gameState.moves--;
    updateDisplay();
    displayPattern(elements.mainGrid, gameState.currentPattern);
    renderBlocks();
    if (gameState.moveHistory.length === 0) elements.undoBtn.disabled = true;
}

function showHint() {
    // İpucu hakkı kontrolü
    if (gameState.hintsAvailable > 0) {
        if (sounds.hint) sounds.hint();
        gameState.hintsAvailable--;
        const currentPattern = JSON.parse(JSON.stringify(gameState.currentPattern));
        displayPattern(elements.mainGrid, gameState.targetPattern, true);
        setTimeout(() => displayPattern(elements.mainGrid, currentPattern), 2000);
        updateHintButton();
    } else if (gameState.adsWatched < 3) {
        // Reklam izleme seçeneği sun
        showAdPrompt();
    } else {
        alert('❌ İpucu hakkınız kalmadı! Her 3 seviyede bir yeni ipucu kazanabilirsiniz.');
    }
}

function showAdPrompt() {
    const watch = confirm(
        `💡 İpucu Hakkı Yok!\n\n` +
        `🎬 Reklam izleyerek 1 ipucu hakkı kazanabilirsiniz.\n` +
        `📊 Kalan reklam hakkı: ${3 - gameState.adsWatched}/3\n\n` +
        `Reklam izlemek ister misiniz?`
    );
    
    if (watch) {
        simulateAdWatch();
    }
}

function simulateAdWatch() {
    // Reklam simülasyonu (gerçek uygulamada AdMob/Unity Ads entegrasyonu yapılır)
    const adOverlay = document.createElement('div');
    adOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        font-family: Arial, sans-serif;
    `;
    
    const adContent = document.createElement('div');
    adContent.style.cssText = `
        text-align: center;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        max-width: 400px;
    `;
    
    adContent.innerHTML = `
        <h2 style="font-size: 2rem; margin-bottom: 20px;">🎬 Reklam</h2>
        <p style="font-size: 1.2rem; margin-bottom: 20px;">Reklam oynatılıyor...</p>
        <div style="font-size: 3rem; margin: 20px 0;" id="ad-countdown">5</div>
        <p style="font-size: 0.9rem; opacity: 0.8;">Lütfen bekleyin</p>
    `;
    
    adOverlay.appendChild(adContent);
    document.body.appendChild(adOverlay);
    
    let countdown = 5;
    const countdownEl = document.getElementById('ad-countdown');
    
    const interval = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(interval);
            document.body.removeChild(adOverlay);
            
            // Reklam izlendi, ipucu hakkı ver
            gameState.adsWatched++;
            gameState.hintsAvailable++;
            
            if (sounds.unlock) sounds.unlock();
            
            alert(`✅ Reklam tamamlandı!\n🎁 1 İpucu hakkı kazandınız!\n📊 Kalan reklam hakkı: ${3 - gameState.adsWatched}/3`);
            
            updateHintButton();
        }
    }, 1000);
}

function updateHintButton() {
    if (!elements.hintBtn) return; // Element yoksa çık

    const hintText = gameState.hintsAvailable > 0
        ? `💡 İpucu (${gameState.hintsAvailable})`
        : gameState.adsWatched < 3
            ? `🎬 İpucu (Reklam İzle)`
            : `💡 İpucu (Yok)`;

    elements.hintBtn.textContent = hintText;

    // Buton rengini güncelle
    if (gameState.hintsAvailable > 0) {
        elements.hintBtn.style.opacity = '1';
    } else if (gameState.adsWatched < 3) {
        elements.hintBtn.style.opacity = '0.8';
    } else {
        elements.hintBtn.style.opacity = '0.5';
    }
}

function showScreen(screenName) {
    // Container'ı göster (eğer gizliyse)
    const container = document.querySelector('.container');
    if (container && container.style.display === 'none') {
        container.style.display = 'block';
    }
    
    // Tüm container içindeki ekranları gizle
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.resultScreen.classList.remove('active');
    
    // İstenen ekranı göster
    elements[screenName + 'Screen'].classList.add('active');
}

// Animasyonlu sayı güncelleme için global değişkenler
let currentDisplayedLevel = 1;
let currentDisplayedScore = 0;
let levelAnimationFrame = null;
let scoreAnimationFrame = null;

function updateDisplay() {
    animateNumber(elements.levelDisplay, currentDisplayedLevel, gameState.currentLevel, (newValue) => {
        currentDisplayedLevel = newValue;
    });
    
    animateNumber(elements.scoreDisplay, currentDisplayedScore, gameState.score, (newValue) => {
        currentDisplayedScore = newValue;
    });
    
    updateHintButton();
}

// Sayıları animasyonlu şekilde güncelle
function animateNumber(element, fromValue, toValue, onUpdate) {
    // Eğer değer değişmediyse animasyon yapma
    if (fromValue === toValue) {
        element.textContent = toValue;
        return;
    }
    
    const duration = 800; // 0.8 saniye
    const startTime = performance.now();
    const difference = toValue - fromValue;
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.floor(fromValue + (difference * easeProgress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = toValue;
            if (onUpdate) onUpdate(toValue);
        }
    }
    
    requestAnimationFrame(animate);
}

init();
