import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import type { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { expect, it } from "vitest";
import { createFrames } from "#generators/createFrames.js";

it("should compile generated frames against OpenAPI response types and narrow every status", async () => {
  const directory = mkdtempSync(resolve(".response-union-test-"));
  try {
    const document: OpenAPIV3.Document = {
      openapi: "3.0.0",
      info: { title: "Response union", version: "1" },
      servers: [{ url: "https://example.test" }],
      paths: {
        "/responses": {
          get: {
            operationId: "getResponses",
            responses: {
              ...Object.fromEntries(
                [200, 201, 302, 400, 500].map((status) => [
                  status,
                  {
                    description: "Response",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          required: [`value${status}`],
                          properties: { [`value${status}`]: { type: "string" } },
                        },
                      },
                    },
                  },
                ]),
              ),
              "204": { description: "No content" },
            },
          },
        },
      },
    };
    writeFileSync(join(directory, "paths.ts"), astToString(await openapiTS(JSON.stringify(document))));
    const frames = await createFrames({
      document,
      output: directory,
      specTypeFilePath: join(directory, "paths.ts"),
      useCodeFence: false,
    });
    for (const { frame } of frames) writeFileSync(join(directory, frame.filePath), frame.source);
    const library = resolve("../jin-frame/src");
    const shim = join(directory, "jin-frame.ts");
    writeFileSync(
      shim,
      [
        `export { JinFrame } from '${library}/frames/JinFrame';`,
        `export { Get } from '${library}/decorators/methods/Get';`,
        `export { Timeout } from '${library}/decorators/methods/options/Timeout';`,
      ].join("\n"),
    );
    const consumer = join(directory, "consumer.ts");
    writeFileSync(
      consumer,
      `
      import { GetResponsesFrame } from './GetResponsesFrame';
      const frame = GetResponsesFrame.of({});
      async function check() {
        const normal = await frame._execute();
        const accepted = await frame._execute({ validateStatus: () => true });
        const created = await frame._create({ validateStatus: () => true })();
        const same: typeof normal = accepted;
        const alsoSame: typeof normal = created;
        ${[200, 201, 302, 400, 500]
          .map(
            (status) => `
          if (same.status === ${status}) {
            const value: string = same.data.value${status};
            // @ts-expect-error Other response properties must not be accessible.
            same.data.unrelated;
            void value;
          }`,
          )
          .join("\n")}
        if (alsoSame.status === 204) { const empty: undefined = alsoSame.data; void empty; }
      }
      void check;
    `,
    );
    const configPath = resolve("../jin-frame/tsconfig.json");
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, resolve("../jin-frame"));
    const program = ts.createProgram([consumer], {
      ...parsed.options,
      rootDir: undefined,
      noEmit: true,
      incremental: false,
      paths: { ...parsed.options.paths, "jin-frame": [shim] },
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    expect(diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
