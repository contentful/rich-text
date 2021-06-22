import get from 'lodash.get';
import * as Contentful from '@contentful/rich-text-types';
import { ContentfulElementNode } from './types';

const defaultSchema: SchemaJSON = {};

/**
 * SlateJS Schema definition v0.33.x
 *
 * @export
 * @interface SchemaJSON
 */
export interface SchemaJSON {
  blocks?: Record<string, SchemaValue>;
  inlines?: Record<string, SchemaValue>;
}
export interface Schema extends SchemaJSON {
  isVoid(node: ContentfulElementNode): boolean;
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
     * @param {ContentfulElementNode} node
     * @returns
     */
    isVoid(node: ContentfulElementNode) {
      const root = Object.values(Contentful.BLOCKS).includes(node.nodeType) ? 'blocks' : 'inlines';
      return get(schema, [root, node.nodeType as string, 'isVoid'], false);
    },
  };
}
