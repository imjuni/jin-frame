import { describe, expect, it } from 'vitest';
import { getQuerystringKeyFormat } from '#processors/getQuerystringKeyFormat';

describe('getQuerystringBrackets', () => {
  it('should return brackets when pass undefined', () => {
    const result = getQuerystringKeyFormat();

    expect(result).toBeUndefined();
  });

  it('should return brackets when pass type querystring', () => {
    const result = getQuerystringKeyFormat({
      type: 'query',
      keyFormat: 'brackets',
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
    });

    expect(result).toEqual('brackets');
  });

  it('should return brackets when pass type param', () => {
    const result = getQuerystringKeyFormat({
      type: 'param',
      comma: false,
      bit: {
        enable: false,
        withZero: false,
      },
    });

    expect(result).toBeUndefined();
  });
});
