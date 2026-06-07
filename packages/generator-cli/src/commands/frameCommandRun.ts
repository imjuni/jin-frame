import fs from "node:fs";
import { convertor, createFrames, load, safePathJoin, validate } from "@jin-frame/generator-core";
import type { CommandContext } from "citty";
import consola, { LogLevels, type LogType } from "consola";
import pathe from "pathe";
import type { frameCommandArgs } from "#src/schema/args/frameCommandArgs.js";
import { frameCommandArgvSchema } from "#src/schema/args/frameCommandArgvSchema.js";
import { loadGeneratorCommandInput } from "#src/schema/args/loadGeneratorCommandInput.js";

export const frameCommandRun = async ({ args }: CommandContext<typeof frameCommandArgs>) => {
  const input = await loadGeneratorCommandInput(args);
  const params = frameCommandArgvSchema.parse(input);

  consola.level = LogLevels[params.logLevel as LogType];
  const specPath = params.spec.toString();

  consola.debug(`Loading spec from "${specPath}"`);
  const spec = await load(specPath);

  if (spec == null) {
    throw new Error(`Failed to load spec from "${specPath}"`);
  }

  consola.debug(`Validating spec from "${specPath}"`);
  const validated = validate(spec);

  if (!validated.valid) {
    throw new Error(`Failed to validate spec from "${specPath}"`);
  }

  if (validated.version === 2) {
    consola.debug("Converting spec v2 > v3");
  }

  const converted = await convertor(validated);

  consola.debug(`Writing to ${params.output}`);

  const specTypeFilePath = params.type;
  await fs.promises.mkdir(params.output, { recursive: true });

  const frames = await createFrames({
    document: converted.document,
    specTypeFilePath,
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
