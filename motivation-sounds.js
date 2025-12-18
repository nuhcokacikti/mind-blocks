// ===== Motivasyon Sesleri =====

// Web Audio API ile ses efektleri oluştur
class MotivationSounds {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API desteklenmiyor');
        }
    }

    // Patlama sesi (explosion)
    playExplosion() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Ana patlama sesi - düşük frekans
        const oscillator1 = this.audioContext.createOscillator();
        const gainNode1 = this.audioContext.createGain();

        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(100, now);
        oscillator1.frequency.exponentialRampToValueAtTime(40, now + 0.3);

        gainNode1.gain.setValueAtTime(0.8, now);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator1.connect(gainNode1);
        gainNode1.connect(this.audioContext.destination);

        oscillator1.start(now);
        oscillator1.stop(now + 0.3);

        // Yüksek frekans çıtırtı
        const noise = this.createNoiseBuffer();
        const noiseSource = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        const noiseFilter = this.audioContext.createBiquadFilter();

        noiseSource.buffer = noise;
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.2);
    }

    // Kazanma fanfar sesi
    playVictoryFanfare() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const notes = [262, 330, 392, 523]; // C, E, G, C (yüksek)

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // Yükseliş sesi (whoosh up)
    playWhooshUp() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.4);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Parlak power-up sesi
    playPowerUp() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        for (let i = 0; i < 5; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            const baseFreq = 400 + (i * 200);
            osc.frequency.setValueAtTime(baseFreq, now + (i * 0.05));

            gain.gain.setValueAtTime(0.2, now + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.05) + 0.2);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(now + (i * 0.05));
            osc.stop(now + (i * 0.05) + 0.2);
        }
    }

    // Yıldız parıltı sesi
    playSparkle() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const frequencies = [2000, 2500, 3000, 2500, 2000];

        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.05);
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.1);
        });
    }

    // Noise buffer oluştur (patlama efekti için)
    createNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    // Tam motivasyon ses paketi
    playMotivationSequence() {
        this.playWhooshUp();
        setTimeout(() => this.playExplosion(), 100);
        setTimeout(() => this.playPowerUp(), 200);
        setTimeout(() => this.playVictoryFanfare(), 300);
        setTimeout(() => this.playSparkle(), 500);
        setTimeout(() => this.playSparkle(), 650);
    }
}

// Global instance oluştur
window.motivationSounds = new MotivationSounds();

console.log('🔊 Motivasyon ses sistemi yüklendi!');
