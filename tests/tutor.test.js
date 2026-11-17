const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  ARTICULATION_GUIDES,
  getArticulationGuide,
  diagnoseSpeechError,
  generateLessonSpeech
} = require('../js/tutor.js');

describe('AI Speech Tutor & Coaching Engine Tests', () => {
  test('getArticulationGuide retrieves known vowel guides', () => {
    const guideA = getArticulationGuide('A');
    assert.ok(guideA.mouth.includes('wide'));
    assert.ok(guideA.tip.includes('apple'));

    const guideO = getArticulationGuide('O');
    assert.ok(guideO.mouth.includes('O shape') || guideO.mouth.includes('Round'));
  });

  test('getArticulationGuide generates intelligent heuristics for vocabulary', () => {
    const guideLion = getArticulationGuide('Lion');
    assert.ok(guideLion.mouth.includes('tongue') || guideLion.mouth.includes('Tongue'));

    const guideCat = getArticulationGuide('Cat');
    assert.ok(guideCat.tip.includes('throat'));
  });

  test('diagnoses fronting error (k -> t)', () => {
    const diagnosis = diagnoseSpeechError('cat', 'tat');
    assert.equal(diagnosis.pattern, 'fronting');
    assert.ok(diagnosis.coaching.includes('throat'));
  });

  test('diagnoses gliding error (r -> w)', () => {
    const diagnosis = diagnoseSpeechError('rabbit', 'wabbit');
    assert.equal(diagnosis.pattern, 'gliding_r');
    assert.ok(diagnosis.coaching.includes('roof of your mouth') || diagnosis.coaching.includes('tongue'));
  });

  test('diagnoses stopping error (f -> p)', () => {
    const diagnosis = diagnoseSpeechError('fish', 'pish');
    assert.equal(diagnosis.pattern, 'stopping_f');
    assert.ok(diagnosis.coaching.includes('bottom lip'));
  });

  test('diagnoses th substitution (th -> f)', () => {
    const diagnosis = diagnoseSpeechError('thank you', 'fank you');
    assert.equal(diagnosis.pattern, 'th_to_f');
    assert.ok(diagnosis.coaching.includes('tongue'));
  });

  test('diagnoses cluster reduction', () => {
    const diagnosis = diagnoseSpeechError('star', 'tar');
    assert.equal(diagnosis.pattern, 'cluster_reduction');
    assert.ok(diagnosis.coaching.includes('Blend them together'));
  });

  test('diagnoses final consonant deletion', () => {
    const diagnosis = diagnoseSpeechError('cat', 'ca');
    assert.equal(diagnosis.pattern, 'final_consonant_deletion');
    assert.ok(diagnosis.coaching.includes('end sound'));
  });

  test('recognizes exact correct pronunciation', () => {
    const diagnosis = diagnoseSpeechError('dog', 'dog');
    assert.equal(diagnosis.pattern, 'correct');
    assert.ok(diagnosis.coaching.includes('Perfect') || diagnosis.coaching.includes('clearly'));
  });

  test('generates child-friendly lesson speech', () => {
    const lesson = generateLessonSpeech({ word: 'Cat' });
    assert.ok(lesson.includes('Cat'));
    assert.ok(lesson.includes('practice'));
  });
});
