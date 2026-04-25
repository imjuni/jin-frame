import { generateHostValue } from '#/generators/hosts/generateHostValue';
import type { OpenAPIV3 } from 'openapi-types';
import { describe, expect, it } from 'vitest';

describe('generateHostValue', () => {
  const mockServers: OpenAPIV3.ServerObject[] = [
    { url: 'https://dev.api.example.com/v1', description: 'Development server' },
    { url: 'https://staging.api.example.com/v1', description: 'Staging server' },
    { url: 'https://api.example.com/v1', description: 'Production server' }
  ];

  it('should generate string host for string strategy', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: { hostStrategy: 'string' }
    });

    expect(result).toBe("'https://dev.api.example.com/v1'");
  });

  it('should use provided host when specified', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: {
        hostStrategy: 'string',
        host: 'https://custom.api.com'
      }
    });

    expect(result).toBe("'https://custom.api.com'");
  });

  it('should generate function name for function strategy', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: {
        hostStrategy: 'function',
        hostFunctionName: 'getCustomHost'
      }
    });

    expect(result).toBe('getCustomHost');
  });

  it('should use default function name when not specified', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: { hostStrategy: 'function' }
    });

    expect(result).toBe('getApiHost');
  });

  it('should generate env-function with default mapping', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: { hostStrategy: 'env-function' }
    });

    expect(result).toContain('process.env.NODE_ENV');
    expect(result).toContain('development: \'https://dev.api.example.com/v1\'');
    expect(result).toContain('staging: \'https://staging.api.example.com/v1\'');
    expect(result).toContain('production: \'https://api.example.com/v1\'');
  });

  it('should generate env-function with custom env var', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: {
        hostStrategy: 'env-function',
        hostEnvVar: 'API_ENV'
      }
    });

    expect(result).toContain('process.env.API_ENV');
  });

  it('should use custom server mapping', () => {
    const result = generateHostValue({
      servers: mockServers,
      options: {
        hostStrategy: 'env-function',
        serverMapping: {
          dev: 'https://localhost:3000',
          prod: 'https://api.example.com'
        }
      }
    });

    expect(result).toContain('dev: \'https://localhost:3000\'');
    expect(result).toContain('prod: \'https://api.example.com\'');
  });

  it('should throw error for unknown strategy', () => {
    expect(() => {
      generateHostValue({
        servers: mockServers,
        options: { hostStrategy: 'unknown' as any }
      });
    }).toThrow('Unknown host strategy: unknown');
  });

  it('should throw error when no servers provided', () => {
    expect(() => {
      generateHostValue({
        servers: [],
        options: { hostStrategy: 'string' }
      });
    }).toThrow('No servers found in OpenAPI specification');
  });
});