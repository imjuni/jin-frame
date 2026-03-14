import { load } from '#/openapi/load';
import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { exists, existsSync } from 'my-node-fp';
import axios from 'axios';

vi.mock('my-node-fp', () => ({
  exists: vi.fn(),
}));

describe('load', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('', async () => {
    // const result = await load('./samples/v3.yml');
    const p = path.join(process.cwd(), '..', '..', 'examples', 'openapi', 'v3.json');
    const e = await load(p);
    console.log(e);
  });

  it('', async () => {
    const expectation = { name: 'ironman' };
    const handle = vi.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from(JSON.stringify(expectation)));

    vi.mocked(exists).mockResolvedValue(true);

    const result = await load('./samples/v3.yml');
    handle.mockRestore();

    expect(result).toEqual(expectation);
  });

  it('2', async () => {
    const expectation = { name: 'ironman' };
    const handle = vi.spyOn(axios, 'get').mockResolvedValue({ data: expectation });

    const result = await load('http://some.api.google.com/test');
    handle.mockRestore();

    expect(result).toEqual(expectation);
  });

  it('3', async () => {
    vi.mocked(exists).mockResolvedValue(false);

    const result = await load('/a/b/c/some-spec.yml');

    expect(result).toBeUndefined();
  });
});
