/* eslint-disable class-methods-use-this */
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { ValidationResultType } from '#interfaces/ValidationResultType';
import { runAndUnwrap } from '#tools/runAndUnwrap';

export class BaseValidator<TOrigin = unknown, TData = TOrigin, TError = unknown> {
  /**
   * exception 인 경우 validation error 발생하면 JinValidationError 예외 발생
   * value 인 경우 validation error 발생하면 validation error 결과를 reply 데이터에 추가
   * */
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
