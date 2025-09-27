import type { AxiosRequestConfig } from 'axios';

/**
 * Debug information for HTTP requests
 */
export interface IDebugInfo {
  /** Timestamp information when the request started */
  ts: {
    /** Unix timestamp with milliseconds as string */
    unix: string;
    /**
     * ISO timestamp without hyphens, containing only T character and dot
     * @example "20210721T112233.444"
     */
    iso: string;
  };

  /** Request execution duration in milliseconds */
  duration: number;

  /** Whether the request was deduplicated */
  isDeduped: boolean;

  /** Axios request configuration object */
  req: AxiosRequestConfig;
}
