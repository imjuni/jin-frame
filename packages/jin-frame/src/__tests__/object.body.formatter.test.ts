import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { lightFormat } from 'date-fns';
import { expect, it } from 'vitest';
import { ObjectBody } from '#decorators/fields/ObjectBody';
import { Param } from '#decorators/fields/Param';

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test001PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    formatters: [
      {
        findFrom: 'name',
        string(value) {
          return `${value}::111`;
        },
      },
      {
        findFrom: 'date',
        dateTime(value) {
          const f = lightFormat(value, 'yyyy-MM-dd');
          return f;
        },
      },
    ],
  })
  declare public readonly ability: {
    name: string;
    date: Date;
    desc: string;
  };
}

it('object formatters array', async () => {
  const frame = Test001PostFrame.of({
    passing: 'hello',
    ability: {
      name: 'cannon',
      date: new Date(2023, 0, 1),
      desc: 'fire cannon',
    },
  });

  const req = frame._request();

  const expectation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      name: 'cannon::111',
      date: '2023-01-01',
      desc: 'fire cannon',
    }),
    url: 'http://some.api.google.com/jinframe/hello',
  };

  // console.log(req.data);

  expect(req).toEqual(expectation);
});
