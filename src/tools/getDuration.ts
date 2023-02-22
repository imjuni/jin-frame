/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import intervalToDuration from 'date-fns/intervalToDuration';

export function getDuration(start: Date, end: Date) {
  try {
    const durationSeconds = intervalToDuration({ start, end }).seconds!;
    const duration = durationSeconds * 1000;

    return duration;
  } catch {
    return -1;
  }
}
