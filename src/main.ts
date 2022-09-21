import * as core from '@actions/core';
import { lcovToMarkdown } from './lcov';

(async () => {
  try {
    await core.summary
      .addRaw(await lcovToMarkdown(core.getInput('lcov', { required: true })))
      .write();
  } catch (e) {
    core.setFailed(typeof e === 'string' || e instanceof Error ? e : `${e}`);
  }
})();
