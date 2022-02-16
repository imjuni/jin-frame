// import { readFileSync } from 'fs';
// import { argv, logger, option, task } from 'just-scripts';
import { logger, option, task, series, parallel } from 'just-scripts';
import { exec } from 'just-scripts-utils';

option('env', { default: { env: 'develop' } });

task('ctix', async () => {
  await exec('ctix create -p ./tsconfig.json', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', async () => {
  await exec('rimraf dist artifact', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build-only', async () => {
  const cmd = 'cross-env NODE_ENV=production webpack --config webpack.config.prod.js';
  logger.info('Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-develop', async () => {
  const cmd = 'npm publish --registry http://localhost:8901 --force';

  logger.info('Publish package to verdaccio: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-production', async () => {
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

task('ctix:create', async () => {
  const cmd = 'ctix create -p ./tsconfig.json';

  logger.info('Create index file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('ctix:clean', async () => {
  const cmd = 'ctix clean -p ./tsconfig.json';

  logger.info('Create index file : ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build', series('clean', 'ctix:create', 'build-only', 'ctix:clean'));
task('pub', series('build', 'publish-develop'));
task('clean', parallel('clean:file', 'ctix:clean'));
task('pub:prod', series('build', 'publish-production'));
