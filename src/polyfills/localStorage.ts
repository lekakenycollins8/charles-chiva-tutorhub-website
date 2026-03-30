// Polyfill for Node.js v25+ which provides an incomplete localStorage object
// This prevents the debug package from crashing during SSR

if (typeof window === 'undefined' && typeof localStorage !== 'undefined') {
  // Node.js v25+ has a global localStorage but it's incomplete
  // Check if it's missing the required methods
  if (typeof localStorage.getItem !== 'function') {
    // Create a minimal in-memory storage that won't crash
    const storage = new Map<string, string>();
    
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
        get length() { return storage.size; },
        key: (index: number) => Array.from(storage.keys())[index] ?? null,
      },
      writable: false,
      configurable: true,
    });
  }
}
