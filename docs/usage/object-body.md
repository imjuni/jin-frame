---
lang: en-US
title: Object Body
description: Object Body usage
---

Explain how to define header parameter using the jin-frame. The body parameter can be defined as the `body()` function and the `objectBody()`. This section describes the `objectBody()` function.

## depth

The function `objectBody()` does not automatically generate 1 dpeth keys. If the `AxiosRequestConfig.data` shape is complex and has many keys, generating all key values as a function `body()` can result in more unnecessary work.

```ts
class MarvelHeroPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly id: string;

  @JinEitherFrame.objectBody()
  public readonly personality: { username: string; password: string };

  constructor(args: { id: string; username: string; password: string }) {
    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });

    this.id = args.id;
    this.personality = { username: args.username, password: args.password };
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

If you look at the `data` field, you can see that the `username` and `password` keys are assigned into the data without using the `personality` class member variable name. As such, the `objectBody()` function is a function that defines all or part of the body parameter.

## type

`objectBody()` function use `string` and `number`, `boolean`, `Date`, `string[]`, `number[]`, `boolean[]`, `Date[]`, `object` type. `string[]`, `number[]`, `boolean[]`, `Date[]` type don't merged another `objectBody()` definition.

## formatters

### single formatters

The `objectBody()` function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request.

`getUnixTime` function is included in package `date-fns`.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetHeroFrame extends JinFrame {
  @JinFrame.param()
  public readonly id: Date;

  @JinFrame.objectBody({
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

  @JinFrame.objectBody({
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

You may need to apply formatters to multiple keys when the value defined by the function `objectBody()` is `object`. See below.

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

  @JinEitherFrame.objectBody({
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

  @JinEitherFrame.objectBody()
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

- [object.body.builder.test](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.get.test.ts)
- [BodyOrderedMergeFrame.ts](https://github.com/imjuni/jin-frame/blob/master/examples/CommaSeperatedGetFrame.ts)
- [ComplexFormatGetFrame.ts](https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts)
- [ComplexFormattingWithBodyMergeFrame.ts](https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts)
