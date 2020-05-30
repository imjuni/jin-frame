/* eslint-disable max-classes-per-file */

import axios from 'axios';
import { isPass } from 'my-easy-fp';
import nock from 'nock';
import { JinFrame } from '../JinFrame';
import debug from 'debug';

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
    super({ host: 'http://some.api.yanolja.com/jinframe/:passing', method: 'POST' });

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
      host: 'http://some.api.yanolja.com/jinframe/:passing',
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
    nock('http://some.api.yanolja.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const tq = new TestPostQuery();
    const requester = tq.create();
    const res = await requester();

    if (isPass(res)) {
      log(tq.request());
      log('Data-Pass: ', JSON.stringify(res.pass.$req, null, 2));
      log('test?', res.pass.status, res.pass.data);
    } else {
      log('Data-Fail: ', res.fail.$req);
      log('Data-Fail: ', res.fail.status);
    }

    expect(isPass(res)).toEqual(true);
  });

  test('nock-post-without-eiter-jinframe', async () => {
    nock('http://some.api.yanolja.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const tq = new TestPostQuery();
    const requester = tq.createWithoutEither();
    const res = await requester();

    if (res.status <= 400) {
      log(tq.request());
      log('Data-Pass: ', JSON.stringify(res.$req, null, 2));
      log('test?', res.status, res.data);
    } else {
      log('Data-Fail: ', res.$req);
      log('Data-Fail: ', res.status);
    }

    expect(res.status <= 400).toEqual(true);
  });

  test('nock-post-urlencoded', async () => {
    nock('http://some.api.yanolja.com').post('/jinframe/pass', 'username=ironman&password=marvel').reply(200, {
      message: 'hello',
    });

    const tq = new TestUrlencodedPostQuery();
    const requester = tq.create();
    const res = await requester();

    if (isPass(res)) {
      log('Data-Pass: ', JSON.stringify(res.pass.$req, null, 2));
      log('test?', res.pass.status, res.pass.data);
    } else {
      log('Data-Fail: ', res.fail.$req);
      log('Data-Fail: ', res.fail.status);
    }

    expect(isPass(res)).toEqual(true);
  });
});
