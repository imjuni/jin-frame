import { getFrameName } from '#/generators/getFrameName';
import { describe, expect, it } from 'vitest';

describe('getFrameName', () => {
  it('should return operationId when non nullable operationId', () => {
    const result = getFrameName({
      operationId: 'findPetsByTags',
      method: 'POST',
      pathKey: '/pet/findByTags',
    });

    expect(result).toEqual('FindPetsByTagsFrame');
  });

  it('should return method with pathKey when nullable operationId', () => {
    const result = getFrameName({
      operationId: undefined,
      method: 'POST',
      pathKey: '/pet/findByTags',
    });

    expect(result).toEqual('PostPetFindByTagsFrame');
  });
});
