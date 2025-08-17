import { JinEitherFrame } from '../src/frames/JinEitherFrame';
import type JinConstructorType from '../src/tools/type-utilities/JinConstructorType';

export class PokemonFrame extends JinEitherFrame<any, any> {
  @Param()
  name: string;

  constructor(args: JinConstructorType<PokemonFrame>) {
    super({
      $$host: 'https://pokeapi.co/api/v2/pokemon/:name',
      $$method: 'GET',
    });

    this.name = args.name;
  }
}
