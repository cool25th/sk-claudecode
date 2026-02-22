## Auto-Detection

The skill checks state files to determine what's active:
- `.skc/state/autopilot-state.json` → Autopilot detected
- `.skc/state/ralph-state.json` → Ralph detected
- `.skc/state/ultrawork-state.json` → Ultrawork detected
- `.skc/state/ecomode-state.json` → Ecomode detected
- `.skc/state/ultraqa-state.json` → UltraQA detected
- `.skc/state/swarm.db` → Swarm detected (SQLite database)
- `.skc/state/ultrapilot-state.json` → Ultrapilot detected
- `.skc/state/pipeline-state.json` → Pipeline detected
- `.skc/state/plan-consensus.json` → Plan Consensus detected
- `.skc/state/ralplan-state.json` → Plan Consensus detected (legacy)

If multiple modes are active, they're cancelled in order of dependency:
1. Autopilot (includes ralph/ultraqa/ecomode cleanup)
2. Ralph (includes linked ultrawork OR ecomode cleanup)
3. Ultrawork (standalone)
4. Ecomode (standalone)
5. UltraQA (standalone)
6. Swarm (standalone)
7. Ultrapilot (standalone)
8. Pipeline (standalone)
9. Plan Consensus (standalone)
