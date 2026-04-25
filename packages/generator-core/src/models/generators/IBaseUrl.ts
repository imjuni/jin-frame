/**
 * Base URL endpoint를 정의
 */
export interface IBaseUrl {
  /**
   * jin-frame에서 사용할 base-frame의 출처
   *
   * - option: core 함수에 옵션으로 전달한 host
   * - spec-url: OpenAPI spec document를 다운로드한 URL
   * - document-server: OpenAPI spec document의 server 부분
   * - path-server: OpenAPI spec paths에서 개별 endpoint의 server 부분
   * */
  kind: 'option' | 'spec-url' | 'document-server' | 'path-server';

  /**
   * base-frame에서 사용할 url
   */
  url: URL;
}
