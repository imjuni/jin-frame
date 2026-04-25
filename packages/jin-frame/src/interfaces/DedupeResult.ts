import type { JinResp } from '#interfaces/JinResp';

/**
 * Result interface for deduplicated requests
 * @template Pass - The response data type
 */
export interface DedupeResult<Pass, Fail> {
  /** The response from the HTTP request */
  reply: JinResp<Pass, Fail>;
  /** Whether this request was deduplicated (true) or was the original request (false) */
  isDeduped: boolean;
}
