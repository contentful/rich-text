import { BLOCKS } from '../blocks';
import { INLINES } from '../inlines';
import { CONTAINERS, LIST_ITEM_BLOCKS, TOP_LEVEL_BLOCKS } from '../schemaConstraints';
import { Document, Text } from '../types';
import { ObjectAssertion } from './assert';
import { NodeAssertion, Node, HyperLinkAssertion, assert, assertLink, VOID_CONTENT } from './node';
import { Path } from './path';
import { assertText } from './text';

export type ValidationError = {
  name: string;
  type?: string;
  value?: Record<string, any> | string | number | boolean | null;
  min?: number | string;
  max?: number | string;
  details?: string | null;
  path?: (string | number)[];
  contentTypeId?: string | string[];
  nodeType?: string;
  customMessage?: string;
  expected?: string[];
};

const assertInlineOrText = assert([...Object.values(INLINES), 'text'].sort());

const assertList = assert([BLOCKS.LIST_ITEM]);
const assertVoidEntryLink = assertLink('Entry', VOID_CONTENT);
const assertTableCell = assert(
  () => ({
    nodeTypes: [BLOCKS.PARAGRAPH],
    min: 1,
  }),
  (data, path) => {
    const $ = new ObjectAssertion(data, path);

    $.noAdditionalProperties(['colspan', 'rowspan']);
    $.number('colspan', true);
    $.number('rowspan', true);

    return $.errors;
  },
);

const nodeValidator: Record<Node['nodeType'], NodeAssertion<any>> = {
  [BLOCKS.DOCUMENT]: assert(TOP_LEVEL_BLOCKS),
  [BLOCKS.PARAGRAPH]: assertInlineOrText,
  [BLOCKS.HEADING_1]: assertInlineOrText,
  [BLOCKS.HEADING_2]: assertInlineOrText,
  [BLOCKS.HEADING_3]: assertInlineOrText,
  [BLOCKS.HEADING_4]: assertInlineOrText,
  [BLOCKS.HEADING_5]: assertInlineOrText,
  [BLOCKS.HEADING_6]: assertInlineOrText,
  [BLOCKS.QUOTE]: assert(CONTAINERS[BLOCKS.QUOTE]),
  [BLOCKS.EMBEDDED_ENTRY]: assertVoidEntryLink,
  [BLOCKS.EMBEDDED_ASSET]: assertLink('Asset', VOID_CONTENT),
  [BLOCKS.EMBEDDED_RESOURCE]: assertLink('Contentful:Entry', VOID_CONTENT),
  [BLOCKS.HR]: assert(VOID_CONTENT),
  [BLOCKS.OL_LIST]: assertList,
  [BLOCKS.UL_LIST]: assertList,
  [BLOCKS.LIST_ITEM]: assert([...LIST_ITEM_BLOCKS].sort()),
  [BLOCKS.TABLE]: assert(() => ({
    nodeTypes: [BLOCKS.TABLE_ROW],
    min: 1,
  })),
  [BLOCKS.TABLE_ROW]: assert(() => ({
    nodeTypes: [BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL],
    min: 1,
  })),
  [BLOCKS.TABLE_CELL]: assertTableCell,
  [BLOCKS.TABLE_HEADER_CELL]: assertTableCell,
  [INLINES.HYPERLINK]: new HyperLinkAssertion(),
  [INLINES.EMBEDDED_ENTRY]: assertVoidEntryLink,
  [INLINES.EMBEDDED_RESOURCE]: assertLink('Contentful:Entry', VOID_CONTENT),
  [INLINES.ENTRY_HYPERLINK]: assertLink('Entry', ['text']),
  [INLINES.ASSET_HYPERLINK]: assertLink('Asset', ['text']),
  [INLINES.RESOURCE_HYPERLINK]: assertLink('Contentful:Entry', ['text']),
};

function validateNode(node: Node | Text, path: Path): ValidationError[] {
  if (node.nodeType === 'text') {
    return assertText(node, path);
  }

  const errors = nodeValidator[node.nodeType].assert(node, path);

  if (errors.length > 0) {
    return errors;
  }

  const $ = new ObjectAssertion(node, path);

  $.each('content', (item, path) => {
    // We already know those are valid nodes thanks to the assertion done in
    // the NodeAssertion class
    return validateNode(item, path);
  });

  return $.errors;
}

export const validateRichTextDocument = (document: Document): ValidationError[] => {
  const path = new Path();
  const $ = new ObjectAssertion(document, path);

  if ($.object()) {
    $.enum('nodeType', [BLOCKS.DOCUMENT]);
  }

  if ($.errors.length > 0) {
    return $.errors;
  }

  return validateNode(document, path);
};
