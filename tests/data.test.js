const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CATS, CATEGORY_META } = require('../js/data.js');

describe('Data Integrity & Curriculum Tests', () => {
  test('CATEGORY_META matches all CATS categories', () => {
    const catsKeys = Object.keys(CATS);
    const metaKeys = Object.keys(CATEGORY_META);
    assert.deepEqual(catsKeys.sort(), metaKeys.sort());

    metaKeys.forEach(key => {
      const meta = CATEGORY_META[key];
      assert.ok(meta.title, `meta for ${key} must have title`);
      assert.ok(meta.icon, `meta for ${key} must have icon`);
      assert.ok(meta.desc, `meta for ${key} must have desc`);
      assert.ok(meta.badge, `meta for ${key} must have badge`);
      assert.ok(['beginner', 'intermediate', 'advanced'].includes(meta.level), `meta level invalid for ${key}`);
    });
  });

  test('all categories contain non-empty arrays with full pedagogical properties', () => {
    Object.keys(CATS).forEach(cat => {
      const items = CATS[cat];
      assert.ok(items.length > 0, `category ${cat} should have items`);

      items.forEach(item => {
        assert.ok(item.word, `${cat} item must have word`);
        assert.ok(item.emoji, `${cat} item must have emoji`);
        assert.ok(item.hint, `${cat} item must have hint`);
        assert.ok(item.phonics, `${cat} item must have phonics: ${item.word}`);
        assert.ok(Array.isArray(item.syllables) && item.syllables.length > 0, `${cat} item must have syllables: ${item.word}`);
        assert.ok(item.sentence, `${cat} item must have example sentence: ${item.word}`);
      });
    });
  });

  test('alphabet has all 26 letters', () => {
    assert.equal(CATS.alphabet.length, 26);
    const letters = CATS.alphabet.map(i => i.word);
    const expected = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    assert.deepEqual(letters, expected);
  });

  test('numbers has 10 items (One to Ten)', () => {
    assert.equal(CATS.numbers.length, 10);
  });

  test('no duplicate words within any category', () => {
    Object.keys(CATS).forEach(cat => {
      const words = CATS[cat].map(i => i.word.toLowerCase());
      const unique = new Set(words);
      assert.equal(words.length, unique.size, `category ${cat} contains duplicates`);
    });
  });
});
