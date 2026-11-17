/**
 * SpeakUp - Practice Data & Categories
 */
const CATS = {
  vowels: [
    { word: 'A', emoji: '🍎', hint: 'like Apple', speak: 'Ay', aliases: ['ay', 'a', 'eh'] },
    { word: 'E', emoji: '🐘', hint: 'like Elephant', speak: 'Ee', aliases: ['ee', 'e'] },
    { word: 'I', emoji: '🍦', hint: 'like Ice cream', speak: 'Eye', aliases: ['eye', 'i', 'aye'] },
    { word: 'O', emoji: '🍊', hint: 'like Orange', speak: 'Oh', aliases: ['oh', 'o', 'owe'] },
    { word: 'U', emoji: '☂️', hint: 'like Umbrella', speak: 'Ooh', aliases: ['you', 'u', 'oo', 'ooh', 'yu'] }
  ],
  words: [
    { word: 'Cat', emoji: '🐱', hint: 'a fluffy pet', aliases: ['kitty', 'kitten'] },
    { word: 'Dog', emoji: '🐶', hint: 'a loyal friend', aliases: ['puppy', 'doggy'] },
    { word: 'Ball', emoji: '⚽', hint: 'you can kick it' },
    { word: 'Sun', emoji: '☀️', hint: 'shines in the sky' },
    { word: 'Tree', emoji: '🌳', hint: 'grows in a park' },
    { word: 'Fish', emoji: '🐟', hint: 'lives in water' },
    { word: 'Bird', emoji: '🐦', hint: 'can fly high' },
    { word: 'Star', emoji: '⭐', hint: 'shines at night' },
    { word: 'Moon', emoji: '🌙', hint: 'in the night sky' },
    { word: 'Rain', emoji: '🌧️', hint: 'falls from clouds' }
  ],
  phrases: [
    { word: 'Hello', emoji: '👋', hint: 'a friendly greeting', aliases: ['hi', 'hey'] },
    { word: 'Thank you', emoji: '🙏', hint: 'show you are grateful', aliases: ['thanks', 'thank u'] },
    { word: 'Good morning', emoji: '🌅', hint: 'say at the start of the day', aliases: ['morning'] },
    { word: 'I love you', emoji: '❤️', hint: 'show you care', aliases: ['love you'] },
    { word: 'Please', emoji: '😊', hint: 'be kind and polite', aliases: ['plz'] },
    { word: 'Sorry', emoji: '🤗', hint: 'when you made a mistake', aliases: ['my bad'] }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATS };
}
