import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinPassResp } from '#interfaces/JinPassResp';
import type { JinResp } from '#interfaces/JinResp';

export async function fetchClient<Pass, Fail>(req: Request): Promise<JinResp<Pass, Fail>> {
  const response = await fetch(req);
  const data = await response.json().catch(() => undefined);

  if (response.ok) {
    const passed: JinPassResp<Pass> = {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: {},
      data: data as Pass,
    };

    return passed;
  }

  const failed: JinFailResp<Fail> = {
    ok: false,
    status: response.status,
    statusText: response.statusText,
    headers: {},
    data: data as Fail,
  };

  return failed;
}
