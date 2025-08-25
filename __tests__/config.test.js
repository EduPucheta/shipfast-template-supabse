import config from '../config.js';

// Get the pricing function from the Scale plan
const scalePlan = config.stripe.plans.find(plan => plan.name === 'Scale');
const calculatePrice = scalePlan.pricing;

describe('Pricing Calculator', () => {
  test('should calculate correct price for 1 user', () => {
    const result = calculatePrice(1);
    expect(result).toBe(29);
  });

  test('should calculate correct price for 5 users (tier 2)', () => {
    const result = calculatePrice(5);
    expect(result).toBe(5 * 24); // 120
  });

  test('should calculate correct price for 15 users (tier 3)', () => {
    const result = calculatePrice(15);
    expect(result).toBe(15 * 21); // 315
  });

  test('should calculate correct price for 25 users (tier 4)', () => {
    const result = calculatePrice(25);
    expect(result).toBe(25 * 17); // 425
  });

  test('should return 0 for quantities over 50', () => {
    const result = calculatePrice(100);
    expect(result).toBe(0);
  });
});
