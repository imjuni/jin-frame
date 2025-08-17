import { JinEitherFrame } from '../src/frames/JinEitherFrame';

/**
 * Overlap decorator in class variable
 */
export default class OverlapDecoratorGetFrame extends JinEitherFrame {
  @Param()
  @Query()
  @Body()
  @Header)
  declare public readonly id: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: false, comma: true })
  declare public readonly skills: string[];

  constructor({ id, name, skills }: { id: string; name: string; skills: string[] }) {
    super({ $$host: 'http://some.api.google.com', $$path: '/jinframe/:id', $$method: 'post' });

    this.id = id;
    this.name = name;
    this.skills = skills;
  }
}
