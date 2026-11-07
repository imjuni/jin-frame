import { createFrames, load, safePathJoin } from "@jin-frame/generator-core";
import type { CommandContext } from "citty";
import consola, { LogLevels, type LogType } from "consola";
import { resolveOpenapiDocument } from "#commands/resolveOpenapiDocument.js";
import { writeGeneratedFiles } from "#commands/writeGeneratedFiles.js";
import type { frameCommandArgs } from "#schema/args/frameCommandArgs.js";
import { frameCommandArgvSchema } from "#schema/args/frameCommandArgvSchema.js";
import { loadGeneratorCommandInput } from "#schema/args/loadGeneratorCommandInput.js";

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

  consola.debug(`Resolving spec from "${specPath}"`);
  const converted = await resolveOpenapiDocument(spec.data, specPath);

  consola.debug(`Writing to ${params.output}`);

  const specTypeFilePath = params.type;
  const frames = await createFrames({
    document: converted.document,
    templatePath: params.templatePath,
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

  await writeGeneratedFiles(
    params.output,
    frames.map((frame) => ({
      relativePath: safePathJoin(frame.frame.tag, frame.frame.filePath),
      source: frame.frame.source,
    })),
    { preservePreviousPaths: ["paths.d.ts"] },
  );
};
