import type { JinFrame } from '#frames/JinFrame';
import type { DebugInfo } from '#interfaces/DebugInfo';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';

export class JinCreateError<T extends JinFrame<TPASS, TFAIL>, TPASS, TFAIL = TPASS> extends Error {
  __discriminator = 'JinCreateError';

  #debug: Omit<DebugInfo, 'req'>;

  #frame: T;

  #status: number;

  #statusText: string;

  constructor({ debug, frame, message }: { debug: Omit<DebugInfo, 'req'>; frame: T; message: string }) {
    super(message);

    this.#debug = debug;
    this.#frame = frame;
    this.#status = httpStatusCodes.INTERNAL_SERVER_ERROR;
    this.#statusText = getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  get debug(): Omit<DebugInfo, 'req'> {
    return this.#debug;
  }

  get frame(): T {
    return this.#frame;
  }

  get status(): number {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }
}
