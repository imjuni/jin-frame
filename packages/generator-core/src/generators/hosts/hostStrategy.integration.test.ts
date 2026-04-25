import { generateHostValue } from '#/generators/hosts/generateHostValue';
import { createFrames } from '#/generators/createFrames';
import type { OpenAPIV3 } from 'openapi-types';
import { describe, expect, it } from 'vitest';

describe('Host Strategy Integration Test', () => {
  const mockOpenApiDoc: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    servers: [
      { url: 'https://dev.api.example.com/v1', description: 'Development server' },
      { url: 'https://staging.api.example.com/v1', description: 'Staging server' },
      { url: 'https://api.example.com/v1', description: 'Production server' }
    ],
    paths: {
      '/users': {
        get: {
          operationId: 'getUsers',
          summary: 'Get all users',
          responses: {
            '200': {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  describe('generateHostValue', () => {
    it('should generate string host for string strategy', () => {
      const result = generateHostValue({
        servers: mockOpenApiDoc.servers!,
        options: { hostStrategy: 'string' }
      });

      expect(result).toBe("'https://dev.api.example.com/v1'");
    });

    it('should generate custom function name for function strategy', () => {
      const result = generateHostValue({
        servers: mockOpenApiDoc.servers!,
        options: {
          hostStrategy: 'function',
          hostFunctionName: 'getCustomApiHost'
        }
      });

      expect(result).toBe('getCustomApiHost');
    });

    it('should generate environment-based function with custom mapping', () => {
      const result = generateHostValue({
        servers: mockOpenApiDoc.servers!,
        options: {
          hostStrategy: 'env-function',
          hostEnvVar: 'API_ENV',
          serverMapping: {
            local: 'http://localhost:3000',
            dev: 'https://dev.api.example.com/v1',
            prod: 'https://api.example.com/v1'
          }
        }
      });

      expect(result).toContain('process.env.API_ENV');
      expect(result).toContain("local: 'http://localhost:3000'");
      expect(result).toContain("dev: 'https://dev.api.example.com/v1'");
      expect(result).toContain("prod: 'https://api.example.com/v1'");
    });

    it('should override with explicit host when provided', () => {
      const result = generateHostValue({
        servers: mockOpenApiDoc.servers!,
        options: {
          hostStrategy: 'string',
          host: 'https://custom.override.com'
        }
      });

      expect(result).toBe("'https://custom.override.com'");
    });
  });

  describe('createFrames integration', () => {
    it('should create frames with string host strategy', async () => {
      const frames = await createFrames({
        specTypeFilePath: '/test/spec.d.ts',
        output: '/test/output',
        useCodeFence: false,
        document: mockOpenApiDoc,
        hostStrategy: 'string'
      });

      expect(frames).toHaveLength(1);
      expect(frames[0].frame.source).toContain("'https://dev.api.example.com/v1'");
    });

    it('should create frames with function host strategy', async () => {
      const frames = await createFrames({
        specTypeFilePath: '/test/spec.d.ts',
        output: '/test/output',
        useCodeFence: false,
        document: mockOpenApiDoc,
        hostStrategy: 'function',
        hostFunctionName: 'getApiEndpoint'
      });

      expect(frames).toHaveLength(1);
      expect(frames[0].frame.source).toContain('getApiEndpoint');
    });

    it('should create frames with env-function host strategy', async () => {
      const frames = await createFrames({
        specTypeFilePath: '/test/spec.d.ts',
        output: '/test/output',
        useCodeFence: false,
        document: mockOpenApiDoc,
        hostStrategy: 'env-function',
        hostEnvVar: 'NODE_ENV'
      });

      expect(frames).toHaveLength(1);
      expect(frames[0].frame.source).toContain('process.env.NODE_ENV');
      expect(frames[0].frame.source).toContain('development:');
      expect(frames[0].frame.source).toContain('staging:');
      expect(frames[0].frame.source).toContain('production:');
    });
  });
});