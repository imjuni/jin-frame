import type { JinFrame } from "#frames/JinFrame";
import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinResp, JinResponse } from "#interfaces/JinResp";

export class JinRespError<Response extends JinResponse = JinResponse> extends Error {
  __discriminator = "JinRespError";

  #debug: DebugInfo;

  #frame: JinFrame<Response>;

  #resp: JinResp<Response> | undefined;

  #status: number;

  #statusText: string;

  constructor(
    options: {
      debug: DebugInfo;
      frame: JinFrame<Response>;
      message: string;
      cause?: unknown;
    } & ({ resp: JinResp<Response> } | { resp?: undefined; status: number; statusText: string }),
  ) {
    super(options.message, { cause: options.cause });

    this.#debug = options.debug;
    this.#frame = options.frame;
    this.#resp = options.resp;
    if ("status" in options) {
      this.#status = options.status;
      this.#statusText = options.statusText;
    } else {
      this.#status = options.resp.status;
      this.#statusText = options.resp.statusText;
    }
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

  override toString(): string {
    return `JinRespError [${this.#status} ${this.#statusText}]: ${this.message}`;
  }
}
