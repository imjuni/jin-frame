/* eslint-disable max-classes-per-file, no-console */
import { JinEitherFrame } from '../../frames/JinEitherFrame';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}

test('T001-primitive-type', async () => {
  const frame = new Test001PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { username: 'ironman', password: 'advengers' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  expect(req).toEqual(excpetation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'uuu' })
  public readonly username: string;

  @JinEitherFrame.body({ replaceAt: 'ppp' })
  public readonly password: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}

test('T002-primitive-type-key-replace', async () => {
  const frame = new Test002PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { uuu: 'ironman', ppp: 'advengers' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  expect(req).toEqual(excpetation);
});

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'uuu.username' })
  public readonly username: string;

  @JinEitherFrame.body({ replaceAt: 'ppp.password' })
  public readonly password: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}

test('T003-primitive-type-key-replace-using-dot-props', async () => {
  const frame = new Test003PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { uuu: { username: 'ironman' }, ppp: { password: 'advengers' } },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test004ZeroDepthPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.body()
  public readonly hero: {
    name: string;
    ability: string;
    age: number;
  };

  constructor(args: {
    passing: string;
    username: string;
    hero: {
      name: string;
      ability: string;
      age: number;
    };
  }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.hero = args.hero;
  }
}

test('T004-plain-object-type-without-formatter', async () => {
  const frame = new Test004ZeroDepthPostFrame({
    passing: 'hello',
    username: 'ironman',
    hero: { name: 'ironman', ability: 'proto cannon', age: 33 },
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { username: 'ironman', hero: { name: 'ironman', ability: 'proto cannon', age: 33 } },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  console.log(req);

  expect(req).toEqual(excpetation);
});
