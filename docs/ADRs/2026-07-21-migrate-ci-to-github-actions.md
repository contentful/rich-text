# Migrate CI from CircleCI to GitHub Actions

## Status

Accepted

## Context

The trigger, per the commit message, was narrow and pragmatic: "CodeQL needs at least one action to run,
and as we don't have any, why not migrate the whole pipeline to GitHub Actions instead?" — i.e. adopting
CodeQL (a GitHub-native scanning tool) required at least one GitHub Actions workflow to exist, which made
maintaining two parallel CI systems (CircleCI for build/test/release, GitHub Actions for CodeQL only) look
like unnecessary duplication. [`140b093`]

## Decision

Replace `.circleci/config.yml` entirely with GitHub Actions workflows: `ci.yml` (orchestrator), `build.yaml`,
`check.yaml`, `release.yaml`. The existing Lerna independent-versioning release flow was preserved as-is in
this migration (it was replaced separately, one day later, by the Nx Release migration — see
`2026-07-22-migrate-release-to-nx-release.md`). The CircleCI Vault service identity was renamed to
`github-action`. The `compressed-size` CI job (bundle-size tracking, config still present at
`.contentful/compressed-size.yml`) was dropped — "no GH Actions equivalent exists org-wide" — and explicitly
flagged as a follow-up in the PR description. [`140b093`]

## Consequences

- Single CI system going forward; no more dual-maintenance of CircleCI + GitHub Actions config.
- `.contentful/compressed-size.yml` is now dead configuration — no job reads it. It was not removed, so it
  reads as "still active" to anyone skimming the repo. Confirm whether to restore a bundle-size check or
  delete the stale config.
- The PR's own "TODO" noted "Update required checks before merging" — worth confirming whether branch
  protection required-checks were actually updated to the new GitHub Actions job names, or whether this
  was left as manual follow-up. `[NEEDS TEAM INPUT]`
