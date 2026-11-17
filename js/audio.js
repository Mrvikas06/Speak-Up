/**
 * SpeakUp - Web Audio API Sound Synthesizer
 */
let soundEnabled = true;
let sfxAudioContext = null;

function getAudioContext() {
  if (!sfxAudioContext && (window.AudioContext || window.webkitAudioContext)) {
    sfxAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sfxAudioContext && sfxAudioContext.state === 'suspended') {
    sfxAudioContext.resume();
  }
  return sfxAudioContext;
}

function playTone(freq, duration, type = 'sine', gain = 0.15, offset = 0) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    const now = ctx.currentTime + offset;
    osc.frequency.setValueAtTime(freq, now);
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // Graceful fallback if Web Audio is restricted
  }
}

function playCorrectSound() {
  playTone(523.25, 0.15, 'triangle', 0.18, 0);     // C5
  playTone(659.25, 0.18, 'triangle', 0.20, 0.08);  // E5
  playTone(783.99, 0.22, 'triangle', 0.22, 0.16);  // G5
  playTone(1046.5, 0.35, 'triangle', 0.25, 0.24);  // C6
}

function playWrongSound() {
  playTone(330, 0.18, 'sine', 0.14, 0);
  playTone(261.6, 0.28, 'sine', 0.14, 0.14);
}

function playClickSound() {
  playTone(800, 0.05, 'triangle', 0.08, 0);
}

function playCompleteSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((freq, i) => {
    playTone(freq, 0.35, 'triangle', 0.18, i * 0.1);
  });
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    btn.setAttribute('aria-label', soundEnabled ? 'Mute sound effects' : 'Unmute sound effects');
  }
  if (soundEnabled) playClickSound();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playCorrectSound,
    playWrongSound,
    playClickSound,
    playCompleteSound,
    toggleSound
  };
}
