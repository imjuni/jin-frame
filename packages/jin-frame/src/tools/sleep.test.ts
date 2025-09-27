import { describe, expect, it } from 'vitest';
import { sleep } from '#tools/sleep';

describe('sleep', () => {
  it('should resolve after the specified interval', async () => {
    const startTime = Date.now();
    const interval = 100; // 100ms

    await sleep(interval);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Allow some tolerance for timing (�10ms)
    expect(elapsed).toBeGreaterThanOrEqual(interval - 10);
    expect(elapsed).toBeLessThan(interval + 50);
  });

  it('should resolve immediately when interval is 0', async () => {
    const startTime = Date.now();

    await sleep(0);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Should complete very quickly (within 10ms)
    expect(elapsed).toBeLessThan(10);
  });

  it('should work with negative interval (treated as 1)', async () => {
    const startTime = Date.now();

    await sleep(-100);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Should complete very quickly (within 10ms)
    expect(elapsed).toBeLessThan(10);
  });

  it('should work with NaN (treated as 1)', async () => {
    const startTime = Date.now();

    await sleep(NaN);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Should complete very quickly (within 10ms)
    expect(elapsed).toBeLessThan(10);
  });

  it('should work with floating point intervals', async () => {
    const startTime = Date.now();
    const interval = 50.5; // 50.5ms

    await sleep(interval);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Allow tolerance for floating point timing
    expect(elapsed).toBeGreaterThanOrEqual(50);
    expect(elapsed).toBeLessThan(80);
  });

  it('should handle large intervals correctly', async () => {
    const startTime = Date.now();
    const interval = 200; // 200ms

    await sleep(interval);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeGreaterThanOrEqual(interval - 10);
    expect(elapsed).toBeLessThan(interval + 50);
  });

  it('should work with concurrent sleep calls', async () => {
    const startTime = Date.now();
    const interval = 100;
    const maxInterval = 200;

    // Start multiple sleep calls concurrently
    const promises = [sleep(interval + 30), sleep(maxInterval), sleep(interval + 50)];

    await Promise.all(promises);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // All should complete at roughly the same time
    expect(elapsed).toBeGreaterThanOrEqual(maxInterval - 10);
    expect(elapsed).toBeLessThan(maxInterval + 50);
  });
});
