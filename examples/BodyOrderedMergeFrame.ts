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
export default class BodyOrderedMergeFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.objectBody({
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
  public readonly firstBody: IFirstBody;

  @JinEitherFrame.objectBody({
    order: 1,
    formatters: [
      {
        findFrom: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly secondBody: ISecondBody;

  @JinEitherFrame.objectBody({
    order: 2,
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
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:passing', $$method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];

    this.firstBody = { ...firstBody };
    this.secondBody = { ...secondBody };
    this.thirdBody = { ...thirdBody };
  }
}
