/* eslint-disable import/no-extraneous-dependencies */

import { format, parse } from 'date-fns';
import { JinEitherFrame } from '../src/frames/JinEitherFrame';

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
export default class ComplexFormatGetFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query()
  declare public readonly skill: string[];

  @JinEitherFrame.objectBody({
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

  constructor({ body }: { body: IFirstBody }) {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.body = { ...body };
  }
}
