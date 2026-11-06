import type { JinResp } from "#interfaces/JinResp";

export type JinHttpClient = <Response>(req: Request) => Promise<JinResp<Response>>;
