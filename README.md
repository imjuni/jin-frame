# jin-frame

[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master) [![codecov](https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-frame)

Reusable HTTP request definition library. Create `template` for Your HTTP Request!

| Axios Usage                      | Jin-Frame                               |
| -------------------------------- | --------------------------------------- |
| ![axios](assets/axios-usage.png) | ![jin-frame](assets/jinframe-usage.png) |

## Why?

RESTful API is still the most popular API implementation way with various protocols such as GraphQL, gRPC, and tRPC. It is easy to develop APIs that can be used on various platforms such as iOS, Android, and Web. However, as the number of RESTful APIs increases, writing code for using APIs is repetitive and boring. Furthermore, Making it reusable on multiple projects is not easy, and it is more difficult to use it on multiple projects as a separate package.

jin-frame is a extendable RESTful API definition system developed with the aim fo defining these RESTful APIs concisely and clearly, separating them into separate packages, and resuing them in multiple projects.

1. Type check on API parameters
1. Extending API definitions using OOP design
1. Utilize the Axios ecosystem
1. Build a separate package using ctix

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

  // automatically initialize via base class, have to use same name of args and JinFrame class
  // execute `Object.keys(args).forEach(key => this[key] = args[key])`
  constructor(args: OmitConstructorType<TestPostQuery, 'host' | 'method' | 'contentType'>) {
    super({ ...args, host: 'http://some.api.yanolja.com/jinframe/:id', method: 'POST' });
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

## Requirement

1. TypeScript
1. Decorator
   - enable experimentalDecorators, emitDecoratorMetadata option in `tsconfig.json`

## Axios version

| jin-frame | axios     |
| --------- | --------- |
| 2.x       | <= 0.27.x |
| 3.x       | >= 1.1.x  |

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
