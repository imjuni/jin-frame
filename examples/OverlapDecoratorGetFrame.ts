import { JinEitherFrame } from '../src/frames/JinEitherFrame';

/**
 * Overlap decorator in class variable
 */
export default class OverlapDecoratorGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  @JinEitherFrame.query()
  @JinEitherFrame.body()
  @JinEitherFrame.header()
  public readonly id: string;

  @JinEitherFrame.query()
  public readonly name: string;

  @JinEitherFrame.query({ encode: false, comma: true })
  public readonly skills: string[];

  constructor({ id, name, skills }: { id: string; name: string; skills: string[] }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:id', method: 'post' });

    this.id = id;
    this.name = name;
    this.skills = skills;
  }
}
