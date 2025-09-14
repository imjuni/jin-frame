import { getBodyField } from '#processors/getBodyField';
import { describe, expect, it } from 'vitest';

describe('getBodyField', () => {
  it('should return original instance when primitive type and array', () => {
    function a() {}
    const b = () => {};
    const c = Symbol(1);

    const r01 = getBodyField(1, { key: 'name', option: { type: 'body' } });
    const r02 = getBodyField(BigInt(1), { key: 'name', option: { type: 'body' } });
    const r03 = getBodyField(c, { key: 'name', option: { type: 'body' } });
    const r04 = getBodyField(a, { key: 'name', option: { type: 'body' } });
    const r05 = getBodyField(b, { key: 'name', option: { type: 'body' } });
    const r06 = getBodyField([1], { key: 'name', option: { type: 'body' } });

    expect(r01).toEqual(1);
    expect(r02).toEqual(BigInt(1));
    expect(r03).toEqual(c);
    expect(r04).toEqual(a);
    expect(r05).toEqual(b);
    expect(r06).toEqual([1]);
  });

  it('should return origin object instance when key field is null', () => {
    const data = { name: null };
    const results = getBodyField(data, {
      key: 'name',
      option: {
        type: 'body',
        formatters: {
          number: (v) => `${v}`,
        },
      },
    });

    expect(results).toEqual(data);
  });

  it('should return formatted object instance when key field is primitive type', () => {
    const results = getBodyField(
      { name: 1 },
      {
        key: 'name',
        option: {
          type: 'body',
          formatters: {
            number: (v) => `${v}`,
          },
        },
      },
    );

    expect(results).toEqual({ name: '1' });
  });

  it('should return formatted object instance when key field is primitive type array', () => {
    const results = getBodyField(
      { name: [1] },
      {
        key: 'name',
        option: {
          type: 'body',
          formatters: {
            number: (v) => `${v}`,
          },
        },
      },
    );

    expect(results).toEqual({ name: ['1'] });
  });

  it('should return formatted object instance when key field is object type array', () => {
    const results = getBodyField(
      { name: [1] },
      {
        key: 'name',
        option: {
          type: 'body',
          formatters: {
            number: (v) => `${v}`,
          },
        },
      },
    );

    expect(results).toEqual({ name: ['1'] });
  });

  it('should return formatted object instance when key field is object type array', () => {
    const results = getBodyField(
      { name: { age: 10 } },
      {
        key: 'name',
        option: {
          type: 'body',
          formatters: {
            findFrom: 'age',
            number: (v) => `${v}`,
          },
        },
      },
    );

    expect(results).toEqual({ name: { age: '10' } });
  });

  it('should return formatted object instance when key field is object type array', () => {
    const results = getBodyField(
      { name: { age: 10 } },
      {
        key: 'name',
        option: {
          type: 'body',
          formatters: {
            findFrom: 'age',
            number: (v) => `${v}`,
          },
        },
      },
    );

    expect(results).toEqual({ name: { age: '10' } });
  });
});
