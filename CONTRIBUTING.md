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

We appreciate any community contributions to this project, whether in the form
of issues or pull requests.

This document outlines what we'd like you to follow in terms of commit messages
and code style.

It also explains what to do if you want to set up the project locally and run
tests.

**Working on your first Pull Request?**
You can learn how from this *free* series: [How to Contribute to an Open Source
Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Useful npm scripts

- `npm run build` builds vendored files in the `dist` directory of each package
- `npm run commit` runs git commits with [commitizen](http://commitizen.github.io/cz-cli/)
- `npm run clean` removes any built files and `node_modules`
- `npm run lint` runs our TypeScript linter on all `.ts` files in each package
- `npm run test` runs unit tests for all packages
- `npm run test:ci` runs unit tests in CI mode (same as would be run by Travis)
- `npm run test:watch` runs unit tests in "watch" mode (will refresh relevant
  code paths on save)

## Setup

This project is a [Lerna](https://lernajs.io/) monorepo with several packages,
each published separately to npm.

### Local Development

Run `npm install` to install all necessary dependencies.

As a post-install step, all Lerna dependencies are [hoisted](https://github.com/lerna/lerna/blob/master/doc/hoist.md),
and hence internally reliant packages (e.g., `rich-text-html-renderer`, which
depends upon `rich-text-types`) will resolve their modules via symlink. In other
words, `npm install` will _both_ install external dependencies for each project,
_and_ ensure packages that pull in other packages in this repository as
dependencies are linked to the local version (rather than whatever the state
of those packages is on npm).

Each package is written in [TypeScript](https://www.typescriptlang.org/) and
compiled to ES5 using [rollup](https://rollupjs.org/guide/en) to the `dist`
directory.

This should generally only happen at publishing time, but you may want to run
`npm run build` prematurely during local development.

For example, let's say you're working on a pull request that

1) adds support for a type in `rich-text-types`, and
2) adds behavior to handle that type in `rich-text-html-renderer`.

If changes in the latter are dependent upon changes in the former, you'll need
to run `npm run build` to update the referenced vendored files in
`rich-text-html-renderer`.

All necessary dependencies are installed under `node_modules` and any necessary
tools can be accessed via npm scripts. There is no need to install anything
globally.

### Creating commits

We follow [Angular JS Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-type)
to generate a changelog, enforced by [commitizen](http://commitizen.github.io/cz-cli/).
You'll need to use `npm run commit` to create conventional commits.

### Code style

This project uses [JavaScript Standard Style](https://standardjs.com/) and
[Prettier](https://prettier.io/) conventions. Install a relevant editor plugin
if you'd like. When in doubt, follow a style similar to the existing code :)

We use a common [rollup](https://rollupjs.org/guide/en) config to compile
packages from TypeScript to ES5. We also use common [TypeScript](https://www.typescriptlang.org/)
and [tslint](https://palantir.github.io/tslint/) configs. You'll notice
the `rollup.config.js` and `tsconfig.json` in each package largely reference
those files on a root level - this keeps code conventions consistent across the
repository as a whole.

### Running tests

We use [Jest](https://jestjs.io/) for unit tests. See **Useful npm scripts**
above for some relevant npm commands.

## Publishing

We use [Lerna](https://github.com/lerna/lerna) to:

- keep dependencies in sync
  - `lerna bootstrap --hoist` (which is run as a post-install step)
- publish
  - `NPM_CONFIG_OTP={2fa_otp_goes_here} npm run publish`
  - As a community developer, you most likely won't have to worry about this
    step :)
