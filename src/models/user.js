// models/user.js
export default class User {
  constructor(name, id = crypto.randomUUID()) {
    const trimmed = (name ?? '').trim();
    if (typeof name !== 'string' || !trimmed) {
      throw new Error('Name is required');
    }
    this.name = trimmed;
    this.id = id;
  }

  toJSON() {
    // Return only JSON-safe, public fields
    return { id: this.id, name: this.name };
  }

  // Optional: for imports
  static fromJSON(obj) {
    if (!obj || typeof obj.name !== 'string' || typeof obj.id !== 'string') {
      throw new Error('Invalid user JSON');
    }
    // (Optional) validate UUID format here
    return new User({ id: obj.id, name: obj.name });
  }
}
