# jin-frame

[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master)

Reusable HTTP request definition library

# Why jin-frame?

When the system designed by MSA architecture, it invokes many APIs repeatedly. These repetitive API calls can be optimized for method extraction by refectoring, but are hardly reusabled and easily make to mistakes. Jin-frame defines the API as a class. Defining APIs in this class allows static type verification with the help of the TypeScript compiler and reduces the probability of errors by abstracting API calls. Jin-frame can use [Axios](https://github.com/axios/axios) to call APIs directly or automatically process up to run.

1. TypeScript compiler can detect error at compile-time
1. HTTP request definition
1. Use Axios ecosystem

# Requirement

1. TypeScript
1. Decorator
   - enable experimentalDecorators, emitDecoratorMetadata option in tsconfig.json

# Install

```sh
npm i jin-frame --save
```

# Useage

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

TestPostQuery class create AxiosRequestConfig object below.

```ts
const query = new TestPostQuery('ironman', 'beam');
console.log(query.request());

// console.log show below,
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

You can change name or skill parameter at run-time. Even if you can change host address. Every change don't make fail and create well-formed AxiosRequestConfig object. Also you can change request time and transformRequest, validateStatus parameter. _x-www-form-urlencoded_ transformRequest already include. You only set content-type params. See _x-www-form-urlencoded_ [testcase](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.post.test.ts).

Execution is simple. Create curried function after execute that function. jin-frame using axios library so using on browser.

```ts
const query = new TestPostQuery('ironman', 'beam');
const res = await query.execute();

// or
const resp = await axios.request(query.request());
```

Also you can use either,

```ts
// change base calss JinFrame to JinEitherFrame
class TestPostQuery extends JinEitherFrame {
  // your definition ...
}

const query = new TestPostQuery('ironman', 'beam');
const res = await query.execute();

if (isFail(res)) {
  // failover action
}
```

# Example

You can find more examples in [examples directory](https://github.com/imjuni/jin-frame/tree/master/examples).
