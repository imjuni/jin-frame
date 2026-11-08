---
outline: deep
---

# 6.0 마이그레이션

`jin-frame` 6.0.0과 generator-cli·generator-core 1.0.0을 함께 사용합니다. 런타임은 네이티브 `fetch`를 사용합니다. Node.js는 `^22.23.4`를 충족해야 하며 이 범위에는 24와 26이 포함되지 않습니다. 생성기는 TypeScript >= 6, openapi-typescript >= 7이 필요하며 런타임 라이브러리는 TypeScript >= 5.0을 지원합니다.

## 응답 타입

`JinFrame<DTO>`를 `JinFrame<{ status: number; data: DTO }>` 또는 상태별 응답 union으로 변경합니다. `JinPassResp`와 `JinFailResp`는 `JinResp<Response>`로 교체합니다.

```ts
import { Get, JinFrame, validateStatus } from 'jin-frame';

type UserResponse =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };

@Get({ host: 'https://api.example.com', path: '/user' })
class UserFrame extends JinFrame<UserResponse> {}

const frame = UserFrame.of({});
const success = await frame._execute();
console.log(success.data.name);

const reply = await frame._execute({ validateStatus: validateStatus(200, 404) });
if (reply.status === 200) {
  console.log(reply.data.name);
} else {
  console.error(reply.data.message);
}
```

호출 옵션에 `validateStatus`가 없으면 반환 타입은 명세의 2xx 응답으로 좁혀집니다. `validateStatus(200, 404)`는 타입 가드로 해당 상태를 선택합니다. `() => true`처럼 boolean을 반환하는 콜백은 전체 응답 union을 유지합니다. 데코레이터에 지정한 콜백은 런타임 수용 여부를 제어하지만 호출의 반환 타입에는 반영되지 않으므로, 2xx 외 상태를 수용한다면 호출 옵션에도 대응하는 검증기를 전달합니다.

`ok`는 `validateStatus`가 응답을 수용했는지 나타내는 boolean입니다. `data` 타입은 `status`로 좁힙니다. `validator: new ApiValidator()`로 전체 응답을 받는 검증기를 등록하고 내부에서 상태별 스키마를 선택합니다.

## 오류 처리

거부된 HTTP 상태는 실제 응답을 `resp`에 담은 `JinRespError`를 발생시킵니다. 네트워크 오류 등 응답이 없는 실패는 `resp === undefined`일 수 있으므로 `cause`를 확인합니다. 진단용 기본값인 `status: 500`은 실제 HTTP 500 응답을 의미하지 않습니다. `validateStatus: () => true`도 네트워크 오류를 응답으로 바꾸지 않습니다.

## 인스턴스 메서드

요청은 `_execute()`로 실행합니다. 인스턴스 메서드는 `_` 접두사를 사용하며 정적 생성 메서드는 `of()`, `builder()`를 사용합니다. [네이밍 컨벤션](./method/naming-convention)을 참고하세요.

## 클라이언트 재생성

[생성기 패키지](./generator)를 1.0.0으로 올리고 클라이언트를 재생성합니다. 생성된 프레임은 명세의 숫자 상태 코드 2xx~5xx를 단일 응답 union으로 사용합니다. 본문이 없는 응답은 `data: undefined`를 사용하며 `default`, `2XX` 같은 범위 키는 숫자 리터럴 union에서 제외합니다.


## 검증기 이전

기존 pass/fail 설정과 상태별 검증기 맵을 단일 `validator`로 교체합니다. `BaseValidator<Replies, TError>`는 전체 응답 union을 받으며 별도 TData 타입 인수는 없습니다. `getData()`는 기본적으로 전체 응답을 반환하므로 보통 재정의할 필요가 없습니다. `validator(response)` 안에서 상태를 검사하고 적절한 스키마로 `response.data`를 검증합니다.

```ts
// Before
validators: { pass: userValidator, fail: errorValidator }

// After
validator: new ApiValidator({ type: 'exception' })
```

[전체 응답 검증 예제](./method/validation)
