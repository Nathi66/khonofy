# Workflow: Bug Fix

## Pipeline

```
Receive Issue
↓
Read Specification
↓
Read Business Rules
↓
Locate Component / Backend
↓
Reproduce
↓
Find Root Cause
↓
Implement Fix (owning engineer)
↓
Run Tests
↓
Verify
↓
Update Documentation (if behavior/docs wrong)
↓
Complete (Loop Engineer gates)
```

## Skills

- Loop Engineer orchestrates
- Frontend / Backend / Database Engineer implements based on root cause
- QA verifies against specs
- BA updates specs only if the bug revealed incorrect documentation (not to match a buggy implementation)

## Rule

Fix code to match specs. If the product should change, update specs first via BA/PM, then fix.
