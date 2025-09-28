import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Header } from '#decorators/fields/Header';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header({ replaceAt: 'uuu' })
  declare public readonly username: string;

  @Header({ replaceAt: 'ppp' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header({ replaceAt: 'uuu.username' })
  declare public readonly username: string;

  @Header({ replaceAt: 'ppp.password' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header()
  declare public readonly hero: {
    name: string;
    ability: string;
    age: number;
  };
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test005PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header({ comma: true, encode: false })
  declare public readonly hero: string[];
}

describe('JinEitherFrame - Header', () => {
  it('T001-primitive-type', async () => {
    const frame = Test001PostFrame.of({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', username: 'ironman', password: 'advengers' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    expect(req).toEqual(expectation);
  });

  it('T001-header', async () => {
    const frame = Test001PostFrame.of({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    expect(req.headers).toMatchObject({
      username: 'ironman',
      password: 'advengers',
      'Content-Type': 'application/json',
    });
  });

  it('T002-primitive-type-key-replace', async () => {
    const frame = Test002PostFrame.of({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', uuu: 'ironman', ppp: 'advengers' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    expect(req).toEqual(expectation);
  });

  it('T003-primitive-type-key-replace-at-not-support-dot-props', async () => {
    const frame = Test003PostFrame.of({ passing: 'hello', username: 'ironman', password: 'advengers' });
    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', 'ppp.password': 'advengers', 'uuu.username': 'ironman' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(expectation);
  });

  it('T004-plain-object-type-json-serialization', async () => {
    const frame = Test004PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      hero: { name: 'ironman', ability: 'proto cannon', age: 33 },
    });

    const req = frame.request();

    const expectation = {
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

    expect(req).toEqual(expectation);
  });

  it('T005-plain-object-type-array-comma-separated', async () => {
    const frame = Test005PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      hero: ['ironman', 'thor', 'hulk', 'doctor strange'],
    });

    const req = frame.request();

    const expectation = {
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

    expect(req).toEqual(expectation);
  });
});
