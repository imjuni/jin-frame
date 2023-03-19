import { JinEitherFrame } from '#frames/JinEitherFrame';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.H()
  public readonly username!: string;

  @JinEitherFrame.H()
  public readonly password!: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

test('T001-primitive-type', async () => {
  const frame = new Test001PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json', username: 'ironman', password: 'advengers' },
    method: 'POST',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  expect(req).toEqual(excpetation);
});

test('T001-header', async () => {
  const frame = new Test001PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  frame.request();

  expect(frame.$$header).toMatchObject({
    username: 'ironman',
    password: 'advengers',
    'Content-Type': 'application/json',
  });
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.header({ replaceAt: 'uuu' })
  public readonly username!: string;

  @JinEitherFrame.header({ replaceAt: 'ppp' })
  public readonly password!: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

test('T002-primitive-type-key-replace', async () => {
  const frame = new Test002PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json', uuu: 'ironman', ppp: 'advengers' },
    method: 'POST',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  expect(req).toEqual(excpetation);
});

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.header({ replaceAt: 'uuu.username' })
  public readonly username!: string;

  @JinEitherFrame.header({ replaceAt: 'ppp.password' })
  public readonly password!: string;

  constructor(args: { passing: string; username: string; password: string }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

test('T003-primitive-type-key-replace-at-not-support-dot-props', async () => {
  const frame = new Test003PostFrame({ passing: 'hello', username: 'ironman', password: 'advengers' });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json', 'ppp.password': 'advengers', 'uuu.username': 'ironman' },
    method: 'POST',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.headers);

  expect(req).toEqual(excpetation);
});

class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.header()
  public readonly username!: string;

  @JinEitherFrame.header()
  public readonly hero!: {
    name: string;
    ability: string;
    age: number;
  };

  constructor(args: {
    passing: string;
    username: string;
    hero: {
      name: string;
      ability: string;
      age: number;
    };
  }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

test('T004-plain-object-type-json-serialization', async () => {
  const frame = new Test004PostFrame({
    passing: 'hello',
    username: 'ironman',
    hero: { name: 'ironman', ability: 'proto cannon', age: 33 },
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: {
      'Content-Type': 'application/json',
      username: 'ironman',
      hero: '%7B%22name%22%3A%22ironman%22%2C%22ability%22%3A%22proto%20cannon%22%2C%22age%22%3A33%7D',
    },
    method: 'POST',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.headers);

  expect(req).toEqual(excpetation);
});

class Test005PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.header()
  public readonly username!: string;

  @JinEitherFrame.header({ comma: true, encode: false })
  public readonly hero!: string[];

  constructor(args: { passing: string; username: string; hero: string[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

test('T005-plain-object-type-array-comma-seperated', async () => {
  const frame = new Test005PostFrame({
    passing: 'hello',
    username: 'ironman',
    hero: ['ironman', 'thor', 'hulk', 'doctor strange'],
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: {
      'Content-Type': 'application/json',
      username: 'ironman',
      hero: 'ironman,thor,hulk,doctor strange',
    },
    method: 'POST',
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.headers);

  expect(req).toEqual(excpetation);
});
