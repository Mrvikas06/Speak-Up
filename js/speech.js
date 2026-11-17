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

// Evaluate pronunciation accuracy and calculate 1-3 star score
function evaluatePronunciation(heard, currentItem) {
  if (!heard || !currentItem) {
    return { isMatch: false, stars: 0, scorePct: 0, feedback: "I didn't hear anything." };
  }

  const cleanHeard = cleanSpeechText(heard);
  const cleanTarget = cleanSpeechText(currentItem.word);
  if (!cleanHeard || !cleanTarget) {
    return { isMatch: false, stars: 0, scorePct: 0, feedback: 'Please speak louder.' };
  }

  // Strategy 1: Exact target match
  if (cleanHeard === cleanTarget) {
    return { isMatch: true, stars: 3, scorePct: 100, feedback: 'Flawless pronunciation!' };
  }

  const aliases = Array.isArray(currentItem.aliases) ? currentItem.aliases.map(cleanSpeechText) : [];
  if (aliases.includes(cleanHeard)) {
    return { isMatch: true, stars: 3, scorePct: 98, feedback: 'Excellent pronunciation!' };
  }

  const heardWords = cleanHeard.split(' ').filter(Boolean);
  if (heardWords.includes(cleanTarget)) {
    return { isMatch: true, stars: 3, scorePct: 95, feedback: 'Great job, clearly spoken!' };
  }

  for (const a of aliases) {
    if (heardWords.includes(a)) {
      return { isMatch: true, stars: 2, scorePct: 88, feedback: 'Very good! You got it!' };
    }
  }

  // Strategy 2: Multi-word phrase or token inclusion
  if (cleanHeard.includes(cleanTarget) || cleanTarget.includes(cleanHeard)) {
    if (cleanTarget.length > 1 || heardWords.includes(cleanTarget)) {
      return { isMatch: true, stars: 2, scorePct: 85, feedback: 'Nice effort! Well said!' };
    }
  }

  // Strategy 3: Close Levenshtein phonetic approximation
  if (cleanTarget.length >= 3) {
    for (const w of heardWords) {
      if (Math.abs(w.length - cleanTarget.length) <= 1 && levenshtein(w, cleanTarget) <= 1) {
        return { isMatch: true, stars: 2, scorePct: 80, feedback: 'Very close, great speaking!' };
      }
    }
    if (levenshtein(cleanHeard, cleanTarget) <= 1) {
      return { isMatch: true, stars: 2, scorePct: 80, feedback: 'Very close pronunciation!' };
    }
  }

  return { isMatch: false, stars: 1, scorePct: 40, feedback: `I heard "${cleanHeard}". Let's try again!` };
}

// Robust speech comparison strategy
function checkSpeechMatch(heard, currentItem) {
  return evaluatePronunciation(heard, currentItem).isMatch;
}

// Text-to-Speech (Audio Playback)
function speakWord(item, onStart, onEnd, isSlow = false) {
  if (!('speechSynthesis' in window)) return;
  const toSpeak = (item && (item.speak || item.word)) || '';
  if (!toSpeak) return;

  const utter = new SpeechSynthesisUtterance(toSpeak);
  utter.rate = isSlow ? 0.48 : 0.72;
  utter.pitch = isSlow ? 1.05 : 1.15;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(x => /Samantha|Karen|Moira|Veena|Google UK/.test(x.name)) || voices[0];
  if (preferredVoice) utter.voice = preferredVoice;

  if (onStart) utter.onstart = onStart;
  if (onEnd) utter.onend = onEnd;

  window.speechSynthesis.cancel();
  currentUtterance = utter;
  window.speechSynthesis.speak(utter);
}

function speakText(text, isSlow = false) {
  if (!('speechSynthesis' in window) || !text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = isSlow ? 0.5 : 0.75;
  utter.pitch = 1.1;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(x => /Samantha|Karen|Moira|Veena|Google UK/.test(x.name)) || voices[0];
  if (preferredVoice) utter.voice = preferredVoice;
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
    evaluatePronunciation,
    speakWord,
    speakText,
    cancelSpeechSynthesis
  };
}
