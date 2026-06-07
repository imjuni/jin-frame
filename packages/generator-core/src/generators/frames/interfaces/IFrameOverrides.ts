import type { IFrameOverrideRetry } from "#generators/frames/interfaces/IFrameOverrideRetry.js";

export interface IFrameOverrides {
  hosts?: Record<string, string>;
  retries?: Record<string, IFrameOverrideRetry>;
  timeouts?: Record<string, number>;
}
