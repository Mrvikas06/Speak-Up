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
let currentFilter = 'all';
let activeCategory = null;

// Sticker Catalog
const STICKERS_CATALOG = [
  { id: 'vowels', icon: '🍎', title: 'Vowel Explorer', desc: 'Practice Vowels' },
  { id: 'alphabet', icon: '🅰️', title: 'Alphabet Master', desc: 'Practice Alphabet' },
  { id: 'numbers', icon: '🔢', title: 'Number Star', desc: 'Practice Numbers' },
  { id: 'colors', icon: '🎨', title: 'Rainbow Artist', desc: 'Practice Colors' },
  { id: 'words', icon: '🐱', title: 'Word Champion', desc: 'Practice Words' },
  { id: 'animals', icon: '🦁', title: 'Safari Guide', desc: 'Practice Animals' },
  { id: 'actions', icon: '🏃', title: 'Action Hero', desc: 'Practice Actions' },
  { id: 'phrases', icon: '💬', title: 'Polite Speaker', desc: 'Practice Phrases' },
  { id: 'twisters', icon: '🌀', title: 'Twister Wizard', desc: 'Practice Twisters' },
  { id: 'perfect', icon: '⭐', title: 'Superstar', desc: 'Score 100% in any set' }
];

function getUnlockedStickers() {
  try {
    const raw = localStorage.getItem('speakup_stickers');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function unlockSticker(id) {
  try {
    const unlocked = getUnlockedStickers();
    if (!unlocked.includes(id)) {
      unlocked.push(id);
      localStorage.setItem('speakup_stickers', JSON.stringify(unlocked));
      updateStickerCounter();
    }
  } catch (e) {}
}

function updateStickerCounter() {
  const countEl = document.getElementById('sticker-count');
  if (countEl) {
    countEl.textContent = getUnlockedStickers().length;
  }
}

function openStickerModal() {
  if (typeof playClickSound === 'function') playClickSound();
  renderStickers();
  const modal = document.getElementById('sticker-modal');
  if (modal) modal.classList.add('show');
}

function closeStickerModal() {
  if (typeof playClickSound === 'function') playClickSound();
  const modal = document.getElementById('sticker-modal');
  if (modal) modal.classList.remove('show');
}

function renderStickers() {
  const grid = document.getElementById('sticker-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const unlocked = getUnlockedStickers();

  STICKERS_CATALOG.forEach(s => {
    const isUnlocked = unlocked.includes(s.id);
    const item = document.createElement('div');
    item.className = 'sticker-item' + (isUnlocked ? '' : ' locked');
    item.innerHTML = `
      <span class="sticker-icon">${s.icon}</span>
      <div class="sticker-title">${s.title}</div>
      <div class="sticker-desc">${isUnlocked ? 'Unlocked!' : s.desc}</div>
    `;
    grid.appendChild(item);
  });
}

// Theme Management
const THEMES = ['default', 'contrast', 'dyslexia'];
let currentThemeIndex = 0;

function initTheme() {
  try {
    const saved = localStorage.getItem('speakup_theme');
    if (saved && THEMES.includes(saved)) {
      currentThemeIndex = THEMES.indexOf(saved);
      applyTheme(saved);
    }
  } catch (e) {}
}

function cycleTheme() {
  if (typeof playClickSound === 'function') playClickSound();
  currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
  const theme = THEMES[currentThemeIndex];
  applyTheme(theme);
  try {
    localStorage.setItem('speakup_theme', theme);
  } catch (e) {}
}

function applyTheme(theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  const btn = document.getElementById('theme-btn');
  if (btn) {
    const labels = {
      default: '🎨 Theme: Pastel',
      contrast: '🌓 Theme: Contrast',
      dyslexia: '📖 Theme: Dyslexia'
    };
    btn.textContent = labels[theme] || '🎨 Theme';
  }
}

// Curriculum Category Cards Rendering
function renderCategoryCards() {
  const grid = document.getElementById('cats-grid');
  if (!grid || typeof CATS === 'undefined') return;
  grid.innerHTML = '';

  const catKeys = Object.keys(CATS);
  catKeys.forEach(cat => {
    const meta = (typeof CATEGORY_META !== 'undefined' && CATEGORY_META[cat]) || {
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: '📚',
      desc: 'Speech practice',
      level: 'beginner',
      badge: `${CATS[cat].length} items`
    };

    if (currentFilter !== 'all' && meta.level !== currentFilter) {
      return;
    }

    const card = document.createElement('div');
    card.className = `cat-card ${cat} ${meta.level}`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Practice ${meta.title}`);
    card.onclick = () => startCategory(cat);
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startCategory(cat);
      }
    };

    card.innerHTML = `
      <span class="cat-icon">${meta.icon}</span>
      <div class="cat-name">${meta.title}</div>
      <div class="cat-desc">${meta.desc}</div>
      <span class="cat-badge">${meta.badge}</span>
    `;
    grid.appendChild(card);
  });
}

function filterCategories(level) {
  if (typeof playClickSound === 'function') playClickSound();
  currentFilter = level;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === level);
  });
  renderCategoryCards();
}

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
  activeCategory = cat;
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

  // Phonics breakdown
  const phEl = document.getElementById('w-phonics');
  if (phEl) {
    phEl.textContent = it.phonics ? `sounds: / ${it.phonics} /` : '';
    phEl.style.display = it.phonics ? 'inline-block' : 'none';
  }

  // Syllables pills
  const sylWrap = document.getElementById('w-syllables');
  if (sylWrap) {
    sylWrap.innerHTML = '';
    if (Array.isArray(it.syllables) && it.syllables.length > 0) {
      it.syllables.forEach(s => {
        const pill = document.createElement('button');
        pill.className = 'syllable-pill';
        pill.textContent = s;
        pill.title = `Listen to "${s}"`;
        pill.onclick = (e) => {
          e.stopPropagation();
          playSyllable(s);
        };
        sylWrap.appendChild(pill);
      });
      sylWrap.style.display = 'flex';
    } else {
      sylWrap.style.display = 'none';
    }
  }

  // Example sentence
  const sentWrap = document.getElementById('w-sentence-wrap');
  const sentEl = document.getElementById('w-sentence');
  if (sentWrap && sentEl) {
    if (it.sentence) {
      sentEl.textContent = `"${it.sentence}"`;
      sentWrap.style.display = 'flex';
    } else {
      sentWrap.style.display = 'none';
    }
  }

  // Mouth positioning guide
  const coachBox = document.getElementById('w-coach-box');
  const coachIcon = document.getElementById('w-coach-icon');
  const coachShape = document.getElementById('w-coach-shape');
  const coachTip = document.getElementById('w-coach-tip');
  if (coachBox && coachShape && coachTip && typeof getArticulationGuide === 'function') {
    const guide = getArticulationGuide(it.word);
    if (guide) {
      if (coachIcon) coachIcon.textContent = guide.emoji || '👄';
      coachShape.textContent = guide.mouthShape || 'Mouth Shape';
      coachTip.textContent = guide.tongueTip || guide.cues || '';
      coachBox.style.display = 'flex';
    } else {
      coachBox.style.display = 'none';
    }
  }

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
function playWord(isSlow = false) {
  if (!items[idx]) return;
  speakWord(
    items[idx],
    () => setStatus(isSlow ? '🐢 Listening slowly...' : '🔊 Listen carefully...', 'listening'),
    () => setStatus('🎤 Now your turn! Press Speak!', ''),
    isSlow
  );
}

function teachWord() {
  if (!items[idx]) return;
  if (typeof playClickSound === 'function') playClickSound();
  if (typeof generateLessonSpeech === 'function' && typeof speakText === 'function') {
    const lesson = generateLessonSpeech(items[idx]);
    speakText(lesson, false);
    setStatus('🎓 Teacher: ' + (items[idx].hint || items[idx].word), 'listening');
  } else {
    playWord(true);
  }
}

function playSyllable(syl) {
  if (typeof playClickSound === 'function') playClickSound();
  if (typeof speakText === 'function') speakText(syl, true);
}

function playSentence() {
  if (!items[idx] || !items[idx].sentence) return;
  if (typeof speakText === 'function') {
    speakText(items[idx].sentence, false);
    setStatus('🔊 Listening to example sentence...', 'listening');
  }
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
      if (typeof startLiveVisualizer === 'function') {
        startLiveVisualizer('mic-wave');
      } else {
        const wave = document.getElementById('mic-wave');
        if (wave) wave.classList.add('active');
      }
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
        const evalResult = typeof evaluatePronunciation === 'function'
          ? evaluatePronunciation(finalText, currentItem)
          : { isMatch: checkSpeechMatch(finalText, currentItem), stars: 3, feedback: 'Great job!' };

        if (evalResult.isMatch) {
          handleCorrect(finalText, evalResult);
        } else {
          handleWrong(finalText, evalResult);
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
      if (typeof stopLiveVisualizer === 'function') {
        stopLiveVisualizer('mic-wave');
      } else {
        const wave = document.getElementById('mic-wave');
        if (wave) wave.classList.remove('active');
      }
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
  if (typeof stopLiveVisualizer === 'function') {
    stopLiveVisualizer('mic-wave');
  } else {
    const wave = document.getElementById('mic-wave');
    if (wave) wave.classList.remove('active');
  }
}

// Result Feedback
function handleCorrect(said, evalResult) {
  if (typeof playCorrectSound === 'function') playCorrectSound();
  score++;
  document.getElementById('score-val').textContent = score;
  spawnConfetti();
  spawnStars();
  const starsCount = evalResult && evalResult.stars ? evalResult.stars : 3;
  const starsDisplay = '⭐'.repeat(starsCount);
  const praises = ['Amazing! 🎉', 'Wonderful! ✨', 'Great job! 🌟', 'Superstar! ⭐', 'You did it! 🎊', 'Brilliant! 🌈', 'Perfect! 💫'];
  const praise = (evalResult && evalResult.feedback) || praises[Math.floor(Math.random() * praises.length)];
  const isLast = idx >= items.length - 1;
  showOverlay(starsDisplay, '🎉', praise, 'ok', `You said: "${said}"`, isLast ? '🏆 Finish!' : 'Next Word →', null);
}

function handleWrong(said, evalResult) {
  if (typeof playWrongSound === 'function') playWrongSound();
  const card = document.getElementById('word-card');
  if (card) {
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 600);
  }
  const target = items[idx].word;
  let tutorAdvice = null;
  if (said && typeof diagnoseSpeechError === 'function') {
    tutorAdvice = diagnoseSpeechError(target, said);
  }
  const msg = !said
    ? `I didn't hear anything. Say "${target}" LOUDLY!`
    : (evalResult && evalResult.feedback) || `I heard "${said}". Say "${target}" more clearly!`;

  showOverlay('⭐', '😊', 'Keep Trying!', 'ng', msg, 'Skip →', tutorAdvice);
}

function showOverlay(stars, icon, title, cls, msg, nextTxt, tutorAdvice) {
  const starsEl = document.getElementById('r-stars');
  if (starsEl) starsEl.textContent = stars || '⭐';
  document.getElementById('r-icon').textContent = icon;
  document.getElementById('r-title').textContent = title;
  document.getElementById('r-title').className = 'result-title ' + cls;
  document.getElementById('r-said').textContent = msg;
  document.getElementById('r-next').textContent = nextTxt;

  const tutorBox = document.getElementById('r-tutor-box');
  const tutorMsg = document.getElementById('r-tutor-msg');
  if (tutorBox && tutorMsg) {
    if (tutorAdvice && tutorAdvice.coaching) {
      tutorMsg.textContent = `${tutorAdvice.emoji || '💡'} ${tutorAdvice.coaching}`;
      tutorBox.style.display = 'block';
    } else {
      tutorBox.style.display = 'none';
    }
  }

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

  if (activeCategory) {
    unlockSticker(activeCategory);
  }
  if (pct === 100) {
    unlockSticker('perfect');
  }

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

  const stickerModal = document.getElementById('sticker-modal');
  if (stickerModal && stickerModal.classList.contains('show')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeStickerModal();
      return;
    }
  }

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
  initTheme();
  renderCategoryCards();
  updateStickerCounter();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
