import { recursive } from 'merge';

export function mergeBody<T = unknown>(origin: T, target: T) {
  if (typeof origin === 'object' && Array.isArray(origin)) {
    return [...origin].concat(Array.isArray(target) ? [...target] : [target]);
  }

  if (typeof origin === 'object') {
    return recursive(true, origin, target);
  }

  return target;
}
