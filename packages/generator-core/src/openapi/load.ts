import fs from 'node:fs';
import { exists } from 'my-node-fp';
import axios from 'axios';
import { multiParse } from '#/tools/multiParse';
import type { ILoadResult } from '#/openapi/interfaces/ILoadResult';
import type { JsonValue } from 'type-fest';

export async function load(filePath: string): Promise<ILoadResult | undefined> {
  if (await exists(filePath)) {
    // load openapi spec from the file
    const buf = await fs.promises.readFile(filePath);
    const parsed = multiParse<JsonValue>(buf.toString());

    if (parsed == null) {
      return parsed;
    }

    return { from: 'file', ...parsed };
  }

  if (filePath.startsWith('http')) {
    // load openapi spec from the http
    const reply = await axios.get(filePath);
    return { from: 'url', kind: 'json', data: reply.data };
  }

  return undefined;
}
