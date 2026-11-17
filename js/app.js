/**
 * SpeakUp - Main Application Controller
 */

// Application State
let items = [];
let idx = 0;
let score = 0;
let recog = null;
let isRec = false;
let recTimeout = null;
let testRecogInstance = null;
let testTimeout = null;

// Floating Background Bubbles
function initBubbles() {
  const cols = ['#FF6B6B', '#26D0CE', '#A78BFA', '#FFD93D', '#74B9FF', '#FF8ED4', '#6BCB77', '#FFA552'];
  const wrap = document.getElementById('bubbles');
  if (!wrap) return;
  for (let i = 0; i < 20; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const s = 18 + Math.random() * 70;
    b.style.cssText = `width:${s}px;height:${s}px;background:${cols[i % cols.length]};
      left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 11}s;
      animation-delay:${Math.random() * 12}s`;
    wrap.appendChild(b);
  }
}

// Page Navigation
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
}

function goHome() {
  if (typeof playClickSound === 'function') playClickSound();
  stopRec();
  if (typeof cancelSpeechSynthesis === 'function') {
    cancelSpeechSynthesis();
  }
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('show');
  score = 0;
  idx = 0;
  items = [];
  showPage('page-home');
}

// Category Start
function startCategory(cat) {
  if (typeof playClickSound === 'function') playClickSound();
  if (!CATS[cat]) return;
  items = [...CATS[cat]];

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  idx = 0;
  score = 0;
  const scoreVal = document.getElementById('score-val');
  if (scoreVal) scoreVal.textContent = '0';

  buildDots();
  loadWord();
  showPage('page-practice');
  setStatus('👆 Press Listen first, then say the word!', '');
}

function buildDots() {
  const c = document.getElementById('pdots');
  if (!c) return;
  c.innerHTML = '';
  items.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'pdot' + (i === 0 ? ' current' : '');
    d.id = 'd' + i;
    c.appendChild(d);
  });
}

function refreshDots() {
  items.forEach((_, i) => {
    const d = document.getElementById('d' + i);
    if (!d) return;
    if (i < idx) {
      d.className = 'pdot done';
    } else if (i === idx) {
      d.className = 'pdot current';
    } else {
      d.className = 'pdot';
    }
  });
}

function loadWord() {
  if (!items[idx]) return;
  const it = items[idx];
  document.getElementById('w-emoji').textContent = it.emoji;
  document.getElementById('w-text').textContent = it.word;
  document.getElementById('w-hint').textContent = it.hint;
  refreshDots();

  const sb = document.getElementById('speak-btn');
  if (sb) {
    sb.disabled = false;
    sb.classList.remove('recording');
    sb.innerHTML = '🎤 Speak';
  }
  const wave = document.getElementById('mic-wave');
  if (wave) wave.classList.remove('active');
  setStatus('👆 Press Listen first, then say the word!', '');
}

// Speech Playback
function playWord() {
  if (!items[idx]) return;
  speakWord(
    items[idx],
    () => setStatus('🔊 Listen carefully...', 'listening'),
    () => setStatus('🎤 Now your turn! Press Speak!', '')
  );
}

// Speech Recognition
function toggleSpeech() {
  if (isRec) stopRec();
  else startRec();
}

function startRec() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    setStatus('❌ Use Chrome, Edge, or Safari', 'wrong');
    return;
  }

  if (!recog) {
    initRecognition();
  }

  try {
    isRec = true;
    recog.start();
  } catch (err) {
    setStatus('❌ Error starting mic', 'wrong');
  }

  function initRecognition() {
    recog = new SR();
    recog.lang = 'en-US';
    recog.continuous = true;
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    let speechDetected = false;

    recog.onstart = () => {
      isRec = true;
      speechDetected = false;
      if (recTimeout) clearTimeout(recTimeout);

      const btn = document.getElementById('speak-btn');
      if (btn) {
        btn.classList.add('recording');
        btn.disabled = false;
        btn.innerHTML = '⏹ Stop';
      }
      const wave = document.getElementById('mic-wave');
      if (wave) wave.classList.add('active');
      setStatus('🔴 LISTENING... speak anytime in the next 30 seconds!', 'listening');

      recTimeout = setTimeout(() => {
        stopRec();
        if (!speechDetected) {
          setStatus("⏱️ Time's up! Try again!", 'wrong');
        }
      }, 30000);
    };

    recog.onresult = e => {
      if (recTimeout) clearTimeout(recTimeout);
      let interimText = '';
      let finalText = '';

      for (let i = 0; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.toLowerCase().trim();
        if (e.results[i].isFinal) {
          finalText = transcript;
          speechDetected = true;
        } else {
          interimText = transcript;
        }
      }

      const display = finalText || interimText;
      if (display) {
        setStatus(`📝 You said: "${display}"`, 'listening');
      }

      if (finalText) {
        stopRec();
        const currentItem = items[idx];
        const match = checkSpeechMatch(finalText, currentItem);

        if (match) {
          handleCorrect(finalText);
        } else {
          handleWrong(finalText);
        }
      }
    };

    recog.onerror = e => {
      const msgs = {
        'no-speech': '🔊 Still waiting... SPEAK NOW LOUDLY!',
        'not-allowed': '🚫 Mic denied. Check browser settings.',
        'audio-capture': '❌ No microphone. Check hardware.',
        'network': '🌐 No internet.',
        'service-not-allowed': '🚫 Mic blocked.',
        'bad-grammar': '⚠️ Unclear. Speak more clearly!',
        'aborted': '⏸️ Stopped.'
      };
      const msg = msgs[e.error] || '❌ ' + e.error;
      setStatus(msg, 'listening');

      if (e.error === 'not-allowed' || e.error === 'audio-capture' || e.error === 'service-not-allowed') {
        stopRec();
      } else if (e.error === 'no-speech') {
        if (!isRec) return;
        try {
          recog.abort();
          setTimeout(() => {
            if (isRec && recog) {
              try { recog.start(); } catch (err) {}
            }
          }, 100);
        } catch (err) {}
      }
    };

    recog.onend = () => {
      if (recTimeout) clearTimeout(recTimeout);
      isRec = false;
      const wave = document.getElementById('mic-wave');
      if (wave) wave.classList.remove('active');
    };
  }
}

function stopRec() {
  if (recTimeout) {
    clearTimeout(recTimeout);
    recTimeout = null;
  }
  isRec = false;
  if (recog) {
    try { recog.stop(); } catch (e) {}
  }
  const btn = document.getElementById('speak-btn');
  if (btn) {
    btn.classList.remove('recording');
    btn.disabled = false;
    btn.innerHTML = '🎤 Speak';
  }
  const wave = document.getElementById('mic-wave');
  if (wave) wave.classList.remove('active');
}

// Result Feedback
function handleCorrect(said) {
  if (typeof playCorrectSound === 'function') playCorrectSound();
  score++;
  document.getElementById('score-val').textContent = score;
  spawnConfetti();
  spawnStars();
  const praises = ['Amazing! 🎉', 'Wonderful! ✨', 'Great job! 🌟', 'Superstar! ⭐', 'You did it! 🎊', 'Brilliant! 🌈', 'Perfect! 💫'];
  const praise = praises[Math.floor(Math.random() * praises.length)];
  const isLast = idx >= items.length - 1;
  showOverlay('🎉', praise, 'ok', `You said "${said}" perfectly!`, isLast ? '🏆 Finish!' : 'Next Word →');
}

function handleWrong(said) {
  if (typeof playWrongSound === 'function') playWrongSound();
  const card = document.getElementById('word-card');
  if (card) {
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 600);
  }
  const target = items[idx].word;
  const msg = !said
    ? `I didn't hear anything. Say "${target}" LOUDLY!`
    : `I heard "${said}". Say "${target}" more clearly!`;

  showOverlay('😊', 'Keep Trying!', 'ng', msg, 'Skip →');
}

function showOverlay(icon, title, cls, msg, nextTxt) {
  document.getElementById('r-icon').textContent = icon;
  document.getElementById('r-title').textContent = title;
  document.getElementById('r-title').className = 'result-title ' + cls;
  document.getElementById('r-said').textContent = msg;
  document.getElementById('r-next').textContent = nextTxt;
  document.getElementById('overlay').classList.add('show');
}

function nextWord() {
  if (typeof playClickSound === 'function') playClickSound();
  document.getElementById('overlay').classList.remove('show');
  idx++;
  if (idx >= items.length) {
    showComplete();
  } else {
    loadWord();
  }
}

function retryWord() {
  if (typeof playClickSound === 'function') playClickSound();
  document.getElementById('overlay').classList.remove('show');
  loadWord();
}

// Complete Screen
function showComplete() {
  if (typeof playCompleteSound === 'function') playCompleteSound();
  const total = items.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  let icon = '🏆';
  let title = 'Outstanding! 🎊';
  let sub = "You're a superstar speaker!";

  if (pct < 80 && pct >= 50) {
    icon = '⭐';
    title = 'Great effort! 👏';
    sub = "You're getting better every day!";
  } else if (pct < 50) {
    icon = '💪';
    title = 'Keep going! 😊';
    sub = 'Practice makes perfect!';
  }

  document.getElementById('c-icon').textContent = icon;
  document.getElementById('c-title').textContent = title;
  document.getElementById('c-sub').textContent = sub;
  document.getElementById('c-correct').textContent = score;
  document.getElementById('c-total').textContent = total;
  document.getElementById('c-pct').textContent = pct + '%';

  showPage('page-complete');
  setTimeout(() => {
    const bar = document.getElementById('c-bar');
    if (bar) bar.style.width = pct + '%';
  }, 100);

  if (pct >= 50) {
    spawnConfetti();
    spawnStars();
  }
}

// Status Helper
function setStatus(msg, type) {
  const el = document.getElementById('status-bar');
  if (!el) return;
  el.textContent = msg;
  el.className = 'status-bar' + (type ? ' ' + type : '');
}

// Particle Effects
function spawnConfetti() {
  const cols = ['#FF6B6B', '#26D0CE', '#FFD93D', '#6BCB77', '#A78BFA', '#FF8ED4', '#74B9FF', '#FFA552'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-bit';
    const s = 8 + Math.random() * 10;
    c.style.cssText = `left:${Math.random() * 100}vw;width:${s}px;height:${s}px;
      background:${cols[Math.floor(Math.random() * cols.length)]};
      border-radius:${Math.random() > 0.45 ? '50%' : '3px'};
      animation-duration:${1.4 + Math.random() * 2}s;animation-delay:${Math.random() * 0.6}s`;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

function spawnStars() {
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div');
    s.className = 'star-burst';
    s.textContent = ['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)];
    s.style.cssText = `left:${15 + Math.random() * 70}vw;top:${15 + Math.random() * 70}vh;
      animation-delay:${Math.random() * 0.4}s`;
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

// Microphone Test
function testMicrophone() {
  const statusEl = document.getElementById('mic-test-status');
  const btn = document.getElementById('mic-test-btn');
  if (!statusEl) return;

  statusEl.style.display = 'block';

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    statusEl.className = 'mic-test-status error';
    statusEl.textContent = '❌ Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.';
    return;
  }

  if (testRecogInstance) {
    try { testRecogInstance.abort(); } catch (e) {}
    testRecogInstance = null;
  }
  if (testTimeout) {
    clearTimeout(testTimeout);
    testTimeout = null;
  }

  statusEl.className = 'mic-test-status listening';
  statusEl.textContent = '🔴 Listening... Say "Hello", "Cat", or any word loudly!';
  if (btn) btn.disabled = true;

  try {
    testRecogInstance = new SR();
    testRecogInstance.lang = 'en-US';
    testRecogInstance.continuous = false;
    testRecogInstance.interimResults = true;

    let heardWord = '';

    testTimeout = setTimeout(() => {
      if (testRecogInstance) {
        try { testRecogInstance.abort(); } catch (e) {}
      }
      if (btn) btn.disabled = false;
      if (!heardWord) {
        statusEl.className = 'mic-test-status error';
        statusEl.textContent = '⏱️ No sound detected. Please check microphone volume and permissions, then try again!';
      }
    }, 10000);

    testRecogInstance.onresult = e => {
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.trim();
        if (t) {
          heardWord = t;
        }
      }
      if (heardWord) {
        statusEl.className = 'mic-test-status success';
        statusEl.textContent = `✅ Microphone works! Heard: "${heardWord}"`;
        if (testTimeout) clearTimeout(testTimeout);
        if (btn) btn.disabled = false;
        try { testRecogInstance.stop(); } catch (err) {}
      }
    };

    testRecogInstance.onerror = e => {
      if (testTimeout) clearTimeout(testTimeout);
      if (btn) btn.disabled = false;
      statusEl.className = 'mic-test-status error';
      if (e.error === 'not-allowed') {
        statusEl.textContent = '🚫 Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (e.error === 'no-speech') {
        statusEl.textContent = '🔊 No speech detected. Please speak louder into your microphone!';
      } else {
        statusEl.textContent = `⚠️ Microphone notice (${e.error}). Ensure your mic is connected and try again.`;
      }
    };

    testRecogInstance.onend = () => {
      if (btn) btn.disabled = false;
    };

    testRecogInstance.start();
  } catch (err) {
    if (testTimeout) clearTimeout(testTimeout);
    if (btn) btn.disabled = false;
    statusEl.className = 'mic-test-status error';
    statusEl.textContent = '⚠️ Unable to start microphone test. Please check browser permissions.';
  }
}

// Keyboard Accessibility
window.addEventListener('keydown', e => {
  if (e.target && ['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;

  const overlay = document.getElementById('overlay');
  const isOverlayOpen = overlay && overlay.classList.contains('show');

  if (isOverlayOpen) {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextWord();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      retryWord();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      retryWord();
    }
    return;
  }

  const practicePage = document.getElementById('page-practice');
  const isPracticeActive = practicePage && practicePage.classList.contains('active');

  if (isPracticeActive) {
    if (e.key === ' ') {
      e.preventDefault();
      toggleSpeech();
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      playWord();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      goHome();
    }
  }
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initBubbles();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
