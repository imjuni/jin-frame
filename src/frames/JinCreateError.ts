import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { JinFrame } from '@frames/JinFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosError } from 'axios';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';

export class JinCreateError<
  T extends JinFrame<TPASS, TFAIL> | JinEitherFrame<TPASS, TFAIL>,
  TPASS,
  TFAIL = TPASS,
> extends Error {
  __discriminator = 'JinCreateError';

  #debug: Omit<IDebugInfo, 'req'>;

  #frame: T extends JinFrame<TPASS, TFAIL> ? JinFrame<TPASS, TFAIL> : JinEitherFrame<TPASS, TFAIL>;

  #status: AxiosError['status'];

  #statusText: string;

  constructor({
    debug,
    frame,
    message,
  }: {
    debug: Omit<IDebugInfo, 'req'>;
    frame: T extends JinFrame<TPASS, TFAIL> ? JinFrame<TPASS, TFAIL> : JinEitherFrame<TPASS, TFAIL>;
    message: string;
  }) {
    super(message);

    this.#debug = debug;
    this.#frame = frame;
    this.#status = httpStatusCodes.INTERNAL_SERVER_ERROR;
    this.#statusText = getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  get debug(): Omit<IDebugInfo, 'req'> {
    return this.#debug;
  }

  get frame(): T extends JinFrame<TPASS, TFAIL> ? JinFrame<TPASS, TFAIL> : JinEitherFrame<TPASS, TFAIL> {
    return this.#frame;
  }

  get status(): AxiosError['status'] {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }
}
