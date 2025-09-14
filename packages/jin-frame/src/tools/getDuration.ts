// eslint-disable-next-line import-x/no-extraneous-dependencies
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

/**
 * getDuration only calculate milliseconds ~ days
 */
export function getDuration(start: Date, end: Date): number {
  try {
    const duration = differenceInMilliseconds(end, start);
    return Number.isNaN(duration) ? -1 : duration;
  } catch {
    return -1;
  }
}
