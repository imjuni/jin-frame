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

**HTTP Reqest** = **TypeScript Class**

A reusable, declarative, type-safe, and extendable HTTP request library.

<!-- markdownlint-disable MD033 -->
<p align="center">
   <img src="assets/jin-frame-brand.png" alt="brand" width="400"/>
</p>
<!-- markdownlint-enable MD033 -->

Why `jin-frame`?

1. Declarative API Definition
2. Type Safety
3. Support for Retry, Hooks, File Upload, Timeout and Mocking
4. Build upon the Axios Ecosystem
5. Path Parameter Support

## Table of Contents <!-- omit in toc -->

- [Comparison of direct usage and jin-frame](#comparison-of-direct-usage-and-jin-frame)
- [Requirements](#requirements)
- [Install](#install)
- [Usage](#usage)
- [Axios version](#axios-version)
- [Retry, Timeout](#retry-timeout)
- [Mocking](#mocking)
- [Form](#form)
  - [application/x-www-form-urlencoded](#applicationx-www-form-urlencoded)
  - [multipart/form-data](#multipartform-data)
  - [Field for logging, debugging](#field-for-logging-debugging)
- [Example](#example)
- [License](#license)

## Comparison of direct usage and jin-frame

| Direct usage                        | Jin-Frame                                  |
| ----------------------------------- | ------------------------------------------ |
| ![axios](assets/axios-usage.png)    | ![jin-frame](assets/jinframe-usage.png)    |
| [axios svg](assets/axios-usage.svg) | [jin-frame svg](assets/jinframe-usage.svg) |

## Requirements

1. TypeScript
1. Decorator
   - enable experimentalDecorators, emitDecoratorMetadata option in `tsconfig.json`

```jsonc
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    // enable experimentalDecorators, emitDecoratorMetadata for using decorator
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```

## Install

```sh
npm install jin-frame --save
```

```sh
yarn add jin-frame --save
```

```sh
pnpm add jin-frame --save
```

## Usage

This is example of union param, body, header parameter.

```ts
import { Post, Param, Body, Header, Query } from 'jin-frame';

@Post({ host: 'https://api.superhero.com', path: '/:name' })
class TestPostQuery extends JinFrame {
  @Header()
  declare public readonly Authorization: string;

  @Param()
  declare public readonly name: string;

  @Body()
  declare public readonly team: string;

  @Body()
  declare public readonly gender: string;
}
```

TestPostFrame class create AxiosRequestConfig object below.

```ts
const frame = TestPostFrame.of({ 
  Authorization: 'Bearer aaa3657e-cd78-4bcd-a311-109a7500b60f', 
  name: 'ironman', 
  team: 'advengers', 
  gender: 'male'
});

console.log(frame.request());

// console.log show below,
{
  timeout: 2000,
  headers: { 
    Authorization: 'Bearer aaa3657e-cd78-4bcd-a311-109a7500b60f',
    'Content-Type': 'application/json'
  },
  method: 'POST',
  data: { team: 'advengers', gender: 'male' },
  transformRequest: undefined,
  url: 'https://api.superhero.com/ironman',
  validateStatus: () => true
}
```

You can direct execute jin-frame. Curried request function create after execute it. jin-frame using axios library so using on browser.

```ts
const frame = TestPostFrame.of({ 
  Authorization: 'Bearer aaa3657e-cd78-4bcd-a311-109a7500b60f', 
  name: 'ironman', 
  team: 'advengers', 
  gender: 'male'
});
const res = await frame.execute();
```

## Axios version

| jin-frame | axios     |
| --------- | --------- |
| 2.x       | <= 0.27.x |
| 3.x       | >= 1.1.x  |
| 4.x       | >= 1.4.x  |

## Retry, Timeout

Retry and Timeout can be easily applied without installing additional packages.

```ts
import { Post, Param, Body, Header, Query, Retry } from 'jin-frame';

@Timeout(2000) // Timeout after 2000ms
@Retry({ max: 5, interval: 1000 }) // Retry up to 5 times with 1000ms interval
@Post({ host: 'https://api.superhero.com', path: '/:name' })
class TestPostQuery extends JinFrame {
  @Header()
  declare public readonly Authorization: string;

  @Param()
  declare public readonly name: string;

  @Body()
  declare public readonly team: string;

  @Body()
  declare public readonly gender: string;
}
```

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

const frame = UserFrame.of({ params: { searchText: 'John' } });
const reply = await frame.execute();

console.log(response.data);
```

## Form

The form data is `multipart/form-data` and `application/x-www-form-urlencoded`. Use to upload files or submit form fields data.

### application/x-www-form-urlencoded

`application/x-www-form-urlencoded` converts from data using the `trasformRequest` function in [axios](https://github.com/axios/axios). For jin-frame, if you set the `application/x-www-form-urlencoded` to content-type, use the built-in transformRequest function or pass transformRequest function to constructor.

### multipart/form-data

jin-frame uses the [form-data](https://github.com/form-data/form-data) package for form-data processing. If you set the `multipart/form-data` content-type, use the form-data package to generate the AxiosRequestConfig data field value. Alternatively, upload the file by passing the customBody constructor parameter.

### Field for logging, debugging

query, header, param, body getter function have each request parameter.

```ts
const frame = TestPostFrame.of({ id: 1, name: 'ironman', skill: 'beam' });
// jin-frame build body, header, query, param variable
const res = await frame.execute();

// You can verify body, header, query parameter
console.log(frame.getData('body'));
console.log(frame.getData('header'));
console.log(frame.getData('query'));
console.log(frame.getData('param'));
```

## Example

You can find more examples in [examples directory](https://github.com/imjuni/jin-frame/tree/master/examples).

## License

This software is licensed under the [MIT](LICENSE).
