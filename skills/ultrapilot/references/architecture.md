## Architecture

```
User Input: "Build a full-stack todo app"
           |
           v
  [ULTRAPILOT COORDINATOR]
           |
   Decomposition + File Partitioning
           |
   +-------+-------+-------+-------+
   |       |       |       |       |
   v       v       v       v       v
[W-1]   [W-2]   [W-3]   [W-4]   [W-5]
backend frontend database api-docs tests
(src/  (src/   (src/    (docs/)  (tests/)
 api/)  ui/)    db/)
   |       |       |       |       |
   +---+---+---+---+---+---+---+---+
       |
       v
  [INTEGRATION PHASE]
  (shared files: package.json, tsconfig.json, etc.)
       |
       v
  [VALIDATION PHASE]
  (full system test)
```
