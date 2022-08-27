import { JinEitherFrame } from '../src/frames/JinEitherFrame';
import { OmitConstructorType } from '../src/tools/ConstructorType';

export class PokemonFrame extends JinEitherFrame<any, any> {
  @JinEitherFrame.param()
  name: string;

  constructor(args: OmitConstructorType<PokemonFrame, 'host' | 'contentType' | 'method'>) {
    super({
      host: 'https://pokeapi.co/api/v2/pokemon/:name',
      method: 'GET',
    });

    this.name = args.name;
  }
}
