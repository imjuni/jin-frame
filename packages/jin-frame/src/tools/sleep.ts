/**
 * Asynchronously waits for the specified number of milliseconds before resolving.
 * This function creates a Promise that resolves after the given interval using setTimeout.
 *
 * @param _interval - The number of milliseconds to wait before resolving
 *                   - Negative values are treated as 1ms
 *                   - NaN values are treated as 1ms
 * @returns A Promise that resolves to void after the specified interval
 *
 * @example
 * ```ts
 * // Wait for 1 second
 * await sleep(1000);
 * console.log('1 second has passed');
 *
 * // Wait for 500ms
 * await sleep(500);
 * console.log('500ms has passed');
 *
 * // Negative values are treated as 1ms
 * await sleep(-100); // waits 1ms
 *
 * // NaN values are treated as 1ms
 * await sleep(NaN); // waits 1ms
 * ```
 *
 * @example
 * ```ts
 * // Use in async functions for delays
 * async function delayedExecution() {
 *   console.log('Starting...');
 *   await sleep(2000);
 *   console.log('2 seconds later');
 * }
 *
 * // Use with Promise.all for concurrent operations
 * const results = await Promise.all([
 *   sleep(100),
 *   sleep(200),
 *   sleep(150)
 * ]);
 * // All complete after 200ms (the longest)
 * ```
 */
export async function sleep(_interval: number): Promise<void> {
  let interval = _interval < 0 ? 1 : _interval;
  interval = Number.isNaN(interval) ? 1 : interval;

  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}
