import type { JsonValue } from 'type-fest';
import type { IMultiParse } from '#/tools/interfaces/IMultiParse';

/**
 * load 함수 실행 결과
 *
 * @type T load 함수를 실행했을 때 parse 후 데이터 형식. 기본 값은 JsonValue 타입
 */
export interface ILoadResult<T = JsonValue> {
  /**
   * 파일을 읽은 경로
   * - file: 파일에서 OpenAPI Spec 문서를 읽음
   * - url: url에서 OpenAPI Spec 문서를 읽음
   * */
  from: 'file' | 'url';

  kind: IMultiParse<T>['kind'];

  /**
   * load 함수 실행 결과로 읽은 데이터
   */
  data: T;
}
