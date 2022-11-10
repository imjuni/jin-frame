/* eslint-disable max-classes-per-file, no-console */
import { lightFormat } from 'date-fns';
import { JinEitherFrame } from '../frames/JinEitherFrame';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.objectBody()
  public readonly ability: number;

  constructor(args: { passing: string; ability: number }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.ability = args.ability;
  }
}

test('T001-primitive-number', async () => {
  const frame = new Test001PostFrame({
    passing: 'hello',
    ability: 1,
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: 1,
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.objectBody()
  public readonly ability: string;

  constructor(args: { passing: string; ability: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.ability = args.ability;
  }
}

test('T002-primitive-string', async () => {
  const frame = new Test002PostFrame({
    passing: 'hello',
    ability: 'Energy repulsor',
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: 'Energy repulsor',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability: Date;

  constructor(args: { passing: string; ability: Date }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.ability = args.ability;
  }
}

test('T003-primitive-date-with-format', async () => {
  const frame = new Test003PostFrame({
    passing: 'hello',
    ability: new Date(2022, 9, 19, 11, 22, 33, 44),
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: '2022-10-19 11:22:33',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.objectBody()
  public readonly ability: boolean;

  constructor(args: { passing: string; ability: boolean }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.ability = args.ability;
  }
}

test('T004-primitive-boolean', async () => {
  const frame = new Test004PostFrame({
    passing: 'hello',
    ability: true,
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: true,
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});
