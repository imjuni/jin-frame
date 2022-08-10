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
 * Complex datetime formatting With Body Object merging
 */
export default class ComplexFormattingWithBodyMergeFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: true })
  public readonly skill: string[];

  @JinEitherFrame.objectBody({
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

  @JinEitherFrame.objectBody({
    formatters: [
      {
        key: 'data.more.birthday',
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
  public readonly secondBody: ISecondBody;

  @JinEitherFrame.objectBody()
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
