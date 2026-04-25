import { lightFormat } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test001PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: [{ string: (value) => `${value}+111` }, { string: (value) => `${value}+222` }],
  })
  declare public readonly username: string[];

  @Body()
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test002PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: [
      {
        findFrom: 'name',
        string: (value) => `${value}+111`,
      },
      {
        findFrom: 'bio.birth',
        dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
      },
    ],
  })
  declare public readonly hero: {
    name: string;
    age: number;
    bio: {
      birth: Date;
    };
  };

  @Body()
  declare public readonly password: string;
}

describe('JinFrame', () => {
  it('T001-primitive-type-multiple-formatters', async () => {
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
      body: JSON.stringify({ username: ['ironman+111+222', 'thor+111+222'], password: 'advengers' }),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });

  it('T002-zero-depth-post-frame', async () => {
    const frame = Test002PostFrame.of({
      passing: 'hello',
      hero: { name: 'ironman', age: 33, bio: { birth: new Date(1978, 2, 3, 11, 22, 33) } },
      password: 'advengers',
    });
    const req = frame.request();

    const expectedBody = {
      hero: {
        name: 'ironman+111',
        age: 33,
        bio: {
          birth: '1978-03-03T11:22:33',
        },
      },
      password: 'advengers',
    };

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: expectedBody,
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });
});
