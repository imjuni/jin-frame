import type { JinFrame } from '#frames/JinFrame';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { JinFailResp } from '#interfaces/JinFailResp';

export class JinRespError<TPASS, TFAIL = unknown> extends Error {
  __discriminator = 'JinRespError';

  #debug: DebugInfo;

  #frame: JinFrame<TPASS, TFAIL>;

  #resp: JinFailResp<TFAIL>;

  #status: number;

  #statusText: string;

  constructor({
    debug,
    frame,
    resp,
    message,
    cause,
  }: {
    debug: DebugInfo;
    frame: JinFrame<TPASS, TFAIL>;
    resp: JinFailResp<TFAIL>;
    message: string;
    cause?: unknown;
  }) {
    super(message, { cause });

    this.#debug = debug;
    this.#frame = frame;
    this.#resp = resp;
    this.#status = resp.status;
    this.#statusText = resp.statusText;
  }

  get debug(): DebugInfo {
    return this.#debug;
  }

  get frame(): JinFrame<TPASS, TFAIL> {
    return this.#frame;
  }

  get resp(): JinFailResp<TFAIL> | undefined {
    return this.#resp;
  }

  get status(): number {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }

  override toString(): string {
    return `JinRespError [${this.#status} ${this.#statusText}]: ${this.message}`;
  }
}
