import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, realpathSync } from 'fs';
import { join, normalize, sep } from 'path';
import { tmpdir } from 'os';

const testProjectRoot = join(tmpdir(), `omc-bridge-debug3-${Date.now()}`);
mkdirSync(testProjectRoot, { recursive: true });

const PROJECT_SKILLS_SUBDIR = '.skc/skills';
const projectSkillsDir = join(testProjectRoot, PROJECT_SKILLS_SUBDIR);
mkdirSync(projectSkillsDir, { recursive: true });

const skillFile = join(projectSkillsDir, "test-skill.md");
writeFileSync(skillFile, "---\nname: Test\ntriggers:\n  - x\n---\nC");

// Simulate safeRealpathSync
function safeRealpathSync(filePath) {
  try {
    return realpathSync(filePath);
  } catch {
    return filePath;
  }
}

// Simulate isWithinBoundary
function isWithinBoundary(realPath, boundary) {
  const normalizedReal = realPath.replace(/\\/g, '/').replace(/\/+/g, '/');
  const normalizedBoundary = boundary.replace(/\\/g, '/').replace(/\/+/g, '/');
  console.log("  isWithinBoundary:");
  console.log("    realPath:", normalizedReal);
  console.log("    boundary:", normalizedBoundary);
  const result = normalizedReal === normalizedBoundary || normalizedReal.startsWith(normalizedBoundary + '/');
  console.log("    result:", result);
  return result;
}

console.log("skillFile:", skillFile);
console.log("projectSkillsDir:", projectSkillsDir);

const realPath = safeRealpathSync(skillFile);
console.log("realPath:", realPath);

const boundaryCheck = isWithinBoundary(realPath, projectSkillsDir);

// Cleanup
rmSync(testProjectRoot, { recursive: true, force: true });
