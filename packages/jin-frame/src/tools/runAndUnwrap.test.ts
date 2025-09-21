import { runAndUnwrap } from '#tools/runAndUnwrap';
import { describe, expect, it } from 'vitest';

describe('runAndUnwrap', () => {
  it('should return synchronous result when function returns non-promise value', async () => {
    const result = await runAndUnwrap(() => 1);
    expect(result).toBe(1);
  });

  it('should unwrap and return resolved value when function returns promise', async () => {
    const result = await runAndUnwrap(async () => Promise.resolve(1));
    expect(result).toBe(1);
  });

  it('should maintain type safety with complex function arguments when function has multiple parameters', async () => {
    const complexFn = (a: string, b: number, c: boolean) => `${a}-${b}-${c}`;
    const result = await runAndUnwrap(complexFn, 'hello', 42, true);
    expect(result).toBe('hello-42-true');
  });

  it('should maintain type safety with complex async function when function returns promise with complex type', async () => {
    const asyncComplexFn = async (name: string, age: number) => ({ name, age, timestamp: Date.now() });
    const result = await runAndUnwrap(asyncComplexFn, 'Alice', 30);
    expect(result).toHaveProperty('name', 'Alice');
    expect(result).toHaveProperty('age', 30);
    expect(result).toHaveProperty('timestamp');
  });
});
