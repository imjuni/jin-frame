/**
 * Result interface for deduplicated requests
 * @template Pass - The response data type
 */
export interface DedupeResult {
  /** The response from the HTTP request */
  resp: Response;
  /** Whether this request was deduplicated (true) or was the original request (false) */
  isDeduped: boolean;
}
