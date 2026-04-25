import type { JinRespBase } from '#interfaces/JinRespBase';

export interface JinFailResp<T> extends JinRespBase {
  ok: false;
  data: T;
}
