# jin-frame
[![Download Status](https://img.shields.io/npm/dw/jin-frame.svg)](https://npmcharts.com/compare/jin-frame?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout)](https://github.com/imjuni/jin-frame) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg)](https://github.com/imjuni/jin-frame/issues) [![NPM version](https://img.shields.io/npm/v/jin-frame.svg)](https://www.npmjs.com/package/jin-frame) [![License](https://img.shields.io/npm/l/jin-frame.svg)](https://github.com/imjuni/jin-frame/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/jin-frame.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master)

Repeatable HTTP request definition library

jin-frame is tool that create repeatable HTTP request. If you develop under MSA architecture or AWS, Azure who use same API call over and over again. This action is sucessfully processed but sometimes raise error in copy and paste. If you definition HTTP request to TypeScript class, jin-frame create same request every time, reduce fail.

## Breaking change
Either data type change.


From

```ts
import { Either } from 'my-easy-fp';
```

To

```ts
import { Either } from 'fp-ts/lib/Either';
```

### Why?

#### Pros.
1. fp-ts have variety feature. Especially pipe and chain is fantastic feature.
1. my-easy-fp cannot support pipe, chain, toMap etc.

#### Cons.
1. left, right, isLeft, isRight hard to understanding than efail, epass, isFail, isPass.


## Why jin-frame?
You can define HTTP request to TypeScript class. Also you can pass TypeScript type at sucess or fail. See below benefits of the this definition.

1. TypeScript can detect error at compile-time
1. Automate HTTP request creation
1. Use variety axios ecosystem

# Requirement
1. TypeScript
1. Decorator

# Install
```sh
npm i jin-frame --save
```

# Useage
jin-frame using [axios](https://github.com/axios/axios) library. See below example.

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

You can change name or skill parameter at run-time. Even if you can change host address. Every change don't make fail and create well-formed AxiosRequestConfig object. Also you can change request time and transformRequest, validateStatus parameter. _x-www-form-urlencoded_ transformRequest already include. You only set content-type params. See _x-www-form-urlencoded_ [testcase](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.post.test.ts). 

Execution is simple. Create curried function after execute that function. jin-frame using axios library so using on browser. 

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.createWithoutEither();

const res = await requester();
```

If you can use easy-fp, use either. See below.

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.create();

const res = await requester();

if (isFail(res)) {
  // failover action
}
```

# Arguments
## request function
* timeout?: number
    * request timeout, milliseconds
* userAgent?: string;
    * custom user-agent string
* validateStatus?: AxiosRequestConfig['validateStatus'];
    * validateStatus function. See validateStatus description in [request config](https://github.com/axios/axios#request-config)
## createWithEither function
* timeout?: number
    * request timeout, milliseconds
* userAgent?: string;
    * custom user-agent string
* validateStatus?: AxiosRequestConfig['validateStatus'];
    * validateStatus function. See validateStatus description in [request config](https://github.com/axios/axios#request-config)
## create function
* timeout?: number
    * request timeout, milliseconds
* userAgent?: string;
    * custom user-agent string
* validateStatus?: AxiosRequestConfig['validateStatus'];
    * validateStatus function. See validateStatus description in [request config](https://github.com/axios/axios#request-config)