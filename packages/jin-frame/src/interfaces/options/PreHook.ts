import type { JinRequestConfig } from "#interfaces/JinRequestConfig";

export type PreHook = (req: JinRequestConfig) => void | Promise<void>;
