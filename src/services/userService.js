import User from '../models/user';

export class UserService {
  constructor() {
    this.users = new Map();
  }
  addUser(name) {
    const trimmed = (name ?? '').trim();

    if (!trimmed || typeof name !== 'string')
      throw new Error('Name is required!');

    if (this.hasUser(trimmed)) throw new Error('User already exists');

    const user = new User(trimmed);
    this.users.set(trimmed, user);
    return user;
  }

  getUser(name) {
    return this.users.get(name);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }
  getAllUserNames() {
    return Array.from(this.users.keys());
  }

  hasUser(name) {
    return this.users.has(name);
  }

  getUserCount() {
    return this.users.size;
  }
  clear() {
    this.users.clear();
  }
  deleteUser(name) {
    if (this.users.has(name)) {
      return this.users.delete(name);
    } else {
      throw new Error('No such a user exists');
    }
  }

  updateUser(name, newName) {
    const trimmed = (newName ?? '').trim();
    if (!this.users.has(name)) throw new Error('User not found');
    if (!trimmed) throw new Error('New name must be a non-empty string');
    if (this.users.has(trimmed)) throw new Error('User already exists');

    const user = this.users.get(name);
    this.users.delete(name);
    user.name = trimmed;
    this.users.set(trimmed, user);
    return user;
  }

  validateImportedUser(name) {
    const trimmedName = name.trim();

    const validName = typeof trimmedName === 'string' && trimmedName.length > 0;
    const existingUser = this.hasUser(trimmedName);

    if (!validName) {
      return { invalid: name };
    }
    if (validName) {
      if (!existingUser) {
        return { valid: trimmedName };
      }
      if (existingUser) {
        return { existing: name };
      }
    }
  }

  importUsers(userData) {
    if (!Array.isArray(userData)) {
      throw new Error('User data must be an array');
    }
    const validatedUsers = {
      valid: [],
      invalid: [],
      existing: [],
    };
    userData.forEach((userData) => {
      if (userData && userData.name) {
        //validate user
        const validated = this.validateImportedUser(userData.name);

        if (validated.valid) {
          this.users.set(validated.valid, new User(validated.valid));
          validatedUsers.valid.push(validated.valid);
        } else if (validated.invalid) {
          validatedUsers.invalid.push(validated.invalid);
        } else if (validated.existing) {
          validatedUsers.existing.push(validated.existing);
        }
      }
    });
    return validatedUsers;
  }
}
