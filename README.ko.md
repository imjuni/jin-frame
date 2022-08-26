# jin-frame

[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master)

Reusable HTTP request definitation library

## Why jin-frame?

MSA 아키텍처로 시스템이 구성되면 여러 API를 반복적으로 호출합니다. 이런 반복적인 API 호출은 리펙토링에 의해서 메소드 추출로 최적화할 수 있지만 확장성이 떨어지고 실수를 만들기 쉽습니다. jin-frame은 API를 클래스로 정의합니다. 이렇게 클래스로 API를 정의하면 TypeScript 컴파일러의 도움을 받아 정적 타입 확인을 할 수 있고 반복적인 API 호출을 추상화하여 오류가 발생할 확률을 줄여줍니다. jin-frame은 [Axios](https://github.com/axios/axios)를 사용하여 직접 Axios로 API를 호출하거나 실행까지 자동으로 처리할 수 있습니다.

1. 타입 정의를 통한 정적 타입분석
1. AxiosRequestConfig를 자동 생성하거나 API 호출
1. Axios 에코 시스템과 결합

## Requirement

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
    super({ host: 'http://some.api.yanolja.com/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = name;
    this.skill = skill;
    this.gender = 'male';
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

만약 my-only-either를 사용한다면 다음과 같이 할 수 있습니다.

```ts
class TestPostQuery extends JinEitherFrame {
  @JinFrame.param()
  public readonly passing: string;

  @JinFrame.body({ key: 'test.hello.marvel.name' })
  public readonly name: string;

  @JinFrame.header({ key: 'test.hello.marvel.skill' })
  public readonly skill: string;

  @JinFrame.body({ key: 'test.hello.marvel.gender' })
  public readonly gender: string;

  constructor(name: string, skill: string) {
    super({ host: 'http://some.api.yanolja.com/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = name;
    this.skill = skill;
    this.gender = 'male';
  }
}

const query = new TestPostQuery('ironman', 'beam');
const requester = query.create();

const res = await requester();

if (isFail(res)) {
  // failover action
}
```
