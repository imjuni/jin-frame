import fs from "node:fs";
import { exists } from "my-node-fp";
import type { JsonValue } from "type-fest";
import type { ILoadResult } from "#openapi/interfaces/ILoadResult.js";
import { multiParse } from "#tools/multiParse.js";

export async function load(filePath: string): Promise<ILoadResult | undefined> {
  if (await exists(filePath)) {
    // load openapi spec from the file
    const buf = await fs.promises.readFile(filePath);
    const parsed = multiParse<JsonValue>(buf.toString());

    if (parsed == null) {
      return parsed;
    }

    return { from: "file", ...parsed };
  }

  if (filePath.startsWith("http")) {
    // load openapi spec from the http
    const reply = await fetch(filePath);

    if (!reply.ok) {
      throw new Error(`Failed to load spec from "${filePath}": ${reply.status} ${reply.statusText}`);
    }

    const parsed = multiParse<JsonValue>(await reply.text());

    if (parsed == null) {
      return parsed;
    }

    return { from: "url", ...parsed };
  }

  return undefined;
}
