/* eslint-disable class-methods-use-this */
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { ValidationResultType } from '#interfaces/ValidationResultType';
import { runAndUnwrap } from '#tools/runAndUnwrap';

export class BaseValidator<TOrigin = unknown, TData = TOrigin, TError = unknown> {
  /**
   * Controls how a validation failure is surfaced.
   * - 'exception': throws JinValidationError on failure
   * - 'value': attaches the validation result to the reply object instead of throwing
   */
  #type: ValidationResultType;

  constructor({ type }: { type: ValidationResultType }) {
    this.#type = type;
  }

  get type(): ValidationResultType {
    return this.#type;
  }

  /** override your data getter */
  getData(reply: TOrigin): TData {
    return reply as unknown as TData;
  }

  validator(_data: TData): ValidationResult<TError> | Promise<ValidationResult<TError>> {
    return { valid: true };
  }

  async validate(reply: TOrigin): Promise<ValidationResult<TError>> {
    const data = this.getData(reply);
    const result = await runAndUnwrap(this.validator.bind(this), data);
    return result;
  }
}
