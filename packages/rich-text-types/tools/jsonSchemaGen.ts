import { resolve } from 'path';
import { writeFile } from 'fs';

import * as TJS from 'typescript-json-schema';
import { INLINES, BLOCKS } from '../src/index';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  topRef: true,
  noExtraProps: true,
  required: true,
  // @ts-ignore
  useTypeOfKeyword: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
  // composite: true,
  lib: ['es2015', 'es2016', 'es2017', 'dom'],
};

const createJsonSchema = (symbolName: string, nodeType: string): void => {
  const doc = TJS.generateSchema(program, symbolName, settings);

  const schemaString = JSON.stringify(doc, null, 2);

  writeFile(`./src/schemas/generated/${nodeType}.json`, schemaString, (err: Error) => {
    if (err) {
      return console.log(err);
    }
  });
};

const program = TJS.getProgramFromFiles(
  [resolve('./src/types.ts'), resolve('./src/nodeTypes.ts')],
  compilerOptions,
);

const blockSymbolsMap = new Map([
  [BLOCKS.DOCUMENT, 'Document'],
  [BLOCKS.PARAGRAPH, 'Paragraph'],
  [BLOCKS.HEADING_1, 'Heading1'],
  [BLOCKS.HEADING_2, 'Heading2'],
  [BLOCKS.HEADING_3, 'Heading3'],
  [BLOCKS.HEADING_4, 'Heading4'],
  [BLOCKS.HEADING_5, 'Heading5'],
  [BLOCKS.HEADING_6, 'Heading6'],
  [BLOCKS.OL_LIST, 'OrderedList'],
  [BLOCKS.UL_LIST, 'UnorderedList'],
  [BLOCKS.LIST_ITEM, 'ListItem'],
  [BLOCKS.HR, 'Hr'],
  [BLOCKS.QUOTE, 'Quote'],
  [BLOCKS.EMBEDDED_ENTRY, 'EntryLinkBlock'],
  [BLOCKS.EMBEDDED_ASSET, 'AssetLinkBlock'],
]);

const inlineSymbolsMap = new Map([
  [INLINES.HYPERLINK, 'Hyperlink'],
  [INLINES.ENTRY_HYPERLINK, 'EntryHyperlink'],
  [INLINES.ASSET_HYPERLINK, 'AssetHyperlink'],
  [INLINES.EMBEDDED_ENTRY, 'EntryLinkInline'],
]);

Object.values(BLOCKS).forEach(nodeType => {
  const symbolName = blockSymbolsMap.get(nodeType);
  createJsonSchema(symbolName, nodeType);
});

Object.values(INLINES).forEach(nodeType => {
  const symbolName = inlineSymbolsMap.get(nodeType);
  createJsonSchema(symbolName, nodeType);
});

createJsonSchema('Text', 'text');
