# jin-frame이란?

## Introduction

jin-frame은 HTTP 요청을 TypeScript 클래스로 정의하고 네이티브 `fetch`로 전송하는 라이브러리입니다. 데코레이터로 클래스 필드를 경로 매개변수, 쿼리 문자열, 헤더, 요청 본문에 연결합니다.

요청 클래스에는 엔드포인트의 URL, 입력 필드, 타임아웃, 재시도 설정을 모아 둡니다. 여러 엔드포인트가 사용하는 호스트나 인증 설정은 부모 클래스에 정의할 수 있습니다.

## Why jin-frame?

- **HTTP API를 TypeScript 클래스로 정의합니다.** HTTP 메서드, 엔드포인트, 타임아웃, 재시도 정책, 인증 설정을 요청 필드와 함께 선언합니다.
- **API별 운영 요구사항을 설정에 반영합니다.** 엔드포인트마다 다른 타임아웃, 재시도 정책과 요청 옵션을 지정합니다.
- **응답을 검증하고 중복 요청을 줄입니다.** 검증기로 응답 데이터를 확인하고, 동시에 실행되는 동일한 요청은 중복 제거 기능으로 하나의 네트워크 호출을 공유합니다.
- **상속으로 API 설정의 계층을 표현합니다.** 부모 클래스에 공통 설정을 정의하고 자식 클래스에서 재정의해 API의 계층 구조를 반영합니다.

## 요청과 응답 타입

`of()`는 클래스에 선언한 필드로 요청 객체를 만듭니다. 상태 코드마다 응답 본문이 다른 API라면 `{ status, data }` union을 선언하고 `status`를 확인해 `data` 타입을 좁힙니다.

타입 선언은 서버 응답을 런타임에 검증하지 않습니다. 반환된 데이터가 스키마에 맞는지 확인하려면 [응답 검증기](./method/validation)를 등록합니다.

## 엔드포인트별 설정

아래 목록 요청의 타임아웃은 10초입니다. 상세 요청은 타임아웃이 2초이고, 실패하면 1초 간격으로 최대 세 번 재시도합니다.

```ts
import { Get, JinFrame, Param, Query } from 'jin-frame';

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon',
  timeout: 10_000, // 10 seconds
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  timeout: 2_000, // 2 seconds
  retry: { max: 3, interval: 1000 }, // Retry up to 3 times at 1-second intervals
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

## 공통 요청 동작

- [훅](./method/hook)은 요청 전후와 재시도 시점에 실행됩니다.
- [상속](./method/inheritance)으로 여러 요청 클래스의 설정과 훅을 공유합니다.
- [폼 데이터](./method/form)는 URL 인코딩 필드와 multipart 파일 업로드를 지원합니다.
- [모킹](./method/mocking)은 MSW로 요청을 가로채 API 서버 호출 없이 테스트합니다.

요청 클래스를 패키지로 내보내 여러 프로젝트에서 사용할 수도 있습니다. 설치와 실행 예제는 [시작하기](./getting-to-start)를 참고하세요.
