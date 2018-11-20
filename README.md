<p align="center">
  <a href="https://www.contentful.com/slack/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Slack-2AB27B.svg?logo=slack&maxAge=31557600" alt="Join Contentful Community Slack">
  </a>
  &nbsp;
  <a href="https://www.contentfulcommunity.com/">
    <img src="https://img.shields.io/badge/-Join%20Community%20Forum-3AB2E6.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1OSI+CiAgPHBhdGggZmlsbD0iI0Y4RTQxOCIgZD0iTTE4IDQxYTE2IDE2IDAgMCAxIDAtMjMgNiA2IDAgMCAwLTktOSAyOSAyOSAwIDAgMCAwIDQxIDYgNiAwIDEgMCA5LTkiIG1hc2s9InVybCgjYikiLz4KICA8cGF0aCBmaWxsPSIjNTZBRUQyIiBkPSJNMTggMThhMTYgMTYgMCAwIDEgMjMgMCA2IDYgMCAxIDAgOS05QTI5IDI5IDAgMCAwIDkgOWE2IDYgMCAwIDAgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0UwNTM0RSIgZD0iTTQxIDQxYTE2IDE2IDAgMCAxLTIzIDAgNiA2IDAgMSAwLTkgOSAyOSAyOSAwIDAgMCA0MSAwIDYgNiAwIDAgMC05LTkiLz4KICA8cGF0aCBmaWxsPSIjMUQ3OEE0IiBkPSJNMTggMThhNiA2IDAgMSAxLTktOSA2IDYgMCAwIDEgOSA5Ii8+CiAgPHBhdGggZmlsbD0iI0JFNDMzQiIgZD0iTTE4IDUwYTYgNiAwIDEgMS05LTkgNiA2IDAgMCAxIDkgOSIvPgo8L3N2Zz4K&maxAge=31557600"
      alt="Join Contentful Community Forum">
  </a>
</p>


# rich-text - Contentful's Rich text utilities

> Typescript libraries for handling and rendering rich text documents.


**What is Contentful?**

[Contentful](https://www.contentful.com/) provides content infrastructure for digital teams to power websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customizable web app that enable developers and content creators to ship their products faster.

## Packages

- [rich-text-types](https://github.com/contentful/rich-text/tree/master/packages/rich-text-types)
- [rich-text-plain-text-renderer](https://github.com/contentful/rich-text/tree/master/packages/rich-text-plain-text-renderer)
- [rich-text-html-renderer](https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer)
- [rich-text-links](https://github.com/contentful/rich-text/tree/master/packages/rich-text-links)
- [rich-text-from-markdown](https://github.com/contentful/rich-text/tree/master/packages/rich-text-from-markdown)

## Pre-requisites && Installation

### Pre-requisites

- node.js 8.x
- yarn

## Contributing

We follow [angular commit format](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-type)
to generate a changelog.

You'll need to use `npm run commit` to create conventional commits.
## Publishing

We use [Lerna](https://github.com/lerna/lerna) to:

- keep dependencies in sync
  - `lerna bootstrap --hoist`, which is run as a post-install step
- publish
  - `NPM_CONFIG_OTP={2fa_otp_goes_here} npm run publish`
