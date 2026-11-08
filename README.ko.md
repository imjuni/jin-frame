# jin-frame

[통합 문서](https://imjuni.github.io/jin-frame/ko/packages)


![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg?style=flat-square)](https://npmcharts.com/compare/jin-frame?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/issues)
[![NPM version](https://img.shields.io/npm/v/jin-frame.svg?style=flat-square)](https://www.npmjs.com/package/jin-frame)
[![License](https://img.shields.io/npm/l/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)
[![code style: Biome](https://img.shields.io/badge/code_style-Biome-60a5fa.svg?style=flat-square)](https://biomejs.dev/)

**HTTP Request** = **TypeScript Class**

TypeScript 데코레이터와 클래스를 사용해 HTTP 요청을 선언적으로 정의하는 라이브러리입니다. 네이티브 `fetch` 위에 구축되어 별도의 HTTP 클라이언트 의존성이 없습니다.

<!-- markdownlint-disable MD033 -->
<p align="center">
   <img src="assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
</p>
<!-- markdownlint-enable MD033 -->

## Why jin-frame?

1. **선언적 API 정의** — 클래스와 데코레이터로 URL, QueryString, Path Parameter, Body, Header를 직관적으로 정의
2. **타입 안전성** — 숫자 `status` 기반 판별 유니온 응답 타입, 컴파일 단계 오류 검출
3. **Retry, Hook, File Upload, Timeout, AbortSignal 지원**
4. **네이티브 `fetch` 기반** — 별도 HTTP 클라이언트 불필요
5. **RFC 6570 URI Template** — `{param}` 형식의 path parameter 지원
6. **Builder 패턴** — 컴파일 시점 필드 완전성 체크
7. **상속 친화적** — 부모 클래스에 host/auth 정의, 자식 클래스에서 path만 오버라이드
8. **런타임 URL 오버라이드** — `_execute()` 호출 시 host, pathPrefix, path 변경 가능

## 6.0.0 릴리즈

`jin-frame` 6.0.0과 `@jin-frame/generator-cli`·`@jin-frame/generator-core` 1.0.0을 함께 사용합니다. 5.x에서 업그레이드할 때는 [6.0 마이그레이션 가이드](https://imjuni.github.io/jin-frame/ko/migration-v6)를 확인하세요.

## 목차 <!-- omit in toc -->

- [설치](#설치)
- [버전](#버전)
- [사용법](#사용법)
- [데코레이터](#데코레이터)
- [상속](#상속)
- [Builder 패턴](#builder-패턴)
- [상태 코드별 응답](#상태-코드별-응답)
- [Retry, Timeout](#retry-timeout)
- [Authorization](#authorization)
- [validateStatus](#validatestatus)
- [런타임 URL 오버라이드](#런타임-url-오버라이드)
- [네이밍 컨벤션](#네이밍-컨벤션)
- [요구사항](#요구사항)
- [문서](#문서)
- [License](#license)

## 설치

```sh
npm install jin-frame --save
```

```sh
yarn add jin-frame --save
```

```sh
pnpm add jin-frame --save
```

## 버전

| 버전 | HTTP 클라이언트 | 비고 |
|------|----------------|------|
| < 5.0 | Axios | `axios` peer dependency 필요 |
| 5.x | 네이티브 `fetch` | 기존 응답 타입 API |
| 6.x | 네이티브 `fetch` | 상태 코드별 응답 union, Node.js ^22.23.4 필요 |

## 사용법

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

const frame = PokemonFrame.of({ name: 'pikachu', tid: randomUUID() });
const reply = await frame._execute();

if (reply.status === 200) {
  console.log(reply.data);
}
```

## 데코레이터

### 메서드 데코레이터

| 데코레이터 | 설명 |
|-----------|------|
| `@Get` | HTTP GET |
| `@Post` | HTTP POST |
| `@Put` | HTTP PUT |
| `@Patch` | HTTP PATCH |
| `@Delete` | HTTP DELETE |
| `@Head` | HTTP HEAD |
| `@Options` | HTTP OPTIONS |
| `@Retry` | 재시도 설정 |
| `@Timeout` | 요청 타임아웃 |
| `@Dedupe` | 동일한 동시 요청 중복 제거 |
| `@Security` | 인증 Security Provider |
| `@Validator` | 응답 유효성 검사기 |

### 필드 데코레이터

| 데코레이터 | 매핑 대상 |
|-----------|----------|
| `@Param` | URL path parameter (`{name}`) |
| `@Query` | URL query string |
| `@Body` | Request body 필드 |
| `@ObjectBody` | Request body (객체 전체 병합) |
| `@Header` | Request header |
| `@Cookie` | `Cookie` request header |

## 상속

부모 클래스에 공통 설정(host, auth, pathPrefix, 기본 필드값)을 정의하고, 자식 클래스에서 path만 오버라이드하는 패턴이 핵심입니다.

```ts
import { Get, Post, Param, Header, Body, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({ host: 'https://pokeapi.co', pathPrefix: '/api/v2' })
class PokeApiFrame extends JinFrame {
  @Header({ replaceAt: 'X-Request-Id' })
  declare public readonly requestId: string;

  // 모든 자식 클래스에서 requestId 자동 주입
  protected static override getDefaultValues() {
    return { requestId: randomUUID() };
  }
}

@Get({ path: '/pokemon/{name}' })
class GetPokemonFrame extends PokeApiFrame {
  @Param()
  declare public readonly name: string;
}

@Post({ path: '/pokemon' })
class CreatePokemonFrame extends PokeApiFrame {
  @Body()
  declare public readonly name: string;
}

// requestId는 getDefaultValues로 자동 설정
const frame = GetPokemonFrame.of({ name: 'pikachu' });
const reply = await frame._execute();
```

## Builder 패턴

`builder()`는 타입 레벨에서 설정된 필드를 추적합니다. 모든 public 필드가 할당되어야만 `build()`가 가능하며, 미입력 필드는 컴파일 에러로 검출됩니다.

```ts
const frame = PokemonFrame.builder()
  .set('name', 'pikachu')
  .set('tid', randomUUID())
  .build(); // public 필드가 누락되면 컴파일 에러

const reply = await frame._execute();
```

`of()`에서도 builder 콜백을 사용할 수 있습니다:

```ts
const frame = PokemonFrame.of((b) => b.set('name', 'pikachu').set('tid', randomUUID()));
```

## 상태 코드별 응답

`JinFrame`은 `{ status, data }` 응답 union 하나를 타입 인수로 받습니다. `status`로 분기하면 `data` 타입이 좁혀집니다.

```ts
type PokemonResponse =
  | { status: 200; data: Pokemon }
  | { status: 404; data: ErrorBody };

class PokemonFrame extends JinFrame<PokemonResponse> {}

const reply = await frame._execute({ validateStatus: () => true });
if (reply.status === 200) {
  console.log(reply.data);
} else {
  console.error(reply.data);
}
```

### 생성된 상태 코드별 응답 타입

OpenAPI 생성기는 명세의 숫자 상태 코드(2xx~5xx)를 `{ status, data }` union으로 묶어 `JinFrame`의 단일 타입 인수로 전달합니다. `status`를 검사하면 해당 응답의 `data` 타입이 좁혀집니다. 본문이 없는 응답의 `data`는 `undefined`입니다.

기본적으로 2xx 외의 응답은 기존처럼 예외를 발생시킵니다. 오류 응답을 직접 받으려면 `_execute({ validateStatus: () => true })`를 사용합니다. 생성된 클래스는 항상 명세의 전체 숫자 상태 코드를 선언합니다. 호출 옵션에 검증기가 없으면 반환 타입은 2xx로 좁혀지고, `() => true`를 전달하면 전체 union을 반환합니다. `validateStatus(200, 404)`를 사용하면 런타임과 반환 타입에서 해당 상태를 선택합니다. `default`와 `2XX` 같은 범위 키는 숫자 리터럴 union에 포함하지 않습니다.

이 변경은 타입 API의 호환성을 변경합니다. 기존 `JinFrame<DTO>`는 `JinFrame<{ status: number; data: DTO }>`로, 상태별 응답이 있으면 해당 union으로 이전합니다. `JinPassResp`·`JinFailResp`는 `JinResp<Response>`로 통합되었습니다. `validators.pass/fail` 설정은 응답 수용·거부 경로의 검증기를 선택하는 용도로 유지됩니다.

## Retry, Timeout

```ts
@Timeout(2000)
@Retry({ max: 5, interval: 1000 })
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

지수 백오프 예시:

```ts
@Retry({
  max: 5,
  getInterval: (retry) => Math.min(1000 * 2 ** retry, 30_000),
})
```

## Authorization

```ts
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  authorization: process.env.YOUR_KEY_HERE,
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;
}
```

## validateStatus

데코레이터 레벨에서 기본값으로 설정하거나, `_execute()` 호출 시 오버라이드할 수 있습니다:

```ts
// 데코레이터 레벨 기본값
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/{name}',
  validateStatus: (ok, status) => ok || status === 404,
})
export class PokemonFrame extends JinFrame { ... }

// _execute() 레벨 오버라이드 (우선 적용)
const reply = await frame._execute({
  validateStatus: (ok, status) => ok || status === 304,
});
```

## 런타임 URL 오버라이드

`_execute()` 호출 시 `host`, `pathPrefix`, `path`를 오버라이드할 수 있습니다:

```ts
const reply = await frame._execute({
  host: 'https://staging.api.example.com',
  pathPrefix: '/v3',
  path: '/pokemon/{name}',
});
```

## 네이밍 컨벤션

| 접두사 | 용도 |
|--------|------|
| `#` | 내부 상태 (JavaScript private field) — 자식 클래스에서 접근 불가 |
| `_` | 모든 인스턴스 메서드 — public API, hook, 내부 헬퍼 |
| _(없음)_ | 정적 메서드 |

전체 규칙은 [네이밍 컨벤션](https://imjuni.github.io/jin-frame/ko/method/naming-convention) 문서를 참고하세요.

## 요구사항

- Node.js ^22.23.4
- TypeScript >= 5.0
- `tsconfig.json`에서 `experimentalDecorators`, `emitDecoratorMetadata` 활성화

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 문서

[문서 워크스페이스](packages/docs/README.md)에서 세 패키지의 가이드와 API 레퍼런스를 함께 관리합니다. 로컬 실행은 `pnpm docs:dev`, 빌드는 `pnpm docs:build`를 사용합니다.

전체 문서: **[https://imjuni.github.io/jin-frame/ko/](https://imjuni.github.io/jin-frame/ko/)**

- [시작하기](https://imjuni.github.io/jin-frame/ko/getting-to-start)
- [상속](https://imjuni.github.io/jin-frame/ko/method/inheritance)
- [Builder 패턴](https://imjuni.github.io/jin-frame/ko/method/builder)
- [URL Template (RFC 6570)](https://imjuni.github.io/jin-frame/ko/method/url-template)
- [폼 / 파일 업로드](https://imjuni.github.io/jin-frame/ko/method/form)
- [Retry](https://imjuni.github.io/jin-frame/ko/method/retry)
- [Authorization](https://imjuni.github.io/jin-frame/ko/method/authorization)
- [유효성 검사](https://imjuni.github.io/jin-frame/ko/method/validation)
- [네이밍 컨벤션](https://imjuni.github.io/jin-frame/ko/method/naming-convention)

## License

This software is licensed under the [MIT](LICENSE).



## 응답이 없는 오류 처리

`JinRespError.resp`는 완전한 HTTP 응답 객체이거나 `undefined`입니다. 응답이 없는 네트워크 오류에서는 `data`, `headers`, `raw`를 가진 가짜 응답을 만들지 않습니다. 원본 오류는 `cause`에 보존됩니다.

HTTP 상태가 거부된 경우에는 `resp`에 실제 응답의 `status`, `data`, `headers`, `raw`와 검증 결과가 유지됩니다. `resp`가 없을 때 오류 객체의 `status`·`statusText`는 내부 진단용 값입니다. 기본값인 `500`·`Internal Server Error`는 서버가 실제로 500을 반환했다는 의미가 아닙니다.

`validateStatus: () => true`도 네트워크 오류를 반환값으로 바꾸지 않습니다. 응답 생성 전후의 훅 또는 역직렬화 과정에서 발생한 오류도 `JinRespError`로 래핑될 수 있으므로, `resp === undefined`만으로 네트워크 장애라고 단정하지 말고 `cause`를 함께 확인합니다.

```ts
import { JinRespError } from 'jin-frame';

try {
  await frame._execute();
} catch (error) {
  if (!(error instanceof JinRespError)) throw error;

  const response = error.resp;
  if (response === undefined) {
    console.error(error.message, error.cause);
  } else {
    console.error(response.status, response.data, response.headers);
  }
}
```
