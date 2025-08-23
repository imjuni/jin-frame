import type { IFrameOption } from '#interfaces/options/IFrameOption';

export function setFrameOption<K extends keyof IFrameOption>(target: IFrameOption, key: K, value: unknown): void {
  const forReAssign = target;

  if (value != null) {
    forReAssign[key] = value as IFrameOption[K];
  }
}
