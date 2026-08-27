# Migrate package manager from Yarn to pnpm

## Status

Accepted

## Context

The repo used Yarn (`yarn.lock`, Lerna's `npmClient: yarn`, Yarn-only `resolutions` in `package.json`) as
its package manager. `yarn.lock` was ~10,800 lines removed and replaced with a `pnpm-lock.yaml` of ~12,050
lines, generated via `pnpm import` specifically to preserve the same resolved dependency versions
(deterministic migration, not a fresh resolve). No alternative package manager (npm workspaces, staying on
Yarn) is discussed in the commit message; this reads as an org-wide/team-wide standardization on pnpm
rather than a rich-text-specific tradeoff analysis. [`3eddc41`]

## Decision

Adopt pnpm as the package manager:

- `pnpm-workspace.yaml` added for workspace package resolution (pnpm does not read the npm `workspaces`
  field in `package.json`).
- `lerna.json` → `npmClient` changed from `yarn` to `pnpm`.
- Yarn-only `resolutions` replaced with `pnpm.overrides` in `package.json`.
- `packageManager` field pinned to `pnpm@10.33.0` (later bumped by Renovate to `10.34.4` for a security fix,
  per `git log -- package.json`).
- `.npmrc` gained `shamefully-hoist=true` so pnpm's `node_modules` layout matches the flat/hoisted structure
  Lerna + Nx expect.

[`3eddc41` — `chore: migrate from yarn to pnpm`]

## Consequences

- Enables the later Lerna→Nx Release migration (`2026-07-22`), which was already standard for pnpm-based Nx
  monorepos elsewhere at Contentful per that commit's message ("the tag-only `nx release` pattern already
  used by other Contentful nx monorepos").
- `shamefully-hoist=true` trades pnpm's normal strict node_modules isolation for compatibility with
  Lerna/Nx's flat-layout expectations — a deliberate compatibility tradeoff, not pnpm's default posture.
- Contributors must use pnpm; npm/yarn will not read `pnpm-workspace.yaml` and can produce an incorrect
  dependency layout (documented in `AGENTS.md`/`CONTRIBUTING.md`).
