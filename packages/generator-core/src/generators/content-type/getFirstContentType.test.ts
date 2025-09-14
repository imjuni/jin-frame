import { getFirstContentType } from '#/generators/content-type/getFirstContentType';
import { describe, expect, it } from 'vitest';

describe('getFirstContentType', () => {
  const preferredContentType = ['application/json', 'application/*+json', 'text/plain', 'text/*'];

  it('should return undefined when pass empty content', () => {
    const result = getFirstContentType(preferredContentType, undefined);
    expect(result).toBeUndefined();
  });

  it('should return application/json when match prefered and content-type', () => {
    const result = getFirstContentType(preferredContentType, {
      'application/json': {},
    });

    expect(result).toEqual({
      mediaType: 'application/json',
      value: {},
    });
  });

  it('should return text/markdown when match wildcard', () => {
    const result = getFirstContentType(preferredContentType, {
      'text/markdown': {},
    });

    expect(result).toEqual({
      mediaType: 'text/markdown',
      value: {},
    });
  });

  it('should return text/markdown when match wildcard', () => {
    const result = getFirstContentType(preferredContentType, {
      'text/markdown': {},
    });

    expect(result).toEqual({
      mediaType: 'text/markdown',
      value: {},
    });
  });

  it('should return application/rss+json when match partial wildcard', () => {
    const result = getFirstContentType(preferredContentType, {
      'application/rss+json': {},
    });

    expect(result).toEqual({
      mediaType: 'application/rss+json',
      value: {},
    });
  });

  it('should return application/x-www-form-urlencoded when non-match in preferred', () => {
    const result = getFirstContentType(preferredContentType, {
      'application/x-www-form-urlencoded': {},
    });

    expect(result).toEqual({
      mediaType: 'application/x-www-form-urlencoded',
      value: {},
    });
  });

  it('should return undefined when empty content', () => {
    const result = getFirstContentType(preferredContentType, {});

    expect(result).toBeUndefined();
  });
});
