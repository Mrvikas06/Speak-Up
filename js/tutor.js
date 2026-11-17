/**
 * SpeakUp - AI Speech Tutor & Pedagogical Coach Engine
 * Provides speech therapy heuristics, phonological error diagnosis,
 * mouth positioning guides, and interactive vocal coaching for kids.
 */

// Phonological error mapping and speech therapy coaching rules
const PHONOLOGICAL_PATTERNS = [
  {
    name: 'fronting',
    pattern: /[ck]/g,
    substitution: 't',
    advice: "You used the tip of your tongue! Try pushing air from the back of your throat like a gentle cough: 'k-k-k'!"
  },
  {
    name: 'fronting_g',
    pattern: /g/g,
    substitution: 'd',
    advice: "Make the sound deep in your throat with the back of your tongue: 'g-g-g'!"
  },
  {
    name: 'gliding_r',
    pattern: /r/g,
    substitution: 'w',
    advice: "Curl the tip of your tongue up toward the roof of your mouth without rounding your lips into a 'w'!"
  },
  {
    name: 'gliding_l',
    pattern: /l/g,
    substitution: 'w',
    advice: "Tap the tip of your tongue behind your top front teeth: 'l-l-l'!"
  },
  {
    name: 'stopping_f',
    pattern: /f/g,
    substitution: 'p',
    advice: "Rest your top teeth gently on your bottom lip and blow air out smoothly: 'fff'!"
  },
  {
    name: 'stopping_s',
    pattern: /s/g,
    substitution: 't',
    advice: "Keep the air flowing through your teeth like a hissing snake: 'sss', don't stop the air!"
  },
  {
    name: 'th_to_f',
    pattern: /th/g,
    substitution: 'f',
    advice: "Peek the very tip of your tongue out between your front teeth and blow gently: 'th-th'!"
  },
  {
    name: 'th_to_s',
    pattern: /th/g,
    substitution: 's',
    advice: "Place your tongue between your teeth, not behind them, for a soft 'th' sound!"
  }
];

// Articulatory mouth position and phonics tips
const ARTICULATION_GUIDES = {
  // Vowels
  'A': {
    mouth: 'Open mouth wide',
    tip: 'Drop your jaw and open wide like taking a big bite of an apple: "Ayy"!',
    sound: 'ay',
    gesture: 'Open hand wide'
  },
  'E': {
    mouth: 'Wide smile shape',
    tip: 'Smile wide showing your teeth and say: "Eee" like a happy dolphin!',
    sound: 'ee',
    gesture: 'Point to a big smile'
  },
  'I': {
    mouth: 'Jaw drops then rises',
    tip: 'Start with your mouth open and say "Eye" as your chin comes up!',
    sound: 'eye',
    gesture: 'Point near your eye'
  },
  'O': {
    mouth: 'Round lips into an O shape',
    tip: 'Make your lips into a round circle like a bubble: "Ohh"!',
    sound: 'oh',
    gesture: 'Make circle with fingers'
  },
  'U': {
    mouth: 'Pucker lips forward',
    tip: 'Push your lips forward like blowing a gentle whistle: "Ooh"!',
    sound: 'ooh',
    gesture: 'Point two lips forward'
  },

  // Common vocabulary items
  'Cat': {
    mouth: 'Back of throat -> wide mouth -> tap tongue',
    tip: 'Start with a crisp "K" in your throat, open wide for "ah", and tap your tongue for "T"!',
    sound: 'k - æ - t',
    gesture: 'Tap throat then teeth'
  },
  'Dog': {
    mouth: 'Tap tongue behind top teeth -> drop jaw -> back of throat',
    tip: 'Tap your tongue for "D", round open mouth for "ah", and finish in your throat with "G"!',
    sound: 'd - ɔː - g',
    gesture: 'Tap roof of mouth'
  },
  'Fish': {
    mouth: 'Top teeth on bottom lip -> blow air -> quiet "sh"',
    tip: 'Bite your bottom lip gently for "Fff", then make quiet shushing lips: "shhh"!',
    sound: 'f - ɪ - ʃ',
    gesture: 'Finger on lips for sh'
  },
  'Sun': {
    mouth: 'Teeth together -> smile -> blow air',
    tip: 'Keep your teeth close together and hiss air through them like a snake: "Sss-un"!',
    sound: 's - ʌ - n',
    gesture: 'Snake hand motion'
  },
  'Tree': {
    mouth: 'Tongue taps top teeth -> slide into curled tongue',
    tip: 'Blend "T" and "R" together smoothly without pausing: "Trr-ee"!',
    sound: 't - r - iː',
    gesture: 'Curl tongue upward'
  },
  'Star': {
    mouth: 'Hiss air -> tap tongue -> open mouth',
    tip: 'Start with the snake sound "Sss", then pop the "T" immediately: "S-t-ar"!',
    sound: 's - t - ɑːr',
    gesture: 'Slide fingers smoothly'
  },
  'Thank you': {
    mouth: 'Tongue tip between teeth -> blow gently',
    tip: 'Peek your tongue tip out between your teeth and blow soft air for "Th-ank you"!',
    sound: 'θ - æ - ŋ - k',
    gesture: 'Gently touch chin'
  },
  'Hello': {
    mouth: 'Breathe out warm air -> tongue taps roof',
    tip: 'Breathe out warm air from your chest for "Hhh", then lift tongue for "ll-o"!',
    sound: 'h - ə - l - oʊ',
    gesture: 'Hand near mouth breathing warm air'
  }
};

// Default generic articulation fallback
function getArticulationGuide(word) {
  if (!word) {
    return {
      mouth: 'Natural relaxed mouth',
      tip: 'Listen carefully, pronounce each sound clearly, and speak with confidence!',
      sound: word || '',
      gesture: 'Smile and speak clearly'
    };
  }

  const clean = word.trim();
  if (ARTICULATION_GUIDES[clean]) {
    return ARTICULATION_GUIDES[clean];
  }

  // Generate intelligent phoneme guidance based on starting sound
  const firstChar = clean.charAt(0).toUpperCase();
  if (ARTICULATION_GUIDES[firstChar]) {
    return ARTICULATION_GUIDES[firstChar];
  }

  const initialGuides = {
    'B': { mouth: 'Both lips press together', tip: 'Press your lips together and pop air out: "Buh"!' },
    'P': { mouth: 'Both lips press together', tip: 'Hold your breath behind your lips, then pop: "Puh"!' },
    'M': { mouth: 'Both lips closed', tip: 'Keep lips closed and hum through your nose: "Mmm"!' },
    'W': { mouth: 'Round lips into a circle', tip: 'Pucker your lips like an O shape: "Wuh"!' },
    'L': { mouth: 'Tongue taps behind top teeth', tip: 'Lift your tongue tip straight up to the roof of your mouth: "Lll"!' },
    'R': { mouth: 'Curl tongue back', tip: 'Pull your tongue back slightly like a spoon: "Rrr"!' },
    'S': { mouth: 'Teeth close together', tip: 'Blow steady air through your front teeth like a snake: "Sss"!' },
    'T': { mouth: 'Tongue taps roof of mouth', tip: 'Tap your tongue quickly behind your front teeth: "T-t-t"!' },
    'D': { mouth: 'Tongue taps roof of mouth', tip: 'Tap and use your voice to pop air: "D-d-d"!' },
    'F': { mouth: 'Top teeth on lower lip', tip: 'Rest top teeth on bottom lip and blow air: "Fff"!' }
  };

  const generic = initialGuides[firstChar] || {
    mouth: 'Clear open lips',
    tip: `Start with a crisp sound for the letter "${firstChar}", then blend each syllable smoothly!`
  };

  return {
    mouth: generic.mouth,
    tip: generic.tip,
    sound: clean.toLowerCase(),
    gesture: 'Speak clearly and smile'
  };
}

// Diagnose why spoken audio differed from target word
function diagnoseSpeechError(targetWord, heardText) {
  if (!targetWord || !heardText) {
    return {
      pattern: 'no_speech',
      diagnosis: 'No speech was detected.',
      coaching: 'Make sure your microphone is close, take a breath, and speak out loud and clear!'
    };
  }

  const target = targetWord.toLowerCase().trim();
  const heard = heardText.toLowerCase().trim();

  if (target === heard) {
    return {
      pattern: 'correct',
      diagnosis: 'Perfect pronunciation!',
      coaching: 'Outstanding! You pronounced every sound clearly!'
    };
  }

  // Check phonological processes
  for (const rule of PHONOLOGICAL_PATTERNS) {
    if (target.match(rule.pattern)) {
      const simulatedSub = target.replace(rule.pattern, rule.substitution);
      if (heard === simulatedSub || heard.includes(simulatedSub)) {
        return {
          pattern: rule.name,
          diagnosis: `Speech pattern detected: substituted "${rule.substitution}" sound.`,
          coaching: rule.advice
        };
      }
    }
  }

  // Check cluster reduction (e.g. "star" -> "tar" or "tree" -> "tee")
  if (target.length >= 4 && target.match(/^[s|t|b|c|p|f][r|l|t|p|k]/)) {
    const singleConsonant = target.charAt(1) + target.slice(2);
    if (heard === singleConsonant || heard.startsWith(target.slice(1, 3))) {
      return {
        pattern: 'cluster_reduction',
        diagnosis: 'Blended consonant cluster was shortened.',
        coaching: `Remember to pronounce both sounds at the beginning! Blend them together smoothly: "${target.slice(0, 2)}"!`
      };
    }
  }

  // Check final consonant deletion (e.g. "cat" -> "ca", "dog" -> "do")
  if (target.length >= 3 && heard.length < target.length && target.startsWith(heard)) {
    const missingEnd = target.slice(heard.length);
    return {
      pattern: 'final_consonant_deletion',
      diagnosis: `End consonant "${missingEnd}" was omitted.`,
      coaching: `You started great! Don't forget to finish the word with the crisp end sound: "${missingEnd}"!`
    };
  }

  // General closeness / vowel variation advice
  const guide = getArticulationGuide(targetWord);
  return {
    pattern: 'general_variation',
    diagnosis: `Heard "${heardText}" instead of "${targetWord}".`,
    coaching: `${guide.tip} Let's try saying it together!`
  };
}

// Generate an interactive pedagogical lesson prompt for speech synthesis
function generateLessonSpeech(item) {
  if (!item || !item.word) return '';
  const word = item.word;
  const guide = getArticulationGuide(word);

  return `Let's practice the word "${word}". ${guide.mouth}. ${guide.tip}. Now listen carefully, then say "${word}"!`;
}

// Export for Node.js test environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ARTICULATION_GUIDES,
    PHONOLOGICAL_PATTERNS,
    getArticulationGuide,
    diagnoseSpeechError,
    generateLessonSpeech
  };
}
