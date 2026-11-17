/**
 * SpeakUp - Practice Curriculum & Learning Data
 */

const CATEGORY_META = {
  vowels: { title: 'Vowels', icon: '🔤', desc: 'A · E · I · O · U sounds', level: 'beginner', badge: '5 sounds' },
  alphabet: { title: 'Alphabet', icon: '🅰️', desc: 'Full A to Z phonics', level: 'beginner', badge: '26 letters' },
  numbers: { title: 'Numbers', icon: '🔢', desc: 'Counting from 1 to 10', level: 'beginner', badge: '10 numbers' },
  colors: { title: 'Colors', icon: '🎨', desc: 'Bright everyday colors', level: 'beginner', badge: '10 colors' },
  words: { title: 'Words', icon: '🐱', desc: 'Simple everyday words', level: 'intermediate', badge: '10 words' },
  animals: { title: 'Animals', icon: '🦁', desc: 'Friendly animal names', level: 'intermediate', badge: '10 animals' },
  actions: { title: 'Actions', icon: '🏃', desc: 'Fun verbs & movements', level: 'intermediate', badge: '10 actions' },
  phrases: { title: 'Phrases', icon: '💬', desc: 'Polite daily expressions', level: 'advanced', badge: '6 phrases' },
  twisters: { title: 'Twisters', icon: '🌀', desc: 'Fun pronunciation challenges', level: 'advanced', badge: '5 twisters' }
};

const CATS = {
  vowels: [
    { word: 'A', emoji: '🍎', hint: 'like Apple', speak: 'Ay', phonics: 'ay', syllables: ['A'], sentence: 'A is for sweet red apple.', aliases: ['ay', 'a', 'eh'] },
    { word: 'E', emoji: '🐘', hint: 'like Elephant', speak: 'Ee', phonics: 'ee', syllables: ['E'], sentence: 'E is for big elephant.', aliases: ['ee', 'e'] },
    { word: 'I', emoji: '🍦', hint: 'like Ice cream', speak: 'Eye', phonics: 'eye', syllables: ['I'], sentence: 'I is for cold ice cream.', aliases: ['eye', 'i', 'aye'] },
    { word: 'O', emoji: '🍊', hint: 'like Orange', speak: 'Oh', phonics: 'oh', syllables: ['O'], sentence: 'O is for round orange.', aliases: ['oh', 'o', 'owe'] },
    { word: 'U', emoji: '☂️', hint: 'like Umbrella', speak: 'Ooh', phonics: 'ooh', syllables: ['U'], sentence: 'U is for open umbrella.', aliases: ['you', 'u', 'oo', 'ooh', 'yu'] }
  ],
  alphabet: [
    { word: 'A', emoji: '🍎', hint: 'Apple', speak: 'Ay', phonics: 'ay', syllables: ['A'], sentence: 'An apple a day.', aliases: ['ay', 'a'] },
    { word: 'B', emoji: '🐻', hint: 'Bear', speak: 'Bee', phonics: 'buh', syllables: ['B'], sentence: 'Big brown bear.', aliases: ['bee', 'b'] },
    { word: 'C', emoji: '🐱', hint: 'Cat', speak: 'See', phonics: 'kuh', syllables: ['C'], sentence: 'Cute little cat.', aliases: ['see', 'c', 'sea'] },
    { word: 'D', emoji: '🐶', hint: 'Dog', speak: 'Dee', phonics: 'duh', syllables: ['D'], sentence: 'Happy puppy dog.', aliases: ['dee', 'd'] },
    { word: 'E', emoji: '🥚', hint: 'Egg', speak: 'Ee', phonics: 'eh', syllables: ['E'], sentence: 'An egg for breakfast.', aliases: ['ee', 'e'] },
    { word: 'F', emoji: '🦊', hint: 'Fox', speak: 'Eff', phonics: 'fuh', syllables: ['F'], sentence: 'Quick red fox.', aliases: ['eff', 'f'] },
    { word: 'G', emoji: '🍇', hint: 'Grapes', speak: 'Jee', phonics: 'guh', syllables: ['G'], sentence: 'Sweet purple grapes.', aliases: ['jee', 'g'] },
    { word: 'H', emoji: '🏠', hint: 'House', speak: 'Aitch', phonics: 'huh', syllables: ['H'], sentence: 'A cozy house.', aliases: ['aitch', 'h'] },
    { word: 'I', emoji: '🏝️', hint: 'Island', speak: 'Eye', phonics: 'eye', syllables: ['I'], sentence: 'Sunny warm island.', aliases: ['eye', 'i'] },
    { word: 'J', emoji: '🧃', hint: 'Juice', speak: 'Jay', phonics: 'juh', syllables: ['J'], sentence: 'Fresh fruit juice.', aliases: ['jay', 'j'] },
    { word: 'K', emoji: '🪁', hint: 'Kite', speak: 'Kay', phonics: 'kuh', syllables: ['K'], sentence: 'Fly a high kite.', aliases: ['kay', 'k'] },
    { word: 'L', emoji: '🦁', hint: 'Lion', speak: 'Ell', phonics: 'luh', syllables: ['L'], sentence: 'Brave golden lion.', aliases: ['ell', 'l'] },
    { word: 'M', emoji: '🐵', hint: 'Monkey', speak: 'Em', phonics: 'muh', syllables: ['M'], sentence: 'Playful cute monkey.', aliases: ['em', 'm'] },
    { word: 'N', emoji: '🪹', hint: 'Nest', speak: 'En', phonics: 'nuh', syllables: ['N'], sentence: 'Little bird nest.', aliases: ['en', 'n'] },
    { word: 'O', emoji: '🦉', hint: 'Owl', speak: 'Oh', phonics: 'oh', syllables: ['O'], sentence: 'Wise night owl.', aliases: ['oh', 'o'] },
    { word: 'P', emoji: '🐧', hint: 'Penguin', speak: 'Pee', phonics: 'puh', syllables: ['P'], sentence: 'Waddling cool penguin.', aliases: ['pee', 'p'] },
    { word: 'Q', emoji: '👑', hint: 'Queen', speak: 'Kyoo', phonics: 'kwuh', syllables: ['Q'], sentence: 'Kind royal queen.', aliases: ['cue', 'q', 'kyoo'] },
    { word: 'R', emoji: '🌈', hint: 'Rainbow', speak: 'Ar', phonics: 'ruh', syllables: ['R'], sentence: 'A colorful rainbow.', aliases: ['ar', 'r', 'are'] },
    { word: 'S', emoji: '☀️', hint: 'Sun', speak: 'Ess', phonics: 'suh', syllables: ['S'], sentence: 'Bright warm sun.', aliases: ['ess', 's'] },
    { word: 'T', emoji: '🐯', hint: 'Tiger', speak: 'Tee', phonics: 'tuh', syllables: ['T'], sentence: 'Strong striped tiger.', aliases: ['tee', 't', 'tea'] },
    { word: 'U', emoji: '🦄', hint: 'Unicorn', speak: 'Yoo', phonics: 'yoo', syllables: ['U'], sentence: 'Magical white unicorn.', aliases: ['you', 'u'] },
    { word: 'V', emoji: '🎻', hint: 'Violin', speak: 'Vee', phonics: 'vuh', syllables: ['V'], sentence: 'Sweet sounding violin.', aliases: ['vee', 'v'] },
    { word: 'W', emoji: '🌊', hint: 'Wave', speak: 'Double-yoo', phonics: 'wuh', syllables: ['W'], sentence: 'Big ocean wave.', aliases: ['w', 'double u'] },
    { word: 'X', emoji: '📦', hint: 'Box', speak: 'Ex', phonics: 'ks', syllables: ['X'], sentence: 'Letter X in a box.', aliases: ['ex', 'x'] },
    { word: 'Y', emoji: '⛵', hint: 'Yacht', speak: 'Why', phonics: 'yuh', syllables: ['Y'], sentence: 'Sailing fast yacht.', aliases: ['why', 'y'] },
    { word: 'Z', emoji: '🦓', hint: 'Zebra', speak: 'Zee', phonics: 'zuh', syllables: ['Z'], sentence: 'Striped zoo zebra.', aliases: ['zee', 'zed', 'z'] }
  ],
  numbers: [
    { word: 'One', emoji: '1️⃣', hint: 'number 1', speak: 'One', phonics: 'w-ʌ-n', syllables: ['One'], sentence: 'I see one smiling star.', aliases: ['1', 'won'] },
    { word: 'Two', emoji: '2️⃣', hint: 'number 2', speak: 'Two', phonics: 't-uː', syllables: ['Two'], sentence: 'I have two hands.', aliases: ['2', 'to', 'too'] },
    { word: 'Three', emoji: '3️⃣', hint: 'number 3', speak: 'Three', phonics: 'θ-r-iː', syllables: ['Three'], sentence: 'Three little birds.', aliases: ['3'] },
    { word: 'Four', emoji: '4️⃣', hint: 'number 4', speak: 'Four', phonics: 'f-ɔːr', syllables: ['Four'], sentence: 'A car has four wheels.', aliases: ['4', 'for'] },
    { word: 'Five', emoji: '5️⃣', hint: 'number 5', speak: 'Five', phonics: 'f-aɪ-v', syllables: ['Five'], sentence: 'High five with five fingers!', aliases: ['5'] },
    { word: 'Six', emoji: '6️⃣', hint: 'number 6', speak: 'Six', phonics: 's-ɪ-k-s', syllables: ['Six'], sentence: 'Six bright crayons.', aliases: ['6'] },
    { word: 'Seven', emoji: '7️⃣', hint: 'number 7', speak: 'Seven', phonics: 's-ɛ-v-ə-n', syllables: ['Sev', 'en'], sentence: 'Seven colors in the rainbow.', aliases: ['7'] },
    { word: 'Eight', emoji: '8️⃣', hint: 'number 8', speak: 'Eight', phonics: 'eɪ-t', syllables: ['Eight'], sentence: 'An octopus has eight arms.', aliases: ['8', 'ate'] },
    { word: 'Nine', emoji: '9️⃣', hint: 'number 9', speak: 'Nine', phonics: 'n-aɪ-n', syllables: ['Nine'], sentence: 'Nine shining marbles.', aliases: ['9'] },
    { word: 'Ten', emoji: '🔟', hint: 'number 10', speak: 'Ten', phonics: 't-ɛ-n', syllables: ['Ten'], sentence: 'Count ten little toes.', aliases: ['10'] }
  ],
  colors: [
    { word: 'Red', emoji: '🔴', hint: 'like a strawberry', phonics: 'r-ɛ-d', syllables: ['Red'], sentence: 'The apple is bright red.', aliases: ['rad'] },
    { word: 'Blue', emoji: '🔵', hint: 'like the clear sky', phonics: 'b-l-uː', syllables: ['Blue'], sentence: 'The ocean water is blue.', aliases: ['blew'] },
    { word: 'Green', emoji: '🟢', hint: 'like fresh grass', phonics: 'ɡ-r-iː-n', syllables: ['Green'], sentence: 'The frog is shiny green.' },
    { word: 'Yellow', emoji: '🟡', hint: 'like bright sunshine', phonics: 'j-ɛ-l-oʊ', syllables: ['Yel', 'low'], sentence: 'Bananas are sweet and yellow.' },
    { word: 'Orange', emoji: '🟠', hint: 'like juicy fruit', phonics: 'ɔː-r-ɪ-n-dʒ', syllables: ['Or', 'ange'], sentence: 'The pumpkin is bright orange.' },
    { word: 'Purple', emoji: '🟣', hint: 'like sweet grapes', phonics: 'p-ɜːr-p-əl', syllables: ['Pur', 'ple'], sentence: 'The flowers are lovely purple.' },
    { word: 'Pink', emoji: '🌸', hint: 'like cotton candy', phonics: 'p-ɪ-ŋ-k', syllables: ['Pink'], sentence: 'The flamingo is pretty pink.' },
    { word: 'Brown', emoji: '🟤', hint: 'like teddy bear fur', phonics: 'b-r-aʊ-n', syllables: ['Brown'], sentence: 'The acorn is smooth brown.' },
    { word: 'White', emoji: '⚪', hint: 'like winter snow', phonics: 'w-aɪ-t', syllables: ['White'], sentence: 'The fluffy clouds are white.' },
    { word: 'Black', emoji: '⚫', hint: 'like the dark night', phonics: 'b-l-æ-k', syllables: ['Black'], sentence: 'The night sky is black.' }
  ],
  words: [
    { word: 'Cat', emoji: '🐱', hint: 'a fluffy pet', phonics: 'k-æ-t', syllables: ['Cat'], sentence: 'The cat likes warm milk.', aliases: ['kitty', 'kitten'] },
    { word: 'Dog', emoji: '🐶', hint: 'a loyal friend', phonics: 'd-ɔː-ɡ', syllables: ['Dog'], sentence: 'The dog wags its tail happily.', aliases: ['puppy', 'doggy'] },
    { word: 'Ball', emoji: '⚽', hint: 'you can kick it', phonics: 'b-ɔː-l', syllables: ['Ball'], sentence: 'We bounce the colorful ball.' },
    { word: 'Sun', emoji: '☀️', hint: 'shines in the sky', phonics: 's-ʌ-n', syllables: ['Sun'], sentence: 'The warm sun shines all day.', aliases: ['son'] },
    { word: 'Tree', emoji: '🌳', hint: 'grows in a park', phonics: 't-r-iː', syllables: ['Tree'], sentence: 'Birds build nests in the tall tree.' },
    { word: 'Fish', emoji: '🐟', hint: 'lives in water', phonics: 'f-ɪ-ʃ', syllables: ['Fish'], sentence: 'The fish swims in the clear pond.' },
    { word: 'Bird', emoji: '🐦', hint: 'can fly high', phonics: 'b-ɜːr-d', syllables: ['Bird'], sentence: 'The blue bird sings a sweet song.' },
    { word: 'Star', emoji: '⭐', hint: 'shines at night', phonics: 's-t-ɑːr', syllables: ['Star'], sentence: 'Twinkle twinkle little star.' },
    { word: 'Moon', emoji: '🌙', hint: 'in the night sky', phonics: 'm-uː-n', syllables: ['Moon'], sentence: 'The full moon lights up the night.' },
    { word: 'Rain', emoji: '🌧️', hint: 'falls from clouds', phonics: 'r-eɪ-n', syllables: ['Rain'], sentence: 'Cool rain waters the garden flowers.', aliases: ['reign', 'rein'] }
  ],
  animals: [
    { word: 'Lion', emoji: '🦁', hint: 'king of the jungle', phonics: 'l-aɪ-ə-n', syllables: ['Li', 'on'], sentence: 'The proud lion roars loudly.' },
    { word: 'Elephant', emoji: '🐘', hint: 'has a long trunk', phonics: 'ɛ-l-ə-f-ə-n-t', syllables: ['El', 'e', 'phant'], sentence: 'The elephant drinks with its trunk.' },
    { word: 'Monkey', emoji: '🐵', hint: 'loves climbing trees', phonics: 'm-ʌ-ŋ-k-i', syllables: ['Mon', 'key'], sentence: 'The monkey swings from tree to tree.' },
    { word: 'Tiger', emoji: '🐯', hint: 'has orange stripes', phonics: 't-aɪ-ɡ-ər', syllables: ['Ti', 'ger'], sentence: 'The striped tiger walks quietly.' },
    { word: 'Giraffe', emoji: '🦒', hint: 'tallest animal', phonics: 'dʒ-ə-r-æ-f', syllables: ['Gi', 'raffe'], sentence: 'The tall giraffe eats high leaves.' },
    { word: 'Zebra', emoji: '🦓', hint: 'black and white stripes', phonics: 'z-iː-b-r-ə', syllables: ['Ze', 'bra'], sentence: 'The zebra runs across the plains.' },
    { word: 'Duck', emoji: '🦆', hint: 'says quack quack', phonics: 'd-ʌ-k', syllables: ['Duck'], sentence: 'The duck splashes in the water.' },
    { word: 'Frog', emoji: '🐸', hint: 'can jump very high', phonics: 'f-r-ɔː-ɡ', syllables: ['Frog'], sentence: 'The green frog hops on a lily pad.' },
    { word: 'Rabbit', emoji: '🐰', hint: 'has long soft ears', phonics: 'r-æ-b-ɪ-t', syllables: ['Rab', 'bit'], sentence: 'The bunny rabbit munches a carrot.', aliases: ['bunny'] },
    { word: 'Dolphin', emoji: '🐬', hint: 'smart sea jumper', phonics: 'd-ɔː-l-f-ɪ-n', syllables: ['Dol', 'phin'], sentence: 'The friendly dolphin leaps in waves.' }
  ],
  actions: [
    { word: 'Jump', emoji: '🦘', hint: 'bounce up high', phonics: 'dʒ-ʌ-m-p', syllables: ['Jump'], sentence: 'Jump up into the air!' },
    { word: 'Run', emoji: '🏃', hint: 'move your feet fast', phonics: 'r-ʌ-n', syllables: ['Run'], sentence: 'Run fast across the playground.' },
    { word: 'Sing', emoji: '🎤', hint: 'make musical sounds', phonics: 's-ɪ-ŋ', syllables: ['Sing'], sentence: 'Sing a happy little melody.' },
    { word: 'Dance', emoji: '💃', hint: 'move to the beat', phonics: 'd-æ-n-s', syllables: ['Dance'], sentence: 'Dance and spin to the music.' },
    { word: 'Read', emoji: '📖', hint: 'look at book words', phonics: 'r-iː-d', syllables: ['Read'], sentence: 'Read an exciting story together.' },
    { word: 'Eat', emoji: '🍎', hint: 'enjoy healthy food', phonics: 'iː-t', syllables: ['Eat'], sentence: 'Eat your crunchy vegetables.' },
    { word: 'Drink', emoji: '🥛', hint: 'sip cold water', phonics: 'd-r-ɪ-ŋ-k', syllables: ['Drink'], sentence: 'Drink a glass of cold water.' },
    { word: 'Sleep', emoji: '😴', hint: 'rest your eyes at night', phonics: 's-l-iː-p', syllables: ['Sleep'], sentence: 'Sleep well and have sweet dreams.' },
    { word: 'Smile', emoji: '😊', hint: 'show a happy face', phonics: 's-m-aɪ-l', syllables: ['Smile'], sentence: 'Smile and share your happiness.' },
    { word: 'Play', emoji: '🧸', hint: 'have fun with friends', phonics: 'p-l-eɪ', syllables: ['Play'], sentence: 'Play nicely with your toys.' }
  ],
  phrases: [
    { word: 'Hello', emoji: '👋', hint: 'a friendly greeting', phonics: 'h-ə-l-oʊ', syllables: ['Hel', 'lo'], sentence: 'Hello, how are you today?', aliases: ['hi', 'hey'] },
    { word: 'Thank you', emoji: '🙏', hint: 'show you are grateful', phonics: 'θ-æ-ŋ-k j-uː', syllables: ['Thank', 'you'], sentence: 'Thank you for helping me.', aliases: ['thanks', 'thank u'] },
    { word: 'Good morning', emoji: '🌅', hint: 'say at the start of the day', phonics: 'ɡ-ʊ-d m-ɔːr-n-ɪ-ŋ', syllables: ['Good', 'morn', 'ing'], sentence: 'Good morning, have a great day!', aliases: ['morning'] },
    { word: 'I love you', emoji: '❤️', hint: 'show you care', phonics: 'aɪ l-ʌ-v j-uː', syllables: ['I', 'love', 'you'], sentence: 'I love you with all my heart.', aliases: ['love you'] },
    { word: 'Please', emoji: '😊', hint: 'be kind and polite', phonics: 'p-l-iː-z', syllables: ['Please'], sentence: 'Please may I have some fruit?', aliases: ['plz'] },
    { word: 'Sorry', emoji: '🤗', hint: 'when you made a mistake', phonics: 's-ɔː-r-i', syllables: ['Sor', 'ry'], sentence: 'I am sorry for the mistake.', aliases: ['my bad'] }
  ],
  twisters: [
    { word: 'Red lorry yellow lorry', emoji: '🚛', hint: 'say it fast and crisp', phonics: 'red loh-ree yel-oh loh-ree', syllables: ['Red', 'lor', 'ry', 'yel', 'low', 'lor', 'ry'], sentence: 'Red lorry, yellow lorry, rolling along.', aliases: ['red lorry yellow lorry'] },
    { word: 'She sells seashells', emoji: '🐚', hint: 'sh and s sounds', phonics: 'shee selz see-shelz', syllables: ['She', 'sells', 'sea', 'shells'], sentence: 'She sells seashells on the warm seashore.', aliases: ['she sells sea shells'] },
    { word: 'Blue big bubble', emoji: '🫧', hint: 'b sound practice', phonics: 'bloo big buh-buhl', syllables: ['Blue', 'big', 'bub', 'ble'], sentence: 'A blue big bubble floated up high.', aliases: ['big blue bubble'] },
    { word: 'Quick purple puppy', emoji: '🐶', hint: 'p and k sound practice', phonics: 'kwik pur-puhl puh-pee', syllables: ['Quick', 'pur', 'ple', 'pup', 'py'], sentence: 'A quick purple puppy plays outside.', aliases: ['quick purple puppy'] },
    { word: 'Bright starry sky', emoji: '✨', hint: 'st and r sound practice', phonics: 'bryte stahr-ee skye', syllables: ['Bright', 'star', 'ry', 'sky'], sentence: 'Look at the bright starry sky tonight.', aliases: ['bright starry sky'] }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATS, CATEGORY_META };
}
