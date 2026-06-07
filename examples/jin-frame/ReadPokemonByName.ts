import { Param } from "../src/decorators/fields/Param";
import { Get } from "../src/decorators/methods/Get";
import { JinFrame } from "../src/frames/JinFrame";

@Get({ host: "https://pokeapi.co/api/v2/pokemon/:name" })
export class PokemonFrame extends JinFrame<any, any> {
  @Param()
  public declare readonly name: string;
}
