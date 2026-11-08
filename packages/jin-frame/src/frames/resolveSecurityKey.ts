import type { FrameOption } from "#interfaces/options/FrameOption";
import type { JinFrameCreateConfig } from "#interfaces/options/JinFrameCreateConfig";
import type { JinFrameRequestConfig } from "#interfaces/options/JinFrameRequestConfig";

export async function resolveSecurityKey<T extends JinFrameRequestConfig & JinFrameCreateConfig>(
  frameOption: FrameOption,
  option: T | undefined,
): Promise<T> {
  if (option?.dynamicAuth != null) {
    return option;
  }
  const frameAuth = frameOption.authorization;
  if (typeof frameAuth !== "function") {
    return (option ?? {}) as T;
  }
  return { ...(option ?? {}), dynamicAuth: await frameAuth() } as T;
}
