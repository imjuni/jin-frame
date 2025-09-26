import type { AxiosResponse } from 'axios';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { RequestDedupeManager } from './RequestDedupeManager';

describe('RequestDedupeManager', () => {
  beforeEach(() => {
    RequestDedupeManager.clearAllPendingRequests();
  });

  describe('dedupe', () => {
    it('should execute request and return response with isDeduped: false for first call', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'test data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'test-key-1';

      const result = await RequestDedupeManager.dedupe(cacheKey, mockRequester);

      expect(result.response).toBe(mockResponse);
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should return cached response with isDeduped: true for concurrent calls', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'cached data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 100);
          }),
      );

      const cacheKey = 'test-key-2';

      const [result1, result2, result3] = await Promise.all([
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
      ]);

      expect(mockRequester).toHaveBeenCalledTimes(1);
      expect(result1.response).toBe(mockResponse);
      expect(result1.isDeduped).toBe(false);
      expect(result2.response).toBe(mockResponse);
      expect(result2.isDeduped).toBe(true);
      expect(result3.response).toBe(mockResponse);
      expect(result3.isDeduped).toBe(true);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should handle different cache keys independently', async () => {
      const mockResponse1: AxiosResponse<string> = {
        data: 'data 1',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockResponse2: AxiosResponse<string> = {
        data: 'data 2',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester1 = vi.fn().mockResolvedValue(mockResponse1);
      const mockRequester2 = vi.fn().mockResolvedValue(mockResponse2);

      const [result1, result2] = await Promise.all([
        RequestDedupeManager.dedupe('key-1', mockRequester1),
        RequestDedupeManager.dedupe('key-2', mockRequester2),
      ]);

      expect(mockRequester1).toHaveBeenCalledTimes(1);
      expect(mockRequester2).toHaveBeenCalledTimes(1);
      expect(result1.response).toBe(mockResponse1);
      expect(result1.isDeduped).toBe(false);
      expect(result2.response).toBe(mockResponse2);
      expect(result2.isDeduped).toBe(false);
    });

    it('should remove pending request after successful completion', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'test',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'test-key-3';

      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);

      const promise = RequestDedupeManager.dedupe(cacheKey, mockRequester);
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(true);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(1);

      await promise;
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should remove pending request after failed completion', async () => {
      const mockError = new Error('Request failed');
      const mockRequester = vi.fn().mockRejectedValue(mockError);
      const cacheKey = 'test-key-4';

      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);

      const promise = RequestDedupeManager.dedupe(cacheKey, mockRequester);
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(true);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(1);

      await expect(promise).rejects.toThrow('Request failed');
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should handle concurrent requests with one failing', async () => {
      const mockError = new Error('Network error');
      const mockRequester = vi.fn().mockRejectedValue(mockError);
      const cacheKey = 'test-key-5';

      const promises = [
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
      ];

      await expect(Promise.all(promises)).rejects.toThrow('Network error');
      expect(mockRequester).toHaveBeenCalledTimes(1);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should allow new requests after previous request completes', async () => {
      const mockResponse1: AxiosResponse<string> = {
        data: 'first response',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockResponse2: AxiosResponse<string> = {
        data: 'second response',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester1 = vi.fn().mockResolvedValue(mockResponse1);
      const mockRequester2 = vi.fn().mockResolvedValue(mockResponse2);
      const cacheKey = 'test-key-6';

      const result1 = await RequestDedupeManager.dedupe(cacheKey, mockRequester1);
      const result2 = await RequestDedupeManager.dedupe(cacheKey, mockRequester2);

      expect(mockRequester1).toHaveBeenCalledTimes(1);
      expect(mockRequester2).toHaveBeenCalledTimes(1);
      expect(result1.response).toBe(mockResponse1);
      expect(result1.isDeduped).toBe(false);
      expect(result2.response).toBe(mockResponse2);
      expect(result2.isDeduped).toBe(false);
    });

    it('should handle generic type correctly', async () => {
      interface TestData {
        id: number;
        name: string;
      }

      const mockData: TestData = { id: 1, name: 'test' };
      const mockResponse: AxiosResponse<TestData> = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'test-key-7';

      const result = await RequestDedupeManager.dedupe<TestData>(cacheKey, mockRequester);

      expect(result.response.data.id).toBe(1);
      expect(result.response.data.name).toBe('test');
      expect(result.isDeduped).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should track pending requests count correctly', async () => {
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);

      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          }),
      );

      const promise1 = RequestDedupeManager.dedupe('key-1', mockRequester);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(1);

      const promise2 = RequestDedupeManager.dedupe('key-2', mockRequester);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(2);

      await Promise.all([promise1, promise2]);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should check if specific pending request exists', async () => {
      const cacheKey = 'test-pending-key';
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);

      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          }),
      );

      const promise = RequestDedupeManager.dedupe(cacheKey, mockRequester);
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(true);
      expect(RequestDedupeManager.hasPendingRequest('other-key')).toBe(false);

      await promise;
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
    });

    it('should clear all pending requests', async () => {
      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          }),
      );

      RequestDedupeManager.dedupe('key-1', mockRequester);
      RequestDedupeManager.dedupe('key-2', mockRequester);
      RequestDedupeManager.dedupe('key-3', mockRequester);

      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(3);
      expect(RequestDedupeManager.hasPendingRequest('key-1')).toBe(true);
      expect(RequestDedupeManager.hasPendingRequest('key-2')).toBe(true);
      expect(RequestDedupeManager.hasPendingRequest('key-3')).toBe(true);

      RequestDedupeManager.clearAllPendingRequests();

      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
      expect(RequestDedupeManager.hasPendingRequest('key-1')).toBe(false);
      expect(RequestDedupeManager.hasPendingRequest('key-2')).toBe(false);
      expect(RequestDedupeManager.hasPendingRequest('key-3')).toBe(false);
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle empty cache key', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'test',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const result = await RequestDedupeManager.dedupe('', mockRequester);

      expect(result.response).toBe(mockResponse);
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
    });

    it('should handle very long cache keys', async () => {
      const longKey = 'a'.repeat(1000);
      const mockResponse: AxiosResponse<string> = {
        data: 'test',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const result = await RequestDedupeManager.dedupe(longKey, mockRequester);

      expect(result.response).toBe(mockResponse);
      expect(result.isDeduped).toBe(false);
      expect(RequestDedupeManager.hasPendingRequest(longKey)).toBe(false);
    });

    it('should handle requester function that throws synchronously', async () => {
      const mockError = new Error('Synchronous error');
      const mockRequester = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      const cacheKey = 'sync-error-key';

      await expect(RequestDedupeManager.dedupe(cacheKey, mockRequester)).rejects.toThrow('Synchronous error');
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should handle race condition when clearing pending requests during execution', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'test',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<AxiosResponse<string>>((resolve) => {
            setTimeout(() => resolve(mockResponse), 50);
          }),
      );

      const cacheKey = 'race-condition-key';
      const promise = RequestDedupeManager.dedupe(cacheKey, mockRequester);

      setTimeout(() => {
        RequestDedupeManager.clearAllPendingRequests();
      }, 25);

      const result = await promise;
      expect(result.response).toBe(mockResponse);
      expect(result.isDeduped).toBe(false);
    });

    it('should handle multiple sequential calls with same key after error', async () => {
      const mockError = new Error('First request failed');
      const mockResponse: AxiosResponse<string> = {
        data: 'success',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const failingRequester = vi.fn().mockRejectedValue(mockError);
      const successRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'error-recovery-key';

      await expect(RequestDedupeManager.dedupe(cacheKey, failingRequester)).rejects.toThrow('First request failed');
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);

      const result = await RequestDedupeManager.dedupe(cacheKey, successRequester);
      expect(result.response).toBe(mockResponse);
      expect(result.isDeduped).toBe(false);
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
    });

    it('should handle null and undefined responses', async () => {
      const mockResponse: AxiosResponse<null> = {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {} as any,
      };

      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'null-response-key';

      const result = await RequestDedupeManager.dedupe(cacheKey, mockRequester);

      expect(result.response.data).toBe(null);
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
    });
  });
});
