import * as fs from 'fs';
import * as path from 'path';

export function findWorkspaceRoot(): string {
  let directory = process.cwd();
  while (directory !== path.dirname(directory)) {
    if (fs.existsSync(path.join(directory, 'nx.json'))) {
      return directory;
    }
    directory = path.dirname(directory);
  }
  return process.cwd();
}
