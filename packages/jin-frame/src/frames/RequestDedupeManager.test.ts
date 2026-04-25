import { describe, expect, it, beforeEach, vi } from 'vitest';
import { RequestDedupeManager } from './RequestDedupeManager';

describe('RequestDedupeManager', () => {
  beforeEach(() => {
    RequestDedupeManager.clearAllPendingRequests();
  });

  describe('dedupe', () => {
    it('should execute request and return response with isDeduped: false for first call', async () => {
      const mockResponse = new Response(JSON.stringify('test data'), { status: 200, statusText: 'OK' });
      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'test-key-1';

      const result = await RequestDedupeManager.dedupe(cacheKey, mockRequester);

      expect(result.resp.status).toBe(200);
      expect(await result.resp.json()).toBe('test data');
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should return cached response with isDeduped: true for concurrent calls', async () => {
      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<Response>((resolve) => {
            setTimeout(() => resolve(new Response(JSON.stringify('cached data'), { status: 200, statusText: 'OK' })), 100);
          }),
      );

      const cacheKey = 'test-key-2';

      const [result1, result2, result3] = await Promise.all([
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
        RequestDedupeManager.dedupe(cacheKey, mockRequester),
      ]);

      expect(mockRequester).toHaveBeenCalledTimes(1);
      expect(result1.resp.status).toBe(200);
      expect(result1.isDeduped).toBe(false);
      expect(result2.resp.status).toBe(200);
      expect(result2.isDeduped).toBe(true);
      expect(result3.resp.status).toBe(200);
      expect(result3.isDeduped).toBe(true);
      expect(await result1.resp.json()).toBe('cached data');
      expect(await result2.resp.json()).toBe('cached data');
      expect(await result3.resp.json()).toBe('cached data');
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);
    });

    it('should handle different cache keys independently', async () => {
      const mockRequester1 = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('data 1'), { status: 200, statusText: 'OK' }),
      );
      const mockRequester2 = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('data 2'), { status: 200, statusText: 'OK' }),
      );

      const [result1, result2] = await Promise.all([
        RequestDedupeManager.dedupe('key-1', mockRequester1),
        RequestDedupeManager.dedupe('key-2', mockRequester2),
      ]);

      expect(mockRequester1).toHaveBeenCalledTimes(1);
      expect(mockRequester2).toHaveBeenCalledTimes(1);
      expect(result1.resp.status).toBe(200);
      expect(result1.isDeduped).toBe(false);
      expect(result2.resp.status).toBe(200);
      expect(result2.isDeduped).toBe(false);
      expect(await result1.resp.json()).toBe('data 1');
      expect(await result2.resp.json()).toBe('data 2');
    });

    it('should remove pending request after successful completion', async () => {
      const mockResponse = new Response(JSON.stringify('test'), { status: 200, statusText: 'OK' });
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
      const mockRequester1 = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('first response'), { status: 200, statusText: 'OK' }),
      );
      const mockRequester2 = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('second response'), { status: 200, statusText: 'OK' }),
      );
      const cacheKey = 'test-key-6';

      const result1 = await RequestDedupeManager.dedupe(cacheKey, mockRequester1);
      const result2 = await RequestDedupeManager.dedupe(cacheKey, mockRequester2);

      expect(mockRequester1).toHaveBeenCalledTimes(1);
      expect(mockRequester2).toHaveBeenCalledTimes(1);
      expect(result1.resp.status).toBe(200);
      expect(result1.isDeduped).toBe(false);
      expect(result2.resp.status).toBe(200);
      expect(result2.isDeduped).toBe(false);
      expect(await result1.resp.json()).toBe('first response');
      expect(await result2.resp.json()).toBe('second response');
    });

    it('should handle response correctly', async () => {
      const mockResponse = new Response(JSON.stringify({ id: 1, name: 'test' }), { status: 200, statusText: 'OK' });
      const mockRequester = vi.fn().mockResolvedValue(mockResponse);
      const cacheKey = 'test-key-7';

      const result = await RequestDedupeManager.dedupe(cacheKey, mockRequester);

      expect(result.resp.status).toBe(200);
      expect(result.resp.ok).toBe(true);
      expect(result.isDeduped).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should track pending requests count correctly', async () => {
      expect(RequestDedupeManager.getPendingRequestsCount()).toBe(0);

      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<Response>((resolve) => {
            setTimeout(() => resolve(new Response(null, { status: 200 })), 100);
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
          new Promise<Response>((resolve) => {
            setTimeout(() => resolve(new Response(null, { status: 200 })), 100);
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
          new Promise<Response>((resolve) => {
            setTimeout(() => resolve(new Response(null, { status: 200 })), 100);
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
      const mockRequester = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('test'), { status: 200, statusText: 'OK' }),
      );

      const result = await RequestDedupeManager.dedupe('', mockRequester);

      expect(result.resp.status).toBe(200);
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
    });

    it('should handle very long cache keys', async () => {
      const longKey = 'a'.repeat(1000);
      const mockRequester = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('test'), { status: 200, statusText: 'OK' }),
      );

      const result = await RequestDedupeManager.dedupe(longKey, mockRequester);

      expect(result.resp.status).toBe(200);
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
      const mockRequester = vi.fn().mockImplementation(
        async () =>
          new Promise<Response>((resolve) => {
            setTimeout(
              () => resolve(new Response(JSON.stringify('test'), { status: 200, statusText: 'OK' })),
              50,
            );
          }),
      );

      const cacheKey = 'race-condition-key';
      const promise = RequestDedupeManager.dedupe(cacheKey, mockRequester);

      setTimeout(() => {
        RequestDedupeManager.clearAllPendingRequests();
      }, 25);

      const result = await promise;
      expect(result.resp.status).toBe(200);
      expect(result.isDeduped).toBe(false);
    });

    it('should handle multiple sequential calls with same key after error', async () => {
      const mockError = new Error('First request failed');
      const failingRequester = vi.fn().mockRejectedValue(mockError);
      const successRequester = vi.fn().mockResolvedValue(
        new Response(JSON.stringify('success'), { status: 200, statusText: 'OK' }),
      );
      const cacheKey = 'error-recovery-key';

      await expect(RequestDedupeManager.dedupe(cacheKey, failingRequester)).rejects.toThrow('First request failed');
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);

      const result = await RequestDedupeManager.dedupe(cacheKey, successRequester);
      expect(result.resp.status).toBe(200);
      expect(result.isDeduped).toBe(false);
      expect(RequestDedupeManager.hasPendingRequest(cacheKey)).toBe(false);
    });

    it('should handle no-content responses', async () => {
      const mockRequester = vi.fn().mockResolvedValue(new Response(null, { status: 204, statusText: 'No Content' }));
      const cacheKey = 'null-response-key';

      const result = await RequestDedupeManager.dedupe(cacheKey, mockRequester);

      expect(result.resp.status).toBe(204);
      expect(result.isDeduped).toBe(false);
      expect(mockRequester).toHaveBeenCalledTimes(1);
    });
  });
});
