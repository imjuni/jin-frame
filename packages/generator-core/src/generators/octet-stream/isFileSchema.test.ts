import { isFileSchema } from '#/generators/octet-stream/isFileSchema';
import { describe, expect, it } from 'vitest';

describe('isFileSchema', () => {
  it('should return single file when schema binary format', () => {
    const result = isFileSchema({
      type: 'string',
      format: 'binary',
    });

    expect(result).toEqual({ isArray: false, isFile: true });
  });

  it('should return single file when schema byte format', () => {
    const result = isFileSchema({
      type: 'string',
      format: 'byte',
    });

    expect(result).toEqual({ isArray: false, isFile: true });
  });

  it('should return single file when array schema byte format', () => {
    const result = isFileSchema({
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    });

    expect(result).toEqual({ isArray: true, isFile: true });
  });

  it('should return single file when array schema byte format', () => {
    const result = isFileSchema({
      type: 'array',
      items: {
        type: 'string',
        format: 'byte',
      },
    });

    expect(result).toEqual({ isArray: true, isFile: true });
  });

  it('should return non file when schema byte format', () => {
    const result = isFileSchema({
      type: 'string',
    });

    expect(result).toEqual({ isArray: false, isFile: false });
  });

  it('should return non file when array schema byte format', () => {
    const result = isFileSchema({
      type: 'array',
      items: {
        type: 'string',
      },
    });

    expect(result).toEqual({ isArray: true, isFile: false });
  });

  it('should return non file when pass undefined', () => {
    const result = isFileSchema(undefined);

    expect(result).toEqual({ isArray: false, isFile: false });
  });
});
