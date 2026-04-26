import type { JinRespBase } from '#interfaces/JinRespBase';
import type { ValidationResult } from '#interfaces/ValidationResult';

export interface JinPassResp<T> extends JinRespBase {
  ok: true;
  data: T;
  valid: boolean;
  $validated: ValidationResult;
}
