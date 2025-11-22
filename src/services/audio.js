// Audio alert service for AEGIS
// Plays alert sounds when threats are detected

class AudioService {
    constructor() {
        this.alertSound = null;
        this.enabled = true;
        this.lastPlayTime = 0;
        this.cooldown = 5000; // 5 second cooldown between alerts
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Create audio context and oscillator for alert sound
        // Using Web Audio API to generate alert sound (no external file needed!)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Audio service initialized');
        } catch (e) {
            console.warn('Audio not available:', e);
        }
    }

    playThreatAlert() {
        if (!this.enabled || !this.initialized) return;

        const now = Date.now();
        if (now - this.lastPlayTime < this.cooldown) return;

        this.lastPlayTime = now;
        this._playAlertSequence();
    }

    _playAlertSequence() {
        if (!this.audioContext) return;

        // Resume audio context if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create a dramatic 3-beep alert sequence
        const frequencies = [880, 1100, 880]; // A5 - C#6 - A5
        const durations = [0.15, 0.15, 0.3];
        let time = now;

        frequencies.forEach((freq, i) => {
            // Oscillator
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);

            // Gain (volume envelope)
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.3, time + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(time);
            osc.stop(time + durations[i]);

            time += durations[i] + 0.05; // Small gap between beeps
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

// Singleton instance
const audioService = new AudioService();

export default audioService;
