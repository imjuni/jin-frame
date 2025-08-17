/* eslint-disable import/no-extraneous-dependencies */

import { format, parse } from 'date-fns';
import { JinFrame } from '../src/frames/JinFrame';
import { ObjectBody } from '../src/decorators/fields/ObjectBody';
import { Query } from '../src/decorators/fields/Query';
import { Param } from '../src/decorators/fields/Param';
import { Get } from '../src/decorators/methods/Get';

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

/**
 * Complex datetime formatting With Body Object merging with set body object merge order
 */
@Get({ host: 'http://some.api.google.com', path: '/jinframe/:passing' })
export default class BodyOrderedMergeFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: true })
  declare public readonly skill: string[];

  @ObjectBody({
    order: 3,
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
  declare public readonly firstBody: IFirstBody;

  @ObjectBody({
    order: 1,
    formatters: [
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  declare public readonly secondBody: ISecondBody;

  @ObjectBody({
    order: 2,
  })
  declare public readonly thirdBody: IThirdBody;
}
