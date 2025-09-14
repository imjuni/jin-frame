import { describe, expect, it } from 'vitest';

import { Get } from '#decorators/methods/Get';
import { Query } from '#decorators/fields/Query';
import { JinFrame } from '#frames/JinFrame';
import { Param } from '#decorators/fields/Param';
import { TFieldsOf } from '#tools/type-utilities/TFieldsOf';

@Get({ host: 'https://pokeapi.co' })
class BaseFrame extends JinFrame {
  @Query()
  declare public readonly tid: string;

  protected static override getDefaultValues(): Partial<TFieldsOf<InstanceType<typeof this>>> {
    return { tid: 'fce5a3d5-84aa-4051-96a3-1dbecd93dbe4' };
  }
}

@Get({ path: '/api/v2/pokemon/:name' })
export class PokemonFrame extends BaseFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

describe('JinFrame inheritance', () => {
  it('ass', async () => {
    const frame = PokemonFrame.of((b) => b.from({ name: 'pikachu' }));
    const req = frame.request();
    expect(req.url).toEqual('https://pokeapi.co/api/v2/pokemon/pikachu?tid=fce5a3d5-84aa-4051-96a3-1dbecd93dbe4');
  });
});
