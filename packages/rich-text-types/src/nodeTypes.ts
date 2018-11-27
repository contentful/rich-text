import { Block, Inline, Text, TopLevelBlock } from './types';
import BLOCKS from './blocks';
import INLINES from './inlines';

type EmptyNodeData = {};
// BLOCKS

// Heading
export interface Heading1 extends Block {
  nodeType: BLOCKS.HEADING_1;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading2 extends Block {
  nodeType: BLOCKS.HEADING_2;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading3 extends Block {
  nodeType: BLOCKS.HEADING_3;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading4 extends Block {
  nodeType: BLOCKS.HEADING_4;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading5 extends Block {
  nodeType: BLOCKS.HEADING_5;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading6 extends Block {
  nodeType: BLOCKS.HEADING_6;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Paragraph
export interface Paragraph extends Block {
  nodeType: BLOCKS.PARAGRAPH;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Quote
export interface Quote extends Block {
  nodeType: BLOCKS.QUOTE;
  data: EmptyNodeData;
  content: Paragraph[];
}
// Horizontal rule
export interface Hr extends Block {
  nodeType: BLOCKS.HR;
  /**
   *
   * @maxItems 0
   */
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// OL
export interface OrderedList extends Block {
  nodeType: BLOCKS.OL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}
// UL
export interface UnorderedList extends Block {
  nodeType: BLOCKS.UL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}

export interface ListItem extends Block {
  nodeType: BLOCKS.LIST_ITEM;
  data: EmptyNodeData;
  content: TopLevelBlock[];
}

// taken from graphql schema-generator/contentful-types/link.ts
export interface Link<T extends string = string> {
  sys: {
    type: 'Link';
    linkType: T;
    id: string;
  };
}

export interface EntryLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Array<Inline | Text>;
}

export interface AssetLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ASSET;
  data: {
    target: Link<'Asset'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Array<Inline | Text>;
}

// INLINE

export interface EntryLinkInline extends Inline {
  nodeType: INLINES.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface Hyperlink extends Inline {
  nodeType: INLINES.HYPERLINK;
  data: {
    uri: string;
  };
  content: Text[];
}

export interface AssetHyperlink extends Inline {
  nodeType: INLINES.ASSET_HYPERLINK;
  data: {
    target: Link<'Asset'>;
  };
  content: Text[];
}

export interface EntryHyperlink extends Inline {
  nodeType: INLINES.ENTRY_HYPERLINK;
  data: {
    target: Link<'Entry'>;
  };
  content: Text[];
}
