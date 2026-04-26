import { REQUEST_VALIDATOR_DECORATOR } from '#decorators/methods/handlers/REQUEST_VALIDATOR_DECORATOR';
import type { BaseValidator } from '#validators/BaseValidator';
import 'reflect-metadata';

export function Validator(_option: { pass?: BaseValidator; fail?: BaseValidator }) {
  return function validatorHandle(target: object): void {
    const option = Object.freeze(_option);
    const prev =
      (Reflect.getOwnMetadata(REQUEST_VALIDATOR_DECORATOR, target) as
        | { pass?: BaseValidator; fail?: BaseValidator }[]
        | undefined) ?? [];

    Reflect.defineMetadata(REQUEST_VALIDATOR_DECORATOR, [...prev, option], target);
  };
}
