/* eslint-disable import/no-extraneous-dependencies */

import { format, parse } from 'date-fns';
import { JinFrame } from '../src/frames/JinFrame';
import { Query } from '../src/decorators/fields/Query';
import { Param } from '../src/decorators/fields/Param';
import { ObjectBody } from '../src/decorators/fields/ObjectBody';
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

/**
 * Complex date formatting In jin-frame
 */
@Get({ host: 'http://some.api.google.com', path: '/jinframe/:passing' })
export default class ComplexFormatGetFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query()
  declare public readonly skill: string[];

  @ObjectBody({
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
  declare public readonly body: IFirstBody;
}
