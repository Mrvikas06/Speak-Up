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

// Live Audio Waveform Visualizer
let liveAudioStream = null;
let liveAnalyser = null;
let visualizerAnimId = null;

async function startLiveVisualizer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.classList.add('active');

  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    liveAudioStream = stream;
    const ctx = getAudioContext();
    if (!ctx) return;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 32;
    source.connect(analyser);
    liveAnalyser = analyser;

    const bars = container.querySelectorAll('.wave-bar');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function update() {
      if (!liveAnalyser) return;
      liveAnalyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;

      bars.forEach((bar, idx) => {
        const val = dataArray[idx % dataArray.length] || avg;
        const height = Math.max(6, Math.min(34, (val / 255) * 40));
        bar.style.height = `${height}px`;
      });

      visualizerAnimId = requestAnimationFrame(update);
    }
    update();
  } catch (err) {
    // Keep standard CSS wave animation fallback
  }
}

function stopLiveVisualizer(containerId) {
  if (visualizerAnimId && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(visualizerAnimId);
    visualizerAnimId = null;
  }
  if (liveAudioStream) {
    try {
      liveAudioStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    liveAudioStream = null;
  }
  liveAnalyser = null;

  const container = document.getElementById(containerId);
  if (container) {
    container.classList.remove('active');
    const bars = container.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
      bar.style.height = '';
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playCorrectSound,
    playWrongSound,
    playClickSound,
    playCompleteSound,
    toggleSound,
    startLiveVisualizer,
    stopLiveVisualizer
  };
}
