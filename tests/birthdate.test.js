import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeBirthDateValue,
  calculateAgeYears,
} from '../src/studentBirthDate.js';

test('normalizeBirthDateValue keeps a full ISO date', () => {
  assert.equal(normalizeBirthDateValue('2015-04-12'), '2015-04-12');
});

test('normalizeBirthDateValue converts a year-only value to a date', () => {
  assert.equal(normalizeBirthDateValue('2015'), '2015-01-01');
});

test('calculateAgeYears uses the full birth date and respects age boundaries', () => {
  const today = new Date('2026-10-20');
  assert.equal(calculateAgeYears('2010-11-30', today), 15);
  assert.equal(calculateAgeYears('2016-10-21', today), 9);
});
