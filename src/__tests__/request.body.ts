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

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.body({
    formatters: [
      {
        key: 'data.more.weddingAnniversary',
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.signDate',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly body: IFirstBody;

  constructor({ body }: { body: IFirstBody }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.body = { ...body };
  }
}

class TestMergeFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.body({
    key: 'body',
    formatters: [
      {
        key: 'data.more.weddingAnniversary',
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.signDate',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly firstBody: IFirstBody;

  @JinEitherFrame.body({
    key: 'body',
    formatters: [
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly secondBody: ISecondBody;

  @JinEitherFrame.body({
    key: 'body',
  })
  public readonly thirdBody: IThirdBody;

  constructor({
    firstBody,
    secondBody,
    thirdBody,
  }: {
    firstBody: IFirstBody;
    secondBody: ISecondBody;
    thirdBody: IThirdBody;
  }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.firstBody = { ...firstBody };
    this.secondBody = { ...secondBody };
    this.thirdBody = { ...thirdBody };
  }
}

class TestOrderedMergeFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.body({
    key: 'body',
    order: 2,
    formatters: [
      {
        key: 'data.more.weddingAnniversary',
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'data.signDate',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly firstBody: IFirstBody;

  @JinEitherFrame.body({
    key: 'body',
    order: 1,
    formatters: [
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly secondBody: ISecondBody;

  @JinEitherFrame.body({
    key: 'body',
    order: 0,
  })
  public readonly thirdBody: IThirdBody;

  constructor({
    firstBody,
    secondBody,
    thirdBody,
  }: {
    firstBody: IFirstBody;
    secondBody: ISecondBody;
    thirdBody: IThirdBody;
  }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.firstBody = { ...firstBody };
    this.secondBody = { ...secondBody };
    this.thirdBody = { ...thirdBody };
  }
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

test('body-build', async () => {
  const frame = new TestGetFrame({ body: cloneDeep(share.first) });
  const req = frame.request();

  const expectation = {
    body: {
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

test('body-non-merge-build', async () => {
  const frame = new TestGetFrame({ body: cloneDeep(share.first) });
  const req = frame.request();

  const expectation = {
    body: {
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

test('body-merge-build', async () => {
  const frame = new TestMergeFrame({
    firstBody: cloneDeep(share.first),
    secondBody: cloneDeep(share.second),
    thirdBody: cloneDeep(share.third),
  });
  const req = frame.request();

  const expectation = {
    body: {
      name: 'thor',
      data: {
        signDate: '2022-07-29 13:44:22',
        age: '111',
        more: {
          birthday: '2020-02-22 03:11:22',
          weddingAnniversary: '2020-07-29 11:22:33',
        },
      },
      character: 'thunder',
      major: 'computer science',
    },
  };

  log(JSON.stringify(req.data ?? {}, undefined, 2));
  expect(req.data).toEqual(expectation);
});

test('body-ordered-merge-build', async () => {
  const frame = new TestOrderedMergeFrame({
    firstBody: cloneDeep(share.first),
    secondBody: cloneDeep(share.second),
    thirdBody: cloneDeep(share.third),
  });
  const req = frame.request();

  const expectation = {
    body: {
      name: 'fireman',
      data: {
        signDate: '2022-07-29 13:44:22',
        age: 33,
        more: {
          birthday: '2020-07-22 11:22:33',
          weddingAnniversary: '2020-07-29 11:22:33',
        },
      },
      character: 'angry',
      major: 'computer science',
    },
  };

  log(JSON.stringify(req.data ?? {}, undefined, 2));
  expect(req.data).toEqual(expectation);
});
