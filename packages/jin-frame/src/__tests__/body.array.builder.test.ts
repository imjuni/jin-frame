import { describe, expect, it } from 'vitest';
import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test001PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string[];

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test002PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string[];

  // warnning, username2 is invalid usage. It will be overwrite previous username key
  @Body({ replaceAt: 'username' })
  declare public readonly username2: string[];

  @Body()
  declare public readonly password: string;
}

describe('JinFrame - Body', () => {
  it('should process array when pass plain array body field', async () => {
    const frame = Test001PostFrame.of({
      passing: 'hello',
      username: ['ironman', 'thor'],
      password: 'advengers',
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: { username: ['ironman', 'thor'], password: 'advengers' },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });

  it('should overrite body field when pass multiple body field', async () => {
    const frame = Test002PostFrame.of({
      passing: 'hello',
      username: ['ironman', 'thor'],
      username2: ['hulk', 'black widow'],
      password: 'advengers',
    });
    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: { username: ['hulk', 'black widow'], password: 'advengers' },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });
});
