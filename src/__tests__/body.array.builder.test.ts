import { JinEitherFrame } from '#frames/JinEitherFrame';
import type { JinBuiltInMember } from '#tools/type-utilities/JinBuiltInMember';
import type { OmitConstructorType } from '#tools/type-utilities/OmitConstructorType';
import { expect, it } from 'vitest';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public declare readonly passing: string;

  @JinEitherFrame.body()
  public declare readonly username: string[];

  @JinEitherFrame.body()
  public declare readonly password: string;

  constructor(args: OmitConstructorType<Test001PostFrame, JinBuiltInMember>) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T001-plain-array-body', async () => {
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
  public declare readonly passing: string;

  @JinEitherFrame.body()
  public declare readonly username: string[];

  // warnning, username2 is invalid usage. It will be overwrite previous username key
  @JinEitherFrame.body({ replaceAt: 'username' })
  public declare readonly username2: string[];

  @JinEitherFrame.body()
  public declare readonly password: string;

  constructor(args: { passing: string; username: string[]; username2: string[]; password: string }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T002-plain-array-overwrite', async () => {
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
