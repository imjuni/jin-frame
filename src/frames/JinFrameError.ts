import type { JinFrame } from '@frames/JinFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';

export class JinFrameError<TPASS, TFAIL = any> extends Error {
  __discriminator = 'JinFrameError';

  #debug: IDebugInfo;

  #frame: JinFrame<TPASS, TFAIL>;

  #resp?: AxiosResponse<TFAIL>;

  constructor({
    debug,
    frame,
    resp,
    message,
  }: {
    debug: IDebugInfo;
    frame: JinFrame<TPASS, TFAIL>;
    resp?: AxiosResponse<TFAIL>;
    message: string;
  }) {
    super(message);

    this.#debug = debug;
    this.#frame = frame;
    this.#resp = resp;
  }

  get debug(): IDebugInfo {
    return this.#debug;
  }

  get frame(): JinFrame<TPASS, TFAIL> {
    return this.#frame;
  }

  get resp(): AxiosResponse<any> | undefined {
    return this.#resp;
  }
}
