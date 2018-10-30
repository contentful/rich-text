# rich-text

Typescript libraries for handling and rendering rich text documents.

## Contributions

We follow [angular commit format](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-type)
to generate a changelog.

You'll need to use `npm run commit` to create conventional commits.

## Publishing

We use [Lerna](https://github.com/lerna/lerna) to:

- keep dependencies in sync
  - `lerna bootstrap --hoist`, which gets run as a post-install step
- publish
  - `NPM_CONFIG_OTP={2fa_otp_goes_here} lerna publish`
