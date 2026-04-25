/**
 * multiParse 함수 결과
 */
export interface IMultiParse<T = unknown> {
  /**
   * 문서 형식
   * - yaml: yaml 파싱
   * - json: json 파싱
   */
  kind: 'yaml' | 'json';

  /**
   * 파싱한 결과
   */
  data: T;
}
