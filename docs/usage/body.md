---
lang: en-US
title: Body
description: Body usage
---

Explain how to define header parameter using the jin-frame. The body parameter can be defined as the `body()` function and the `objectBody()`. This section describes the `body()` function.

## depth

`body()` function automatically generated 1 depth on `AxiosRequestConfig.data`. See below.

```ts
class MarvelHeroPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly id: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: { id: string; username: string; password: string }) {
    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });

    this.id = args.id;
    this.username = args.username;
    this.password = args.password;
  }
}

const frame = new MarvelHeroPostFrame({ id: 1, username: 'ironman', password: 'advengers' });
const req = frame.request();
console.log(req);
```

When you create `MarvelHeroPostFrame` and execute the `requset` function, the following body objects are created:

```json
{
  "timeout": 120000,
  "headers": { "Content-Type": "application/json" },
  "method": "POST",
  "data": { "username": "ironman", "password": "advengers" },
  "transformRequest": undefined,
  "url": "http://api.marvel-comics.com/hero/1",
  "validateStatus": undefined
}
```

`req` value is type of `AxiosRequestConfig`.

If you look at the `data` field, you can see that the `username` and `password` keys are generated and value assigned. As such, the `body()` function is a function that defines a piece of the value to be entered into the body parameter.

## type

`body()` function use `string` and `number`, `boolean`, `Date`, `string[]`, `number[]`, `boolean[]`, `Date[]`, `object` type.

## formatters

### single formatters

The `body()` function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request.

`getUnixTime` function is included in package `date-fns`.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetHeroFrame extends JinFrame {
  @JinFrame.param()
  public readonly id: Date;

  @JinFrame.body({
    formatter: {
      dateTime: (value) => getUnixTime(value),
    },
  })
  public readonly epoch: Date;

  constructor(id: number, epoch: Date) {
    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });

    this.id = id;
    this.epoch = epoch;
  }
}
```

formatters have three function like number, dateTime, string. Each function can be an input value for another formatters function.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetEpochFormatFrame extends JinFrame {
  @JinFrame.param()
  public readonly id: Date;

  @JinFrame.body({
    formatter: {
      order: ['number', 'dateTime', 'string'],
      number: (value) => getUnixTime(value + 86400),
      dateTime: (value) => liteFormat(value, 'yyyyMMddHHmmss'),
    },
  })
  public readonly epoch: number;

  constructor(id: number, epoch: number) {
    super({ host: 'http://api.marvel-comics.com', path: '/release/:epoch', method: 'POST' });

    this.id = id;
    this.epoch = epoch;
  }
}
```

`GetEpochFormatFrame` adds 1 day to the epoch variable, converts it to a Date type using the getUnixTime function, and converts it to a string using the liteFormat function. `GetEpochFormatFrame` is an example. You can find another efficiency way to add a day and text it's

`order` option deside that order of formatter apply. Default values are `['number', 'string', 'dateTime']`

### multiple formatters

You may need to apply formatters to multiple keys when the value defined by the function `body()` is `object`. See below.

```ts
interface IHeroInBody {
  name: string;
  age: number;
  bio: {
    birth: Date;
  };
}

class MarvelHeroPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly id: string;

  @JinEitherFrame.body({
    formatters: [
      {
        findFrom: 'name',
        string: (value) => `Marvel SuperHero "${value}"`,
      },
      {
        findFrom: 'bio.birth',
        dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
      },
    ],
  })
  public readonly hero: IHeroInBody;

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: { id: string; hero: IHeroInBody; password: string }) {
    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });

    this.id = args.id;
    this.hero = args.hero;
    this.password = args.password;
  }
}
```

The `hero` class member variable defined by the function `body()` using the `IHeroInBody` interface. The above example shows the application of formatters to the `name` and `bio.birth` values in the `IHeroInBody` interface defined in this way.

You want to access a child node in `hero` object, you have to pass `findFrom` option and that is use dot path(using [dot-prop](https://github.com/sindresorhus/dot-prop) package). The class member variable name `hero` should not be written down.

## Examples

You can found more example in [testcase](https://github.com/imjuni/jin-frame/blob/master/src/__tests__) and [examples](https://github.com/imjuni/jin-frame/blob/master/examples).

- [jinframe.post.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.post.test.ts)
- [request.body.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/request.body.ts)
- [body.array.builder.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/body.array.builder.test.ts)
- [body.builder.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/body.builder.test.ts)
- [body.formatter.builder.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/body.formatter.builder.test.ts)
- [body.formatters.builder.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/body.formatters.builder.test.ts)
