import { expandUriTemplate } from '#tools/uri-template/expandUriTemplate';
import { describe, expect, it } from 'vitest';

describe('expandUriTemplate', () => {
  it('should expand single variable', () => {
    const result = expandUriTemplate('/pet/{petId}', { petId: '123' });
    expect(result).toBe('/pet/123');
  });

  it('should expand multiple variables', () => {
    const result = expandUriTemplate('/pet/{petId}/tag/{tagId}', { petId: '123', tagId: '456' });
    expect(result).toBe('/pet/123/tag/456');
  });

  it('should percent-encode spaces in path parameters', () => {
    const result = expandUriTemplate('/search/{query}', { query: 'hello world' });
    expect(result).toBe('/search/hello%20world');
  });

  it('should handle numeric values', () => {
    const result = expandUriTemplate('/user/{userId}', { userId: 123 });
    expect(result).toBe('/user/123');
  });

  it('should expand to empty string when variable not found', () => {
    const result = expandUriTemplate('/pet/{petId}', {});
    expect(result).toBe('/pet/');
  });

  it('should handle mixed found and not found variables', () => {
    const result = expandUriTemplate('/pet/{petId}/tag/{tagId}', { petId: '123' });
    expect(result).toBe('/pet/123/tag/');
  });

  it('should handle special characters in variable names', () => {
    const result = expandUriTemplate('/api/{user-id}', { 'user-id': '123' });
    expect(result).toBe('/api/123');
  });
});
