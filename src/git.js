import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getStagedDiff() {
  try {
    const { stdout } = await execAsync('git diff --cached');
    return stdout.trim();
  } catch (error) {
    throw new Error('Failed to get staged diff. Are you in a git repository?');
  }
}

export async function commitChanges(message) {
  try {
    await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`);
  } catch (error) {
    throw new Error('Failed to commit changes');
  }
}

export function detectLanguages(diff) {
  const extensions = diff.match(/\+\+\+ b\/.*\.(\w+)/g) || [];
  const langs = new Set();
  
  extensions.forEach(ext => {
    const match = ext.match(/\.(\w+)$/);
    if (match) langs.add(match[1]);
  });
  
  return Array.from(langs);
}
