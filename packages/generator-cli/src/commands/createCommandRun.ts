import { createFrames, createOpenapiTs, load, safePathJoin } from "@jin-frame/generator-core";
import type { CommandContext } from "citty";
import consola, { LogLevels, type LogType } from "consola";
import pathe from "pathe";
import { resolveOpenapiDocument } from "#commands/resolveOpenapiDocument.js";
import { writeGeneratedFiles } from "#commands/writeGeneratedFiles.js";
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

  const specSourceCode = await createOpenapiTs(converted.document, transformArgvToOpenapiTsOptions(params));

  consola.debug(`Writing to ${params.output}`);
  const specFilePath = pathe.join(params.output, "paths.d.ts");

  const frames = await createFrames({
    document: converted.document,
    templatePath: params.templatePath,
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
    hostFunctionImport: params.hostFunctionImport,
    serverMapping: params.serverMapping,
    securityProviderDir: params.securityProviderDir,
    securityProviders: params.securityProviders,
    overrides: {
      hosts: params.hosts,
      retries: params.retries,
      timeouts: params.timeouts,
    },
  });
  consola.debug(`Frames: ${frames.length}`);

  await writeGeneratedFiles(params.output, [
    { relativePath: "paths.d.ts", source: specSourceCode },
    ...frames.map((frame) => ({
      relativePath: safePathJoin(frame.frame.tag, frame.frame.filePath),
      source: frame.frame.source,
    })),
  ]);
};
