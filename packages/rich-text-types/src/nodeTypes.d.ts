import { Block, Inline } from './types';
export interface Heading1 extends Block {
  nodeType: 'heading-1';
}
export interface Heading2 extends Block {
  nodeType: 'heading-2';
}
export interface Heading3 extends Block {
  nodeType: 'heading-3';
}
export interface Heading4 extends Block {
  nodeType: 'heading-4';
}
export interface Heading5 extends Block {
  nodeType: 'heading-5';
}
export interface Heading6 extends Block {
  nodeType: 'heading-6';
}
export interface Paragraph extends Block {
  nodeType: 'paragraph';
}
export interface Quote extends Block {
  nodeType: 'quote';
  content: Paragraph[];
}
export interface Hr extends Block {
  nodeType: 'hr';
}
export interface OrderedList extends Block {
  nodeType: 'ordered-list';
  content: ListItem[];
}
export interface UnorderedList extends Block {
  nodeType: 'unordered-list';
  content: ListItem[];
}
export interface ListItem extends Block {
  nodeType: 'list-item';
}
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
}
export interface AssetLinkBlock extends Block {
  nodeType: 'embedded-asset-block';
  data: {
    target: Link<'Asset'>;
  };
}
export interface EntryLinkInline extends Inline {
  nodeType: 'embedded-entry-inline';
  data: {
    target: Link<'Entry'>;
  };
}
export interface Hyperlink extends Inline {
  nodeType: 'hyperlink';
  data: {
    uri: string;
    title: string;
  };
}
export interface AssetHyperlink extends Inline {
  nodeType: 'asset-hyperlink';
  data: {
    target: Link<'Asset'>;
    title: string;
  };
}
export interface EntryHyperlink extends Inline {
  nodeType: 'entry-hyperlink';
  data: {
    target: Link<'Entry'>;
    title: string;
  };
}
