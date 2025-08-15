import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#tools/decorators/MethodDecorators';
import { describe, expect, it } from 'vitest';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.H()
  declare public readonly username: string;

  @JinEitherFrame.H()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.header({ replaceAt: 'uuu' })
  declare public readonly username: string;

  @JinEitherFrame.header({ replaceAt: 'ppp' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.header({ replaceAt: 'uuu.username' })
  declare public readonly username: string;

  @JinEitherFrame.header({ replaceAt: 'ppp.password' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.header()
  declare public readonly username: string;

  @JinEitherFrame.header()
  declare public readonly hero: {
    name: string;
    ability: string;
    age: number;
  };
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test005PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.header()
  declare public readonly username: string;

  @JinEitherFrame.header({ comma: true, encode: false })
  declare public readonly hero: string[];
}

describe('JinEitherFrame - Header', () => {
  it('T001-primitive-type', async () => {
    const frame = new Test001PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', username: 'ironman', password: 'advengers' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    expect(req).toEqual(excpetation);
  });

  it('T001-header', async () => {
    const frame = new Test001PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    expect(req.headers).toMatchObject({
      username: 'ironman',
      password: 'advengers',
      'Content-Type': 'application/json',
    });
  });

  it('T002-primitive-type-key-replace', async () => {
    const frame = new Test002PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', uuu: 'ironman', ppp: 'advengers' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    expect(req).toEqual(excpetation);
  });

  it('T003-primitive-type-key-replace-at-not-support-dot-props', async () => {
    const frame = new Test003PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', 'ppp.password': 'advengers', 'uuu.username': 'ironman' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });

  it('T004-plain-object-type-json-serialization', async () => {
    const frame = new Test004PostFrame({
      passing: 'hello',
      username: 'ironman',
      hero: { name: 'ironman', ability: 'proto cannon', age: 33 },
    });

    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        username: 'ironman',
        hero: '%7B%22name%22%3A%22ironman%22%2C%22ability%22%3A%22proto%20cannon%22%2C%22age%22%3A33%7D',
      },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });

  it('T005-plain-object-type-array-comma-seperated', async () => {
    const frame = new Test005PostFrame({
      passing: 'hello',
      username: 'ironman',
      hero: ['ironman', 'thor', 'hulk', 'doctor strange'],
    });

    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        username: 'ironman',
        hero: 'ironman,thor,hulk,doctor strange',
      },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });
});
