import { JinEitherFrame } from '#frames/JinEitherFrame';
import { ConstructorType } from '#tools/type-utilities/ConstructorType';
import { lightFormat } from 'date-fns';
import { describe, expect, it } from 'vitest';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.P()
  declare public readonly passing: string;

  @JinEitherFrame.B({
    formatters: [{ string: (value) => `${value}+111` }, { string: (value) => `${value}+222` }],
  })
  declare public readonly username: string[];

  @JinEitherFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test001PostFrame>) {
    super(args, {
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });
  }
}

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body({
    formatters: [
      {
        findFrom: 'name',
        string: (value) => `${value}+111`,
      },
      {
        findFrom: 'bio.birth',
        dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
      },
    ],
  })
  declare public readonly hero: {
    name: string;
    age: number;
    bio: {
      birth: Date;
    };
  };

  @JinEitherFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test002PostFrame>) {
    super(args, {
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });
  }
}

describe('JinEitherFrame', () => {
  it('T001-primitive-type-multiple-formatters', async () => {
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
      data: { username: ['ironman+111+222', 'thor+111+222'], password: 'advengers' },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(excpetation);
  });

  it('T002-zero-depth-post-frame', async () => {
    const frame = new Test002PostFrame({
      passing: 'hello',
      hero: { name: 'ironman', age: 33, bio: { birth: new Date(1978, 2, 3, 11, 22, 33) } },
      password: 'advengers',
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: {
        hero: {
          age: 33,
          bio: {
            birth: '1978-03-03T11:22:33',
          },
          name: 'ironman+111',
        },
        password: 'advengers',
      },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(excpetation);
  });
});
