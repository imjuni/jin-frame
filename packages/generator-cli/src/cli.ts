import log from 'consola';
import { isError } from 'my-easy-fp';
import { install as sourceMapSupportInstall } from 'source-map-support';
import { or, command, constant, object, string, optional, option } from '@optique/core';
import { run } from '@optique/run';
import { createCommand } from '#/commands/createCommand';
import { create } from '#/handlers/create';

sourceMapSupportInstall();

const frameCommand = command(
  'frame',
  object({
    action: constant('frame'),
    path: optional(option('-p', '--path', string({ metavar: '/a/b/c' }))),
    sampe: optional(option('-s', '--sample', string({ metavar: 'hello' }))),
  }),
);

const handler = async () => {
  const parser = or(createCommand, frameCommand);
  const result = run(parser);

  switch (result.action) {
    case 'create':
      return await create(result);
    case 'frame':
      await (async () => {
        console.log('frame', result.path, result.sampe);
      })();
      break;
    default:
      await (async () => {
        console.log('unknown action', result.path, result.sampe);
      })();
      break;
  }
};

handler().catch((caught) => {
  const err = isError(caught, new Error('unknown error raised'));

  log.error(err.message);
  log.error(err.stack);
});
