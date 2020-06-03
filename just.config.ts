// import { readFileSync } from 'fs';
// import { argv, logger, option, task } from 'just-scripts';
import { logger, option, task, series } from 'just-scripts';
import { exec } from 'just-scripts-utils';

option('env', { default: { env: 'develop' } });

task('clean', async () => {
  await exec('rimraf dist artifact', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build-only', async () => {
  const cmd = 'NODE_ENV=production webpack --config webpack.config.prod.js';
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

task('clean', async () => {
  const cmd = 'rimraf dist';

  logger.info('Clean builded directory: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build', series('clean', 'build-only'));
task('pub', series('build', 'publish-develop'));
task('pub:prod', series('build', 'publish-production'));
