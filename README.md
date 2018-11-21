# rich-text

Monorepo with Typescript libraries for handling and rendering Contentful rich
text documents.

## Packages

- [`rich-text-from-markdown`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-from-markdown)
  - Converts markdown documents to rich text
- [`rich-text-html-renderer`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer)
  - Converts rich text documents to HTML
- [`rich-text-links`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-links)
  - Entity (entry and asset) link extraction utilities
- [`rich-text-plain-text-renderer`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-plain-text-renderer)
  - Converts rich text documents to plain text
- [`rich-text-types`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer)
  - Type definitions and constants for the rich text field type

## Useful npm scripts

- `npm run build` builds vendored files in the `dist/` directory of each package
- `npm run commit` runs git commits with [commitizen](http://commitizen.github.io/cz-cli/)
- `npm run clean` removes any built files and `node_modules`
- `npm run lint` runs our TypeScript linter on all `.ts` files in each package
- `npm run test` runs unit tests for all packages
- `npm run test:ci` runs unit tests in CI mode (same as would be run by Travis)
- `npm run test:watch` runs unit tests in "watch" mode (will refresh relevant
  code paths on save)

## Get involved

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?maxAge=31557600)](http://makeapullrequest.com)

We appreciate any help on our repositories. For more details on how to
contribute, see below:

### Contributing

We follow [Angular JS Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-type)
to generate a changelog, enforced by [commitizen](http://commitizen.github.io/cz-cli/). You'll need to use `npm run commit` to create
conventional commits.

We use a common [rollup](https://rollupjs.org/guide/en) config to compile
packages from TypeScript to ES5.

We use common [TypeScript](https://www.typescriptlang.org/) and [tslint](https://palantir.github.io/tslint/)
configs.

We use [Jest](https://jestjs.io/) for unit tests.

### Publishing

We use [Lerna](https://github.com/lerna/lerna) to:

- keep dependencies in sync
  - `lerna bootstrap --hoist` (which is run as a post-install step)
- publish
  - `NPM_CONFIG_OTP={2fa_otp_goes_here} npm run publish`

## Reach out to us

### You have questions about how to use this library?
* Reach out to our community forum: [![Contentful Community Forum](https://img.shields.io/badge/-Join%20Community%20Forum-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://support.contentful.com/)
* Jump into our community slack channel: [![Contentful Community Slack](https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600)](https://www.contentful.com/slack/)

### You found a bug or want to propose a feature?

* File an issue here on GitHub: [![File an issue](https://img.shields.io/badge/-Create%20Issue-6cc644.svg?logo=github&maxAge=31557600)](https://github.com/contentful/rich-text/issues/new). Make sure to remove any credential from your code before sharing it.

### You need to share confidential information or have other questions?

* File a support ticket at our Contentful Customer Support: [![File support ticket](https://img.shields.io/badge/-Submit%20Support%20Ticket-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600)](https://www.contentful.com/support/)

## License

This repository is published under the [MIT](LICENSE) license.

## Code of Conduct

We want to provide a safe, inclusive, welcoming, and harassment-free space and experience for all participants, regardless of gender identity and expression, sexual orientation, disability, physical appearance, socioeconomic status, body size, ethnicity, nationality, level of experience, age, religion (or lack thereof), or other identity markers.

[Read our full Code of Conduct](https://github.com/contentful-developer-relations/community-code-of-conduct).
