import { bitwised } from '#tools/bitwised';
import { encodes } from '#tools/encodes/encodes';
import { getDuration } from '#tools/getDuration';
import { removeBothSlash } from '#tools/slash-utils/removeBothSlash';
import { removeEndSlash } from '#tools/slash-utils/removeEndSlash';
import { removeStartSlash } from '#tools/slash-utils/removeStartSlash';
import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';
import { typeAssert } from '#tools/type-narrowing/typeAssert';
import { describe, expect, it } from 'vitest';

describe('isValidPrimitiveType', () => {
  it('all', () => {
    const r01 = isValidPrimitiveType('a');
    const r02 = isValidPrimitiveType(1);
    const r03 = isValidPrimitiveType(true);
    const r04 = isValidPrimitiveType(new Date());
    const r05 = isValidPrimitiveType(Symbol('S'));

    expect(r01).toBeTruthy();
    expect(r02).toBeTruthy();
    expect(r03).toBeTruthy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });
});

describe('isValidArrayType', () => {
  it('all', () => {
    const r01 = isValidArrayType(['a']);
    const r02 = isValidArrayType([1]);
    const r03 = isValidArrayType([true]);
    const r04 = isValidArrayType([new Date()]);
    const r05 = isValidArrayType([Symbol('S')]);
    const r06 = isValidArrayType({ a: 'a' });

    expect(r01).toBeTruthy();
    expect(r02).toBeTruthy();
    expect(r03).toBeTruthy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
    expect(r06).toBeFalsy();
  });
});

describe('typeAssert', () => {
  it('raise exception -1', () => {
    try {
      typeAssert(true, Symbol('Symbol'));
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  it('primitive', () => {
    const r01 = typeAssert(true, 1);
    const r02 = typeAssert(false, Symbol('S'));
    expect(r01).toBeTruthy();
    expect(r02).toBeFalsy();
  });

  it('array', () => {
    const str = typeAssert(true, ['a', 'b', 'c']);
    const num = typeAssert(true, [1, 2, 3]);
    const bool = typeAssert(true, [true, true, false]);
    const date = typeAssert(true, [new Date(), new Date(), new Date()]);

    expect(str).toBeTruthy();
    expect(num).toBeTruthy();
    expect(bool).toBeTruthy();
    expect(date).toBeTruthy();
  });
});

describe('slashUtils', () => {
  it('removeEndSlash', () => {
    const removed = removeEndSlash('test/');
    const orgin = removeEndSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  it('removeStartSlash', () => {
    const removed = removeStartSlash('/test');
    const orgin = removeStartSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  it('removeBothSlash', () => {
    const removed = removeBothSlash('/test/');
    const orgin = removeBothSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  it('startWithSlash', () => {
    const removed = startWithSlash('/test');
    const orgin = startWithSlash('test');

    expect(removed).toEqual('/test');
    expect(orgin).toEqual('/test');
  });

  it('bitwised', () => {
    expect(bitwised([0b1, 0b10, 0b100])).toEqual(7);
  });

  it('encodes', () => {
    const r01 = encodes(true, '<');
    const r02 = encodes(false, '<');
    const r03 = encodes(true, ['<', '>']);

    expect(r01).toEqual('%3C');
    expect(r02).toEqual('<');
    expect(r03).toEqual(['%3C', '%3E']);
  });
});

describe('getDuration', () => {
  it('duration', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 10, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(10000);
  });

  it('duration - milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 0, 200);

    const d = getDuration(s, e);

    expect(d).toEqual(200);
  });

  it('duration - second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 1, 200);

    const d = getDuration(s, e);

    expect(d).toEqual(1200);
  });

  it('duration - second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 1, 1, 312);

    const d = getDuration(s, e);

    expect(d).toEqual(61312);
  });

  it('duration - minutes + second + milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 2, 1, 1, 312);

    const d = getDuration(s, e);

    expect(d).toEqual(7261312);
  });

  it('exception - start', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(NaN);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });

  it('exception - end', () => {
    const s = new Date(NaN);
    const e = new Date(2023, 0, 1, 0, 0, 0, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });
});
