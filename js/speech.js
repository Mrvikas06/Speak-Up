/**
 * SpeakUp - Speech Recognition & Speech Synthesis Services
 */

let speechRecog = null;
let isRecognizing = false;
let recognitionTimeout = null;
let currentUtterance = null;

// Normalize text for comparison
function cleanSpeechText(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance calculation
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Robust speech comparison strategy
function checkSpeechMatch(heard, currentItem) {
  if (!heard || !currentItem) return false;
  const cleanHeard = cleanSpeechText(heard);
  const cleanTarget = cleanSpeechText(currentItem.word);
  if (!cleanHeard || !cleanTarget) return false;

  const targets = [cleanTarget];
  if (Array.isArray(currentItem.aliases)) {
    currentItem.aliases.forEach(a => {
      const ca = cleanSpeechText(a);
      if (ca && !targets.includes(ca)) targets.push(ca);
    });
  }

  const heardWords = cleanHeard.split(' ').filter(Boolean);

  for (const tgt of targets) {
    // Strategy 1: Exact string match
    if (cleanHeard === tgt) return true;

    // Strategy 2: Exact word token match
    if (heardWords.includes(tgt)) return true;

    // Strategy 3: Multi-character substring inclusion
    if (cleanHeard.includes(tgt) || tgt.includes(cleanHeard)) {
      if (tgt.length > 1 || heardWords.includes(tgt)) {
        return true;
      }
    }

    // Strategy 4: Levenshtein distance tolerance for close approximations
    if (tgt.length >= 3) {
      for (const w of heardWords) {
        if (Math.abs(w.length - tgt.length) <= 1 && levenshtein(w, tgt) <= 1) {
          return true;
        }
      }
      if (levenshtein(cleanHeard, tgt) <= 1) {
        return true;
      }
    }
  }

  return false;
}

// Text-to-Speech (Audio Playback)
function speakWord(item, onStart, onEnd) {
  if (!('speechSynthesis' in window)) return;
  const toSpeak = (item && (item.speak || item.word)) || '';
  if (!toSpeak) return;

  const utter = new SpeechSynthesisUtterance(toSpeak);
  utter.rate = 0.72;
  utter.pitch = 1.15;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(x => /Samantha|Karen|Moira|Veena|Google UK/.test(x.name)) || voices[0];
  if (preferredVoice) utter.voice = preferredVoice;

  if (onStart) utter.onstart = onStart;
  if (onEnd) utter.onend = onEnd;

  window.speechSynthesis.cancel();
  currentUtterance = utter;
  window.speechSynthesis.speak(utter);
}

function cancelSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Export for Node test environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanSpeechText,
    levenshtein,
    checkSpeechMatch,
    speakWord,
    cancelSpeechSynthesis
  };
}
