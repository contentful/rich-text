import { BLOCKS } from './blocks.js';
import { INLINES } from './inlines.js';
import { Block, Inline, Node, Text, Document as CDocument } from './types.js';

/**
 * Tiny replacement for Object.values(object).includes(key) to
 * avoid including CoreJS polyfills
 */
function hasValue(obj: Record<string, unknown>, value: unknown) {
  for (const key of Object.keys(obj)) {
    if (value === obj[key]) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the node is an instance of Inline.
 */
export function isInline(node: Node): node is Inline {
  return hasValue(INLINES, node.nodeType);
}

/**
 * Checks if the node is an instance of Block.
 */
export function isBlock(node: Node): node is Block {
  return hasValue(BLOCKS, node.nodeType);
}

/**
 * Checks if the node is an instance of Text.
 */
export function isText(node: Node): node is Text {
  return node.nodeType === 'text';
}

/**
 * Checks if a paragraph is empty (has only one child and that child is an empty string text node)
 */
export function isEmptyParagraph(node: Block): boolean {
  if (node.nodeType !== BLOCKS.PARAGRAPH) {
    return false;
  }

  if (node.content.length !== 1) {
    return false;
  }

  const textNode = node.content[0];
  return textNode.nodeType === 'text' && (textNode as Text).value === '';
}

function isValidDocument(document: unknown): document is CDocument {
  return (
    document != null &&
    typeof document === 'object' &&
    'content' in document &&
    Array.isArray((document as CDocument).content)
  );
}

const MIN_NODES_FOR_STRIPPING = 2;

/**
 * Strips empty trailing paragraph from a document if enabled
 * @param document - The rich text document to process
 * @returns A new document with the empty trailing paragraph removed (if conditions are met)
 * @example
 * const processedDoc = stripEmptyTrailingParagraphFromDocument(document);
 */
export function stripEmptyTrailingParagraphFromDocument(document: CDocument): CDocument {
  if (!isValidDocument(document) || document.content.length < MIN_NODES_FOR_STRIPPING) {
    return document;
  }

  const lastNode = document.content[document.content.length - 1];

  // Check if the last node is an empty paragraph
  if (isEmptyParagraph(lastNode)) {
    return {
      ...document,
      content: document.content.slice(0, -1),
    };
  }

  return document;
}
