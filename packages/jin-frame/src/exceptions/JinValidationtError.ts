import type { JinFrame } from '#frames/JinFrame';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { BaseValidator } from '#validators/BaseValidator';
import type { JinPassResp } from '#interfaces/JinPassResp';

export class JinValidationtError<Pass, Fail = unknown, ValidationError = unknown> extends Error {
  __discriminator = 'JinValidationtError';

  #debug: DebugInfo;

  #frame: JinFrame<Pass, Fail>;

  #resp: JinPassResp<Pass>;

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
    frame: JinFrame<Pass, Fail>;
    resp: JinPassResp<Pass>;
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

  get frame(): JinFrame<Pass, Fail> {
    return this.#frame;
  }

  get resp(): JinPassResp<Pass> | undefined {
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
