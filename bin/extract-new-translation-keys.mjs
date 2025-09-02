import ansiEscapes from 'ansi-escapes';
import cma from 'contentful-management';
import { spawnSync } from 'node:child_process';
import { readFile, unlink } from 'node:fs/promises';
import PO from 'pofile';

const CATALOG_URL = 'https://l10n-tooling.colorfuldemo.com/api/catalogs/en-US?preview=true';
const USAGE = 'Usage: npm run upload-translation-keys <cma-token>';
const SPACE_ID = 'rykzha7r6s4b';
const ENVIRONMENT_ID = 'master';
const CONTENTFUL_URL = `https://app.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;
const PLURAL_LANGUAGE_VALUE_ID_MAP = {
  '=0': 'languageValueZero',
  one: 'languageValueOne',
  two: 'languageValueTwo',
  few: 'languageValueFew',
  many: 'languageValueMany',
  other: 'languageValueOther',
};

const cmaToken = process.argv[2];
if (!cmaToken) {
  console.error('Error: <cma-token> parameter is missing');
  console.error(USAGE);
  process.exit(1);
}

const { catalogPath, sourceLocale } = await runCommand(readConfig, 'Read lingui config');

const upstreamTranslationKeys = await runCommand(
  fetchUpstreamTranslationKeys,
  'Fetch upstream translation keys'
);

const newTranslations = await runCommand(
  () => extractNewTranslations(upstreamTranslationKeys),
  'Extract new translations'
);

await uploadTranslations(newTranslations);

await runCommand(() => cleanUp(catalogPath), 'Clean up');

async function uploadTranslations(translations) {
  // eslint-disable-next-line import-x/no-named-as-default-member
  const client = cma.createClient({ accessToken: cmaToken }, { type: 'plain' });

  for (const poItem of translations) {
    const key = poItem.msgid;
    const description =
      poItem.extractedComments[0] !== 'js-lingui-explicit-id'
        ? poItem.extractedComments[0]
        : undefined;

    if (poItem.msgstr[0].match(/^\{(\w+),/)) {
      const fullMatch = poItem.msgstr[0].match(
        /^\{(\w+), plural,((?: (?:=\d+|\w+) \{(?:\{[^{]+?\}|[^{])*?\})+)\}$/
      );
      if (!fullMatch) {
        console.error(`Couldn't parse default message for key ${key}.`);
        continue;
      }

      const count = fullMatch[1];
      const rawForms = fullMatch[2];

      const formMatches = [...rawForms.matchAll(/ ((?:=\d+|\w+)) \{((?:\{[^{]+?\}|[^{])*?)\}/g)];
      const languageValues = Object.fromEntries(
        formMatches.map(([, key, message]) => [
          PLURAL_LANGUAGE_VALUE_ID_MAP[key],
          { [sourceLocale]: message },
        ])
      );

      const messageEntry = await createPluralMessageEntry(client, languageValues, count);
      await createTranslationEntry(client, key, description, messageEntry);
    } else {
      const messageEntry = await createMessageEntry(client, { 'en-US': poItem.msgstr[0] });
      await createTranslationEntry(client, key, description, messageEntry);
    }
  }
}

async function runCommand(command, message) {
  try {
    process.stdout.write(`${message}...`);
    const result = await command();
    console.log(' DONE');
    return result;
  } catch (error) {
    console.error(`\nError: ${error}`);
    process.exit(1);
  }
}

async function fetchUpstreamTranslationKeys() {
  return await fetch(CATALOG_URL).then(async (response) => {
    if (!response.ok) {
      return Promise.reject(
        `Fetching catalog from ${CATALOG_URL} failed with ${response.status} ${response.statusText}`
      );
    }

    return new Set(Object.keys(await response.json()));
  });
}

async function extractNewTranslations(upstreamTranslationKeys) {
  const extractTranslationKeys = spawnSync('npm', ['run', 'extract-translation-keys']);
  if (extractTranslationKeys.status !== 0) {
    throw new Error(`Extracting keys failed with ${extractTranslationKeys.stderr.toString()}`);
  }

  const po = await readCatalog(catalogPath);
  return po.items.filter((item) => !upstreamTranslationKeys.has(item.msgid));
}

function readCatalog(path) {
  return new Promise((resolve, reject) => {
    PO.load(path, (err, po) => {
      if (err) {
        reject(err);
      } else {
        resolve(po);
      }
    });
  });
}

async function createMessageEntry(client, languageValue) {
  return await client.entry.create(
    {
      contentTypeId: 'message',
      spaceId: SPACE_ID,
      environmentId: ENVIRONMENT_ID,
    },
    {
      fields: { languageValue },
    }
  );
}

async function createPluralMessageEntry(client, languageValues, count) {
  return await client.entry.create(
    {
      contentTypeId: 'messageWithPluralization',
      spaceId: SPACE_ID,
      environmentId: ENVIRONMENT_ID,
    },
    {
      fields: {
        count: { 'en-US': count },
        ...languageValues,
      },
    }
  );
}

async function createTranslationEntry(client, key, description, messageEntry) {
  return client.entry
    .create(
      {
        contentTypeId: 'translation',
        spaceId: SPACE_ID,
        environmentId: ENVIRONMENT_ID,
      },
      {
        fields: {
          translationKey: { 'en-US': key },
          description: { 'en-US': description },
          message: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: messageEntry.sys.id,
              },
            },
          },
        },
      }
    )
    .then((entry) => {
      console.log(
        `Created ${ansiEscapes.link('entry', `${CONTENTFUL_URL}/entries/${entry.sys.id}`)} for key ${key}.`
      );
    })
    .catch(async (err) => {
      try {
        await client.entry.delete({
          spaceId: SPACE_ID,
          environmentId: ENVIRONMENT_ID,
          entryId: messageEntry.sys.id,
        });
      } catch (err) {
        console.error(err);
      }
      if (err.name === 'VersionMismatch') {
        console.error(
          `${ansiEscapes.link('Entry', `${CONTENTFUL_URL}/entries/${key}`)} for key ${key} already exists.`
        );
        return;
      }
      console.error(err);
    });
}

async function readConfig() {
  const config = await JSON.parse(await readFile('.linguirc', 'utf-8'));
  const { catalogs, sourceLocale } = config;

  if (catalogs.length > 1) {
    throw new Error(`One catalog expected, found ${catalogs.length}`);
  }
  const catalogPath = catalogs[0].path.replace('{locale}', `${sourceLocale}.po`);

  return { catalogPath, sourceLocale };
}

async function cleanUp(catalogPath) {
  return unlink(catalogPath);
}
