import fs from "node:fs";
import { createFrames, createOpenapiTs, load, printOpenapiTs, safePathJoin } from "@jin-frame/generator-core";
import type { CommandContext } from "citty";
import consola, { LogLevels, type LogType } from "consola";
import pathe from "pathe";
import { resolveOpenapiDocument } from "#commands/resolveOpenapiDocument.js";
import type { createCommandArgs } from "#schema/args/createCommandArgs.js";
import { createCommandArgvSchema } from "#schema/args/createCommandArgvSchema.js";
import { loadGeneratorCommandInput } from "#schema/args/loadGeneratorCommandInput.js";
import { transformArgvToOpenapiTsOptions } from "#transforms/transformArgvToOpenapiTsOptions.js";

export const createCommandRun = async ({ args }: CommandContext<typeof createCommandArgs>) => {
  const input = await loadGeneratorCommandInput(args);
  const params = createCommandArgvSchema.parse(input);

  consola.level = LogLevels[params.logLevel as LogType];
  const specPath = params.spec.toString();

  consola.debug(`Loading spec from "${specPath}"`);
  const spec = await load(specPath);

  if (spec == null) {
    throw new Error(`Failed to load spec from "${specPath}"`);
  }

  consola.debug(`Resolving spec from "${specPath}"`);
  const converted = await resolveOpenapiDocument(spec.data, specPath);

  const nodes = await createOpenapiTs(converted.document, transformArgvToOpenapiTsOptions(params));
  consola.debug(`API endpoints: ${nodes.length}`);

  const specSourceCode = printOpenapiTs(nodes);

  consola.debug(`Writing to ${params.output}`);
  const specFilePath = pathe.join(params.output, "paths.d.ts");

  await fs.promises.mkdir(params.output, { recursive: true });
  await fs.promises.writeFile(specFilePath, specSourceCode);

  const frames = await createFrames({
    document: converted.document,
    specTypeFilePath: specFilePath,
    specFilePath: specPath,
    host: params.host,
    output: params.output,
    useCodeFence: params.codeFence ?? false,
    timeout: params.timeout,
    baseFrame: params.baseFrame,
    hostStrategy: params.hostStrategy,
    hostEnvVar: params.hostEnvVar,
    hostFunctionName: params.hostFunctionName,
    serverMapping: params.serverMapping,
    overrides: {
      hosts: params.hosts,
      retries: params.retries,
      timeouts: params.timeouts,
    },
  });
  consola.debug(`Frames: ${frames.length}`);

  await Promise.all(
    frames.map(async (frame) => {
      const dirPath = safePathJoin(params.output, frame.frame.tag);
      const filePath = pathe.join(dirPath, frame.frame.filePath);

      consola.debug(`Create directory: ${dirPath}`);
      await fs.promises.mkdir(dirPath, { recursive: true });
      consola.debug(`Writing to ${filePath}`);
      await fs.promises.writeFile(filePath, frame.frame.source);
    }),
  );
};
