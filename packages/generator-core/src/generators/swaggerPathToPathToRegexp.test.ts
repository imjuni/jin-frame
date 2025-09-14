import { swaggerPathToPathToRegexp } from '#/generators/swaggerPathToPathToRegexp';
import { describe, expect, it } from 'vitest';

describe('swaggerPathToPathToRegexp', () => {
  it('should return normal path when first vaiable', () => {
    const result = swaggerPathToPathToRegexp('/pet/{petId}');
    expect(result).toEqual('/pet/:petId');
  });

  it('should return operationId when non nullable operationId', () => {
    const result = swaggerPathToPathToRegexp('/files/{path*}');
    expect(result).toEqual('/files/:path*');
  });

  it('should return normal path when first and second vaiable', () => {
    const result = swaggerPathToPathToRegexp('/pet/{petId}/tag/{tagId}');
    expect(result).toEqual('/pet/:petId/tag/:tagId');
  });

  it('should return normal path when first and second hypen concated vaiable', () => {
    const result = swaggerPathToPathToRegexp('/pet/{petId}-{tagId}');
    expect(result).toEqual('/pet/:petId-:tagId');
  });

  it('should return nullable value when ? value', () => {
    const result = swaggerPathToPathToRegexp('/pets/{id}?/photos');
    expect(result).toEqual('/pets/:id?/photos');
  });

  it('should return nullable value when plain value and ? value', () => {
    const result = swaggerPathToPathToRegexp('/search/{q}/{page?}');
    expect(result).toEqual('/search/:q/:page?');
  });

  it('should return wildcard value when dot value', () => {
    const result = swaggerPathToPathToRegexp('/assets/:file(.)+');
    expect(result).toEqual('/assets/:file(.)+');
  });

  it('should return normal path when ignored + value', () => {
    const result = swaggerPathToPathToRegexp('/things/{+slug}');
    expect(result).toEqual('/things/:slug');
  });

  it('should return star wildcard when star value', () => {
    const result = swaggerPathToPathToRegexp('/files/{*path}');
    expect(result).toEqual('/files/:path*');
  });

  it('should return custom regular expression when regex', () => {
    const result = swaggerPathToPathToRegexp('/files/{id:[0-9]+}');
    expect(result).toEqual('/files/:id([0-9])+');
  });

  it('should return origin path when invalid path made by +', () => {
    const result = swaggerPathToPathToRegexp('/files/{+}');
    expect(result).toEqual('/files/{+}');
  });

  it('should return origin path when invalid path made by *', () => {
    const result = swaggerPathToPathToRegexp('/files/{*}');
    expect(result).toEqual('/files/{*}');
  });

  it('should return origin path when invalid path made by :.*', () => {
    const result = swaggerPathToPathToRegexp('/files/{:.*}');
    expect(result).toEqual('/files/{:.*}');
  });
});
