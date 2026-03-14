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

  it('should handle spaces in path parameters without encoding', () => {
    const result = expandUriTemplate('/search/{query}', { query: 'hello world' });
    expect(result).toBe('/search/hello world');
  });

  it('should handle numeric values', () => {
    const result = expandUriTemplate('/user/{userId}', { userId: 123 });
    expect(result).toBe('/user/123');
  });

  it('should keep unchanged if variable not found', () => {
    const result = expandUriTemplate('/pet/{petId}', {});
    expect(result).toBe('/pet/{petId}');
  });

  it('should handle mixed found and not found variables', () => {
    const result = expandUriTemplate('/pet/{petId}/tag/{tagId}', { petId: '123' });
    expect(result).toBe('/pet/123/tag/{tagId}');
  });

  it('should handle special characters in variable names', () => {
    const result = expandUriTemplate('/api/{user-id}', { 'user-id': '123' });
    expect(result).toBe('/api/123');
  });
});
