import type { JinResponse } from "#interfaces/JinResp";
import type { JinRespBase } from "#interfaces/JinRespBase";
import type { ValidationResult } from "#interfaces/ValidationResult";
import type { ValidationResultType } from "#interfaces/ValidationResultType";

/** Complete HTTP response available before validation results are assigned. */
export type ValidationInput<Replies extends JinResponse = JinResponse> = JinRespBase & Replies & { ok: boolean };

export interface ResponseValidator<Replies extends JinResponse = JinResponse> {
  readonly type: ValidationResultType;
  validate: (response: ValidationInput<Replies>) => Promise<ValidationResult>;
}

/** Validate a response union, selecting schemas by status inside validator(). */
export abstract class BaseValidator<Replies extends JinResponse = JinResponse, TError = unknown> {
  readonly #type: ValidationResultType;

  constructor({ type }: { type: ValidationResultType }) {
    this.#type = type;
  }
  get type(): ValidationResultType {
    return this.#type;
  }

  /** Preserve status, body, and metadata for status-specific schema selection. */
  getData(response: ValidationInput<Replies>): ValidationInput<Replies> {
    return response;
  }

  abstract validator(response: ValidationInput<Replies>): ValidationResult<TError> | Promise<ValidationResult<TError>>;

  async validate(response: ValidationInput<Replies>): Promise<ValidationResult<TError>> {
    return this.validator(this.getData(response));
  }
}
