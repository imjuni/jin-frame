/**
 * Convert Swagger/OpenAPI path templating to path-to-regexp format.
 * Examples:
 *  - "/pet/{petId}"            -> "/pet/:petId"
 *  - "/files/{path*}"          -> "/files/:path*"
 *  - "/pets/{id}?/photos"      -> "/pets/:id?/photos"
 *  - "/search/{q}/{page?}"     -> "/search/:q/:page?"
 *  - "/assets/{file:.+}"       -> "/assets/:file(.+)"
 *  - "/things/{+slug}"         -> "/things/:slug"      // RFC6570 reserved '+' 무시
 *
 * Note:
 *  - OpenAPI 표준은 {param}만 정의하지만, 실무 편의를 위해
 *    {name?}, {name*}, {name+}, {name:regex}, {*splat} 등을 지원한다.
 */
export function swaggerPathToPathToRegexp(path: string): string {
  return path.replace(/{([^}]+)}/g, (_, rawInner) => {
    let inner = `${rawInner}`.trim();

    // RFC6570 reserved expansion 지원 흔적: {+var} -> var
    if (inner.startsWith('+')) inner = inner.slice(1).trim();

    // 끝의 수량자/옵셔널 기호 파악: ?, *, +
    let modifier = '';
    const last = inner.slice(-1);
    if (last === '?' || last === '*' || last === '+') {
      modifier = last;
      inner = inner.slice(0, -1).trim();
    }

    // {*splat} 같은 형태: 맨 앞 * 는 이름 없는 와일드카드 관용
    if (modifier === '' && inner.startsWith('*')) {
      modifier = '*';
      inner = inner.slice(1).trim();
    }

    // 커스텀 정규식: {id:[0-9]+} / {file:.+}
    let name = inner;
    let pattern = '';
    const colonIdx = inner.indexOf(':');
    if (colonIdx !== -1) {
      name = inner.slice(0, colonIdx).trim();
      pattern = inner.slice(colonIdx + 1).trim(); // 그대로 쓰되 괄호로 감싼다
    }

    // 파라미터 이름을 안전한 식별자로 정리 (하이픈, 점 등 -> _)
    const safeName = name.replace(/[^\w$]/g, '_');
    if (safeName === '') return _; // 비정상은 원문 유지

    // path-to-regexp 문법으로 변환
    if (pattern) return `:${safeName}(${pattern})${modifier}`;
    return `:${safeName}${modifier}`;
  });
}
