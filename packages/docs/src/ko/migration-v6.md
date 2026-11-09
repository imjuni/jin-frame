---
outline: deep
---

# Migrating to v6

런타임 `jin-frame` 6.x와 생성기 1.x를 함께 사용하고 생성기 변경 후 클라이언트를 다시 생성합니다. Node.js는 선언된 엔진 `>=22.23.4`를 충족해야 합니다. 생성기는 TypeScript >= 6, openapi-typescript >= 7을 사용합니다.

## Migration checklist

| 이전 방식 | 현재 방식 |
| --- | --- |
| `JinFrame<Pass, Fail>` | `{ status, data }` 유니온 하나 |
| `JinPassResp` / `JinFailResp` | 상태로 판별하는 `JinResp<Response>` |
| decorator의 `validateStatus` | `_execute()`·`_create()` 호출 option |
| pass/fail별 Validator | 상태로 schema를 선택하는 Validator 하나 |
| `error.resp`가 항상 존재한다고 가정 | undefined 검사 후 `cause` 확인 |
| Provider constructor 첫 인자의 이름 | 키 또는 동기 키 반환 function |
| default value type에 정적 `typeof this` 사용 | `Partial<PublicFieldsOf<ChildFrame>>` 명시 |

## Response types

```ts twoslash
import { Get, JinFrame, validateStatus } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
})
class UserFrame extends JinFrame<Replies> {}

// A typed predicate accepts the error response without losing its body type.
const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });
if (reply.status === 404) {
  console.log(reply.data.message);
}
```

## Authentication constructors

`new BearerTokenProvider('token')`은 이제 이름이 아니라 토큰입니다. 사용자 이름 메타데이터는 `new BearerTokenProvider(undefined, 'schemeName')`으로 유지합니다. API 키는 `new ApiKeyProvider(key, keyName, location, name?)`입니다. 비동기 조회는 decorator 인증값 또는 `@Security(provider, asyncSupplier)`를 사용합니다.

생성된 Security 하위 class는 선택적인 constructor 키를 받고 OpenAPI scheme 이름은 메타데이터로 유지합니다. 생성 결과뿐 아니라 사용자 템플릿도 갱신해야 scheme 이름이 인증값으로 전송되는 문제를 피할 수 있습니다.

## Factories and defaults

필수 공개 field가 없을 때만 `of()`·`of(undefined)`를 허용합니다. 필수 field가 있으면 object나 콜백이 필요합니다. protected static 메서드의 default value를 자동 추론하지 않으므로 default value로 채우는 필수 field도 object 인자에서는 필수입니다.

## Validation and errors

전체 상태·body response를 받도록 Validator를 바꾸고 `getData()`도 전체 response를 보존합니다. pass/fail 등록 맵이 아니라 Validator 내부에서 schema를 고릅니다. 오류의 상태·body를 읽기 전에 `resp`를 검사합니다.

## Earlier major versions

Axios·Either 제거와 RFC 6570 URL 템플릿은 이전 마이그레이션에 해당합니다. 현재 예제는 fetch와 `_execute()`를 사용합니다. 역사적인 API는 [변경 이력](https://github.com/imjuni/jin-frame/blob/master/CHANGED.md)에서 확인하며 새 코드에 복사하지 않습니다.

## Generated responses

명시적인 숫자 상태만 response 변형으로 생성합니다. `2XX` 범위와 `default`는 제외합니다. 같은 상태의 여러 content type은 body 유니온이 되며 media type 판별자는 추가하지 않습니다. [생성기 설정](./generator-core/configuration)을 참고하세요.
