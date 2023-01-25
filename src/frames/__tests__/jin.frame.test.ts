/* eslint-disable max-classes-per-file */
import { JinCreateError } from '@frames/JinCreateError';
import { JinFrame } from '@frames/JinFrame';
import type { JinRequestError } from '@frames/JinRequestError';
import type { OmitConstructorType } from '@tools/ConstructorType';
import 'jest';
import nock from 'nock';

class CustomError extends Error {
  readonly discriminator = '__CustomError__';

  readonly log: Record<string, string>;

  constructor(message: string, log: Record<string, string>) {
    super(message);

    this.log = log;
  }
}

class Test001PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string;

  @JinFrame.body()
  public readonly username!: string;

  @JinFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test001PostFrame, 'host' | 'method' | 'contentType'>) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'post',
      ...args,
    });
  }
}

class Test002PostFrame extends JinFrame<{ message: string }> {
  @JinFrame.param()
  public readonly passing!: string;

  @JinFrame.body()
  public readonly username!: string;

  @JinFrame.body()
  public readonly password!: string;

  constructor(args: OmitConstructorType<Test001PostFrame, 'host' | 'method' | 'contentType'>) {
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

describe('JinFrame', () => {
  test('validateStatus false', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(400, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });
    try {
      await frame.execute({ validateStatus: (status) => status < 400 });
    } catch (catched) {
      expect(catched).toBeDefined();
    }
  });

  test('validateStatus true', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test001PostFrame({
      username: 'ironman',
      password: 'marvel',
      passing: 'pass',
    });
    const reply = await frame.execute({ validateStatus: (status) => status < 400 });
    expect(reply.status).toEqual(200);
  });

  test('exception - type01 404', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute();
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(404);
    }
  });

  test('exception - type02 404', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', { username: 'ironman', password: 'marvel' }).reply(200, {
      message: 'hello',
    });

    const frame = new Test002PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect(catched as JinCreateError<any, any>).toBeDefined();
    }
  });

  test('exception - type03 404', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute();
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(500);
    }
  });

  test('exception - invalid exception', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        validateStatus: () => {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw 'invalid exception';
        },
      });
    } catch (catched) {
      expect((catched as JinRequestError<any, any>).resp?.status).toEqual(500);
    }
  });

  test('exception - type01 404 - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(404, 'not found');

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status}` });
          }

          return new CustomError(err.message, { status: `${err.status}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '404' });
    }
  });

  test('exception - type03 404 - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'fail' });

    try {
      await frame.execute({
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status}` });
          }

          return new CustomError(err.message, { status: `${err.status}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '500' });
    }
  });

  test('exception - invalid exception - getError', async () => {
    nock('http://some.api.google.com')
      .post('/jinframe/pass', { username: 'ironman', password: 'marvel' })
      .reply(200, { message: 'hello' });

    const frame = new Test001PostFrame({ username: 'ironman', password: 'marvel', passing: 'pass' });

    try {
      await frame.execute({
        validateStatus: () => {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw 'invalid exception';
        },
        getError: (err) => {
          if (err instanceof JinCreateError) {
            return new CustomError(err.message, { status: `${err.status}` });
          }

          return new CustomError(err.message, { status: `${err.status}` });
        },
      });
    } catch (catched) {
      expect((catched as CustomError).log).toMatchObject({ status: '500' });
    }
  });
});
