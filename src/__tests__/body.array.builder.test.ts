import { JinEitherFrame } from '#frames/JinEitherFrame';
import type OmitConstructorType from '#tools/type-utilities/OmitConstructorType';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.body()
  public readonly username!: string[];

  @JinEitherFrame.body()
  public readonly password!: string;

  constructor(
    args: OmitConstructorType<
      Test001PostFrame,
      'host' | 'method' | 'contentType' | '$$query' | '$$body' | '$$header' | '$$param'
    >,
  ) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
      ...args,
    });
  }
}

test('T001-plain-array-body', async () => {
  const frame = new Test001PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { username: ['ironman', 'thor'], password: 'advengers' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.body()
  public readonly username!: string[];

  // warnning, username2 is invalid usage. It will be overwrite previous username key
  @JinEitherFrame.body({ replaceAt: 'username' })
  public readonly username2!: string[];

  @JinEitherFrame.body()
  public readonly password!: string;

  constructor(args: { passing: string; username: string[]; username2: string[]; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
      ...args,
    });
  }
}

test('T002-plain-array-overwrite', async () => {
  const frame = new Test002PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    username2: ['hulk', 'black widow'],
    password: 'advengers',
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { username: ['hulk', 'black widow'], password: 'advengers' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});
