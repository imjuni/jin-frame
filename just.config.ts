// import { readFileSync } from 'fs';
// import { argv, logger, option, task } from 'just-scripts';
import { logger, option, task, series } from 'just-scripts';
import { exec } from 'just-scripts-utils';

option('env', { default: { env: 'develop' } });

task('clean', () => {
  exec('rimraf dist artifact', {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build-only', () => {
  const cmd = 'NODE_ENV=production webpack --config webpack.config.prod.js';
  logger.info('Build: ', cmd);

  exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-develop', () => {
  const cmd = 'npm publish --registry http://localhost:8901 --force';

  logger.info('Publish package to verdaccio: ', cmd);

  exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('publish-production', () => {
  const cmd = 'npm publish';

  logger.info('Publish package to npm registry: ', cmd);

  exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', () => {
  const cmd = 'rimraf dist';

  logger.info('Clean builded directory: ', cmd);

  exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build', series('clean', 'build-only'));
task('pub', series('build', 'publish-develop'));
task('pub:prod', series('build', 'publish-production'));
