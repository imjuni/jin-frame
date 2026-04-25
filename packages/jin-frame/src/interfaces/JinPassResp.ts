import type { JinRespBase } from '#interfaces/JinRespBase';

export interface JinPassResp<T> extends JinRespBase {
  ok: true;
  data: T;
}
