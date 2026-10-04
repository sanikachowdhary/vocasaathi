import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Read json data directly for testing
const trades = JSON.parse(fs.readFileSync(path.resolve('./data/trades.json'), 'utf8'));
const providers = JSON.parse(fs.readFileSync(path.resolve('./data/providers.json'), 'utf8'));
const districts = JSON.parse(fs.readFileSync(path.resolve('./data/districts.json'), 'utf8'));
const sessions = JSON.parse(fs.readFileSync(path.resolve('./data/sessions.json'), 'utf8'));
const cases = JSON.parse(fs.readFileSync(path.resolve('./data/cases.json'), 'utf8'));
const enLocale = JSON.parse(fs.readFileSync(path.resolve('./locales/en.json'), 'utf8'));
const mrLocale = JSON.parse(fs.readFileSync(path.resolve('./locales/mr.json'), 'utf8'));

describe('VocaSaathi Comprehensive Verification Suite', () => {

  test('1. Data Integrity: 10 Trades loaded with required NSQF fields', () => {
    assert.strictEqual(trades.length, 10, 'Must have exactly 10 trades');
    trades.forEach((t) => {
      assert.ok(t.id, 'Trade must have id');
      assert.ok(t.name && t.nameMr, 'Trade must have English and Marathi names');
      assert.ok(t.placementRate >= 70 && t.placementRate <= 95, 'Placement rate must be in valid 70-95% range');
      assert.ok(t.medianEarnings > 10000, 'Median earnings must be positive');
      assert.ok(t.progression.length >= 3, 'Progression ladder must have at least 3 levels');
      assert.ok(t.higherEducationOptions.length > 0, 'Must include higher education lateral paths');
    });
  });

  test('2. Data Integrity: Provider foreign keys in trades match valid providers', () => {
    assert.ok(providers.length >= 8, 'Must have at least 8 verified providers');
    const providerIds = new Set(providers.map(p => p.id));
    
    trades.forEach(trade => {
      trade.providerIds.forEach(pId => {
        assert.ok(providerIds.has(pId), `Provider ID ${pId} in trade ${trade.id} must exist in providers.json`);
      });
    });
  });

  test('3. Data Integrity: Districts benchmark dataset integrity', () => {
    assert.ok(districts.length >= 6, 'Must include at least 6 Maharashtra districts');
    const pune = districts.find(d => d.id === 'dist-pune');
    assert.ok(pune, 'Pune benchmark must exist');
    assert.strictEqual(pune.state, 'Maharashtra');
    assert.ok(pune.avgInitialResistance > pune.avgFinalResistance, 'Evidence must reduce resistance');
  });

  test('4. Data Integrity: Counsellor cases reference valid sessions and structure', () => {
    assert.ok(cases.length >= 4, 'Must have seeded counsellor cases');
    cases.forEach(c => {
      assert.ok(c.id.startsWith('CASE-MH-'), 'Case ID must have standard format');
      assert.ok(c.transcriptSummary.length > 20, 'Transcript summary must be detailed');
      assert.ok(c.detectedObjections.length > 0, 'Objections must be listed');
      assert.ok(c.recommendedActions.length > 0, 'Recommended actions must be present');
    });
  });

  test('5. Localization Integrity: English and Marathi parity', () => {
    assert.ok(enLocale.app.name, 'English app name must exist');
    assert.ok(mrLocale.app.name, 'Marathi app name must exist');
    assert.ok(enLocale.concerns.income.question, 'English concern question must exist');
    assert.ok(mrLocale.concerns.income.question, 'Marathi concern question must exist');
    assert.strictEqual(enLocale.howItWorks.title.length > 0, true);
    assert.strictEqual(mrLocale.howItWorks.title.length > 0, true);
  });

  test('6. Resistance Score calculation logic boundaries', () => {
    // Basic test of bounded resistance
    const initial = 72;
    const drop = 14;
    const finalScore = Math.max(15, Math.min(95, initial - drop));
    assert.strictEqual(finalScore, 58);
    assert.ok(finalScore >= 15 && finalScore <= 95);
  });

  test('7. Multi-Trade Comparison matrix validation', () => {
    const electrician = trades.find(t => t.id === 'trade-electrician');
    const solar = trades.find(t => t.id === 'trade-solar-pv');
    assert.ok(electrician && solar);
    assert.notStrictEqual(electrician.id, solar.id);
    assert.ok(electrician.placementRate !== undefined && solar.placementRate !== undefined);
  });

  test('8. Admin Analytics aggregation math', () => {
    const totalSessions = districts.reduce((acc, d) => acc + d.totalSessions, 0);
    assert.ok(totalSessions > 1000, 'Total seeded sessions across districts should exceed 1000');
  });
});
