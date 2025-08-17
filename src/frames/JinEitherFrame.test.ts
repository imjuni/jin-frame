import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing/:raiseerr' })
class Test002PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}

afterEach(() => {
  nock.cleanAll();
});

describe('JinEitherFrame', () => {
  it('should return JinCreateError when request build fail', async () => {
    const frame = Test002PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
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

  it('should return fail either when status is 400', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(400);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return pass either when status is 200', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });

    if (reply.type === 'pass') {
      expect(reply.pass.status).toEqual(200);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return fail either when 404 not found', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'fail' });
    const reply = await frame.execute();

    if (reply.type === 'fail') {
      expect(reply.fail.status).toEqual(404);
    } else {
      throw new Error('Cannot reach this line');
    }
  });

  it('should return fail either when validate stauts throw exception', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = Test001PostFrame.of({ username: 'ironman', password: 'marvel', passing: 'pass' });
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
