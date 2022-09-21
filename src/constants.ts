import { env } from 'process';

const { GITHUB_REPOSITORY, GITHUB_SHA } = env;
if (typeof GITHUB_REPOSITORY === 'undefined')
  throw new TypeError('GITHUB_REPOSITORY is not defined.');
if (typeof GITHUB_SHA === 'undefined')
  throw new TypeError('GITHUB_SHA is not defined.');

export const blobBase = `https://github.com/${GITHUB_REPOSITORY}/blob/${GITHUB_SHA}/`;
