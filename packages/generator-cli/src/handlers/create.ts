import type { createCommand } from '#/commands/createCommand';
import { createOpenapiTs } from '@jin-frame/generator-core';
import { convertor } from '@jin-frame/generator-core';
import { load } from '@jin-frame/generator-core';
import { validate } from '@jin-frame/generator-core';
import type { InferValue } from '@optique/core';
import consola, { type LogType, LogLevels } from 'consola';
import fs from 'node:fs';
import pathe from 'pathe';
import { printOpenapiTs } from '@jin-frame/generator-core';
import { createFrames } from '@jin-frame/generator-core';
import { safePathJoin } from '@jin-frame/generator-core';
import { createOpenapiTsOption } from '#/options/createOpenapiTsOption';

export async function create(params: InferValue<typeof createCommand>): Promise<void> {
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

  const nodes = await createOpenapiTs(converted.document, createOpenapiTsOption(params));
  consola.debug(`API endpoints: ${nodes.length}`);

  // TypeScript Printer를 사용하여 synthesized node 문제 해결
  const specSourceCode = printOpenapiTs(nodes);

  consola.debug(`Writing to ${params.output}`);
  const specFilePath = pathe.join(params.output, 'paths.d.ts');

  await fs.promises.mkdir(params.output, { recursive: true });
  await fs.promises.writeFile(specFilePath, specSourceCode);

  const frames = await createFrames({
    document: converted.document,
    specTypeFilePath: specFilePath,
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
      consola.debug(`Writing to ${filePath}`);
      await fs.promises.mkdir(dirPath, { recursive: true });
      await fs.promises.writeFile(filePath, frame.frame.source);
    }),
  );
}
