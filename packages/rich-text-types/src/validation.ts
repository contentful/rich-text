import Ajv, { ErrorObject, ValidateFunction } from 'ajv';

import { Node } from './types';
import { BLOCKS } from './blocks';
import { isText } from './helpers';
import { getSchemaWithNodeType } from './schemas';

const ajv = new Ajv({ allErrors: true, verbose: true });

type AnyNode = Node & {
  content?: AnyNode[];
  value?: string;
  marks?: string[];
};

type Path = (string | number)[];

type ErrorTransformer<T = unknown> = (error: ErrorObject, path: Path) => T;

export type ValidationOptions<T> = {
  transformError?: ErrorTransformer<T>;
};

/**
 * Validates a rich text document against our JSON schemas using AJV.
 *
 * We need to reduce the validation scope to keep AJV from returning error
 * messages with obscure code paths.
 *
 * Example:
 *
 * Given a node that accepts children which should match one of multiple
 * schemas, having an invalid child node (e.g., with a missing property), AJV
 * tries to validate the child node against one of the other schemas. This
 * results in misleading / cryptic error messages.
 *
 * This function runs AJV validations against nodes whose children have had
 * their properties reset, so that AJV validates only against properties of the
 * parent node's nodeType. This is the reasoning behind the `removeChildNodes`
 * and `removeGrandChildNodes` helpers.
 */
export function validateRichTextDocument<T>(
  document: AnyNode,
  options?: ValidationOptions<T>,
): T[] {
  const validateRootNode = getValidator(BLOCKS.DOCUMENT);
  const rootNodeIsValid = validateRootNode(removeGrandChildNodes(document));

  const transformError: ErrorTransformer = options?.transformError ?? (error => error);

  /**
   * Note that this is not the most beautiful / functional implementation
   * possible, but since we are validating what could potentially be a
   * substantially lengthy (hence: computationally complex) tree, we need to
   * constrain both space _and_ memory usage. This is the reasoning behind using
   * imperative logic with passed references and in-line mutation.
   */
  const errors: T[] = [];

  if (rootNodeIsValid) {
    validateChildNodes(document, ['content'], errors, transformError);
  } else {
    buildSchemaErrors(validateRootNode, [], errors, transformError);
  }

  return errors;
}

/**
 * Validates each child of a root node, continually (recursively) passing down
 * the path from the originating root node.
 */
function validateChildNodes(
  node: AnyNode,
  path: Path,
  errors: unknown[],
  transform: ErrorTransformer,
) {
  for (let i = 0; i < node.content.length; i++) {
    validateNode(node.content[i], [...path, i], errors, transform);
  }
}

function validateNode(node: AnyNode, path: Path, errors: unknown[], transform: ErrorTransformer) {
  const validateSchema = getValidator(node.nodeType);
  const isValid = validateSchema(removeGrandChildNodes(resetChildNodes(node)));
  if (!isValid) {
    buildSchemaErrors(validateSchema, path, errors, transform);
    return;
  }

  if (!isLeafNode(node)) {
    validateChildNodes(node, [...path, 'content'], errors, transform);
  }
}

/**
 * Gets the validating function for the schema from the AJV instance. Note that
 * AJV caches the schema under the hood, while `getSchemaWithNodeType` is
 * returning JSON objects from a Webpack-ified dictionary object, so there is no
 * way to further optimize here (even though it may look otherwise).
 */
function getValidator(nodeType: string): ValidateFunction {
  const schema = getSchemaWithNodeType(nodeType);

  return ajv.compile(schema);
}

function buildSchemaErrors(
  validateSchema: ValidateFunction,
  path: Path,
  errors: unknown[],
  transform: ErrorTransformer,
) {
  const schemaErrors: any[] = (validateSchema.errors || []).map(error => transform(error, path));

  errors.push(...schemaErrors);
}

function resetChildNodes(node: AnyNode) {
  const { content } = node;
  if (isLeafNode(node)) {
    return node;
  }

  return Object.assign({}, node, { content: content.map(resetNode) });
}

function resetNode(node: AnyNode): AnyNode {
  const { nodeType } = node;
  if (isText(node)) {
    return { nodeType, data: {}, value: '', marks: [] };
  }

  return { nodeType, data: {}, content: [] };
}

function removeGrandChildNodes(node: AnyNode) {
  const { content } = node;
  if (isLeafNode(node)) {
    return node;
  }

  return Object.assign({}, node, { content: content.map(removeChildNodes) });
}

function removeChildNodes(node: AnyNode) {
  if (isText(node)) {
    return node;
  }

  return Object.assign({}, node, { content: [] });
}

function isLeafNode(node: AnyNode) {
  return isText(node) || !Array.isArray(node.content);
}
