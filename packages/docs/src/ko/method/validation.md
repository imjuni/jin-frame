---
outline: deep
---

# 응답 검증

단일 검증기가 전체 응답을 받아 상태 코드에 맞는 스키마를 선택합니다. `getData()` 기본 구현은 입력 응답을 그대로 반환하고, `validator()`는 `status`와 `data`를 함께 받습니다. `BaseValidator<Replies, TError>`의 `Replies`는 프레임과 동일한 `{ status, data }` union입니다.

## 상태별 스키마 선택

아래 예제는 별도로 설치한 Zod를 사용하지만 라이브러리는 스키마 도구에 의존하지 않습니다. 204처럼 검증할 스키마가 없는 상태의 처리는 검증기에서 결정합니다.

```ts
import { z } from 'zod';
import { BaseValidator, Get, JinFrame, Validator } from 'jin-frame';
import type { ValidationInput, ValidationResult } from 'jin-frame';

const userSchema = z.object({ name: z.string() });
const errorSchema = z.object({ message: z.string() });
type Replies =
  | { status: 200; data: z.infer<typeof userSchema> }
  | { status: 204; data: undefined }
  | { status: 404; data: z.infer<typeof errorSchema> }
  | { status: 500; data: z.infer<typeof errorSchema> };

const schemas: Partial<Record<Replies['status'], z.ZodType>> = {
  200: userSchema,
  404: errorSchema,
  500: errorSchema,
};

class ApiValidator extends BaseValidator<Replies, z.ZodIssue> {
  // Optional: the default implementation already returns the whole response.
  getData(response: ValidationInput<Replies>): ValidationInput<Replies> {
    return response;
  }

  validator(response: ValidationInput<Replies>): ValidationResult<z.ZodIssue> {
    const schema = schemas[response.status];
    if (schema === undefined) return { valid: true };
    const result = schema.safeParse(response.data);
    return result.success
      ? { valid: true }
      : { valid: false, error: result.error.issues };
  }
}

@Get({ host: 'https://api.example.com', path: '/user',
  validator: new ApiValidator({ type: 'value' }),
})
class UserFrame extends JinFrame<Replies> {}

const reply = await UserFrame.of({})._execute({ validateStatus: () => true });
if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

## 입력과 등록

`ValidationInput<Replies>`에는 `status`, `data`, `statusText`, `headers`, `raw`, `ok`가 포함되며 아직 확정되지 않은 `valid`·`$validated`는 없습니다. `getData()`를 재정의할 때도 전체 응답 타입을 반환합니다. 본문만 반환하면 상태와 본문의 관계를 잃으므로 허용하지 않습니다.

`validator()`는 동기·비동기 검증 결과를 지원합니다. `TError`는 검증기의 오류 항목 타입이며 프레임 응답에서는 `unknown`으로 노출됩니다. 반환된 검증 결과는 본문을 변환하거나 교체하지 않습니다. 타입 인수는 실제 응답의 유효성을 보장하지 않으므로 스키마로 실제 값을 확인해야 합니다.

```ts
@Validator<Replies>(new ApiValidator({ type: 'exception' }))
@Get({ host: 'https://api.example.com', path: '/user' })
class DecoratedFrame extends JinFrame<Replies> {}
```

메서드 옵션의 `validator`와 `@Validator()` 중 하나로 등록합니다. 기존 데코레이터·상속 우선순위를 유지하며 검증기를 여러 개 합치지 않습니다.

## 실패 정책

| HTTP acceptance | Validation | Result |
| --- | --- | --- |
| Accepted | Valid or no validator | Return response |
| Accepted | Invalid, value mode | Return response with valid: false |
| Accepted | Invalid, exception mode | JinValidationError |
| Rejected | Any validation result | JinRespError with response and validation result |

`validateStatus`는 HTTP 수용 여부만 결정합니다. 같은 검증기가 수용·거부된 응답에 모두 실행되며, 스키마 선택은 검증기 내부에서 결정합니다. 검증기를 등록하지 않으면 `valid: true`와 `$validated: { valid: true }`가 되지만 거부된 HTTP 상태는 여전히 예외입니다.

`getData()`나 `validator()` 자체가 던진 예외는 `JinRespError.cause`에 보존되고 실제 HTTP 상태·본문·헤더·raw도 유지됩니다. 이는 정상적인 `{ valid: false }` 반환과 구분됩니다. HTTP 응답이 없는 네트워크 실패에서는 `resp`가 `undefined`입니다.
