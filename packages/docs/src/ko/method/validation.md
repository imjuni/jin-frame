---
outline: deep
---

# Response validation with Zod

TypeScript 선언은 서버가 보낸 값을 검사하지 않습니다. 하나의 Validator가 전체 response를 받아 `status`에 맞는 schema를 선택합니다.

```sh
pnpm add zod
```

## Status-specific schemas

아래 예제는 200과 404의 body 계약을 검증합니다. 가상 API 주소를 실제 서버로 교체하고 서버의 response 형식에 맞춰 schema를 정의합니다. response와 schema 식별자 위에서 type를 확인할 수 있습니다.

```ts twoslash
import { z } from 'zod';
import { BaseValidator, Get, JinFrame, validateStatus } from 'jin-frame';
import type { ValidationInput, ValidationResult } from 'jin-frame';

const userSchema = z.object({ id: z.string(), name: z.string() });
const errorSchema = z.object({ message: z.string() });

type Replies =
  | { status: 200; data: z.infer<typeof userSchema> }
  | { status: 404; data: z.infer<typeof errorSchema> };

class UserValidator extends BaseValidator<Replies, string> {
  validator({ status, data }: ValidationInput<Replies>): ValidationResult<string> {
    // Choose the schema by HTTP status, including accepted error statuses.
    const schema = status === 200 ? userSchema : errorSchema;
    const result = schema.safeParse(data);

    // Convert Zod issues to the library's validation result contract.
    return result.success
      ? { valid: true }
      : { valid: false, error: result.error.issues.map((issue) => issue.message) };
  }
}

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
  validator: new UserValidator({ type: 'value' }),
})
class UserFrame extends JinFrame<Replies> {}

// Accept 404 as a response while still validating its error-body schema.
const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });
if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

## Failure policy

| HTTP 허용 여부 | schema 결과 | 동작 |
| --- | --- | --- |
| 허용 | 유효 또는 Validator 없음 | response 반환 |
| 허용 | 무효, `value` 모드 | `valid: false`, `$validated.error`와 함께 response 반환 |
| 허용 | 무효, `exception` 모드 | response를 가진 `JinValidationError` 발생 |
| 거부 | 유효·무효 모두 | response와 검증 결과를 가진 `JinRespError` 발생 |

`validator: instance` 또는 `@Validator(instance)`로 등록합니다. 상태별 instance 맵을 등록하는 API가 아니며, 상태 선택은 `validator()` 안에서 수행합니다. 등록하지 않으면 검증 성공으로 처리합니다.

## Complete response input

`ValidationInput<Replies>`에는 `status`, `data`, `headers`, `raw`, `ok`가 있습니다. 기본 `getData()`는 전체 입력을 반환합니다. 오버라이드하더라도 body만 추출하지 말고 전체 response를 유지합니다. `ok`는 schema 일치가 아니라 호출의 HTTP 허용 여부입니다.

`validator()`는 결과 또는 Promise를 반환합니다. `{ valid: false, error: [...] }` 반환과 예외 발생은 다릅니다. schema 실행·역직렬화 중 예상하지 못한 예외는 `cause`와 확보된 response를 가진 `JinRespError`로 감쌉니다.

검증은 `reply.data`를 변환하지 않습니다. Zod의 변환·default value·field 제거 결과인 `result.data`는 자동 반영하지 않습니다. 204처럼 schema가 없는 상태의 정책은 명시적으로 정합니다. 빈 body의 `data`는 `undefined`입니다.

[상태 정책과 오류](./responses)를 참고하세요.
