/* eslint-disable max-classes-per-file */
import { JinEitherFrame } from '@frames/JinEitherFrame';
import type { JinBuiltInMember, OmitConstructorType } from '@tools/ConstructorType';
import 'jest';
import nock from 'nock';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.body()
  public readonly username!: string;

  @JinEitherFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test001PostFrame, JinBuiltInMember>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'post',
      ...args,
    });
  }
}

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.body()
  public readonly username!: string;

  @JinEitherFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test002PostFrame, JinBuiltInMember>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing/:raiseerr',
      method: 'post',
      ...args,
    });
  }
}

afterEach(() => {
  nock.cleanAll();
});

describe('JinEitherFrame', () => {
  test('request build fail', async () => {
    const frame = new Test002PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const requester = frame.create();
    const req = await requester();

    expect(req).toMatchObject({
      type: 'fail',
      fail: {
        $err: {
          __discriminator: 'JinCreateError',
        },
      },
    });
  });

  test('validateStatus false', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(400);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  test('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'pass') {
      expect(reply.pass.status).toEqual(200);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  test('exception - case01', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });
    const reply = await frame.execute();

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(404);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  test('exception - case02', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({
      validateStatus: () => {
        throw new Error('error');
      },
    });

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(500);
    } else {
      throw new Error('Cannot reach this line');
    }
  });
});
