import type { JinResponse } from "#interfaces/JinResp";
import { REQUEST_VALIDATOR_DECORATOR } from "#decorators/methods/handlers/REQUEST_VALIDATOR_DECORATOR";
import type { ResponseValidator } from "#validators/BaseValidator";
import "reflect-metadata";

export function Validator<Response extends JinResponse = JinResponse>(_option: ResponseValidator<Response>) {
  return function validatorHandle(target: object): void {
    const option = Object.freeze(_option);
    const prev =
      (Reflect.getOwnMetadata(REQUEST_VALIDATOR_DECORATOR, target) as ResponseValidator<never>[] | undefined) ?? [];

    Reflect.defineMetadata(REQUEST_VALIDATOR_DECORATOR, [...prev, option], target);
  };
}
