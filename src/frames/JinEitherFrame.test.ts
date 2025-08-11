import { JinEitherFrame } from '#frames/JinEitherFrame';
import { ConstructorType } from '#tools/type-utilities/ConstructorType';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test001PostFrame>) {
    super(args, {
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'post',
    });
  }
}

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly password: string;

  constructor(args: ConstructorType<Test002PostFrame>) {
    super(args, {
      host: 'http://some.api.google.com/jinframe/:passing/:raiseerr',
      method: 'post',
    });
  }
}

afterEach(() => {
  nock.cleanAll();
});

describe('JinEitherFrame', () => {
  it('request build fail', async () => {
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

  it('validateStatus false', async () => {
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

  it('validateStatus true', async () => {
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

  it('exception - case01', async () => {
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

  it('exception - case02', async () => {
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
