import { JinEitherFrame } from '../src/frames/JinEitherFrame';
import { JinConstructorType } from '../src/tools/ConstructorType';

export class PokemonFrame extends JinEitherFrame<any, any> {
  @JinEitherFrame.param()
  name: string;

  constructor(args: JinConstructorType<PokemonFrame>) {
    super({
      host: 'https://pokeapi.co/api/v2/pokemon/:name',
      method: 'GET',
    });

    this.name = args.name;
  }
}
