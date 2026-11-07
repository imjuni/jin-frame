import type { JinResp, JinResponse } from "#interfaces/JinResp";

export type JinHttpClient = <Response extends JinResponse>(req: Request) => Promise<JinResp<Response>>;
