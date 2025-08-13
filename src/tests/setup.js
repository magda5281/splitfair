import { randomUUID } from 'node:crypto';

// Only add randomUUID if the environment doesn't provide it
if (typeof globalThis.crypto?.randomUUID !== 'function') {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: randomUUID, // use Node's randomUUID
    configurable: true,
    writable: false,
  });
}

// Optional toast stubs so your app code doesn’t crash during tests
globalThis.showToast = () => {};
globalThis.showSuccessToast = () => {};
globalThis.showErrorToast = () => {};
