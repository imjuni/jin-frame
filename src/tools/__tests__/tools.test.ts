/* eslint-disable max-classes-per-file, no-console */
import { bitwised } from '@tools/bitwised';
import { encodes } from '@tools/encode';
import { getDuration } from '@tools/getDuration';
import { removeBothSlash, removeEndSlash, removeStartSlash, startWithSlash } from '@tools/slashUtils';
import { isValidArrayType, isValidPrimitiveType, typeAssert } from '@tools/typeAssert';
import 'jest';

describe('isValidPrimitiveType', () => {
  test('all', () => {
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
  test('all', () => {
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
  test('raise exception -1', () => {
    try {
      typeAssert(true, Symbol('Symbol'));
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  test('primitive', () => {
    const r01 = typeAssert(true, 1);
    const r02 = typeAssert(false, Symbol('S'));
    expect(r01).toBeTruthy();
    expect(r02).toBeFalsy();
  });

  test('array', () => {
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
  test('removeEndSlash', () => {
    const removed = removeEndSlash('test/');
    const orgin = removeEndSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  test('removeStartSlash', () => {
    const removed = removeStartSlash('/test');
    const orgin = removeStartSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  test('removeBothSlash', () => {
    const removed = removeBothSlash('/test/');
    const orgin = removeBothSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });

  test('startWithSlash', () => {
    const removed = startWithSlash('/test');
    const orgin = startWithSlash('test');

    expect(removed).toEqual('/test');
    expect(orgin).toEqual('/test');
  });

  test('bitwised', () => {
    expect(bitwised([0b1, 0b10, 0b100])).toEqual(7);
  });

  test('encodes', () => {
    const r01 = encodes(true, '<');
    const r02 = encodes(false, '<');
    const r03 = encodes(true, ['<', '>']);

    expect(r01).toEqual('%3C');
    expect(r02).toEqual('<');
    expect(r03).toEqual(['%3C', '%3E']);
  });
});

describe('getDuration', () => {
  test('duration', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 10, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(10000);
  });

  test('duration - milliseconds', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(2023, 0, 10, 0, 0, 0, 200);

    const d = getDuration(s, e);

    expect(d).toEqual(200);
  });

  test('exception - start', () => {
    const s = new Date(2023, 0, 10, 0, 0, 0, 0);
    const e = new Date(NaN);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });

  test('exception - end', () => {
    const s = new Date(NaN);
    const e = new Date(2023, 0, 1, 0, 0, 0, 0);

    const d = getDuration(s, e);

    expect(d).toEqual(-1);
  });
});
