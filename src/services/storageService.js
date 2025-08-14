import { DOMHelpers } from '../ui/DOMHelpers';

export class StorageService {
  constructor(userService, expenseService) {
    this.userService = userService;
    this.expenseService = expenseService;
  }

  exportData() {
    const data = {
      users: this.userService.getAllUsers().map((user) => user?.toJSON()),
      expenses: this.expenseService.getAllExpenses().map((expense) => {
        return expense?.toJSON();
      }),
      exportDate: new Date().toISOString(),
    };
    const counts = { users: data.users.length, expenses: data.expenses.length };
    if (counts.users === 0 && counts.expenses === 0) {
      return { status: 'empty' };
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const fileName = `expenses_${new Date().toISOString().split('T')[0]}.json`;
    this.downloadFile(blob, fileName);
    return { status: 'exported', counts, fileName };
  }

  downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = DOMHelpers.createLink(url, fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importData(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          const users = Array.isArray(data.users) ? data.users : [];
          const expenses = Array.isArray(data.expenses) ? data.expenses : [];

          const userSummary = users.length
            ? this.userService.importUsers(users)
            : { valid: [], existing: [], invalid: [] };
          const expenseSummary = expenses.length
            ? this.expenseService.importExpenses(expenses)
            : { valid: [], existing: [], invalid: [] };

          resolve({
            userSummary,
            expenseSummary,
            counts: { users: users.length, expenses: expenses.length },
            raw: data,
          });
        } catch (error) {
          reject(new Error(`Failed to import data: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }
}
