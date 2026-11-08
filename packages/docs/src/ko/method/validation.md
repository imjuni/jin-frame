---
outline: deep
---

# 응답 검증

상태 코드별로 검증기를 등록합니다. 해당 상태의 검증기가 없으면 `valid: true`, `$validated: { valid: true }`가 됩니다. `validateStatus`는 반환·예외를 결정하며 검증기 선택에 영향을 주지 않습니다.

## BaseValidator

```ts
import { BaseValidator, Get, JinFrame, Validator } from 'jin-frame';
import type { ValidationInput, ValidatorMap, ValidationResult } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };
type Success = Extract<Replies, { status: 200 }>;

class UserValidator extends BaseValidator<Success, string, string> {
  getData(reply: ValidationInput<Success>): string {
    return reply.data.name;
  }

  validator(name: string): ValidationResult<string> {
    return typeof name === 'string' && name.length > 0
      ? { valid: true }
      : { valid: false, error: ['missing name'] };
  }
}

const validators = {
  200: new UserValidator({ type: 'exception' }),
} satisfies ValidatorMap<Replies>;

@Get({ host: 'https://api.example.com', path: '/user', validators })
class UserFrame extends JinFrame<Replies> {}

const reply = await UserFrame.of({})._execute();
```

`BaseValidator<Response, TData, TError>`의 `Response`는 `{ status, data }` 타입입니다. `getData()`는 응답에서 검증할 값을 추출하고 `validator()`는 동기 또는 비동기로 검증합니다. 두 메서드는 필수입니다. `ValidationInput`은 상태·본문·헤더·raw·ok를 제공하며 아직 확정되지 않은 검증 결과는 포함하지 않습니다. 타입 인수는 실제 응답을 보장하지 않으므로 스키마 검증에서 실제 값을 확인해야 합니다.

## 등록 방법

```ts
@Validator<Replies>(validators)
@Get({ host: 'https://api.example.com', path: '/user' })
class ValidatedUserFrame extends JinFrame<Replies> {}
```

위 예제에는 `Validator` import가 필요합니다. `ValidatorMap<Replies>` 또는 `@Validator<Replies>`로 상태별 입력 타입을 검사합니다. 기존 데코레이터·상속 우선순위를 유지하며 맵을 상태별로 병합하지 않습니다.

## 실패 처리 정책

| HTTP acceptance | Validation | Result |
| --- | --- | --- |
| Accepted | Valid or no validator | Return response |
| Accepted | Invalid, value mode | Return response with valid: false |
| Accepted | Invalid, exception mode | JinValidationError |
| Rejected | Any validation result | JinRespError with response and validation result |

`getData()` 또는 `validator()`가 예외를 던지면 `JinRespError`에 실제 응답과 원본 `cause`를 보존합니다. 검증은 본문을 변환하거나 교체하지 않습니다.

## 404·500 응답 검증과 value 모드

다음 예제는 404와 500을 수용하면서 각각의 본문을 검증합니다. 같은 본문 구조를 가진 상태들은 하나의 검증기 클래스를 재사용할 수 있습니다. 200은 검증기를 등록하지 않았으므로 검증 성공으로 처리됩니다.

```ts
import { BaseValidator, Get, JinFrame, validateStatus } from 'jin-frame';
import type { ValidationInput, ValidationResult, ValidatorMap } from 'jin-frame';

type Responses =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } }
  | { status: 500; data: { message: string } };
type ErrorResponse = Extract<Responses, { status: 404 | 500 }>;

class ErrorBodyValidator extends BaseValidator<ErrorResponse, unknown, string> {
  getData(reply: ValidationInput<ErrorResponse>): unknown {
    return reply.data;
  }

  validator(data: unknown): ValidationResult<string> {
    return typeof data === 'object' && data !== null &&
      'message' in data && typeof data.message === 'string'
      ? { valid: true }
      : { valid: false, error: ['message must be a string'] };
  }
}

const validators = {
  404: new ErrorBodyValidator({ type: 'value' }),
  500: new ErrorBodyValidator({ type: 'value' }),
} satisfies ValidatorMap<Responses>;

@Get({ host: 'https://api.example.com', path: '/user', validators })
class ApiFrame extends JinFrame<Responses> {}

const reply = await ApiFrame.of({})._execute({
  validateStatus: validateStatus(200, 404, 500),
});

if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

`reply.valid`는 boolean 요약값입니다. 오류 목록은 `reply.$validated.valid`로 분기한 뒤 읽습니다. `TError`는 검증기 자체의 결과 타입이며 프레임의 `$validated`에서는 `unknown`으로 노출됩니다. `getData()`가 추출한 값과 스키마 파싱 결과는 응답 본문에 다시 할당되지 않습니다.

## 예외와 원본 응답

`exception`은 검증기가 `{ valid: false, error: [...] }`를 반환했을 때의 정책입니다. 수용한 응답에서만 `JinValidationError`가 발생합니다. 거부한 404·500은 검증 실패 여부와 관계없이 `JinRespError`이며, `resp.$validated`로 검증 결과를 확인합니다. 검증기를 등록하지 않았더라도 거부한 HTTP 상태가 정상 반환되는 것은 아닙니다.

`getData()` 또는 비동기 `validator()` 자체가 던진 오류는 `JinRespError.cause`에 보존됩니다. 이때 이미 받은 `resp.status`, `resp.data`, `resp.headers`, `resp.raw`도 유지됩니다. HTTP 응답 자체가 없는 네트워크 실패에서는 `resp`가 `undefined`입니다.
