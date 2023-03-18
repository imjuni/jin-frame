import { JinEitherFrame } from '#frames/JinEitherFrame';
import { lightFormat, parse } from 'date-fns';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly username: string[];

  @JinEitherFrame.body()
  public readonly password: string;

  constructor(args: { passing: string; username: string[]; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}

test('T001-array-type-formatter', async () => {
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
    data: { username: ['ironman+111', 'thor+111'], password: 'advengers' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string[];

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly password: string;

  constructor(args: { passing: string; username: string[]; password: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
  }
}

test('T002-string-type-formatter', async () => {
  const frame = new Test002PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: { username: ['ironman', 'thor'], password: 'advengers+111' },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  public readonly username: string[];

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly password: string;

  @JinEitherFrame.body()
  public readonly today: Date;

  constructor(args: { passing: string; username: string[]; password: string; today: Date }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
    this.today = args.today;
  }
}

test('T003-string-array-and-string-formatter', async () => {
  const frame = new Test003PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
    today: new Date(2022, 7, 9, 11, 22, 33),
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: {
      username: ['000+ironman+222', '000+thor+222'],
      password: 'advengers+111',
      today: new Date(2022, 7, 9, 11, 22, 33),
    },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  public readonly username: string[];

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly password: string;

  @JinEitherFrame.body({
    formatters: {
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly today: Date;

  constructor(args: { passing: string; username: string[]; password: string; today: Date }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
    this.today = args.today;
  }
}

test('T004-plain-date-formatter', async () => {
  const frame = new Test004PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
    today: new Date(2022, 7, 9, 11, 22, 33),
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: {
      username: ['000+ironman+222', '000+thor+222'],
      password: 'advengers+111',
      today: '2022-08-09 11:22:33',
    },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test005PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  public readonly username: string[];

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly password: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()),
      dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
    },
  })
  public readonly today: string;

  constructor(args: { passing: string; username: string[]; password: string; today: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
    this.today = args.today;
  }
}

test('T005-string-datetime-formatter-sequential', async () => {
  const frame = new Test005PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
    today: '2022-08-09 11:22:33',
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: {
      username: ['000+ironman+222', '000+thor+222'],
      password: 'advengers+111',
      today: '2022-08-09T11:22:33',
    },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});

class Test006PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  public readonly username: string[];

  @JinEitherFrame.body({
    replaceAt: 'pw',
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  public readonly password: string;

  @JinEitherFrame.body({
    replaceAt: 'format-day',
    formatters: {
      string: (value) => parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()),
      dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
    },
  })
  public readonly today: string;

  constructor(args: { passing: string; username: string[]; password: string; today: string }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
    this.today = args.today;
  }
}

test('T006-date-type-key-replace', async () => {
  const frame = new Test006PostFrame({
    passing: 'hello',
    username: ['ironman', 'thor'],
    password: 'advengers',
    today: '2022-08-09 11:22:33',
  });
  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: {
      username: ['000+ironman+222', '000+thor+222'],
      pw: 'advengers+111',
      'format-day': '2022-08-09T11:22:33',
    },
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req);

  expect(req).toEqual(excpetation);
});
