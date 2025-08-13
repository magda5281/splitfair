//initialize all he UI elements

import { DOMHelpers } from '../ui/DOMHelpers';
import { showToast } from '../utils/toastUtil';

export class ExpenseUI {
  constructor(userService, expenseService, storageService) {
    this.userService = userService;
    this.expenseService = expenseService;
    this.storageService = storageService;
    this.initializeElements();
    this.bindEvents();
    this.initializeSelectBox();
  }

  initializeElements() {
    this.elements = {
      addUserForm: DOMHelpers.getElementById('addUserForm'),
      userInput: DOMHelpers.getElementById('userInput'),
      addExpenseForm: DOMHelpers.getElementById('addExpenseForm'),
      expenseUserInput: DOMHelpers.getElementById('expenseUserInput'),
      expenseAmountInput: DOMHelpers.getElementById('expenseAmountInput'),
      expenseReasonInput: DOMHelpers.getElementById('expenseReasonInput'),
      paymentList: DOMHelpers.getElementById('payment-list'),
      simplifyBtn: DOMHelpers.getElementById('simplifyBtn'),
      resultArea: DOMHelpers.getElementById('resultArea'),
      exportBtn: DOMHelpers.getElementById('exportBtn'),
      importBtn: DOMHelpers.getElementById('importBtn'),
      fileInput: DOMHelpers.getElementById('fileInput'),
    };
  }
  // bind the events

  bindEvents() {
    this.elements.addUserForm.addEventListener('submit', (e) => {
      this.handleAddUser(e);
    });
    this.elements.addExpenseForm.addEventListener('submit', (e) => {
      this.handleAddExpense(e);
    });
    this.elements.simplifyBtn.addEventListener('click', () => {
      this.handleSimplify();
    });
    this.elements.exportBtn.addEventListener('click', () => {
      this.handleExport();
    });
    this.elements.importBtn.addEventListener('click', () => {
      this.elements.fileInput.click();
    });
    this.elements.fileInput.addEventListener('change', (event) => {
      this.handleImport(event);
    });
  }
  handleAddUser(e) {
    e.preventDefault();
    try {
      // get the user name provided by user
      const userName = this.elements.userInput.value.trim();
      //check if the user name is given

      if (!userName) {
        throw new Error('If you do have a name than you must enter it!');
      }
      // use the user service to add user

      const user = this.userService.addUser(userName);
      //add user to the expense select box
      this.addUserToSelectBox(user.name);
      // reset the form
      this.elements.addUserForm.reset();
      showToast(`User ${user.name} added`);
    } catch (error) {
      console.error('Error adding user ', error);
      showToast(`Error adding user: ${error.message}`, 'error');
    }
  }
  initializeSelectBox() {
    const defaultOption = DOMHelpers.createOption('Select User', '');
    this.elements.expenseUserInput.add(defaultOption);
  }

  addUserToSelectBox(userName) {
    const option = DOMHelpers.createOption(userName, userName);
    this.elements.expenseUserInput.add(option);
  }

  handleAddExpense(e) {
    e.preventDefault();
    try {
      const paidBy = this.elements.expenseUserInput.value.trim();
      const amount = this.elements.expenseAmountInput.valueAsNumber;
      const description = this.elements.expenseReasonInput.value.trim();
      if (!paidBy) {
        throw new Error('Please select a user!');
      }
      if (!amount || amount <= 0) {
        throw new Error('Amount must be a positive number!');
      }

      const expense = this.expenseService.addExpense(
        paidBy,
        amount,
        description ? description : 'No description'
      );

      this.renderExpense(expense);
      //Reset the form
      this.elements.expenseAmountInput.value = '';
      this.elements.expenseReasonInput.value = '';
      // // Show tost
      showToast(`${amount} expense, paid by ${paidBy} was added`);
    } catch (error) {
      console.error('Error adding expense: ', error.message);
      showToast(`Error adding expenses: ${error.message}`, 'error');
    }
  }
  renderExpense(expense) {
    const text =
      expense.description !== 'No description'
        ? `${expense.paidBy} paid £${expense.amount} for ${expense.description}`
        : `${expense.paidBy} paid £${expense.amount} `;
    const listItem = DOMHelpers.createListItem(text, 'expense-item');
    this.elements.paymentList.appendChild(listItem);
  }
  handleSimplify() {
    try {
      const results = this.expenseService.simplifyExpenses();
      this.displayResults(results);
    } catch (error) {
      console.error('Error simplifying expenses: ', error);
      showToast(`Error simplifying expenses: ${error.message}`, 'error');
    }
  }
  displayResults(results) {
    DOMHelpers.clearElement(this.elements.resultArea);
    if (results.length === 0) {
      const noResultsItem = DOMHelpers.createListItem(
        'All expenses are settled!',
        'no-results'
      );
      this.elements.resultArea.appendChild(noResultsItem);
      return;
    }

    DOMHelpers.appendFragment(this.elements.resultArea, results, (result) =>
      DOMHelpers.createListItem(result, 'settlement-item')
    );
  }

  handleExport() {
    try {
      const res = this.storageService.exportData();
      if (res.status === 'empty') {
        showToast('Nothing to export — no users or expenses found.', 'info');
        return;
      }
      const { users, expenses } = res.counts;
      showToast(
        `Exported ${users} user${
          users !== 1 ? 's' : ''
        } and ${expenses} expense${expenses !== 1 ? 's' : ''}.`
      );
    } catch (error) {
      showToast(`Export failed: ${error.message}`, 'error');
      console.error('Export error:', error);
    }
  }

  async handleImport(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const result = await this.storageService.importData(file);

      this.refreshUI();

      this.reportImportSummary({
        users: result.userSummary,
        expenses: result.expenseSummary,
      });
    } catch (error) {
      showToast(`Import failed: ${error.message}`, 'error');
      console.error('Import error:', error);
    } finally {
      // Reset file input
      e.target.value = '';
    }
  }

  reportImportSummary({ users, expenses }) {
    const msgs = [];
    if (users.valid?.length)
      msgs.push(`Imported ${users.valid?.length} user(s)`);
    if (expenses.valid?.length)
      msgs.push(`Imported ${expenses.valid.length} expense(s)`);
    if (msgs.length) showToast(msgs.join('. ') + '.', 'success');

    const warnings = [];
    if (users.existing?.length)
      warnings.push(`${users.existing.length} user(s) already existed`);
    if (expenses.existing?.length)
      warnings.push(`${expenses.existing.length} expense(s) already existed`);
    if (warnings.length) showToast(warnings.join('. ') + '.', 'info');

    const errors = [];
    if (users.invalid?.length)
      errors.push(`${users.invalid.length} invalid user(s)`);
    if (expenses.invalid?.length)
      errors.push(`${expenses.invalid.length} invalid expense(s)`);
    if (errors.length)
      showToast(`Some items were not added: ${errors.join(', ')}.`, 'error');
  }

  refreshUI() {
    // Refresh user select options
    DOMHelpers.clearElement(this.elements.expenseUserInput);
    const defaultOption = DOMHelpers.createOption('Select User', '');
    this.elements.expenseUserInput.add(defaultOption);

    this.userService.getAllUserNames().forEach((name) => {
      this.addUserToSelectBox(name);
    });

    // Refresh expense list
    DOMHelpers.clearElement(this.elements.paymentList);
    this.expenseService.getAllExpenses().forEach((expense) => {
      this.renderExpense(expense);
    });

    // Clear results
    DOMHelpers.clearElement(this.elements.resultArea);
  }
}
