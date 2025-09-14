import { createOpenapiTs } from '@jin-frame/generator-core';
import { convertor } from '@jin-frame/generator-core';
import { load } from '@jin-frame/generator-core';
import { validate } from '@jin-frame/generator-core';
import type { InferValue } from '@optique/core';
import consola, { type LogType, LogLevels } from 'consola';
import fs from 'node:fs';
import pathe from 'pathe';
import { createFrames } from '@jin-frame/generator-core';
import { safePathJoin } from '@jin-frame/generator-core';
import { frameCommand } from '#/commands/frameCommand';

export async function frame(params: InferValue<typeof frameCommand>): Promise<void> {
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
    consola.debug('Converting spec v2 > v3');
  }

  const converted = await convertor(validated);

  consola.debug(`Writing to ${params.output}`);

  const specTypeFilePath = params.type;
  await fs.promises.mkdir(params.output, { recursive: true });

  const frames = await createFrames({
    document: converted.document,
    specTypeFilePath,
    host: params.host,
    output: params.output,
    useCodeFence: params.codeFence ?? false,
    timeout: params.timeout,
    baseFrame: params.baseFrame,
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
}
