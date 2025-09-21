import type { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { TValidationResult } from '#interfaces/TValidationResult';
import type { AxiosError, AxiosResponse } from 'axios';
import type { Validator } from '#validators/Validator';

export class JinValidationtError<TPASS, TFAIL = unknown, TValidationError = unknown> extends Error {
  __discriminator = 'JinValidationtError';

  #debug: IDebugInfo;

  #frame: JinFrame<TPASS, TFAIL>;

  #resp: AxiosResponse<TPASS>;

  #status: AxiosError['status'];

  #statusText: string;

  #validator: Validator;

  #validated: TValidationResult<TValidationError>;

  constructor({
    debug,
    frame,
    resp,
    message,
    validator,
    validated,
  }: {
    debug: IDebugInfo;
    frame: JinFrame<TPASS, TFAIL>;
    resp: AxiosResponse<TPASS>;
    message: string;
    validator: Validator;
    validated: TValidationResult<TValidationError>;
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

  get debug(): IDebugInfo {
    return this.#debug;
  }

  get frame(): JinFrame<TPASS, TFAIL> {
    return this.#frame;
  }

  get resp(): AxiosResponse<TPASS> | undefined {
    return this.#resp;
  }

  get status(): AxiosError['status'] {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }

  get validator(): Validator {
    return this.#validator;
  }

  get validated(): TValidationResult<TValidationError> {
    return this.#validated;
  }
}
