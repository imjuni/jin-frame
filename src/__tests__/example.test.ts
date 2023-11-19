import { JinEitherFrame } from '#frames/JinEitherFrame';
import type { JinConstructorType } from '#tools/type-utilities/JinConstructorType';
import axios, { type AxiosRequestConfig } from 'axios';
import { it } from 'vitest';

interface IReqGetPokemonInfoByName {
  limit: number;
  offset: number;
}

async function getPokemonInfoByName(inp: IReqGetPokemonInfoByName) {
  const req: AxiosRequestConfig = {
    url: `https://pokeapi.co/api/v2/pokemon?limit=${inp.limit}&offset=${inp.offset}`,
    method: 'get',
  };

  const reply = await axios.request(req);
  return reply.data;
}

class PokemonPagingFrame extends JinEitherFrame<any, any> {
  @JinEitherFrame.query()
  readonly limit: number;

  @JinEitherFrame.query()
  readonly offset: number;

  constructor(args: JinConstructorType<PokemonPagingFrame>) {
    super({
      $$host: 'https://pokeapi.co/api/v2/pokemon',
      $$method: 'GET',
    });

    this.limit = args.limit;
    this.offset = args.offset;
  }
}

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
