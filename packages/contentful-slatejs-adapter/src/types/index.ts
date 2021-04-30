import * as Contentful from '@contentful/rich-text-types';
import type { BaseText } from 'slate';

type SlateText = BaseText & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};
type SlateElement = {
  type: string;
  children?: SlateNode[];
  data?: object;
  isVoid?: boolean;
};

export type ContentfulNode = Contentful.Block | Contentful.Inline | Contentful.Text;
export type SlateNode = SlateElement | SlateText;
export type ContentfulNonTextNodes = Contentful.Block | Contentful.Inline;
