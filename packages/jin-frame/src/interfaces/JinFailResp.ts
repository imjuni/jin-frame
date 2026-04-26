import type { JinRespBase } from '#interfaces/JinRespBase';
import type { ValidationResult } from '#interfaces/ValidationResult';

export interface JinFailResp<T> extends JinRespBase {
  ok: false;
  data: T;
  valid?: boolean;
  $validated?: ValidationResult;
}
