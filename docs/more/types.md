---
lang: en-US
title: Utility Types
description: Utility Types of Jin-Frame
---

Jin-Frame has 2 utility types likes that `ConstructorType`, `OmitConstructorType`. If you have created a request in a complex types of Jin-Frame, you have to also create a constructor parameter in a complex type. Utility types reduce overhead of that task.

## ConstructorType

ConstructorType extract member variable only from Jin-Frame.

```ts
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string[];

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: ConstructorType<Test001PostFrame>) {
    super({
      host: args.host,
      method: args.method,
      contentType: args.contentType,
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}
```

## OmitConstructorType

OmitConstructorType extract member variable only from Jin-Frame and some variable omit.

```ts
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string[];

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: OmitConstructorType<Test001PostFrame, 'host' | 'method' | 'contentType'>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}
```

## JinConstructorType

OmitConstructorType extract member variable only from Jin-Frame and some variable omit.

```ts
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string[];

  @JinEitherFrame.body()
  public readonly password: string;

  // JinConstructorType omit 'host', 'path', 'method', 'contentType'
  constructor(args: JinConstructorType<Test001PostFrame>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}
```

## JinOmitConstructorType

OmitConstructorType extract member variable only from Jin-Frame and some variable omit.

```ts
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string[];

  @JinEitherFrame.body()
  public readonly password: string;

  // JinConstructorType omit 'host', 'path', 'method', 'contentType'
  constructor(args: JinOmitConstructorType<Test001PostFrame, 'usename'>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = 'ironman';
    this.password = args.password;
  }
}
```
