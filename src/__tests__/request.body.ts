/* eslint-disable max-classes-per-file */

import { JinEitherFrame } from '@frames/JinEitherFrame';
import cloneDeep from 'clone-deep';
import { format, parse } from 'date-fns';
import debug from 'debug';

const log = debug('jinframe:test');

interface IFirstBody {
  name: string;
  data: {
    signDate: string;
    age: number;
    more: {
      birthday: string;
      weddingAnniversary: Date;
    };
  };
}

interface ISecondBody {
  character: string;
  major: string;
  data: {
    age: string;
    more: { birthday: string };
  };
}

interface IThirdBody {
  name: string;
  character: string;
  data: {
    age: string;
  };
}

const share: { first: IFirstBody; second: ISecondBody; third: IThirdBody } = {
  first: {
    name: 'fireman',
    data: {
      signDate: '2022-07-29T13:44:22',
      age: 33,
      more: {
        birthday: '2020-07-22T11:22:33',
        weddingAnniversary: new Date(2020, 6, 29, 11, 22, 33),
      },
    },
  },

  second: {
    character: 'angry',
    major: 'computer science',
    data: {
      age: '333',
      more: { birthday: '2020-02-22T03:11:22' },
    },
  },

  third: {
    name: 'thor',
    character: 'thunder',
    data: {
      age: '111',
    },
  },
};

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.body({
    formatters: [
      {
        findFrom: 'data.more.weddingAnniversary',
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        findFrom: 'data.signDate',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly multipleFormatting: IFirstBody;

  constructor({ multipleFormatting }: { multipleFormatting: IFirstBody }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.multipleFormatting = multipleFormatting;
  }
}

test('T001-object-type-field-multiple-formatting', async () => {
  const frame = new Test001PostFrame({ multipleFormatting: cloneDeep(share.first) });
  const req = frame.request();

  const expectation = {
    multipleFormatting: {
      name: 'fireman',
      data: {
        signDate: '2022-07-29 13:44:22',
        age: 33,
        more: {
          birthday: '2020-07-22 11:22:33',
          weddingAnniversary: '2020-07-29 11:22:33',
        },
      },
    },
  };

  expect(req.data).toEqual(expectation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.body({
    formatters: [
      {
        findFrom: 'data.more.weddingAnniversary',
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        findFrom: 'data.signDate',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly hero: IFirstBody;

  @JinEitherFrame.body({
    formatters: [
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly heroBio: ISecondBody;

  @JinEitherFrame.body({
    replaceAt: 'companion',
  })
  public readonly thirdField: IThirdBody;

  constructor({
    firstBody,
    secondBody,
    thirdBody,
  }: {
    firstBody: IFirstBody;
    secondBody: ISecondBody;
    thirdBody: IThirdBody;
  }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.hero = { ...firstBody };
    this.heroBio = { ...secondBody };
    this.thirdField = { ...thirdBody };
  }
}

test('T0002-many-object-field-multiple-formattin', async () => {
  const frame = new Test002PostFrame({
    firstBody: cloneDeep(share.first),
    secondBody: cloneDeep(share.second),
    thirdBody: cloneDeep(share.third),
  });
  const req = frame.request();

  const expectation = {
    hero: {
      name: 'fireman',
      data: {
        signDate: '2022-07-29 13:44:22',
        age: 33,
        more: {
          birthday: '2020-07-22 11:22:33',
          weddingAnniversary: '2020-07-29 11:22:33',
        },
      },
    },
    heroBio: {
      character: 'angry',
      major: 'computer science',
      data: {
        age: '333',
        more: {
          birthday: '2020-02-22 03:11:22',
        },
      },
    },
    companion: {
      name: 'thor',
      character: 'thunder',
      data: {
        age: '111',
      },
    },
  };

  log(JSON.stringify(req.data ?? {}, undefined, 2));

  expect(req.data).toEqual(expectation);
});
