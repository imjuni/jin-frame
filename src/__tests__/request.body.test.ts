import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { ConstructorType } from '#tools/type-utilities/ConstructorType';
import { format, parse } from 'date-fns';
import { expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Body } from '#decorators/fields/Body';

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

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: true })
  declare public readonly skill: string[];

  @Body({
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
  declare public readonly multipleFormatting: IFirstBody;

  constructor(args: Pick<ConstructorType<Test001PostFrame>, 'multipleFormatting'>) {
    super({
      ...args,
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }
}

it('T001-object-type-field-multiple-formatting', async () => {
  const frame = new Test001PostFrame({ multipleFormatting: structuredClone(share.first) });
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

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: true })
  declare public readonly skill: string[];

  @Body({
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
  declare public readonly hero: IFirstBody;

  @Body({
    formatters: [
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  declare public readonly heroBio: ISecondBody;

  @Body({
    replaceAt: 'companion',
  })
  declare public readonly thirdField: IThirdBody;

  constructor(args: Pick<ConstructorType<Test002PostFrame>, 'hero' | 'heroBio' | 'thirdField'>) {
    super({
      ...args,
      passing: 'pass',
      name: 'ironman',
      skill: ['beam', 'flying!'],
    });
  }
}

it('T0002-many-object-field-multiple-formattin', async () => {
  const frame = new Test002PostFrame({
    hero: structuredClone(share.first),
    heroBio: structuredClone(share.second),
    thirdField: structuredClone(share.third),
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

  expect(req.data).toEqual(expectation);
});
