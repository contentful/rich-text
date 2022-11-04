import get from 'lodash.get';
import { BLOCKS, TEXT_CONTAINERS } from '@contentful/rich-text-types';
import { ContentfulElementNode } from './types';

const defaultSchema: SchemaJSON = {};

// TODO: Get rid of outdated SlateJS schema concept here and instead construct
//  a `Schema` object based on `rich-text-types` constants. The original idea
//  was to decouple code from these constants for future extensibility cases
//  where we had to deal with custom node types that wouldn't be part of these
//  constants while a custom (forked) rich-text editor provided `Schema`
//  instance would be aware of them.
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
// TODO: No need to extend `SchemaJSON` and change `isVoid` to take a `nodeType: string`
export interface Schema extends SchemaJSON {
  isVoid(node: ContentfulElementNode): boolean;
  isTextContainer(nodeType: string): boolean;
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
      const root = Object.values(BLOCKS).includes(node.nodeType as any) ? 'blocks' : 'inlines';
      return get(schema, [root, node.nodeType as string, 'isVoid'], false);
    },
    isTextContainer(nodeType: string) {
      return TEXT_CONTAINERS.includes(nodeType as any);
    },
  };
}
