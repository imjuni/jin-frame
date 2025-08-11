import { JinEitherFrame } from '#frames/JinEitherFrame';
import { ConstructorType } from '#tools/type-utilities/ConstructorType';
import axios, { type AxiosRequestConfig } from 'axios';
import { describe, it } from 'vitest';

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

class PokemonPagingFrame extends JinEitherFrame<any, any> {
  @JinEitherFrame.query()
  declare readonly limit: number;

  @JinEitherFrame.query()
  declare readonly offset: number;

  constructor(args: ConstructorType<PokemonPagingFrame>) {
    super(args, {
      host: 'https://pokeapi.co/api/v2/pokemon',
      method: 'GET',
    });
  }
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
    const frame = new PokemonPagingFrame({
      limit: 10,
      offset: 0,
    });

    await frame.execute();

    // console.log(reply.pass.data);
  });
});
