/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

/**
 * getDuration only calculate milliseconds ~ days
 */
export default function getDuration(start: Date, end: Date) {
  try {
    const duration = differenceInMilliseconds(end, start);
    return Number.isNaN(duration) ? -1 : duration;
  } catch {
    return -1;
  }
}
