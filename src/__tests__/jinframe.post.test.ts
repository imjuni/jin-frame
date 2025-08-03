import { JinEitherFrame } from '#frames/JinEitherFrame';
import { isPass } from 'my-only-either';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class TestPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public declare readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.name' })
  public declare readonly name: string;

  @JinEitherFrame.header({ replaceAt: 'test.hello.marvel.skill' })
  public declare readonly skill: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.gender' })
  public declare readonly gender: string;

  constructor() {
    super({ $$host: 'http://some.api.google.com/jinframe/:passing', $$method: 'POST' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = 'beam';
    this.gender = 'male';
  }
}

class TestUrlencodedPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public declare readonly passing: string;

  @JinEitherFrame.body()
  public declare readonly username: string;

  @JinEitherFrame.body()
  public declare readonly password: string;

  constructor() {
    super({
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$contentType: 'application/x-www-form-urlencoded',
      $$method: 'POST',
    });

    this.passing = 'pass';
    this.username = 'ironman';
    this.password = 'marvel';
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
