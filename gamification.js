// gamification.js - Sound effects, animations, and gamified rewards
class GameSounds {
  constructor() {
    // Create simple beep sounds using Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.enabled = true;
  }

  playBeep(frequency = 400, duration = 100) {
    if (!this.enabled) return;
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  playMove() { this.playBeep(600, 80); }
  playCapture() { this.playBeep(800, 150); }
  playCheck() { this.playBeep(400, 200); }
  playCheckmate() { 
    this.playBeep(800, 300);
    setTimeout(() => this.playBeep(600, 300), 200);
    setTimeout(() => this.playBeep(1000, 300), 400);
  }
  playVictory() {
    [800, 900, 1000].forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 200), i * 150);
    });
  }

  toggle() { this.enabled = !this.enabled; }
}

class GameAnimations {
  static createConfetti(x, y) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 20px;
      z-index: 1000;
      pointer-events: none;
      animation: fall 2s ease-in forwards;
    `;
    confetti.innerHTML = ['🎉', '✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 5)];
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 2000);
  }

  static animatePieceCaptured(square) {
    square.style.animation = 'captureExplosion 0.6s ease-out forwards';
    setTimeout(() => {
      square.style.animation = '';
    }, 600);
  }

  static showCheckmate(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 215, 0, 0.95);
      padding: 30px 60px;
      border-radius: 20px;
      font-size: 40px;
      font-weight: bold;
      color: #333;
      z-index: 2000;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      animation: popIn 0.5s ease-out;
      text-align: center;
    `;
    overlay.innerHTML = message;
    document.body.appendChild(overlay);
    
    // Add confetti
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        GameAnimations.createConfetti(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }, i * 30);
    }
    
    setTimeout(() => overlay.remove(), 3000);
  }

  static addShake(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }
}

class GameStats {
  constructor() {
    this.points = 0;
    this.captures = 0;
    this.checkmates = 0;
    this.capturesThisGame = [];
  }

  recordCapture(piece) {
    const values = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90 };
    const pieceType = piece[1];
    const points = values[pieceType] || 0;
    
    this.points += points * 10;
    this.captures++;
    this.capturesThisGame.push({ piece: pieceType, points });
    
    return points * 10;
  }

  recordCheckmate(winner) {
    if (winner !== 'draw') {
      this.checkmates++;
      this.points += 500;
    }
    return this.points;
  }

  reset() {
    this.capturesThisGame = [];
  }

  getStats() {
    return {
      points: this.points,
      captures: this.captures,
      checkmates: this.checkmates,
      capturesThisGame: this.capturesThisGame
    };
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100px) rotateZ(360deg);
      opacity: 0;
    }
  }
  
  @keyframes captureExplosion {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(0); opacity: 0; }
  }
  
  @keyframes popIn {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    60% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Initialize globally
const gameSounds = new GameSounds();
const gameStats = new GameStats();
