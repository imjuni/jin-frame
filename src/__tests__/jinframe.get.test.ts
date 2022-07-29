/* eslint-disable max-classes-per-file */

import JinEitherFrame from '@frames/JinEitherFrame';
import axios from 'axios';
import debug from 'debug';
import { isPass } from 'my-only-either';
import nock from 'nock';

const log = debug('jinframe:test');

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  constructor() {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}

class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.header()
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
    nock('http://some.api.google.com').get('/test').reply(200, {
      message: 'hello',
    });

    const res = await axios.get('http://some.api.google.com/test');

    log('test?', res.status, res.data);
  });

  test('nock-get01-with-jinframe', async () => {
    nock('http://some.api.google.com').get('/jinframe/pass?name=ironman&skill=beam&skill=flying!').reply(200, {
      message: 'hello',
    });

    const frame = new TestGetFrame();
    const resp = await frame.execute();

    if (isPass(resp)) {
      log('Pass', resp.pass.status, resp.pass.data);
    } else {
      log('Fail', resp.fail.$progress, resp.fail.$debug.req, resp.fail.$debug);
    }

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-get02-with-jinframe', async () => {
    nock('http://localhost').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame();
    const resp = await frame.execute();

    if (isPass(resp)) {
      log('Pass', resp.pass.status, resp.pass.data);
    } else {
      log('message: ', resp.fail.$err.message);
      log('Fail', resp.fail.$progress, resp.fail.$debug.req, resp.fail.$debug.req);
    }

    expect(isPass(resp)).toEqual(true);
  });

  test('nock-get03-axios-request', async () => {
    nock('http://localhost').get('/jinframe/hello/test?name=ironman').reply(200, {
      message: 'hello',
    });

    const frame = new TestGet2Frame();
    const req = frame.request();
    const resp = await axios.request(req);

    if (resp.status < 400) {
      log('Pass', resp.status, resp.data);
    } else {
      log('message: ', resp.data);
      log('Fail', resp.status);
    }

    expect(resp.status < 400).toEqual(true);
  });
});
