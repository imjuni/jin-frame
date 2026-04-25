import type { IGetBaseHostParams } from '#/generators/hosts/interfaces/IGetBaseHostParams';
import type { IBaseUrl } from '#/models/generators/IBaseUrl';
import { safeUrl } from '#/tools/safeUrl';

export function getBaseHost({ host, spec }: IGetBaseHostParams): IBaseUrl[] {
  const urls: IBaseUrl[] = [];
  const hostUrl = safeUrl(host);
  const specUrl = safeUrl(spec.from === 'url' ? spec.path : undefined);

  if (hostUrl != null) {
    urls.push({ kind: 'option', url: hostUrl });
  }

  if (specUrl != null) {
    urls.push({ kind: 'spec-url', url: specUrl });
  }

  return urls;
}
