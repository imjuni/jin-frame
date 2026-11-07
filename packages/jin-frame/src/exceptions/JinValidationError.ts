import type { JinFrame } from "#frames/JinFrame";
import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinResp, JinResponse } from "#interfaces/JinResp";
import type { ValidationResult } from "#interfaces/ValidationResult";
import type { BaseValidator } from "#validators/BaseValidator";

export class JinValidationError<Response extends JinResponse = JinResponse, ValidationError = unknown> extends Error {
  __discriminator = "JinValidationError";

  #debug: DebugInfo;

  #frame: JinFrame<Response>;

  #resp: JinResp<Response>;

  #status: number;

  #statusText: string;

  #validator: BaseValidator;

  #validated: ValidationResult<ValidationError>;

  constructor({
    debug,
    frame,
    resp,
    message,
    validator,
    validated,
  }: {
    debug: DebugInfo;
    frame: JinFrame<Response>;
    resp: JinResp<Response>;
    message: string;
    validator: BaseValidator;
    validated: ValidationResult<ValidationError>;
  }) {
    super(message);

    this.#debug = debug;
    this.#frame = frame;
    this.#resp = resp;
    this.#status = resp.status;
    this.#statusText = resp.statusText;
    this.#validated = validated;
    this.#validator = validator;
  }

  get debug(): DebugInfo {
    return this.#debug;
  }

  get frame(): JinFrame<Response> {
    return this.#frame;
  }

  get resp(): JinResp<Response> | undefined {
    return this.#resp;
  }

  get status(): number {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }

  get validator(): BaseValidator {
    return this.#validator;
  }

  get validated(): ValidationResult<ValidationError> {
    return this.#validated;
  }
}
