import type { JinResp } from '#interfaces/JinResp';

export type JinHttpClient = <Pass, Fail>(req: Request) => Promise<JinResp<Pass, Fail>>;
