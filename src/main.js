import { ExpenseUI } from './ui/expensesUI';
import { UserService } from './services/userService';
import { ExpenseService } from './services/expenseService';
import { StorageService } from './services/storageService';
class ExpenseApp {
  constructor() {
    this.userService = new UserService();
    this.expenseService = new ExpenseService(this.userService);
    this.storageService = new StorageService(
      this.userService,
      this.expenseService
    );
    this.ui = null;
  }
  init() {
    try {
      this.ui = new ExpenseUI(
        this.userService,
        this.expenseService,
        this.storageService
      );
      console.log('Splitter app initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}

let expenseApp;

document.addEventListener('DOMContentLoaded', () => {
  expenseApp = new ExpenseApp();
  expenseApp.init();
});

window.addEventListener('load', () => {
  if (!expenseApp) {
    expenseApp = new ExpenseApp();
    expenseApp.init();
  }
});
