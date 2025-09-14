import { safeYamlParse } from '#/tools/safeYamlParse';
import { describe, expect, it } from 'vitest';

describe('safeYamlParse', () => {
  it('should return the parsed value', () => {
    const result = safeYamlParse('a: 1');
    expect(result).toEqual({ a: 1 });
  });

  it('should return undefined when the value is not valid YAML', () => {
    const result = safeYamlParse('{]');
    expect(result).toBeUndefined();
  });
});
