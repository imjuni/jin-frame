import { setFrameOption } from '#tools/setFrameOption';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';

export function mergeFrameOption(prev: IFrameOption, next: IFrameOption): IFrameOption {
  const merged: IFrameOption = { ...prev };

  for (const key of Object.keys(next) as (keyof IFrameOption)[]) {
    setFrameOption(merged, key, next[key]);
  }

  return merged;
}
