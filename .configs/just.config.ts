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
  const cmd = 'eslint --no-ignore --ext ts,tsx,json .';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+webpack:prod', async () => {
  const cmd = 'cross-env NODE_ENV=production webpack --config ./.configs/webpack.config.prod.js';
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

task('+webpack:dev', async () => {
  const cmd = 'cross-env NODE_ENV=production webpack --config ./.configs/webpack.config.dev.js';
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

task('clean:dts', async () => {
  const cmd = 'rimraf dist/src dist/examples';

  logger.info('Clean dts directory: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+dts-bundle', async () => {
  const cmd = 'dts-bundle-generator --no-check --no-banner dist/src/index.d.ts -o dist/index.d.ts';

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
task('webpack:prod', series('clean', 'ctix:single', '+webpack:prod', '+dts-bundle', 'clean:dts', 'ctix:remove'));
task('webpack:dev', series('clean', '+webpack:dev', '+dts-bundle', 'clean:dts'));
task('build', '+build');
task('dts-bundle', series('+dts-bundle', 'clean:dts'));
task('pub', series('build', '+pub'));
task('clean', parallel('clean:file', 'ctix:remove'));
task('pub:prod', series('build', '+pub:prod'));
