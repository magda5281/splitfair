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

  // Used by exports (and JSON.stringify will call this automatically)
  toJSON() {
    return {
      id: this.id,
      paidBy: this.paidBy,
      amount: this.amount,
      description: this.description,
      timestamp: this.timestamp,
    };
  }

  //  Used by imports; keeps the constructor args the same
  static fromJSON(obj) {
    const paidBy = (obj?.paidBy ?? '').trim();
    const amount = Number(obj?.amount);
    const description = obj?.description ?? 'No description';

    if (!paidBy) throw new Error('Invalid expense: empty paidBy');
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error('Invalid amount');

    // create via the existing constructor (don’t change its signature)
    const exp = new Expense(paidBy, amount, description);

    // preserve imported id/timestamp if provided and valid
    if (typeof obj?.id === 'string' && obj.id.trim()) {
      exp.id = obj.id.trim();
    }
    if (typeof obj?.timestamp === 'string') {
      const d = new Date(obj.timestamp);
      if (!Number.isNaN(d.getTime())) {
        exp.timestamp = d.toISOString(); // normalise
      } else {
        throw new Error('Invalid timestamp');
      }
    }

    return exp;
  }
}
