# Contributing to `rich-text`

<p align="center">
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?maxAge=31557600" alt="PRs Welcome">
  </a>
  &nbsp;
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?maxAge=31557600" alt="Semantic Release">
  </a>
  &nbsp;
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=31557600" alt="JS Standard Style">
  </a>
</p>

We appreciate any community contributions to this project, whether in the form of issues or pull requests.

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | `>=24` (see `.nvmrc`, pinned to `v24`) | Use `nvm use` to switch. [`package.json` → `engines.node`, `.nvmrc`] |
| pnpm | `10.33.0` | Pinned via the `packageManager` field; corepack will use this version automatically. [`package.json` → `packageManager`] |

## 2. Getting Started

```bash
git clone https://github.com/contentful/rich-text.git
cd rich-text
pnpm install
pnpm build
pnpm test
```

`.npmrc` sets `ignore-scripts=true` and `shamefully-hoist=true` — the latter makes pnpm's `node_modules`
layout match the flat/hoisted structure Nx expects. [`.npmrc`]

## 3. Development Workflow

This is an npm/pnpm workspaces monorepo (`packages/*`) orchestrated by Nx. Each package is written in
TypeScript and built to `dist/` (CJS + ESM).

- Run a target for every package: `pnpm <script>` at the root (delegates to `nx run-many -t <target>`).
- Run a target for one package only: `nx run <package-name>:<target>` (e.g.
  `nx run rich-text-html-renderer:test`), or `nx affected --target=<target>` to run only what changed
  relative to `master`. [`package.json` → `scripts`, `.github/workflows/check.yaml`]
- If you change `rich-text-types` and are working on a dependent package (e.g. `rich-text-html-renderer`)
  in the same PR, run `pnpm build` first so the dependent picks up the built types/dist output.

## 4. Commands

**Development**

| Command | Source |
| --- | --- |
| `pnpm start` | `package.json` → `scripts.start` (`nx run-many -t start`) |
| `pnpm clean` | `package.json` → `scripts.clean` |

**Testing**

| Command | Source |
| --- | --- |
| `pnpm test` | `package.json` → `scripts.test` (`nx run-many -t test`) |

**Linting & Formatting**

| Command | Source |
| --- | --- |
| `pnpm lint` | `package.json` → `scripts.lint` (`eslint ./ --ext .ts,.tsx`) |
| `pnpm prettier` | `package.json` → `scripts.prettier` — writes formatting in place |
| `pnpm prettier:check` | `package.json` → `scripts.prettier:check` — check-only, used in CI |

**Building**

| Command | Source |
| --- | --- |
| `pnpm build` | `package.json` → `scripts.build` (`nx run-many -t build`) |

## 5. Testing

- **Framework:** Jest, via `@swc/jest` for TS/TSX transform. [`baseJestConfig.js`]
- **Location:** `packages/<name>/src/__test__/*.test.ts(x)`, except `rich-text-types`, whose tests live in
  `packages/rich-text-types/__test__/` (package-root-level, not under `src/`).
- **Run all:** `pnpm test`.
- **Run one package:** `nx run <package-name>:test`.
- **Coverage:** enabled by default (`collectCoverage: true` in `baseJestConfig.js`); reporters write JUnit
  XML to `../../reports/<package>-results.xml`, uploaded as a CI artifact. [`baseJestConfig.js`,
  `.github/workflows/check.yaml`]

## 6. Code Style & Conventions

- TypeScript, `strict: true` at the root (`strictNullChecks: false`); individual packages may override
  (e.g. `rich-text-types` targets `ES2020`/`esnext` and enables `isolatedModules`). [`tsconfig.json`,
  `packages/rich-text-types/tsconfig.json`]
- ESLint: `eslint:recommended` + `plugin:react/recommended` + `plugin:react-hooks/recommended` +
  `plugin:@typescript-eslint/recommended`, plus import-ordering via `eslint-plugin-import-helpers`.
  [`.eslintrc.js`]
- Prettier: single quotes, trailing commas everywhere. [`package.json` → `prettier`]
- 2-space indent, LF line endings, 100-char line length (Markdown exempted from trailing-whitespace
  trimming). [`.editorconfig`]
- Pre-commit hook runs `lint-staged` (Prettier on staged `.js/.jsx/.ts/.tsx/.md/.mdx`). [`.husky/pre-commit`,
  `package.json` → `lint-staged`]

## 7. Commit Convention

Commit messages are linted by `commitlint` against `@commitlint/config-conventional` (standard Conventional
Commits: `feat:`, `fix:`, `chore:`, etc.). [`commitlint.config.js`]

## 8. Branch Strategy & Release Process

- `master` is the release branch; CI runs on every push/PR to any branch. [`.github/workflows/ci.yml`]
- Publishing is fully automated via Nx Release in CI. On every merge to `master`:
  - `nx release version` computes each changed package's next semver from Conventional Commits since its
    last tag and pushes a `@contentful/<package>@<version>` git tag — **it does not commit a version bump
    to the repository**, so `package.json` version fields on disk are not kept in sync between releases.
  - `nx release publish` publishes each newly-tagged package to npm and creates a GitHub Release with
    generated notes.
  - Nx Release's default Conventional Commits mapping gives `chore`/`build` commits `semverBump: "none"` —
    unlike the old Lerna setup, a `chore(deps)` PR alone will not trigger a package release; only
    `feat`/`fix`/breaking-change commits do.
  - Per-package `CHANGELOG.md` files are frozen at their last Lerna-generated state and are **not** updated
    by CI going forward; current release notes appear on the GitHub Releases page instead.

## 9. Pull Requests

- Semantic PR title/commit enforcement is configured via `.github/semantic.yml` (allowed types: `feat`,
  `fix`, `improvement`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`; merge
  commits are not allowed). [`.github/semantic.yml`]
- Working on your first PR? See
  [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## 10. CI/CD

| Job | Trigger | What it does |
| --- | --- | --- |
| `build` | every push/PR (any branch) | `nx affected --target=build`; caches `packages/*/dist` for later jobs. [`.github/workflows/build.yaml`] |
| `check` | after `build` | `nx affected` for `lint`, `prettier:check`, `test`; uploads JUnit reports. [`.github/workflows/check.yaml`] |
| `release` | push to `master`, after `build` + `check` | Pulls Vault secrets, builds all projects, runs `nx release version` + `nx release publish`. [`.github/workflows/release.yaml`] |

## 11. File-Level Guidance

| Path | Why restricted |
| --- | --- |
| `packages/*/dist/` | Build output, regenerated by `prebuild`/`build`; do not hand-edit. |
| `packages/rich-text-types/scripts/fix-esm-import-extensions.mjs` | Part of the `rich-text-types` build pipeline (rewrites relative `.js` specifiers to `.mjs` in built ESM output) — do not run standalone against source. |
