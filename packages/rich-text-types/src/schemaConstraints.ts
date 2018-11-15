import BLOCKS from './blocks';

export type TopLevelBlockEnum =
  | BLOCKS.PARAGRAPH
  | BLOCKS.HEADING_1
  | BLOCKS.HEADING_2
  | BLOCKS.HEADING_3
  | BLOCKS.HEADING_4
  | BLOCKS.HEADING_5
  | BLOCKS.HEADING_6
  | BLOCKS.OL_LIST
  | BLOCKS.UL_LIST
  | BLOCKS.HR
  | BLOCKS.QUOTE
  | BLOCKS.EMBEDDED_ENTRY
  | BLOCKS.EMBEDDED_ASSET;

/**
 * Array of all top level block types.
 * Only these block types can be the direct children of the document.
 */
export const TOP_LEVEL_BLOCKS: TopLevelBlockEnum[] = [
  BLOCKS.PARAGRAPH,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,

  BLOCKS.OL_LIST,
  BLOCKS.UL_LIST,
  BLOCKS.HR,
  BLOCKS.QUOTE,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.EMBEDDED_ASSET,
];

/**
 * Array of all void block types
 */
export const VOID_BLOCKS = [BLOCKS.HR, BLOCKS.EMBEDDED_ENTRY, BLOCKS.EMBEDDED_ASSET];

/**
 * Dictionary of all container block types, and the set block types they accept as children.
 */
export const CONTAINERS = {
  [BLOCKS.OL_LIST]: [BLOCKS.LIST_ITEM],
  [BLOCKS.UL_LIST]: [BLOCKS.LIST_ITEM],
  [BLOCKS.LIST_ITEM]: [...TOP_LEVEL_BLOCKS],
  [BLOCKS.QUOTE]: [BLOCKS.PARAGRAPH],
};
