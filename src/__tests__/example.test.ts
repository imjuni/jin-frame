import axios, { type AxiosRequestConfig } from 'axios';
import { describe, it } from 'vitest';
import crypto from 'node:crypto';

import { Get } from '#decorators/methods/Get';
import { Query } from '#decorators/fields/Query';
import { JinFrame } from '#frames/JinFrame';
import { Param } from '#decorators/fields/Param';

interface IReqGetPokemonWithPaging {
  limit: number;
  offset: number;
}

async function getPokemonWithPaging(inp: IReqGetPokemonWithPaging) {
  const req: AxiosRequestConfig = {
    url: `https://pokeapi.co/api/v2/pokemon?limit=${inp.limit}&offset=${inp.offset}`,
    method: 'get',
  };

  const reply = await axios.request<Record<string, string>>(req);
  return reply.data;
}

interface IReqGetPokemonInfoByName {
  name: string;
  tid: string;
}

async function getPokemonInfoByName(inp: IReqGetPokemonInfoByName) {
  const req: AxiosRequestConfig = {
    url: `https://pokeapi.co/api/v2/pokemon/${inp.name}?tid=${inp.tid}`,
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

@Get({ host: 'https://pokeapi.co/api/v2/pokemon/:name' })
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

describe('Real Request and Response', () => {
  it('getPokemonWithPaging', async () => {
    await getPokemonWithPaging({
      limit: 10,
      offset: 0,
    });

    // console.log(reply);
  });

  it('getPokemonInfoByName', async () => {
    await getPokemonInfoByName({
      name: 'pikachu',
      tid: crypto.randomUUID(),
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

  it('PokemonFrame', async () => {
    const frame = PokemonFrame.of({
      name: 'pikachu',
      tid: crypto.randomUUID(),
    });

    const reply = await frame.execute();

    console.log(reply);
  });
});

/*

interface IReqGetPokemonInfoByName {
  name: string;
  tid: string;
}

async function getPokemonInfoByName(inp: IReqGetPokemonInfoByName) {
  const req: AxiosRequestConfig = {
    url: `https://pokeapi.co/api/v2/pokemon/${inp.name}?tid=${inp.tid}`,
    method: 'get',
  };

  const reply = await axios.request<Record<string, string>>(req);
  return reply.data;
}

console.log(
  await getPokemonInfoByName({
    name: 'pikachu',
    tid: crypto.randomUUID(),
  })
);

*/

/*

@Get({ host: 'https://pokeapi.co/api/v2/pokemon/:name' })
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}

const frame = PokemonFrame.of({
  name: 'pikachu',
  tid: crypto.randomUUID(),
});

console.log(await frame.execute());

*/
