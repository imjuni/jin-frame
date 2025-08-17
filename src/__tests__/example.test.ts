import axios, { type AxiosRequestConfig } from 'axios';
import { describe, it } from 'vitest';

import { Get } from '#decorators/methods/Get';
import { Query } from '#decorators/fields/Query';
import { JinFrame } from '#frames/JinFrame';

interface IReqGetPokemonInfoByName {
  limit: number;
  offset: number;
}

async function getPokemonInfoByName(inp: IReqGetPokemonInfoByName) {
  const req: AxiosRequestConfig = {
    url: `https://pokeapi.co/api/v2/pokemon?limit=${inp.limit}&offset=${inp.offset}`,
    method: 'get',
  };

  const reply = await axios.request<Record<string, string>>(req);
  return reply.data;
}

@Get({ host: 'https://pokeapi.co/api/v2/pokemon' })
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}

describe('Real Request and Response', () => {
  it('getPokemonInfoByName', async () => {
    await getPokemonInfoByName({
      limit: 10,
      offset: 0,
    });

    // console.log(reply);
  });

  it('PokemonPagingFrame', async () => {
    const frame = PokemonPagingFrame.of({
      limit: 10,
      offset: 0,
    });

    await frame.execute();

    // console.log(reply.pass.data);
  });
});
