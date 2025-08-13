// tests/storageService.test.js
import { StorageService } from '../services/storageService.js';

function fakeServices({ users = [], expenses = [] } = {}) {
  return {
    userService: { getAllUsers: () => users },
    expenseService: { getAllExpenses: () => expenses },
  };
}

describe('StorageService.exportData', () => {
  it('returns empty status when nothing to export', () => {
    const { userService, expenseService } = fakeServices();
    const svc = new StorageService(userService, expenseService);
    // spy to ensure no download happens
    svc.downloadFile = vi.fn();
    const res = svc.exportData();
    expect(res.status).toBe('empty');
    expect(svc.downloadFile).not.toHaveBeenCalled();
  });

  it('downloads when data exists', () => {
    const user = {
      id: 'u1',
      name: 'Magda',
      toJSON() {
        return { id: this.id, name: this.name };
      },
    };
    const exp = {
      id: 'e1',
      paidBy: 'Magda',
      amount: 10,
      description: '',
      timestamp: '2025-08-12T00:00:00.000Z',
      toJSON() {
        return {
          id: this.id,
          paidBy: this.paidBy,
          amount: this.amount,
          description: this.description,
          timestamp: this.timestamp,
        };
      },
    };
    const { userService, expenseService } = fakeServices({
      users: [user],
      expenses: [exp],
    });
    const svc = new StorageService(userService, expenseService);
    svc.downloadFile = vi.fn();
    const res = svc.exportData();
    expect(res.status).toBe('exported');
    expect(res.counts).toEqual({ users: 1, expenses: 1 });
    expect(svc.downloadFile).toHaveBeenCalledTimes(1);
  });
});
