import { execSync } from 'child_process';

export function getBranchName(): string {
  try {
    const branch =
      process.env.GIT_BRANCH ||
      execSync('git branch --show-current', {
        encoding: 'utf-8',
      }).trim();
    return branch;
  } catch {
    return 'main';
  }
}
