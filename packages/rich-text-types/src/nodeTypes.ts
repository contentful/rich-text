import { Block, Node, Inline, Text } from './types';

// BLOCKS

// Heading
export interface Heading1 extends Block {
  nodeType: 'heading-1';
  content: Array<Inline | Text>;
}

export interface Heading2 extends Block {
  nodeType: 'heading-2';
  content: Array<Inline | Text>;
}

export interface Heading3 extends Block {
  nodeType: 'heading-3';
  content: Array<Inline | Text>;
}

export interface Heading4 extends Block {
  nodeType: 'heading-4';
  content: Array<Inline | Text>;
}

export interface Heading5 extends Block {
  nodeType: 'heading-5';
  content: Array<Inline | Text>;
}

export interface Heading6 extends Block {
  nodeType: 'heading-6';
  content: Array<Inline | Text>;
}

// Paragraph
export interface Paragraph extends Block {
  nodeType: 'paragraph';
  content: Array<Inline | Text>;
}
// Quote
export interface Quote extends Block {
  nodeType: 'quote';
  content: Paragraph[];
}
// Horizontal rule
export interface Hr extends Block {
  nodeType: 'hr';
  /**
   *
   * @maxItems 0
   */
  content: Array<Inline | Text>;
}

// OL
export interface OrderedList extends Block {
  nodeType: 'ordered-list';
  content: ListItem[];
}
// UL
export interface UnorderedList extends Block {
  nodeType: 'unordered-list';
  content: ListItem[];
}

export interface ListItem extends Block {
  nodeType: 'list-item';
  content: Block[];
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
  nodeType: 'embedded-entry-block';
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
  nodeType: 'embedded-asset-block';
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
  nodeType: 'embedded-entry-inline';
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Array<Text>;
}

export interface Hyperlink extends Inline {
  nodeType: 'hyperlink';
  data: {
    uri: string;
    title: string;
  };
  content: Array<Text>;
}

export interface AssetHyperlink extends Inline {
  nodeType: 'asset-hyperlink';
  data: {
    target: Link<'Asset'>;
    title: string;
  };
  content: Array<Text>;
}

export interface EntryHyperlink extends Inline {
  nodeType: 'entry-hyperlink';
  data: {
    target: Link<'Entry'>;
    title: string;
  };
  content: Array<Text>;
}
