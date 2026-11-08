import type { JinResponse } from "#interfaces/JinResp";
import type { JinRespBase } from "#interfaces/JinRespBase";
import type { ValidationResult } from "#interfaces/ValidationResult";
import type { ValidationResultType } from "#interfaces/ValidationResultType";

export type ValidationInput<Response extends JinResponse = JinResponse> = JinRespBase & Response & { ok: boolean };

export interface ResponseValidator<Response extends JinResponse = JinResponse> {
  readonly type: ValidationResultType;
  validate: (reply: ValidationInput<Response>) => Promise<ValidationResult>;
}

export type ValidatorMap<Response extends JinResponse = JinResponse> = number extends Response["status"]
  ? Record<number, ResponseValidator<never> | undefined>
  : {
      [Status in Response["status"]]?: ResponseValidator<
        Response extends unknown ? (Status extends Response["status"] ? Response & { status: Status } : never) : never
      >;
    };

export abstract class BaseValidator<
  Response extends JinResponse = JinResponse,
  TData = Response["data"],
  TError = unknown,
> {
  readonly #type: ValidationResultType;

  constructor({ type }: { type: ValidationResultType }) {
    this.#type = type;
  }
  get type(): ValidationResultType {
    return this.#type;
  }
  abstract getData(reply: ValidationInput<Response>): TData;
  abstract validator(data: TData): ValidationResult<TError> | Promise<ValidationResult<TError>>;
  async validate(reply: ValidationInput<Response>): Promise<ValidationResult<TError>> {
    return this.validator(this.getData(reply));
  }
}
