// tests/userService.test.js
import User from '../models/user.js';
import { UserService } from '../services/userService.js';
describe('UserService', () => {
  it('adds a user and generates id', () => {
    const svc = new UserService();
    const u = svc.addUser('Magda');
    expect(u).toBeInstanceOf(User);
    expect(u.name).toBe('Magda');
    expect(typeof u.id).toBe('string');
  });

  it('rejects duplicates', () => {
    const svc = new UserService();
    svc.addUser('Magda');
    expect(() => svc.addUser('Magda')).toThrow(/already exists/i);
  });
});
