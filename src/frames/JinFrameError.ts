import IDebugInfo from '@interfaces/IDebugInfo';
import { AxiosResponse } from 'axios';
import type JinFrame from './JinFrame';

export default class JinFrameError<TPASS, TFAIL = any> extends Error {
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
