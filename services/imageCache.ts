// services/imageCache.ts
const cache = new Map<string, string>();

export const imageCache = {
  get: (key: string): string | undefined => cache.get(key),
  // Fix: Use a block body to match the 'void' return type.
  set: (key:string, value: string): void => { cache.set(key, value); },
  has: (key: string): boolean => cache.has(key),
};