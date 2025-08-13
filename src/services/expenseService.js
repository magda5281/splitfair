import Expense from '../models/expense';

export class ExpenseService {
  constructor(userService) {
    this.expenses = [];
    this.userService = userService;
  }

  addExpense(paidBy, amount, description = 'No description') {
    const trimmed = (paidBy ?? '').trim();
    if (!trimmed || typeof paidBy !== 'string') {
      throw new Error('Paid by must be a non empty string!');
    }
    if (!this.userService.hasUser(trimmed)) {
      throw new Error('User does not exist');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number!');
    }
    const expense = new Expense(paidBy, amount, description);

    this.expenses.push(expense);
    return expense;
  }

  getAllExpenses() {
    return [...this.expenses];
  }
  getExpenseByUser(userName) {
    return this.expenses.filter((expense) => expense.paidBy === userName);
  }
  hasExpense(id) {
    if (!id) return false;
    return (
      Array.isArray(this.expenses) && this.expenses.some((e) => e?.id === id)
    );
  }
  validateImportedExpenses(expenses) {
    const expensesValidated = {
      valid: [],
      invalid: [],
      existing: [],
    };
    const existingExpenses = new Map(
      (this.expenses ?? []).map((e) => [e.id, e])
    );

    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.trim();
      const amount = parseFloat(expense.amount.toFixed(2)) || 0;
      const description = expense?.description.trim() || 'No description';
      const id = expense.id.trim();

      const validPaidBy = typeof paidBy === 'string' && paidBy.length > 0;
      const expenseExists = existingExpenses.has(id.trim());
      const validAmount = typeof amount === 'number' && amount > 0;

      const userExists = this.userService.hasUser(
        (validPaidBy && paidBy) || ''
      );
      const validData = validPaidBy && validAmount;

      const validatedExpense = { paidBy, amount, description };

      if (validData) {
        if (!expenseExists) {
          if (userExists) {
            expensesValidated.valid.push(new Expense(validatedExpense));
          } else {
            this.userService.addUser(paidBy);
            expensesValidated.valid.push(new Expense(validatedExpense));
          }
        } else {
          expensesValidated.existing.push(expense);
        }
      } else {
        expensesValidated.invalid.push(expense);
      }
    });
    return expensesValidated;
  }
  importExpenses(expenseData) {
    if (!Array.isArray(expenseData)) {
      throw new Error('Expense data must be an array');
    }
    const validatedExpense = this.validateImportedExpenses(expenseData);

    this.expenses.push(...validatedExpense.valid);
    return validatedExpense;
  }
  simplifyExpenses() {
    // step 1: what each person should pay
    // Alice => 300
    // bob => 150
    // Charlie => 450
    // total => 900
    // Users => 3
    // share per person => 300
    //Step 2: figure out who owes money and who should receive money
    // Alice => 300 => balance = 0
    // bob => 150 => balance = 300 - 150 => 150
    // Charlie => 450 => balance = 300 - 450 = -150
    //Step 3 match people people who owe with people who should receive
    // bob owes 150 => Charlei should receive 150
    // Result: ['bob owes Charlie 150']

    const userCount = this.userService.getUserCount();
    if (userCount === 0) return [];

    const net = {};
    const userNames = this.userService.getAllUserNames();

    userNames.forEach((name) => {
      net[name] = 0;
    });

    this.expenses.forEach((expense) => {
      const share = expense.amount / userCount;
      userNames.forEach((name) => {
        if (name === expense.paidBy) {
          net[name] += expense.amount - share;
        } else {
          net[name] -= share;
        }
      });
    });

    return this.calculateSettlements(net);
  }

  calculateSettlements(net) {
    const results = [];
    //filtering out balanced people - balance = 0
    const names = Object.keys(net).filter((name) => Math.abs(net[name]) > 0.01);

    // sort names by balance -
    names.sort((a, b) => net[a] - net[b]);

    let i = 0;
    let j = names.length - 1;

    while (i < j) {
      const creditor = names[j];
      const debtor = names[i];

      const settlementAmount = Math.min(-net[debtor], net[creditor]);

      if (settlementAmount > 0.01) {
        net[debtor] += settlementAmount;
        net[creditor] -= settlementAmount;
        results.push(
          `${debtor} owes ${creditor} Gbp ${settlementAmount.toFixed(2)}`
        );
      }
      if (Math.abs(net[debtor]) < 0.01) i++;
      if (Math.abs(net[creditor]) < 0.01) j--;
    }

    return results;
  }

  clear() {
    this.expenses = [];
  }
}
