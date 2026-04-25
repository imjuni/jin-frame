import { REQUEST_VALIDATOR_DECORATOR } from '#decorators/methods/handlers/REQUEST_VALIDATOR_DECORATOR';
import type { FrameRetry } from '#interfaces/options/FrameRetry';
import type { BaseValidator as ValidatorClass } from '#validators/BaseValidator';
import 'reflect-metadata';

export function Validator(_option: ValidatorClass) {
  return function validatorHandle(target: object): void {
    const option = Object.freeze(_option);
    const prev = (Reflect.getOwnMetadata(REQUEST_VALIDATOR_DECORATOR, target) as FrameRetry[] | undefined) ?? [];

    Reflect.defineMetadata(REQUEST_VALIDATOR_DECORATOR, [...prev, option], target);
  };
}
