/* eslint-disable class-methods-use-this */
import type { TValidationResult, TValidationResultType } from '#interfaces/TValidationResult';
import { runAndUnwrap } from '#tools/runAndUnwrap';

export class Validator<TOrigin = unknown, TData = TOrigin, TError = unknown> {
  /**
   * exception 인 경우 validation error 발생하면 JinValidationtError 예외 발생
   * value 인 경우 validation error 발생하면 validation error 결과를 reply 데이터에 추가
   * */
  #type: TValidationResultType;

  constructor({ type }: { type: TValidationResultType }) {
    this.#type = type;
  }

  get type(): TValidationResultType {
    return this.#type;
  }

  /** override your data getter */
  getData(reply: TOrigin): TData {
    return reply as unknown as TData;
  }

  validator(_data: TData): TValidationResult<TError> | Promise<TValidationResult<TError>> {
    return { valid: true };
  }

  async validate(reply: TOrigin): Promise<TValidationResult<TError>> {
    const data = this.getData(reply);
    const result = await runAndUnwrap(this.validator.bind(this), data);
    return result;
  }
}
