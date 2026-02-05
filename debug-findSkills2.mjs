import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { OmcPaths } from './dist/lib/worktree-paths.js';

// Create test project
const testProjectRoot = join(tmpdir(), `omc-bridge-debug2-${Date.now()}`);
mkdirSync(testProjectRoot, { recursive: true });

console.log("OmcPaths.SKILLS:", OmcPaths.SKILLS);
console.log("testProjectRoot:", testProjectRoot);

const projectSkillsDir = join(testProjectRoot, OmcPaths.SKILLS);
console.log("projectSkillsDir (expected):", projectSkillsDir);

mkdirSync(projectSkillsDir, { recursive: true });

writeFileSync(
  join(projectSkillsDir, "test-skill.md"),
  "---\nname: Test Skill\ntriggers:\n  - test\n---\nContent"
);

console.log("\nChecks:");
console.log("  projectSkillsDir exists:", existsSync(projectSkillsDir));
console.log("  projectSkillsDir is dir:", statSync(projectSkillsDir).isDirectory());
console.log("  projectSkillsDir contents:", readdirSync(projectSkillsDir));

// Now manually simulate findSkillFilesRecursive
function findSkillFilesRecursive(dir, results, depth = 0) {
  console.log(`  [recursive] checking dir: ${dir}, depth: ${depth}`);
  if (!existsSync(dir)) {
    console.log(`  [recursive] dir not exists!`);
    return;
  }
  if (depth > 10) return;

  const entries = readdirSync(dir, { withFileTypes: true });
  console.log(`  [recursive] entries:`, entries.map(e => e.name));
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findSkillFilesRecursive(fullPath, results, depth + 1);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      console.log(`  [recursive] found skill: ${fullPath}`);
      results.push(fullPath);
    }
  }
}

console.log("\nManual recursive search:");
const results = [];
findSkillFilesRecursive(projectSkillsDir, results);
console.log("Results:", results);

// Cleanup
rmSync(testProjectRoot, { recursive: true, force: true });
console.log("\n✅ Cleanup done");
