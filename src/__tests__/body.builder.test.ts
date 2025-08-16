import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#tools/decorators/methods/Post';
import { describe, expect, it } from 'vitest';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'uuu' })
  declare public readonly username: string;

  @JinEitherFrame.body({ replaceAt: 'ppp' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'uuu.username' })
  declare public readonly username: string;

  @JinEitherFrame.body({ replaceAt: 'ppp.password' })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004ZeroDepthPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly hero: {
    name: string;
    ability: string;
    age: number;
  };
}

describe('JinEitherFrame - primitive type', () => {
  it('primitive type을 path param과 body에 적용', async () => {
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

  it('body의 key 필드를 replaceAt으로 다른 key로 적용', async () => {
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

  it('body의 key 필드를 replaceAt으로 다른 key에 적용할 때 dot notation 사용', async () => {
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

    // console.log(req.data);

    expect(req).toEqual(excpetation);
  });

  it('body 필드를 오브젝트로 설정', async () => {
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

    // console.log(req);

    expect(req).toEqual(excpetation);
  });
});
