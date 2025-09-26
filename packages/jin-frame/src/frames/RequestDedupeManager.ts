import type { AxiosResponse } from 'axios';

export interface DedupeResult<T> {
  response: AxiosResponse<T>;
  isDeduped: boolean;
}

export class RequestDedupeManager {
  // 현재 진행 중인 요청들을 저장 (key: cacheKey, value: Promise)
  private static pendingRequests = new Map<string, Promise<AxiosResponse<unknown>>>();

  static async dedupe<T>(cacheKey: string, requesterFn: () => Promise<AxiosResponse<T>>): Promise<DedupeResult<T>> {
    const existingPromise = this.pendingRequests.get(cacheKey);
    if (existingPromise) {
      const response = (await existingPromise) as AxiosResponse<T>;
      return { response, isDeduped: true };
    }

    // 새로운 요청 생성 및 pendingRequests에 먼저 등록
    const promise = requesterFn()
      .then((response) => {
        // 성공시 pending에서 안전하게 제거
        this.pendingRequests.delete(cacheKey);
        return response;
      })
      .catch((error) => {
        // 실패시에도 pending에서 안전하게 제거
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    // race condition 방지: promise 생성 후 즉시 등록
    this.pendingRequests.set(cacheKey, promise);

    const response = await promise;
    return { response, isDeduped: false };
  }

  // 디버깅 및 모니터링을 위한 유틸리티 메서드들
  static getPendingRequestsCount(): number {
    return this.pendingRequests.size;
  }

  static clearAllPendingRequests(): void {
    this.pendingRequests.clear();
  }

  static hasPendingRequest(cacheKey: string): boolean {
    return this.pendingRequests.has(cacheKey);
  }
}
