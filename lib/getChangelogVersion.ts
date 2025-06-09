// lib/getChangelogVersion.ts
import fs from 'fs';
import path from 'path';

export function getLatestVersionFromChangelog(): string | null {
  const filePath = path.join(process.cwd(), 'pages/docs/CHANGELOG.mdx');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  for (const line of lines) {
    // Check if line is a level 2 heading (starts with ##)
    if (line.startsWith('## ')) {
      const versionMatch = line.match(/##\s*v(\d+\.\d+\.\d+[^\s]*)/);
      if (versionMatch?.[1]) {
        return versionMatch[1]; // Return the version number
      }
      throw new Error(
        'Version format not recognized in changelog. Make sure first 2nd level heading starts with "## v"',
      );
    }
  }

  return null;
}
