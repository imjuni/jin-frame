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
   <img src="assets/jin-frame-brand-icon.png" alt="brand" width="500"/>
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
- [Install](#install)
- [Usage](#usage)
- [Retry, Timeout](#retry-timeout)
- [Authorization](#authorization)
- [Requirements](#requirements)
  - [Decorator](#decorator)
  - [Axios version](#axios-version)
- [Example](#example)
- [License](#license)

## Comparison of direct usage and jin-frame

| Direct usage                        | Jin-Frame                                  |
| ----------------------------------- | ------------------------------------------ |
| ![axios](assets/axios-usage.png)    | ![jin-frame](assets/jinframe-usage.png)    |
| [axios svg](assets/axios-usage.svg) | [jin-frame svg](assets/jinframe-usage.svg) |

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

This is simple example of pokeapi.co.

```ts
import { Get, Param, Query, JinFrame } from 'jin-frame';
import { randomUUID } from 'node:crypto';

@Get({ 
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/:name',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

(async () => {
  const frame = PokemonFrame.of({ 
    name: 'pikachu', 
    tid: randomUUID(),
  });
  const reply = await frame.execute();
  
  // Show Pikachu Data
  console.log(reply.data);
})();
```

## Retry, Timeout

Retry and Timeout can be easily applied without installing additional packages.

```ts
import { Param, Query, Retry, Timeout, JinFrame } from 'jin-frame';

@Timeout(2000) // Timeout after 2000ms
@Retry({ max: 5, interval: 1000 }) // Retry up to 5 times with 1000ms interval
@Get({ 
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/:name',
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

## Authorization

```ts
import { Get, Param, Query } from 'jin-frame';

@Get({ 
  host: 'https://pokeapi.co'
  path: '/api/v2/pokemon/:name'
  authorization: process.env.YOUR_KEY_HERE
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

## Requirements

### Decorator

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

### Axios version

| jin-frame | axios     |
| --------- | --------- |
| 2.x       | <= 0.27.x |
| 3.x       | >= 1.1.x  |
| 4.x       | >= 1.4.x  |

## Example

You can find more examples in [examples directory](https://github.com/imjuni/jin-frame/tree/master/examples).

## License

This software is licensed under the [MIT](LICENSE).
