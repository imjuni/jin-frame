import type { THttpMethod } from '#/https/method';
import { toArray } from 'my-easy-fp';
import type { OpenAPIV3 } from 'openapi-types';

interface IProps {
  pathKey: string;
  method: THttpMethod;
  operation?: Pick<OpenAPIV3.OperationObject, 'description' | 'summary' | 'tags'>;
}

export function getClassJsDoc(params: IProps): string {
  const seeBlock = `@see ${params.method} ${params.pathKey}`;
  const description = [params.operation?.summary, params.operation?.description]
    .filter((desc) => desc != null && desc !== '')
    .join('\n');

  const tagDesc = toArray(params.operation?.tags).join(', ');
  const tag = tagDesc !== '' ? `@tag ${tagDesc}` : '';

  if (description !== '' && tag !== '') {
    return [description, '', seeBlock, tag].join('\n');
  }

  if (description !== '') {
    return [description, '', seeBlock].join('\n');
  }

  if (tag !== '') {
    return [seeBlock, tag].join('\n');
  }

  return seeBlock;
}
