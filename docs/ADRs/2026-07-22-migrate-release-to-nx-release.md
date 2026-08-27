# Migrate release versioning/publishing from Lerna to Nx Release

## Status

Accepted

## Context

The release job's `lerna version --create-release github --yes` step committed the version bump directly
to `master` and pushed it. This became permanently blocked by an org-level GitHub ruleset ("Changes must be
made through a pull request", ruleset id `3858952`) applying to all pushes to `master`, including from
automation — confirmed it could not be bypassed via repo settings since the ruleset is org-managed.
[`0e40927`]

## Decision

Switch to the tag-only `nx release` pattern already used by other Contentful Nx monorepos:

- `nx release version` creates and pushes git tags **without ever committing to the working tree**, so it
  never touches `master` and the ruleset is never triggered.
- `nx release publish` publishes each tagged package to npm and creates a GitHub Release with generated
  changelog notes (`createRelease: "github"`).
- `nx.json` gained a `release` block: independent per-project versioning, Conventional-Commits-based
  version bumps, tag-only git behavior, GitHub-Releases-based changelog.
- `lerna.json` and the `lerna` devDependency were removed; root Lerna-backed scripts (`build`, `clean`,
  `prebuild`, `start`, `test`) were rewritten to `nx run-many` equivalents.
- `nx`/`@nx/js` were added as **direct** devDependencies (previously only transitive, via `lerna`) since
  removing `lerna` would otherwise have dropped them.

[`0e40927` — `chore(ci): migrate release versioning from lerna to nx release`]

## Consequences

- **Intentional behavior change, confirmed with the team at the time:** Nx Release's default
  Conventional-Commits config maps `chore`/`build` commit types to `semverBump: "none"`, unlike Lerna's
  angular preset, which bumped `patch` for *any* commit type. Since this repo's commit volume is dominated
  by Renovate `chore(deps)` PRs, those no longer trigger a package release by themselves — only
  `feat`/`fix`/breaking-change commits do. No override was added to restore the old behavior.
- **Also intentional:** per-package `CHANGELOG.md` files stop being updated by CI going forward, frozen at
  their last Lerna-generated state. Release notes now live on the GitHub Releases page instead. Do not
  expect `CHANGELOG.md` to reflect any release after this migration.
- A same-week follow-up commit (`b503537`, `fix(ci): remove invalid --yes flag from nx release
  subcommands`) and a later one (`chore(ci): upgrade nx to 21.6.11 and fix release config for v21`,
  `406488d`) indicate the initial migration needed two rounds of correction — treat the release pipeline as
  having had rough edges immediately after this migration, not as fully proven on day one.
