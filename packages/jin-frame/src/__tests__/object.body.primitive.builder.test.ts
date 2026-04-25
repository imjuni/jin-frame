import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { lightFormat } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { ObjectBody } from '#decorators/fields/ObjectBody';

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test001PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody()
  declare public readonly ability: number;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test002PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody()
  declare public readonly ability: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test003PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly ability: Date;
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test004PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody()
  declare public readonly ability: boolean;
}

describe('JinFrame ObjectBody using Primitive type', () => {
  it('T001-primitive-number', async () => {
    const frame = Test001PostFrame.of({
      passing: 'hello',
      ability: 1,
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(1),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T002-primitive-string', async () => {
    const frame = Test002PostFrame.of({
      passing: 'hello',
      ability: 'Energy repulsor',
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify('Energy repulsor'),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T003-primitive-date-with-format', async () => {
    const frame = Test003PostFrame.of({
      passing: 'hello',
      ability: new Date(2022, 9, 19, 11, 22, 33, 44),
    });

    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify('2022-10-19 11:22:33'),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T004-primitive-boolean', async () => {
    const frame = Test004PostFrame.of({
      passing: 'hello',
      ability: true,
    });

    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(true),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });
});
