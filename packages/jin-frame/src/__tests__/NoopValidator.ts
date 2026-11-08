import { BaseValidator } from "#validators/BaseValidator";

export class NoopValidator extends BaseValidator {
  validator(_response?: unknown) {
    return { valid: true as const };
  }
}
