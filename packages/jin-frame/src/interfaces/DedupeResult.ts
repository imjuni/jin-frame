import type { AxiosResponse } from 'axios';

/**
 * Result interface for deduplicated requests
 * @template T - The response data type
 */
export interface DedupeResult<T> {
  /** The response from the HTTP request */
  reply: AxiosResponse<T>;
  /** Whether this request was deduplicated (true) or was the original request (false) */
  isDeduped: boolean;
}
