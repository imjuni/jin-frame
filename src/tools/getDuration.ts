/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import intervalToDuration from 'date-fns/intervalToDuration';

/**
 * getDuration only calculate milliseconds ~ days
 */
export function getDuration(start: Date, end: Date) {
  try {
    const ms = end.getMilliseconds() - start.getMilliseconds();
    const seconds = intervalToDuration({ start, end }).seconds!;
    const minutes = intervalToDuration({ start, end }).minutes!;
    const hours = intervalToDuration({ start, end }).hours!;
    const days = intervalToDuration({ start, end }).days!;

    return ms + seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60 + days * 1000 * 60 * 60 * 24;
  } catch {
    return -1;
  }
}
