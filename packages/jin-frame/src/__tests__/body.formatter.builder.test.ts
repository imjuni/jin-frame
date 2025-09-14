import { describe, expect, it } from 'vitest';
import { lightFormat, parse } from 'date-fns';

import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
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

  @Body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  declare public readonly password: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  declare public readonly username: string[];

  @Body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  declare public readonly password: string;

  @Body()
  declare public readonly today: Date;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  declare public readonly username: string[];

  @Body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  declare public readonly password: string;

  @Body({
    formatters: {
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly today: Date;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test005PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  declare public readonly username: string[];

  @Body({
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  declare public readonly password: string;

  @Body({
    formatters: {
      string: (value) => parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()),
      dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
    },
  })
  declare public readonly today: string;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test006PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({
    formatters: {
      string: (value) => `000+${value}+222`,
    },
  })
  declare public readonly username: string[];

  @Body({
    replaceAt: 'pw',
    formatters: {
      string: (value) => `${value}+111`,
    },
  })
  declare public readonly password: string;

  @Body({
    replaceAt: 'format-day',
    formatters: {
      string: (value) => parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()),
      dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
    },
  })
  declare public readonly today: string;
}

describe('JinEitherFrame - Body with formatters', () => {
  it('T001-array-type-formatter', async () => {
    const frame = Test001PostFrame.of({
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

  it('T002-string-type-formatter', async () => {
    const frame = Test002PostFrame.of({
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

  it('T003-string-array-and-string-formatter', async () => {
    const frame = Test003PostFrame.of({
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

  it('T004-plain-date-formatter', async () => {
    const frame = Test004PostFrame.of({
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

  it('T005-string-datetime-formatter-sequential', async () => {
    const frame = Test005PostFrame.of({
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

  it('T006-date-type-key-replace', async () => {
    const frame = Test006PostFrame.of({
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
});
