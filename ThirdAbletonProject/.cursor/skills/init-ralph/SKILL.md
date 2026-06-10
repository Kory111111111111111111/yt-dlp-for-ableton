---
name: init-ralph
description: 'Initialize or bootstrap a Ralph workspace. Use when starting a repo, preparing the workspace for first use, creating or seeding the `.ralph` folder, filling the first project understanding / journal entries, and documenting setup blockers before substantive work begins.'
argument-hint: Optional short note about the repo purpose or what should be prepared first
user-invocable: true
disable-model-invocation: true
---

# Ralph Workspace Init

Use this skill to perform the first-pass Ralph setup for a workspace.

The goal is to leave the repository in a ready state for future tasks by creating or updating the core `.ralph/` memory files with evidence-based initial content.



## When to Use

- A repository is new to the Ralph workflow
- `.ralph/` exists but is still mostly blank
- The agent needs to prepare project memory before implementation work
- The workspace needs an initial journal entry and verification baseline

## Required Outcomes

After `/init-ralph`, the workspace should have:

- a grounded initial entry in `.ralph/project-understanding.md`
- a first timestamped note in `.ralph/journal.md`
- an initial verification baseline in `.ralph/verification-report.md`
- a handoff entry describing what was prepared in `.ralph/handoff.md`
- updated `.ralph/design-system.md` notes if any UI evidence exists

## Procedure

1. Inspect the repository root, docs, config, manifests, `.github/` customizations, and current `.ralph/` contents.
2. Infer the present purpose of the repository only from evidence in the workspace.
3. Create any missing `.ralph/` files using the standard Ralph filenames.
4. Seed the `.ralph/` files with initial content:
   - record known facts,
   - record unknowns explicitly,
   - avoid guessing product details,
   - note missing verification commands if the repo does not have runnable checks yet.
5. Append the first journal entry with:
   - timestamp,
   - task,
   - investigation summary,
   - changes made,
   - why the workspace was prepared this way,
   - verification performed,
   - follow-up considerations.
6. If the repo depends on environment variables and no `.env` exists, create a placeholder `.env` with the required keys.
7. Finish with a concise summary of what was initialized, what remains unknown, and what the next useful action should be.

## Guardrails

- Do not invent application behavior that is not supported by repository evidence.
- Treat open questions as first-class output.
- Keep the initial entries concise but concrete.
- Prefer preparing the workspace for future work over speculative refactoring.
- If the repo is itself a workflow/template repository, document that directly instead of pretending it is an app.
- If a repository treats `.ralph/` as reference-only or opt-in, do not use this skill unless the user explicitly requests Ralph initialization or refresh work.

## Ralph File Checklist

- `.ralph/project-understanding.md`
- `.ralph/journal.md`
- `.ralph/design-system.md`
- `.ralph/verification-report.md`
- `.ralph/handoff.md`