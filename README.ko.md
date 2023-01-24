# jin-frame

[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master)[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)

Reusable HTTP request definitation library

## Why jin-frame?

RESTful API는 GraphQL, gRPC, tRPC 등 다양한 프로토콜이 있는 지금도 가장 인기 있는 API 구현 방식입니다. iOS, Android, Web 등 다양한 플랫폼에서 사용할 수 있는 API를 쉽게 개발할 수 있습니다. 하지만 RESTful API 수가 많아 질 수록 API를 사용하기 위한 코드를 작성하는 작업은 반복적이고 지루합니다. 여러 프로젝트에서 재사용 가능하게 만드는 작업은 쉽지 않고, 이를 별도 패키지로 다수 프로젝트에서 사용하는 것은 더 어렵습니다.

jin-frame은 이러한 RESTful API를 간결하고 명확하게 정의하고 별도 패키지로 분리하여 여러 프로젝트에서 재사용하는 것을 목표로 개발된 확장 가능한 RESTful API 정의 시스템 입니다.

1. API 파라미터에 타입 체크
1. OOP 디자인을 활용한 API 정의 확장
1. Axios 에코 시스템 활용
1. ctix를 활용한 별도 패키지 구축

## Requirements

1. TypeScript
1. Reflect-Metadata
   - tsconfig.json > experimentalDecorators, emitDecoratorMetadata 옵션 활성화

## Install

```sh
npm i jin-frame --save
```

## Useage

```ts
class TestPostQuery extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;

  @JinFrame.body({ key: 'test.hello.marvel.name' })
  public readonly name: string;

  @JinFrame.header({ key: 'test.hello.marvel.skill' })
  public readonly skill: string;

  @JinFrame.body({ key: 'test.hello.marvel.gender' })
  public readonly gender: string;

  constructor(name: string, skill: string) {
    super({ ...args, host: 'http://some.api.yanolja.com/jinframe/:passing', method: 'POST' });
  }
}
```

이 클래스는 다음과 같은 axios 요청을 생성합니다.

```ts
const query = new TestPostQuery('ironman', 'beam');
console.log(query.request());
```

```js
{
  timeout: 2000,
  headers: { test: { hello: { marvel: { skill: 'beam' } } }, 'Content-Type': 'application/json' },
  method: 'POST',
  data: { test: { hello: { marvel: { name: 'ironman', gender: 'male' } } } },
  transformRequest: undefined,
  url: 'http://some.api.yanolja.com/jinframe/pass',
  validateStatus: () => true
}
```

이름이나 스킬을 변경하더라도 일정하게 요청 객체가 생성됩니다. timeout, transformRequest, validateStatus 등 다양한 부분을 자동으로 생성하며 실수하기 쉬운 data, headers 에서 depth 역시 올바르게 생성합니다. 이 객체를 여러 번 생성하더라도 JinFrame은 실수를 하지 않고 언제나 올바른 객체를 생성할 것입니다.

실행하는 과정도 단순합니다. 요청을 보내는 함수를 생성하고 실행하면 나머지 작업은 모두 JinFrame이 작업합니다. 물론 이 과정은 모두 axios를 사용하기 때문에 브라우저에서도 잘 동작합니다.

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.create();

const res = await requester();
```

만약 my-only-either를 사용한다면 JinEitherFrame를 사용해서 Either 인터페이스를 사용할 수도 있습니다.
