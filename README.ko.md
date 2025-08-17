# jin-frame

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg?style=flat-square)](https://npmcharts.com/compare/jin-frame?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/issues)
[![NPM version](https://img.shields.io/npm/v/jin-frame.svg?style=flat-square)](https://www.npmjs.com/package/jin-frame)
[![License](https://img.shields.io/npm/l/jin-frame.svg?style=flat-square)](https://github.com/imjuni/jin-frame/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-frame/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

jin-frame은 TypeScript 데코레이터와 클래스를 사용한 API 프레임워크로 API 요청을 선언적으로 작성할 수 있게 도와줍니다. 이렇게 작성한 API 요청은 재사용 가능하며 OOP 상속 구조를 사용하여 확장할 수 있습니다. 또한 Axios를 사용하여 안정성과 호환성을 확보하면서 hook, retry, mocking 등 실무에 필요한 다양한 기능을 제공합니다.

## Why jin-frame?

1. 선언적 API 정의
   - 클래스와 데코레이터를 사용하여 URL, Querystring, Path Parameter, Body, Header를 직관적으로 정의할 수 있습니다
1. 타입 안정성
   - TypeScript 타입 시스템을 사용하며, 타입 불일치를 컴파일 단계에서 검출합니다.
1. Retry, Hook, File Upload, Mocking 지원
   - Retry, Hook, File Upload, Mocking 등 실무에 필요한 기능을 제공합니다.
1. Axios 에코 시스템 활용
1. Path Parameter 지원
   - `example.com/:id` 와 같이 URL을 통한 Path Paramter 치환을 지원합니다.

## Requirements

1. TypeScript
1. Reflect-Metadata
   - tsconfig.json > experimentalDecorators, emitDecoratorMetadata 옵션 활성화

## Install

```sh
npm install jin-frame --save
```

## Useage

```ts
import { Post, Param, Body, Header, Query} from 'jin-frame';

@Post({ host: 'http://some.api.google.com', path: '/jinframe/:passing' })
class TestPostQuery extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({ key: 'test.hello.marvel.name' })
  public declare readonly name: string;

  @Header({ key: 'test.hello.marvel.skill' })
  public declare readonly skill: string;

  @Body({ key: 'test.hello.marvel.gender' })
  public declare readonly gender: string;
}
```

이 클래스는 다음과 같은 axios 요청을 생성합니다.

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

이 객체를 여러 번 생성하더라도 JinFrame은 실수를 하지 않고 언제나 올바른 객체를 생성할 것입니다. 실행하는 과정도 단순합니다. axios를 사용하기 때문에 브라우저에서도 잘 동작합니다.

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.create();

const res = await requester();
```
