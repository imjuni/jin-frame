import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#tools/decorators/MethodDecorators';
import { isPass } from 'my-only-either';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.name' })
  declare public readonly name: string;

  @JinEitherFrame.header({ replaceAt: 'test.hello.marvel.skill' })
  declare public readonly skill: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.gender' })
  declare public readonly gender: string;

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: 'beam',
      gender: 'male',
    });
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
})
class TestUrlencodedPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly password: string;

  constructor() {
    super({
      passing: 'pass',
      username: 'ironman',
      password: 'marvel',
    });
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('nock-post-with-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('nock-post-without-eiter-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('nock-post-urlencoded', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', 'username=ironman&password=marvel').reply(200, {
      message: 'hello',
    });

    const frame = new TestUrlencodedPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });
});
