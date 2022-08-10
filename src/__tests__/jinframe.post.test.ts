/* eslint-disable max-classes-per-file */

import { JinEitherFrame } from '@frames/JinEitherFrame';
import debug from 'debug';
import { isPass } from 'my-only-either';
import nock from 'nock';

const log = debug('jinframe:test');

class TestPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.name' })
  public readonly name: string;

  @JinEitherFrame.header({ replaceAt: 'test.hello.marvel.skill' })
  public readonly skill: string;

  @JinEitherFrame.body({ replaceAt: 'test.hello.marvel.gender' })
  public readonly gender: string;

  constructor() {
    super({ host: 'http://some.api.google.com/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = 'beam';
    this.gender = 'male';
  }
}

class TestUrlencodedPostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.body()
  public readonly password: string;

  constructor() {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      contentType: 'x-www-form-urlencoded',
      method: 'POST',
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

  test('nock-post-with-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    if (isPass(resp)) {
      log('Pass', resp.pass.status, resp.pass.data);
    } else {
      log('Fail', resp.fail.$progress, resp.fail.$debug.req, resp.fail.$debug);
    }

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-post-without-eiter-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    if (isPass(resp)) {
      log('Pass', resp.pass.status, resp.pass.data);
    } else {
      log('Fail', resp.fail.$progress, resp.fail.$debug.req, resp.fail.$debug);
    }

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-post-urlencoded', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', 'username=ironman&password=marvel').reply(200, {
      message: 'hello',
    });

    const frame = new TestUrlencodedPostFrame();
    const resp = await frame.execute();

    if (isPass(resp)) {
      log('Pass', resp.pass.status, resp.pass.data);
    } else {
      log(resp.fail.$err.message, resp.fail.$err.stack);
      log('Fail', resp.fail.$progress, resp.fail.$debug.req, resp.fail.$debug);
    }

    expect(isPass(resp)).toEqual(true);
  });
});
