import type { FrameOption } from '#interfaces/options/FrameOption';

export function setFrameOption<K extends keyof FrameOption>(target: FrameOption, key: K, value: unknown): void {
  const forReAssign = target;

  if (value != null) {
    forReAssign[key] = value as FrameOption[K];
  }
}
