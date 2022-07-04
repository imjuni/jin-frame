/* eslint-disable max-classes-per-file */

import debug from 'debug';
import * as TE from 'fp-ts/lib/Either';
import nock from 'nock';
import { JinFrame } from '../JinFrame';

const log = debug('jinframe:test');

class TestPostQuery extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;

  @JinFrame.body({ key: 'test.hello.marvel.name' })
  public readonly name: string;

  @JinFrame.header({ key: 'test.hello.marvel.skill' })
  public readonly skill: string;

  @JinFrame.body({ key: 'test.hello.marvel.gender' })
  public readonly gender: string;

  constructor() {
    super({ host: 'http://some.api.google.com/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = 'beam';
    this.gender = 'male';
  }
}

class TestUrlencodedPostQuery extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;

  @JinFrame.body()
  public readonly username: string;

  @JinFrame.body()
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

    const tq = new TestPostQuery();
    const requester = tq.createWithEither();
    const res = await requester();

    if (TE.isRight(res)) {
      log(tq.request());
      log('Data-Pass: ', JSON.stringify(res.right.$req, null, 2));
      log('test?', res.right.status, res.right.data);
    } else {
      log('Data-Fail: ', res.left.$req);
      log('Data-Fail: ', res.left.status);
    }

    expect(TE.isRight(res)).toEqual(true);
  });

  test('nock-post-without-eiter-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const tq = new TestPostQuery();
    const requester = tq.create();
    const res = await requester();

    if (res.status <= 400) {
      log(tq.request());
      log('Data-Pass: ', JSON.stringify(res.$req, null, 2));
      log('test?', res.status, res.data, res.debug);
    } else {
      log('Data-Fail: ', res.$req);
      log('Data-Fail: ', res.status);
    }

    expect(res.status <= 400).toEqual(true);
  });

  test('nock-post-urlencoded', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', 'username=ironman&password=marvel').reply(200, {
      message: 'hello',
    });

    const tq = new TestUrlencodedPostQuery();
    const requester = tq.createWithEither();
    const res = await requester();

    if (TE.isRight(res)) {
      log('Data-Pass: ', JSON.stringify(res.right.$req, null, 2));
      log('test?', res.right.status, res.right.data, res.right.debug);
    } else {
      log('Data-Fail: ', res.left.$req);
      log('Data-Fail: ', res.left.status);
    }

    expect(TE.isRight(res)).toEqual(true);
  });
});
