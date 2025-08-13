// tests/expense.test.js
import Expense from '../models/expense.js';

describe('Expense', () => {
  it('creates expense and normalises amount', () => {
    const e = new Expense('Magda', 12.345, 'Lunch');
    expect(e.amount).toBe(12.35);
    expect(e.paidBy).toBe('Magda');
    expect(typeof e.id).toBe('string');
  });

  it('toJSON returns stable shape', () => {
    const e = new Expense('Magda', 10, 'Coffee');
    const j = e.toJSON();
    expect(j).toEqual({
      id: e.id,
      paidBy: 'Magda',
      amount: 10,
      description: 'Coffee',
      timestamp: e.timestamp,
    });
  });
});
