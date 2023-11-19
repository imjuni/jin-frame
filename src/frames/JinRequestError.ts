import type { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { AxiosError, AxiosResponse } from 'axios';

export class JinRequestError<TPASS, TFAIL = unknown> extends Error {
  __discriminator = 'JinRequestError';

  #debug: IDebugInfo;

  #frame: JinFrame<TPASS, TFAIL>;

  #resp: AxiosResponse<TFAIL>;

  #status: AxiosError['status'];

  #statusText: string;

  constructor({
    debug,
    frame,
    resp,
    message,
  }: {
    debug: IDebugInfo;
    frame: JinFrame<TPASS, TFAIL>;
    resp: AxiosResponse<TFAIL>;
    message: string;
  }) {
    super(message);

    this.#debug = debug;
    this.#frame = frame;
    this.#resp = resp;
    this.#status = resp.status;
    this.#statusText = resp.statusText;
  }

  get debug(): IDebugInfo {
    return this.#debug;
  }

  get frame(): JinFrame<TPASS, TFAIL> {
    return this.#frame;
  }

  get resp(): AxiosResponse<TFAIL> | undefined {
    return this.#resp;
  }

  get status(): AxiosError['status'] {
    return this.#status;
  }

  get statusText(): string {
    return this.#statusText;
  }
}
