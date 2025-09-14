import { JinFrame } from '../src/frames/JinFrame';
import { Param } from '../src/decorators/fields/Param';
import { Get } from '../src/decorators/methods/Get';

@Get({ host: 'https://pokeapi.co/api/v2/pokemon/:name' })
export class PokemonFrame extends JinFrame<any, any> {
  @Param()
  declare public readonly name: string;
}
