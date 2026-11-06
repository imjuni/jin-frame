import type { JinRespBase } from "#interfaces/JinRespBase";
import type { ValidationResult } from "#interfaces/ValidationResult";

export type JinResponse = { status: number; data: unknown };
export type JinResp<Response = JinResponse> = JinRespBase & {
  data: unknown;
  ok: boolean;
  valid: boolean;
  $validated: ValidationResult;
} & Response;
