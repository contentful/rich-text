import * as Contentful from '@contentful/structured-text-types';

export type ContentfulNode = Contentful.Block | Contentful.Inline | Contentful.Text;
export type SlateNode = Slate.Block | Slate.Inline | Slate.Text;
export type VoidableNode = Contentful.Block | Contentful.Inline;
