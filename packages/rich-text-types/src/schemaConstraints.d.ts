/**
 * Array of all top level block types.
 * Only these block types can be the direct children of the document.
 */
export declare const TOP_LEVEL_BLOCKS: string[];
/**
 * Array of all void block types
 */
export declare const VOID_BLOCKS: string[];
/**
 * Dictionary of all container block types, and the set block types they accept as children.
 */
export declare const CONTAINERS: {
  [x: string]: string[];
};
