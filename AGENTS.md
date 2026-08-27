# AGENTS.md

## Quick Reference

| What you need | Where to look |
| --- | --- |
| How this repo is structured, data flows, domain model | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| How to build/test/run | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Why decisions were made | `docs/ADRs/` (internal-only; ask a maintainer) |
| What this repo does | [README.md](./README.md) |
| PR review rules | [.bito/guidelines/](./.bito/guidelines/) |

## Guardrails

- **Use pnpm.** `packageManager` is pinned to `pnpm@10.33.0` and `pnpm-workspace.yaml` drives workspace
  resolution — npm/yarn will not read `pnpm-workspace.yaml` and can produce a broken `node_modules` layout.
  [`package.json`, `pnpm-workspace.yaml`]
- **This is an Nx monorepo.** Root scripts (`build`, `lint`, `test`, `start`) all delegate to
  `nx run-many -t <target>`. Run a single package's target with `nx run <package>:<target>` rather than
  `cd`-ing into `packages/<name>` and invoking its script directly, so Nx's dependency graph and cache stay
  correct. [`package.json`, `nx.json`]
- **If you write a custom `renderNode` override, escape every interpolated attribute yourself.**
  `rich-text-html-renderer`'s own default `BLOCKS.EMBEDDED_ASSET` renderer previously built the `alt`/`src`
  attributes without proper escaping, which was a stored-XSS finding fixed in a dedicated commit adding
  `escapeHtml()` calls. The library escapes its own defaults; it does not escape output from
  consumer-supplied `renderNode`/`renderMark` overrides. [`packages/rich-text-html-renderer/src/index.ts`,
  `packages/rich-text-html-renderer/src/escapeHtml.ts`]
- **`Link` and `ResourceLink` are not interchangeable shapes.** Code that reads `data.target.sys.id` will
  throw or silently misbehave on a `ResourceLink` node, which only has `sys.urn`. Branch on `sys.type`
  first. [`packages/rich-text-types/src/types.ts`]
- **Releases are tag-only, not commit-based.** `nx release version` never commits to `master` (an
  org-level ruleset blocks direct pushes to `master`, including from automation). Do not add a release step
  that expects a version-bump commit on `master` — there isn't one. [`.github/workflows/release.yaml`]

## Safety & Permissions

- Do not hand-edit `packages/*/dist/` — it is build output (`prebuild` runs `rimraf dist` before every
  build). [`packages/*/package.json` → `scripts.prebuild`]
- Ask before changing `.github/workflows/release.yaml` or `nx.json` → `release` config — a mistake here
  either breaks publishing or (per past incident) attempts a `master` commit that the org ruleset will
  reject.
- Ask before removing `contentful-slatejs-adapter` or its non-standard build config
  (`rollup.config.ts`/`jest.config.js`, not extending root `tsconfig.json`) — it is actively released and
  no deprecation has been confirmed, even though its tooling diverges from the other six packages
  `[NEEDS TEAM INPUT]`.

## Build & Quality

```bash
# Quick verification loop (source: package.json scripts)
pnpm install --frozen-lockfile && pnpm build && pnpm test && pnpm lint
```
