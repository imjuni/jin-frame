/**
 * Runs a function and unwraps the result if it's a Promise
 * @param fn - Function to execute (can be sync or async)
 * @param args - Arguments to pass to the function (type-safe based on fn parameters)
 * @returns The unwrapped result
 */
export async function runAndUnwrap<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn | Promise<TReturn>,
  ...args: TArgs
): Promise<TReturn> {
  const result = fn(...args);

  // Check if result is a Promise
  if (result instanceof Promise) {
    return result;
  }

  return result;
}
