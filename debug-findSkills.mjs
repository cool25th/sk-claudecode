import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { findSkillFiles, clearSkillMetadataCache, PROJECT_SKILLS_SUBDIR } from './dist/hooks/learner/bridge.js';

// Create test project
clearSkillMetadataCache();
const testProjectRoot = join(tmpdir(), `omc-bridge-debug-${Date.now()}`);
mkdirSync(testProjectRoot, { recursive: true });

console.log("PROJECT_SKILLS_SUBDIR:", PROJECT_SKILLS_SUBDIR);

const skillsDir = join(testProjectRoot, ".skc", "skills");
mkdirSync(skillsDir, { recursive: true });

writeFileSync(
  join(skillsDir, "test-skill.md"),
  "---\nname: Test Skill\ntriggers:\n  - test\n---\nContent"
);

console.log("Test project root:", testProjectRoot);
console.log("Skills dir:", skillsDir);
console.log("Skills dir exists:", existsSync(skillsDir));
console.log("Skills dir contents:", readdirSync(skillsDir));

const files = findSkillFiles(testProjectRoot);
console.log("\n=== findSkillFiles result ===");
console.log("Total files:", files.length);
console.log("Project files:", files.filter(f => f.scope === "project").length);
console.log("User files:", files.filter(f => f.scope === "user").length);
files.forEach(f => console.log(`  - ${f.scope}: ${f.path}`));

// Cleanup
rmSync(testProjectRoot, { recursive: true, force: true });
