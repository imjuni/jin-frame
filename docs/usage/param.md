---
lang: en-US
title: Param
description: Param(url path parameter) usage
---

Explain how to define path parameter using the jin-frame.

## url

You have to add a variable to url to use path parameter. The url variable can be added with special character `:` and you can add url to the want path.

```ts
class GetHeroFrame extends JinFrame {
  @JinFrame.param()
  public readonly comicId: number;

  @JinFrame.param()
  public readonly heroId: number;

  constructor(comicId: number, heroId: number) {
    super({ host: 'http://api.marvel-comics.com', path: '/comic/:comicId/hero/:heroId', method: 'POST' });

    this.comicId = comicId;
    this.heroId = heroId;
  }
}
```

`GetHeroFrame` use two url parameter. `comicId`and `heroId` were used to represent the two ids in the url path.

## type

`param()` function use `string` and `number`, `boolean`, `Date` type. You can also use `string[]`, `number[]`, `boolean[]`, `Date[]`,`object` types(array of primitive type), but if you use them, they are automatically converted to strings, so be careful when using them.

## formatters

The `param()` function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request.

`getUnixTime` function is included in package `date-fns`.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetHeroFrame extends JinFrame {
  @JinFrame.param({
    formatter: {
      dateTime: (value) => `${getUnixTime(value)}`,
    },
  })
  public readonly epoch: Date;

  constructor(epoch: Date) {
    super({ host: 'http://api.marvel-comics.com', path: '/release/:epoch', method: 'POST' });

    this.epoch = epoch;
  }
}
```

formatters have three function like number, dateTime, string. Each function can be an input value for another formatters function.

```ts
import getUnixTime from 'date-fns/getUnixTime';

class GetEpochFormatFrame extends JinFrame {
  @JinFrame.param({
    formatter: {
      order: ['number', 'dateTime', 'string'],
      number: (value) => getUnixTime(value + 86400),
      dateTime: (value) => liteFormat(value, 'yyyyMMddHHmmss'),
    },
  })
  public readonly epoch: number;

  constructor(epoch: number) {
    super({ host: 'http://api.marvel-comics.com', path: '/release/:epoch', method: 'POST' });

    this.epoch = epoch;
  }
}
```

`GetEpochFormatFrame` adds 1 day to the epoch variable, converts it to a Date type using the getUnixTime function, and converts it to a string using the liteFormat function. `GetEpochFormatFrame` is an example. You can find another efficiency way to add a day and text it's

`order` option deside that order of formatter apply. Default values are `['number', 'string', 'dateTime']`

## Array

`param()` can pass an array of primitive type, but you have to converted to a string before it can be applied to url.

When the comma option is set to true, the array is combined with a `,` character to convert it into a plain string.

```ts
class GetHeroFrame extends JinFrame {
  @JinFrame.param({ comma: true })
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

- [jinframe.get.test.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.get.test.ts)
- [overlap.get.ts](https://github.com/imjuni/jin-frame/blob/master/src/__tests__/overlap.get.ts)
- [CommaSeperatedGetFrame.ts](https://github.com/imjuni/jin-frame/blob/master/examples/CommaSeperatedGetFrame.ts)
- [OverlapDecoratorGetFrame.ts](https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts)
