import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { lightFormat, parse } from 'date-fns';
import { format } from 'date-fns-tz';
import { describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Header } from '#decorators/fields/Header';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header({
    replaceAt: 'send-at',
    formatters: {
      dateTime: (value) => lightFormat(value, `yyyyMMdd'T'HHmmss`),
    },
  })
  declare public readonly sendAt: Date;
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header({ replaceAt: 'uuu' })
  declare public readonly username: string;

  @Header({
    replaceAt: 'send-at',
    comma: true,
    encode: false,
    formatters: {
      dateTime: (value) => lightFormat(value, `yyyyMMdd'T'HHmmss`),
    },
  })
  declare public readonly sendAt: Date[];
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header({
    replaceAt: 'send-at',
    comma: true,
    encode: false,
    formatters: {
      string: (value) => parse(value, `yyyy-MM-dd HH:mm:ss`, new Date()),
      dateTime: (value) => lightFormat(value, `yyyyMMdd'T'HHmmss`),
    },
  })
  declare public readonly sendAt: string[];
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Header()
  declare public readonly username: string;

  @Header({
    replaceAt: 'send-at',
    comma: true,
    encode: false,
    formatters: [
      {
        order: ['number', 'dateTime'],
        number: (value) => new Date(new Date(value * 1000).toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
        dateTime: (value) => format(value, `yyyyMMdd'T'HHmmss`, { timeZone: 'utc' }),
      },
    ],
  })
  declare public readonly sendAt: number[];
}

describe('JinEitherFrame - Header with formatters', () => {
  it('T001-datetime-formatter', async () => {
    const frame = Test001PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      sendAt: new Date(2022, 7, 10, 11, 22, 33),
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json', username: 'ironman', 'send-at': '20220810T112233' },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });

  it('T002-datetime-array-formatter', async () => {
    const frame = Test002PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      sendAt: [new Date(2022, 7, 10, 11, 22, 33), new Date(2022, 7, 11, 12, 23, 34), new Date(2022, 7, 12, 13, 24, 35)],
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        uuu: 'ironman',
        'send-at': '20220810T112233,20220811T122334,20220812T132435',
      },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    expect(req).toEqual(excpetation);
  });

  it('T003-primitive-type-key-replace-at-not-support-dot-props', async () => {
    const frame = Test003PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      sendAt: ['2022-08-10 11:22:33', '2022-08-11 12:23:34', '2022-08-12 13:24:35'],
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        'send-at': '20220810T112233,20220811T122334,20220812T132435',
        username: 'ironman',
      },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });

  it('T005-plain-object-type-json-serialization', async () => {
    const frame = Test004PostFrame.of({
      passing: 'hello',
      username: 'ironman',
      sendAt: [1660036953, 1660044153, 1660062153],
    });

    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
        username: 'ironman',
        'send-at': '20220809T182233,20220809T202233,20220810T012233',
      },
      method: 'POST',
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(excpetation);
  });
});
