// tests/expense.test.js
import User from '../models/user.js';

describe('User', () => {
  it('creates user with name and id', () => {
    const u = new User('Magda');
    expect(u.name).toBe('Magda');
    expect(typeof u.id).toBe('string');
  });

  it('toJSON returns stable shape', () => {
    const u = new User('Magda');
    const j = u.toJSON();
    expect(j).toEqual({
      id: u.id,
      name: 'Magda',
    });
  });
});
