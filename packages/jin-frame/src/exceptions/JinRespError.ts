import type { JinFrame } from "#frames/JinFrame";
import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinResp, JinResponse } from "#interfaces/JinResp";

export class JinRespError<Response = JinResponse> extends Error {
  __discriminator = "JinRespError";

  #debug: DebugInfo;

  #frame: JinFrame<Response>;

  #resp: JinResp<Response>;

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
    frame: JinFrame<Response>;
    resp: JinResp<Response>;
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
