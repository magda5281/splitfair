export default class Expense {
  constructor(paidBy, amount, description = 'No description') {
    const trimmed = (paidBy ?? '').trim();
    if (!trimmed || typeof paidBy !== 'string') {
      throw new Error('Paid by must be a non empty string!');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number!');
    }

    this.paidBy = trimmed;
    this.amount = parseFloat(Number(amount).toFixed(2));
    this.description = description ?? 'No description';
    this.timestamp = new Date().toISOString();
    this.id = Expense.generateId();
  }

  static generateId() {
    return crypto.randomUUID();
  }

  toJSON() {
    return {
      id: this.id,
      paidBy: this.paidBy,
      amount: this.amount,
      description: this.description,
      timestamp: this.timestamp,
    };
  }

  static fromJSON(obj) {
    const exp = new Expense(obj.paidBy, obj.amount, obj.description);

    if (typeof obj?.id === 'string' && obj.id.trim()) exp.id = obj.id.trim();
    if (typeof obj?.timestamp === 'string') {
      const d = new Date(obj.timestamp);
      if (!Number.isNaN(d.getTime())) {
        exp.timestamp = d.toISOString();
      }
    }
    return exp;
  }
}
