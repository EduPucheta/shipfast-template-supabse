import {describe, expect, test} from '@jest/globals';
import config from '../config.js';

// Get the annual pricing function from the Scale plan
const scalePlanAnnual = config.stripe.plans_annual.find(plan => plan.name === 'Scale');
const calculateAnnualPrice = scalePlanAnnual.pricing;

describe('Annual Pricing Calculator', () => {

  test('should calculate correct annual price for 1 user', () => {
    const result = calculateAnnualPrice(1);
    expect(result).toBe(29 * 10); // 290
  });

  test('should calculate correct annual price for 5 users (tier 2)', () => {
    const result = calculateAnnualPrice(5);
    expect(result).toBe(5 * 24 * 10); // 1200
  });

  test('should calculate correct annual price for 15 users (tier 3)', () => {
    const result = calculateAnnualPrice(15);
    expect(result).toBe(15 * 21 * 10); // 3150
  });

  test('should calculate correct annual price for 25 users (tier 4)', () => {
    const result = calculateAnnualPrice(25);
    expect(result).toBe(25 * 17 * 10); // 4250
  });

  test('should return 0 for annual quantities over 50', () => {
    const result = calculateAnnualPrice(100);
    expect(result).toBe(0);
  });
});
