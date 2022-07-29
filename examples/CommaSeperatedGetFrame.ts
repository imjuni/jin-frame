import JinEitherFrame from '../src/frames/JinEitherFrame';

/**
 * In case of array parameter in querystring, apply comma sepearted string
 *
 * eg.
 * before encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam,flying!
 * after encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam%2Cflying%21
 */
export default class CommaSeperatedGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ comma: true })
  public readonly skill: string[];

  constructor() {
    super({ path: '/jinframe/:passing', method: 'GET' });

    this.passing = 'pass';
    this.name = 'ironman';
    this.skill = ['beam', 'flying!'];
  }
}
