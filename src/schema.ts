import get from 'lodash.get';
import * as Contentful from '@contentful/structured-text-types';
import { VoidableNode } from './types';

const defaultSchema: SchemaJSON = {};

export interface Schema extends SchemaJSON {
  isVoid(node: VoidableNode): boolean;
}

export interface SchemaJSON {
  blocks?: Record<string, SchemaValue>;
  inlines?: Record<string, SchemaValue>;
}

export interface SchemaValue {
  isVoid?: boolean;
  // tslint:disable-next-line:no-any
  [k: string]: any;
}

/**
 * Creates an instance of Schema from json.
 *
 * @export
 * @param {SchemaJSON} [schema=defaultSchema]
 * @returns {Schema}
 */
export function fromJSON(schema: SchemaJSON = defaultSchema): Schema {
  return {
    /**
     * Check if a `node` is void based on the schema rules.
     *
     * @param {VoidableNode} node
     * @returns
     */
    isVoid(node: VoidableNode) {
      const root = node.nodeClass === 'block' ? 'blocks' : 'inlines';
      return get(schema, [root, node.nodeType as string, 'isVoid'], false);
    },
  };
}
