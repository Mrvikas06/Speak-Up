const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CATS } = require('../js/data.js');

describe('Data Integrity Tests', () => {
  test('CATS object contains required categories', () => {
    assert.ok(CATS.vowels, 'vowels category must exist');
    assert.ok(CATS.words, 'words category must exist');
    assert.ok(CATS.phrases, 'phrases category must exist');
  });

  test('vowels category contains valid items', () => {
    assert.equal(CATS.vowels.length, 5, 'should have 5 vowels');
    const vowelWords = CATS.vowels.map(v => v.word);
    assert.deepEqual(vowelWords, ['A', 'E', 'I', 'O', 'U']);

    CATS.vowels.forEach(item => {
      assert.ok(item.word, 'item must have word');
      assert.ok(item.emoji, 'item must have emoji');
      assert.ok(item.hint, 'item must have hint');
      assert.ok(item.speak, 'vowel item must have speak pronunciation');
      assert.ok(Array.isArray(item.aliases), 'item should have aliases array');
    });
  });

  test('words category contains valid items', () => {
    assert.equal(CATS.words.length, 10, 'should have 10 words');
    CATS.words.forEach(item => {
      assert.ok(item.word, 'item must have word');
      assert.ok(item.emoji, 'item must have emoji');
      assert.ok(item.hint, 'item must have hint');
    });
  });

  test('phrases category contains valid items', () => {
    assert.equal(CATS.phrases.length, 6, 'should have 6 phrases');
    CATS.phrases.forEach(item => {
      assert.ok(item.word, 'item must have word');
      assert.ok(item.emoji, 'item must have emoji');
      assert.ok(item.hint, 'item must have hint');
    });
  });

  test('no duplicate words within categories', () => {
    Object.keys(CATS).forEach(cat => {
      const words = CATS[cat].map(i => i.word.toLowerCase());
      const unique = new Set(words);
      assert.equal(words.length, unique.size, `category ${cat} contains duplicates`);
    });
  });
});
