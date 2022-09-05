/* eslint-disable import/no-extraneous-dependencies */
// import { readFileSync } from 'fs';
// import { argv, logger, option, task } from 'just-scripts';
import { logger, option, parallel, series, task } from 'just-scripts';
import { exec } from 'just-scripts-utils';

option('env', { default: { env: 'develop' } });

task('clean', async () => {
  await exec('rimraf dist artifact', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('lint', async () => {
  const cmd = 'eslint --cache --ext ts,tsx .';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+rollup:dev', async () => {
  const cmd = 'cross-env NODE_ENV=production rollup --config ./.configs/rollup.config.dev.ts --configPlugin ts';
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+rollup:prod', async () => {
  const cmd = 'cross-env NODE_ENV=production rollup --config ./.configs/rollup.config.prod.ts --configPlugin ts';
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+build', async () => {
  const cmd = 'cross-env NODE_ENV=production tsc --incremental';
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pub', async () => {
  const cmd = 'npm publish --registry http://localhost:8901 --force';

  logger.info('Publish package to verdaccio: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pub:prod', async () => {
  const cmd = 'npm publish';

  logger.info('Publish package to npm registry: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean:file', async () => {
  const cmd = 'rimraf dist';

  logger.info('Clean builded directory: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix:single', async () => {
  const cmd = 'ctix single -p ./tsconfig.prod.json --config ./.configs/.ctirc';

  logger.info('Create index file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix:create', async () => {
  const cmd = 'ctix create -p ./tsconfig.prod.json --config ./.configs/.ctirc --startAt src';

  logger.info('Create index file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix:remove', async () => {
  const cmd = 'ctix remove -p ./tsconfig.json --config ./.configs/.ctirc';

  logger.info('Create index file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+docs', async () => {
  const cmd = 'typedoc --out docs src/index.ts';
  logger.info('Create document file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+docs-watch', async () => {
  const cmd = 'typedoc --watch --out docs src/index.ts';
  logger.info('Create document file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('docs', series('clean', 'ctix:single', '+docs', 'ctix:remove'));
task('docs-watch', series('clean', 'ctix:single', '+docs-watch'));
task('build', '+build');
task('rollup:dev', series('clean', 'ctix:single', '+rollup:dev', 'ctix:remove'));
task('rollup:prod', series('clean', 'ctix:single', '+rollup:prod', 'ctix:remove'));
task('pub', series('rollup:prod', '+pub'));
task('clean', parallel('clean:file', 'ctix:remove'));
task('pub:prod', series('rollup:prod', '+pub:prod'));
