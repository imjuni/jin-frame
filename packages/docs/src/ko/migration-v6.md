---
outline: deep
---

# 6.0 마이그레이션

`jin-frame` 6.0.0과 generator-cli·generator-core 1.0.0을 함께 사용합니다. 런타임은 네이티브 `fetch`를 사용합니다. Node.js는 `^22.23.4`를 충족해야 하며 이 범위에는 24와 26이 포함되지 않습니다. 생성기는 TypeScript >= 6, openapi-typescript >= 7이 필요하며 런타임 라이브러리는 TypeScript >= 5.0을 지원합니다.

## 왜 6.0에서 호환성을 깨는 변경이 필요했나

직접 작성한 프레임, OpenAPI 생성 코드, 반환 타입 추론, 런타임 검증이 동일한 HTTP 계약을 표현하도록 맞추는 것이 목적입니다. 기존 pass/fail 모델의 한계를 해결하려면 공개 타입과 설정 방식을 함께 바꿔야 했습니다.

### HTTP 수용 여부와 응답 스키마는 서로 다르다

5.x의 `JinFrame<Pass, Fail>`은 응답 본문을 수용·거부 두 그룹으로 구분했습니다. 하지만 200·201·204·404·500은 서로 다른 본문을 가질 수 있고, 호출자가 404를 의도적으로 수용할 수도 있습니다. 수용 정책이 바뀌어도 상태별 본문 계약은 유지돼야 합니다. 숫자 status/data union은 이 관계를 보존하므로 status로 해당 본문을 좁힐 수 있습니다. ok는 런타임 수용 여부를 나타내는 boolean으로 남습니다. 이전 제네릭과 ok 판별을 유지하면 해결하려던 모호함도 그대로 남습니다.

### 반환 타입은 호출 지점의 수용 정책과 일치해야 한다

기본 호출은 명세의 2xx 응답을 반환 타입으로 추론합니다. 타입 가드인 validateStatus 도우미는 200·404처럼 특정 상태를 선택하고, 일반 boolean 콜백은 보수적으로 전체 union을 유지합니다. 클래스 데코레이터는 자신의 타입 가드를 메서드의 반환 타입 추론에 전달할 수 없습니다. 그래서 데코레이터의 validateStatus를 제거하고 _execute()·_create() 호출 옵션으로 옮겼습니다. 두 설정을 함께 유지하면 실제로 반환되는 상태와 타입이 약속하는 상태가 달라질 수 있습니다.

### 검증기도 같은 전체 응답을 봐야 한다

pass/fail로 검증기를 선택하면 의도적으로 수용한 404가 성공 본문용 검증기에 들어갈 수 있습니다. 상태별 검증기 인스턴스 맵도 애플리케이션의 스키마 선택 정책을 등록 설정에 다시 나누게 합니다. 단일 BaseValidator가 getData()와 validator()를 통해 전체 응답을 받고, 사용자 코드가 status를 보고 적합한 스키마로 data를 검증하도록 정리했습니다. 헤더 등 메타데이터도 유지됩니다. 기본 getData()는 입력 응답을 그대로 반환합니다. 등록 형식과 제네릭을 바꾼 이유는 본문만 추출하면서 상태와 본문의 관계가 끊기는 일을 막기 위해서입니다.

### 응답 없는 실패와 실제 HTTP 오류를 구별해야 한다

네트워크·취소 실패에는 HTTP 응답이 없을 수 있습니다. 이때 가상의 500 응답을 만들면 서버가 실제로 그 상태와 본문을 보낸 것처럼 오해하게 됩니다. 응답 없는 오류는 resp를 undefined로 두고 원본 cause를 보존합니다. 실제 응답을 받은 뒤 추출·검증에서 예외가 나면 해당 응답을 유지합니다. 따라서 소비자 코드에서도 resp의 존재를 확인하고 검증 실패와 전송 실패를 구분해야 합니다.

### 런타임과 생성된 클라이언트를 함께 이전해야 한다

OpenAPI는 상태 코드와 media type별로 응답을 정의합니다. 생성기 1.0.0은 런타임 6.0에 맞는 숫자 status/data union을 생성하므로 이전 프레임, 사용자 템플릿, 훅, 검증기 시그니처를 모두 그대로 유지할 수는 없습니다. 타입과 프레임을 함께 재생성하고 사용하는 애플리케이션 코드도 확인해야 합니다. content-type별 판별은 아직 완료되지 않았습니다. 현재 생성기는 같은 상태의 여러 media type 본문을 union으로 합치며 범위 키와 default 응답은 제외합니다.

공개 제네릭, 타입 좁히기, 등록 방식, 오류 처리의 변경을 명시적으로 알리기 위해 메이저 버전을 올렸습니다. 모든 변화가 6.0에서 시작된 것은 아닙니다. 네이티브 fetch, Axios·Either 제거, URI template 전환은 5.x의 변경입니다. 빌드 도구와 통합 문서 패키지의 변경은 유지보수 개선이며 그 자체로 소비자 API의 메이저 버전 사유는 아닙니다. 과거 릴리즈와 버전별 이전 안내는 [CHANGED.md](https://github.com/imjuni/jin-frame/blob/master/CHANGED.md)에 통합했습니다.

## 응답 타입

`JinFrame<Pass, Fail>`를 `JinFrame<{ status: number; data: DTO }>` 또는 상태별 응답 union으로 변경합니다. `JinPassResp`와 `JinFailResp`는 `JinResp<Response>`로 교체합니다.

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

호출 옵션에 `validateStatus`가 없으면 반환 타입은 명세의 2xx 응답으로 좁혀집니다. `validateStatus(200, 404)`는 타입 가드로 해당 상태를 선택합니다. `() => true`처럼 boolean을 반환하는 콜백은 전체 응답 union을 유지합니다. 데코레이터의 validateStatus는 제거됐습니다. 수용 정책을 _execute()·_create() 호출 옵션으로 옮겨 런타임과 반환 타입을 일치시킵니다.

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
