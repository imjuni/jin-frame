import { BaseValidator } from "#validators/BaseValidator";

export class NoopValidator extends BaseValidator {
  getData(reply: { data: unknown }) {
    return reply.data;
  }
  validator(_data?: unknown) {
    return { valid: true as const };
  }
}
