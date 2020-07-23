/* eslint-disable max-classes-per-file */

import axios from 'axios';
import * as TE from 'fp-ts/lib/Either';
import nock from 'nock';
import { JinFrame } from '../JinFrame';
import debug from 'debug';

const log = debug('jinframe:test');

class TestGetQuery extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;
  @JinFrame.query()
  public readonly name: string;
  @JinFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ host: 'http://some.api.yanolja.com', path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

class TestGet2Query extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;
  @JinFrame.query()
  public readonly name: string;
  @JinFrame.header()
  public readonly ttt: string;

  constructor() {
    super({ path: '/jinframe/:passing/test', method: 'GET' });

    this.passing = 'hello';
    this.name = 'ironman';
    this.ttt = 'header value';
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('nock-with-axios', async () => {
    nock('http://some.api.yanolja.com').get('/test').reply(200, {
      message: 'hello',
    });

    const res = await axios.get('http://some.api.yanolja.com/test');

    log('test?', res.status, res.data);
  });

  test('nock-get01-with-jinframe', async () => {
    nock('http://some.api.yanolja.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const tq = new TestGetQuery();
    const requester = tq.create();
    const res = await requester();

    if (TE.isRight(res)) {
      log('Pass', res.right.status, res.right.data);
    } else {
      log('Fail', res.left.status, res.left.$req);
    }

    log('테스트: ', res);
    expect(TE.isRight(res)).toEqual(true);
  });

  test('nock-get02-with-jinframe', async () => {
    nock('http://some.api.yanolja.com').get('/jinframe/pass?name=ironman').reply(200, {
      message: 'hello',
    });

    const tq = new TestGet2Query();
    const requester = tq.create();
    const res = await requester();

    if (TE.isRight(res)) {
      log('test?', res.right.status, res.right.data);
    } else {
      log('Data: ', JSON.stringify(res.left.$req, null, 2));
    }

    expect(TE.isRight(res)).toEqual(false);
  });
});
