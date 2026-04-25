import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinPassResp } from '#interfaces/JinPassResp';

export type JinResp<Pass, Fail> = JinPassResp<Pass> | JinFailResp<Fail>;
