# Add ESM build output alongside CommonJS

## Status

Accepted

## Context

Consumers needed ESM (`import`) support (GitHub issue
[#1043](https://github.com/contentful/rich-text/issues/1043), closing PR #1068). As part of this work the
repo also removed benchmark tooling (`bin/benchmark/`, `bin/tsconfig.json` at root, and
`packages/rich-text-links/bin/*`) and added `packages/rich-text-html-renderer/src/escapeHtml.ts`. A
same-day follow-up commit (`8c320bd`'s successor) dropped the `is-plain-object` dependency (replaced with
inline checks, needed for the latest version to support ESM cleanly) and bumped `engines.node` to Node's
own officially-supported versions. [`8c320bd`]

## Decision

Ship dual CJS + ESM output per package, using per-package `exports` maps
(`{ types, import, require, default }` in each `package.json`). `rich-text-types` uses the most explicit
build pipeline: `build:types` (tsc, declarations only) → `build:cjs` (swc → `dist/cjs`) → `build:esm` (swc →
`dist/esm`, `.mjs` extension) → `fix-esm-imports` (a repo-local script,
`scripts/fix-esm-import-extensions.mjs`, that rewrites relative `.js` import specifiers to `.mjs` in the
built ESM output, since TypeScript/swc do not do this rewrite themselves).

## Consequences

- Consumers on ESM-only toolchains can now `import` these packages directly instead of relying on interop.
- `rich-text-types`'s build is now four sequential steps instead of one `tsc && rollup` pass used by the
  other packages — more moving parts, and the only package with a custom post-build script
  (`fix-esm-import-extensions.mjs`). Anyone touching this package's build should read that script; it is
  not optional tooling, the ESM output would ship broken relative imports without it.
- Root-level and `rich-text-links` benchmark scripts were deleted as part of this change; one benchmark
  directory (`packages/rich-text-plain-text-renderer/bin/`) was missed and is now orphaned (broken
  `tsconfig.json` extends path) — see `CLAUDE.md` Sharp Edges.
