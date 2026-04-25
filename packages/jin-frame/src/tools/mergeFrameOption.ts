import { setFrameOption } from '#tools/setFrameOption';
import type { FrameOption } from '#interfaces/options/FrameOption';

export function mergeFrameOption(prev: FrameOption, next: FrameOption): FrameOption {
  const merged: FrameOption = { ...prev };

  for (const key of Object.keys(next) as (keyof FrameOption)[]) {
    setFrameOption(merged, key, next[key]);
  }

  return merged;
}
