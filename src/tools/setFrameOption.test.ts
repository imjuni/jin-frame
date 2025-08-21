import { setFrameOption } from '#tools/setFrameOption';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import { describe, expect, it } from 'vitest';

describe('setFrameOption', () => {
  const option: IFrameOption = {
    method: 'GET',
    contentType: 'application/json',
    useInstance: false,
  };

  it('should set host value when non nullable value', () => {
    const cloned = structuredClone(option);

    setFrameOption(cloned, 'host', 'host-value');

    expect(cloned.host).toEqual('host-value');
  });

  it('should set host value when non nullable value', () => {
    const cloned = structuredClone(option);

    setFrameOption(cloned, 'contentType', undefined);

    expect(cloned.contentType).toEqual('application/json');
  });
});
