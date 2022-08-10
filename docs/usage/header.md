---
lang: en-US
title: Header
description: Header usage
---

Explain how to define header parameter using the jin-frame.

## type

`header()` function use `string` and `number`, `boolean`, `Date` type. You can also use `string[]`, `number[]`, `boolean[]`, `Date[]`,`object` types(array of primitive type), but if you use them, they are automatically converted to strings, so be careful when using them.

## formatters

The `query()` function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request.

`getUnixTime` function is included in package `date-fns`.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetHeroFrame extends JinFrame {
  @JinFrame.param()
  public readonly id: Date;

  @JinFrame.header({
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

  @JinFrame.header({
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

## Array

`header()` can pass an array of primitive type, but you have to converted to a string before it can be applied to url.

When the comma option is set to true, the array is combined with a `,` character to convert it into a plain string.

```ts
class GetHeroFrame extends JinFrame {
  @JinFrame.header({ comma: true })
  public readonly skill: string[];

  @JinFrame.param()
  public readonly heroId: number;

  constructor(comicId: number, heroId: number) {
    super({ host: 'http://api.marvel-comics.com', path: '/comic/:comicId/hero/:heroId', method: 'POST' });

    this.comicId = comicId;
    this.heroId = heroId;
  }
}
```

If declared as a array of primitive type, such as `GetHeroFrame`, when the comma option is set to true that will be combine into a string using `,` character. When comma optoin is set to false or undefined that will be json serialize.

## Examples

You can found more example in [testcase](https://github.com/imjuni/jin-frame/blob/master/src/__tests__) and [examples](https://github.com/imjuni/jin-frame/blob/master/examples).

- [header.builder.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/header.builder.test.ts)
- [header.formatter.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/header.formatter.test.ts)
