import { describe, expect, it } from "vitest";
import { Param } from "#decorators/fields/Param";
import { Query } from "#decorators/fields/Query";
import { Get } from "#decorators/methods/Get";
import { JinFrame } from "#frames/JinFrame";
import type { FieldsOf } from "#tools/type-utilities/FieldsOf";

@Get({ host: "https://pokeapi.co" })
class BaseFrame extends JinFrame {
  @Query()
  public declare readonly tid: string;

  protected static override getDefaultValues(): Partial<FieldsOf<InstanceType<typeof this>>> {
    return { tid: "fce5a3d5-84aa-4051-96a3-1dbecd93dbe4" };
  }
}

@Get({ path: "/api/v2/pokemon/{name}" })
export class PokemonFrame extends BaseFrame {
  @Param()
  public declare readonly name: string;

  @Query()
  public declare readonly tid: string;
}

describe("JinFrame inheritance", () => {
  it("should apply default values from getDefaultValues when using of() with callback", async () => {
    const frame = PokemonFrame.of((b) => b.from({ name: "pikachu" }));
    const req = frame._request();
    expect(req.url).toEqual("https://pokeapi.co/api/v2/pokemon/pikachu?tid=fce5a3d5-84aa-4051-96a3-1dbecd93dbe4");
  });

  it("should apply default values from getDefaultValues when using builder().build()", () => {
    const frame = PokemonFrame.builder().set("name", "pikachu").build();
    const req = frame._request();
    expect(req.url).toEqual("https://pokeapi.co/api/v2/pokemon/pikachu?tid=fce5a3d5-84aa-4051-96a3-1dbecd93dbe4");
  });
});
