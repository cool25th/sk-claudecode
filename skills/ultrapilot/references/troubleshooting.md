## Troubleshooting

**Decomposition fails?**
- Task may be too coupled
- Fallback to autopilot triggered automatically
- Review `.skc/ultrapilot/decomposition.json` for details

**Worker hangs?**
- Check worker logs in `.skc/logs/ultrapilot-worker-N.log`
- Cancel and restart that worker
- May indicate file ownership issue

**Integration conflicts?**
- Review `.skc/ultrapilot-state.json` conflicts array
- Check if shared files were unexpectedly modified
- Adjust ownership rules if needed

**Validation loops?**
- Cross-component integration issue
- Review boundary imports
- May need sequential retry with full context

**Too slow?**
- Check if workers are truly independent
- Review decomposition quality
- Consider if autopilot would be faster (high interdependency)
