const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { levenshtein } = require('../js/speech.js');

describe('Levenshtein Distance Tests', () => {
  test('returns 0 for identical strings', () => {
    assert.equal(levenshtein('cat', 'cat'), 0);
    assert.equal(levenshtein('', ''), 0);
    assert.equal(levenshtein('hello world', 'hello world'), 0);
  });

  test('returns correct distance for insertions and deletions', () => {
    assert.equal(levenshtein('cat', 'cats'), 1);
    assert.equal(levenshtein('cats', 'cat'), 1);
    assert.equal(levenshtein('', 'a'), 1);
    assert.equal(levenshtein('tree', 'tre'), 1);
  });

  test('returns correct distance for substitutions', () => {
    assert.equal(levenshtein('cat', 'bat'), 1);
    assert.equal(levenshtein('ball', 'bell'), 1);
    assert.equal(levenshtein('sun', 'run'), 1);
  });

  test('returns larger distance for distinct words', () => {
    assert.ok(levenshtein('dog', 'elephant') >= 6);
    assert.ok(levenshtein('cat', 'banana') >= 5);
  });
});
