const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { checkSpeechMatch, cleanSpeechText, evaluatePronunciation } = require('../js/speech.js');
const { CATS } = require('../js/data.js');

describe('Speech Matching Logic Tests', () => {
  test('cleanSpeechText normalizes input correctly', () => {
    assert.equal(cleanSpeechText(' Hello, World! '), 'hello world');
    assert.equal(cleanSpeechText('Cat...'), 'cat');
    assert.equal(cleanSpeechText('THANK YOU!!!'), 'thank you');
    assert.equal(cleanSpeechText(''), '');
  });

  test('matches exact words', () => {
    const catItem = CATS.words.find(w => w.word === 'Cat');
    assert.ok(checkSpeechMatch('cat', catItem));
    assert.ok(checkSpeechMatch('Cat', catItem));
    assert.ok(checkSpeechMatch('CAT', catItem));
  });

  test('matches with trailing punctuation and noise', () => {
    const sunItem = CATS.words.find(w => w.word === 'Sun');
    assert.ok(checkSpeechMatch('sun.', sunItem));
    assert.ok(checkSpeechMatch('the sun', sunItem));
    assert.ok(checkSpeechMatch('sun shines', sunItem));
  });

  test('matches aliases and phonetics for vowels', () => {
    const aItem = CATS.vowels.find(v => v.word === 'A');
    assert.ok(checkSpeechMatch('a', aItem));
    assert.ok(checkSpeechMatch('ay', aItem));
    assert.ok(checkSpeechMatch('eh', aItem));

    const uItem = CATS.vowels.find(v => v.word === 'U');
    assert.ok(checkSpeechMatch('you', uItem));
    assert.ok(checkSpeechMatch('u', uItem));
    assert.ok(checkSpeechMatch('oo', uItem));

    const iItem = CATS.vowels.find(v => v.word === 'I');
    assert.ok(checkSpeechMatch('eye', iItem));
    assert.ok(checkSpeechMatch('i', iItem));
  });

  test('matches phrase aliases', () => {
    const helloItem = CATS.phrases.find(p => p.word === 'Hello');
    assert.ok(checkSpeechMatch('hello', helloItem));
    assert.ok(checkSpeechMatch('hi', helloItem));
    assert.ok(checkSpeechMatch('hey', helloItem));

    const thankItem = CATS.phrases.find(p => p.word === 'Thank you');
    assert.ok(checkSpeechMatch('thank you', thankItem));
    assert.ok(checkSpeechMatch('thanks', thankItem));
  });

  test('matches close Levenshtein pronunciations', () => {
    const ballItem = CATS.words.find(w => w.word === 'Ball');
    assert.ok(checkSpeechMatch('boll', ballItem));

    const rainItem = CATS.words.find(w => w.word === 'Rain');
    assert.ok(checkSpeechMatch('rains', rainItem));
  });

  test('rejects incorrect words', () => {
    const catItem = CATS.words.find(w => w.word === 'Cat');
    assert.equal(checkSpeechMatch('dog', catItem), false);
    assert.equal(checkSpeechMatch('elephant', catItem), false);
    assert.equal(checkSpeechMatch('', catItem), false);
    assert.equal(checkSpeechMatch('banana', catItem), false);
  });

  test('evaluatePronunciation returns star rating and scoring percentage', () => {
    const catItem = CATS.words.find(w => w.word === 'Cat');
    const exactResult = evaluatePronunciation('cat', catItem);
    assert.equal(exactResult.isMatch, true);
    assert.equal(exactResult.stars, 3);
    assert.equal(exactResult.scorePct, 100);

    const closeResult = evaluatePronunciation('kitty', catItem);
    assert.equal(closeResult.isMatch, true);
    assert.ok(closeResult.stars >= 2);

    const failResult = evaluatePronunciation('dog', catItem);
    assert.equal(failResult.isMatch, false);
    assert.equal(failResult.stars, 1);
  });
});
