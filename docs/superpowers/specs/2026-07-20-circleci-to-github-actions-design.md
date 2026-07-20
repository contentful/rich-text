# CircleCI to GitHub Actions Migration — Design

**Goal:** Replace `.circleci/config.yml` with equivalent GitHub Actions workflows, preserving the existing Lerna-based independent-versioning release flow. Single PR: add GH Actions workflows and remove CircleCI config/Vault wiring together.

## Context

Current CircleCI pipeline (`.circleci/config.yml`) has three jobs:

- **`lint-and-test`** — pnpm install, `nx affected` for build/lint/prettier:check/test, stores test results, persists workspace for the release job.
- **`release`** (master only, after `lint-and-test`) — restores workspace, configures Lerna/npm auth for GitHub Packages, runs `nx run-many -t build`, then `lerna version --conventional-commits --create-release github` and `lerna publish from-git`.
- **`compressed-size`** — posts a bundle-size PR comment using a CircleCI-only orb (`@contentful/circleci-orb-tools`, keyed off `CIRCLE_PULL_REQUEST`). No GitHub Actions equivalent exists anywhere in the org.

Secrets are fetched from Vault via the CircleCI `vault` orb, using policies declared in `.contentful/vault-secrets.yaml` under a `circleci` service block (`github-comment`, `semantic-release`, `packages-read`, `nx-read-circleci`).

### Prior art surveyed

- `contentful.js` — fully migrated to GH Actions. Hand-rolled `build.yaml`/`check.yaml`/`release.yaml` called from `main.yaml`. Uses `hashicorp/vault-action` against a `github-action` Vault service, `actions/cache` to pass build output between jobs, `nrwl/nx-set-shas`-style equivalent not needed (not an Nx repo).
- `assemblies` — Nx monorepo, delegates to shared reusable workflows in `contentful/developer-platform` (`@contentful/nx` package). Its release job hardcodes an Nx-Release-based versioning mechanism and actively fails CI if `nx.json` has a `release` key — incompatible with this repo's Lerna independent-versioning setup. **Not adopted** — confirmed with user to stay on Lerna.
- `experience-builder` — Nx monorepo, hand-rolled workflows, publishes to GH Packages via Lerna from a GH Actions `publish.yaml`, pulling `GITHUB_PACKAGES_WRITE_TOKEN` from Vault via `hashicorp/vault-action`. Closest architectural match; this design follows its pattern most closely.

## Workflows

All under `.github/workflows/`, using `pnpm` (per the completed yarn→pnpm migration) and Node from `.nvmrc` (currently `v24`).

### `ci.yml` (caller)

- Triggers: `push` (all branches) and `pull_request`.
- `concurrency: group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true`.
- Calls `build.yaml`, then `check.yaml` (needs: build), then `release.yaml` (needs: [build, check], only on push to `master`).

### `build.yaml` (`workflow_call`)

Steps:

1. Checkout (`fetch-depth: 0` — needed for `nx affected` diffing and later for Lerna's version/changelog history).
2. `pnpm/action-setup`, `actions/setup-node` with `node-version-file: .nvmrc`, `cache: pnpm`.
3. `pnpm install --frozen-lockfile`.
4. `nrwl/nx-set-shas` (replaces the CircleCI `nx_set_shas` command / `nx-read-circleci` Vault policy — this action derives base/head SHAs natively from the GH Actions event context, no Vault secret required).
5. `pnpm exec nx affected --target=build --base=$NX_BASE --head=$NX_HEAD`.
6. `actions/cache/save` — cache `packages/*/dist` keyed on `build-cache-${{ github.run_id }}-${{ github.run_attempt }}`.

### `check.yaml` (`workflow_call`, needs build)

Steps 1–4 same setup as `build.yaml`, then: 5. `actions/cache/restore` — restore the `packages/*/dist` cache from `build.yaml` (`fail-on-cache-miss: true`). 6. `pnpm exec nx affected --target=lint --base=$NX_BASE --head=$NX_HEAD`. 7. `pnpm exec nx affected --target=prettier:check --base=$NX_BASE --head=$NX_HEAD`. 8. `pnpm exec nx affected --target=test --base=$NX_BASE --head=$NX_HEAD`. 9. `actions/upload-artifact` for `reports/` (replaces CircleCI's `store_test_results`).

### `release.yaml` (`workflow_call`, needs [build, check], master push only)

Secrets: `VAULT_URL` (required).

Steps:

1. Checkout (`fetch-depth: 0`).
2. `pnpm/action-setup`, `actions/setup-node` (`.nvmrc`, `cache: pnpm`).
3. `hashicorp/vault-action` — role `${{ github.event.repository.name }}-github-action`, method `jwt`, path `github-actions`, fetch `GITHUB_PACKAGES_WRITE_TOKEN`.
4. `pnpm install --frozen-lockfile`.
5. Write `.npmrc`: `@contentful:registry=https://npm.pkg.github.com` + auth token line.
6. `actions/cache/restore` — restore build output from `build.yaml` (`fail-on-cache-miss: true`).
7. `pnpm nx run-many --all -t build --skip-nx-cache` (rebuild step retained as-is from CircleCI config — kept for parity even though a cache restore precedes it).
8. `pnpm lerna version --no-private --conventional-commits --create-release github --yes`.
9. `pnpm lerna publish from-git --yes`.

`GITHUB_TOKEN`/`GH_TOKEN` env vars for steps 8–9 sourced from the Vault-fetched `GITHUB_PACKAGES_WRITE_TOKEN`.

## Vault config changes

`.contentful/vault-secrets.yaml`: replace the `circleci` service block with a `github-action` service block:

```yaml
version: 1
services:
  github-action:
    policies:
      - github-comment
      - semantic-release
      - packages-read
```

`nx-read-circleci` is dropped — no longer needed since `nrwl/nx-set-shas` resolves base/head SHAs natively in GH Actions without a Vault-backed API call.

## Dropped scope

- **`compressed-size` job** — not migrated. No GitHub Actions equivalent exists in the org for `@contentful/circleci-orb-tools`' compressed-size command. Flagged as a known gap / follow-up, not a blocker for this migration.

## Out of scope

- No adoption of `@contentful/nx` shared reusable workflows (release mechanism conflicts with Lerna independent versioning — confirmed with user).
- No changes to package versioning strategy, publish targets, or registry.

## Cutover

Single PR: add all four workflow files and the Vault config change, delete `.circleci/config.yml`, in one commit set. No side-by-side parallel-run period.

## Testing

- Push the branch and confirm `build`/`check` pass on a PR (via `pull_request` trigger).
- Merge to `master` and confirm `release` runs successfully — actual package version bump + publish to GitHub Packages + GitHub release creation.
- Confirm Vault secret retrieval succeeds under the `github-action` service/role.
