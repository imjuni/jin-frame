import { describe, expect, it } from 'vitest';

import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string[];

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
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

describe('JinEitherFrame - Body', () => {
  it('should process array when pass plain array body field', async () => {
    const frame = new Test001PostFrame({
      passing: 'hello',
      username: ['ironman', 'thor'],
      password: 'advengers',
    });

    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: { username: ['ironman', 'thor'], password: 'advengers' },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(excpetation);
  });

  it('should overrite body field when pass multiple body field', async () => {
    const frame = new Test002PostFrame({
      passing: 'hello',
      username: ['ironman', 'thor'],
      username2: ['hulk', 'black widow'],
      password: 'advengers',
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: { username: ['hulk', 'black widow'], password: 'advengers' },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req);

    expect(req).toEqual(excpetation);
  });
});
