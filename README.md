# jin-frame

[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master)

Reusable HTTP request definition library. Ok, Create `template` for Your HTTP Request!

| Axios Usage                      | Jin-Frame                               |
| -------------------------------- | --------------------------------------- |
| ![axios](assets/axios-usage.png) | ![jin-frame](assets/jinframe-usage.png) |

## Why?

When the system designed by MSA architecture, it invokes many APIs repeatedly. These repetitive API calls can be optimized for method extraction by refectoring, but are hardly reusabled and easily make to mistakes. Jin-frame defines the API as a class. Defining APIs in this class allows static type verification with the help of the TypeScript compiler and reduces the probability of errors by abstracting API calls. Jin-frame can use [Axios](https://github.com/axios/axios) to call APIs directly or automatically process up to run.

1. TypeScript compiler can detect error at compile-time
1. HTTP request definition
1. Use Axios ecosystem
1. Inheritance
1. Support FileUpload

## Requirement

1. TypeScript
1. Decorator
   - enable experimentalDecorators, emitDecoratorMetadata option in tsconfig.json

## Axios version

| jin-frame | axios     |
| --------- | --------- |
| 2.x       | <= 0.27.x |
| 3.x       | >= 1.1.x  |

## Install

```sh
npm i jin-frame --save
```

## Useage

```ts
class TestPostQuery extends JinFrame {
  @JinFrame.param()
  public readonly id!: number;

  @JinFrame.body({ replaceAt: 'test.hello.marvel.name' })
  public readonly name!: string;

  @JinFrame.header({ replaceAt: 'test.hello.marvel.skill' })
  public readonly skill!: string;

  @JinFrame.body({ replaceAt: 'test.hello.marvel.gender' })
  public readonly gender!: string;

  // automatically initialize via base class, have to use same name of args and JinFrame class
  // execute `Object.keys(args).forEach(key => this[key] = args[key])`
  constructor(args: OmitConstructorType<TestPostQuery, 'host' | 'method' | 'contentType'>) {
    super({ host: 'http://some.api.yanolja.com/jinframe/:id', method: 'POST', ...args });
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
  url: 'http://some.api.yanolja.com/jinframe/1',
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

## Form

The form data is `multipart/form-data` and `application/x-www-form-urlencoded`. Use to upload files or submit form fields data.

### application/x-www-form-urlencoded

`application/x-www-form-urlencoded` converts from data using the `trasformRequest` function in [axios](https://github.com/axios/axios). For jin-frame, if you set the `application/x-www-form-urlencoded` to content-type, use the built-in transformRequest function or pass transformRequest function to constructor.

### multipart/form-data

jin-frame uses the [form-data](https://github.com/form-data/form-data) package for form-data processing. If you set the `multipart/form-data` content-type, use the form-data package to generate the AxiosRequestConfig data field value. Alternatively, upload the file by passing the customBody constructor parameter.

## Mocking

jin-frame use axios internally. So you can use [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adpater';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet('/users').reply(200, {
  users: [{ id: 1, name: 'John Smith' }],
});

const frame = new UserFrame({ params: { searchText: 'John' } });
const reply = await frame.execute();

console.log(response.data);
```

## Example

You can find more examples in [examples directory](https://github.com/imjuni/jin-frame/tree/master/examples).
