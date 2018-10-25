#!/bin/bash

# Adopted from https://github.com/elmariofredo/test-lerna-semantic-release

set -e
# Note: do not do set -x or the passwords will leak!

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo ">>> We are in a pull request, not releasing <<<"
  exit 0
fi

if [ "$TRAVIS_BRANCH" != "master" ]; then
  echo ">>> We are not on master branch, not releasing <<<"
  exit 0
fi

[ -z $GH_TOKEN ] && echo "!!!!!! set GH_TOKEN !!!!!!" && exit 1
[ -z $RELEASE_GH_USERNAME ] && echo "!!!!!! set RELEASE_GH_USERNAME !!!!!!" && exit 1
[ -z $RELEASE_GH_EMAIL ] && echo "!!!!!! set RELEASE_GH_EMAIL !!!!!!" && exit 1
[ -z $RELEASE_GH_TOKEN ] && echo "!!!!!! set RELEASE_GH_TOKEN !!!!!!" && exit 1

[ -z $NPM_TOKEN ] && echo "!!!!!! set NPM_TOKEN !!!!!!" && exit 1
[ -z $NPM_CONFIG_EMAIL ] && echo "!!!!!! set NPM_CONFIG_EMAIL !!!!!!" && exit 1
[ -z $NPM_CONFIG_USERNAME ] && echo "!!!!!! set NPM_CONFIG_USERNAME !!!!!!" && exit 1

echo "GH_TOKEN=***${GH_TOKEN: -3} length: ${#GH_TOKEN}"
echo "RELEASE_GH_USERNAME=${RELEASE_GH_USERNAME}"
echo "RELEASE_GH_EMAIL=${RELEASE_GH_EMAIL}"
echo "RELEASE_GH_TOKEN=***${RELEASE_GH_TOKEN: -3} length: ${#RELEASE_GH_TOKEN}"
echo "NPM_TOKEN=***${NPM_TOKEN: -3} length: ${#NPM_TOKEN}"
echo "NPM_CONFIG_EMAIL=${NPM_CONFIG_EMAIL}"
echo "NPM_CONFIG_USERNAME=${NPM_CONFIG_USERNAME}"

#
# Prepare git and npm for release
#

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>> START: SETTING GIT/NPM FOR RELEASE <<<<<<<<<<<<<<<<<<<<<<<<<<<"

  # Checkout explicit branch
  echo ">>> START: git fetch <<<"
  git fetch
  echo ">>> DONE($?): git fetch <<<"

  echo ">>> START: git checkout master <<<"
  git checkout "${TRAVIS_BRANCH}"
  echo ">>> DONE($?): git checkout master <<<"

  # Git auth
  echo ">>> START: git config --global credential.helper store <<<"
  git config --global credential.helper store
  echo ">>> DONE($?): git config --global credential.helper store <<<"

  echo ">>> START: fill ~/.git-credentials <<<"
  echo "https://${RELEASE_GH_USERNAME}:${RELEASE_GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" > ~/.git-credentials
  echo ">>> DONE($?): fill ~/.git-credentials <<<"

  echo ">>> START: git remote set-url origin <<<"
  git remote set-url origin https://github.com/${TRAVIS_REPO_SLUG}.git
  echo ">>> DONE($?): git remote set-url origin <<<"

  echo ">>> START: git config user.name <<<"
  git config --global user.name "${RELEASE_GH_USERNAME}"
  echo ">>> DONE($?): git config user.name <<<"

  echo ">>> START: git config user.email <<<"
  git config --global user.email "${RELEASE_GH_EMAIL}"
  echo ">>> DONE($?): git config user.email <<<"

  echo ">>> DEBUG >>> git config --list > $(git config --list)"

  # Prevent log warning by explicitly setting push strategy
  echo ">>> START: git config --global push.default simple <<<"
  git config --global push.default simple
  echo ">>> DONE($?): git config --global push.default simple <<<"

  # Npm auth
  echo ">>> START: npm config set username ${NPM_CONFIG_USERNAME}"
  npm config set username "${NPM_CONFIG_USERNAME}"
  echo ">>> DONE($?): npm config set username ${NPM_CONFIG_USERNAME}"

  echo ">>> START: npm config set username ${NPM_CONFIG_EMAIL}"
  npm config set email "${NPM_CONFIG_EMAIL}"
  echo ">>> DONE($?): npm config set username ${NPM_CONFIG_EMAIL}"

  echo ">>> START: npm config set //registry.npmjs.org/:_authToken=... <<<"
  npm config set "//registry.npmjs.org/:_authToken=${NPM_TOKEN}"
  echo ">>> DONE($?): npm config set //registry.npmjs.org/:_authToken=... <<<"

  echo ">>> DEBUG >>> npm whoami > $(npm whoami)"
  echo ">>> DEBUG >>> npm config list > $(npm config list)"

  # Fetch tags
  echo ">>> START: git fetch --tags <<<"
  git fetch --tags
  echo ">>> DONE($?): git fetch --tags <<<"

  # Set upstream branch
  echo ">>> START: git branch -u origin/$TRAVIS_BRANCH <<<"
  git branch -u origin/$TRAVIS_BRANCH
  echo ">>> DONE($?): git branch -u origin/$TRAVIS_BRANCH <<<"

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>> DONE: SETTING GIT/NPM FOR RELEASE <<<<<<<<<<<<<<<<<<<<<<<<<<<"

#
# Build app
#

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>> START: BUILDING APP <<<<<<<<<<<<<<<<<<<<<<<<<<<"

  # Run build task
  echo ">>> START: npm run build <<<"
  npm run build
  echo ">>> DONE($?): npm run build <<<"

  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>> DONE: BUILDING APP <<<<<<<<<<<<<<<<<<<<<<<<<<<"

#
# Release
#

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>> START: RELEASE <<<<<<<<<<<<<<<<<<<<<<<<<<<"

echo ">>> START: lerna-semantic-release pre > analyze commits, set versions and create tags"
./node_modules/.bin/lerna-semantic-release pre
echo ">>> DONE($?): lerna-semantic-release pre > analyze commits, set versions and create tags"

echo ">>> START: lerna-semantic-release post > generate CHANGELOG"
./node_modules/.bin/lerna-semantic-release post
echo ">>> DONE($?): lerna-semantic-release post > generate CHANGELOG"

echo ">>> START: git add packages/**/CHANGELOG.md"
git add packages/**/CHANGELOG.md
echo ">>> DONE($?): git add packages/**/CHANGELOG.md"

echo ">>> START: git commit -m \"chore(changelogs): update all CHANGELOG files\" -m \"[skip ci]\""
git commit -m "chore(release): update all CHANGELOG files" -m "[skip ci]"
echo ">>> DONE($?): git commit -m \"chore(changelogs): update all CHANGELOG files\" -m \"[skip ci]\""

echo ">>> START: lerna-semantic-release perform > git push origin --tags and npm publish"
./node_modules/.bin/lerna-semantic-release perform
echo ">>> DONE($?): lerna-semantic-release perform > git push origin --tags and npm publish"
