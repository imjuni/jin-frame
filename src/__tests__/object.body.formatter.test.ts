import { JinEitherFrame } from '#frames/JinEitherFrame';
import { lightFormat } from 'date-fns';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.O({
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
  public readonly ability: {
    name: string;
    date: Date;
    desc: string;
  };

  constructor(args: {
    passing: string;
    ability: {
      name: string;
      date: Date;
      desc: string;
    };
  }) {
    super({
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });

    this.passing = args.passing;
    this.ability = args.ability;
  }
}

test('object formatters array', async () => {
  const frame = new Test001PostFrame({
    passing: 'hello',
    ability: {
      name: 'cannon',
      date: new Date(2023, 0, 1),
      desc: 'fire cannon',
    },
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: {
      name: 'cannon::111',
      date: '2023-01-01',
      desc: 'fire cannon',
    },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});
