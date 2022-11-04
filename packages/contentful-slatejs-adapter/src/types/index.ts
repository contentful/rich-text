import * as Contentful from '@contentful/rich-text-types';

export type SlateMarks = {
  // This is a workaround for TypeScript's limitations around
  // index property exclusion. Ideally we'd join the above properties
  // with something like
  //
  // & { [mark: string]: string }
  //
  // but TypeScript doesn't allow us to create such objects, only
  // work around inconsistencies in existing JavaScript.
  //
  // In reality Slate's node marks are arbitrary, but for this library
  // denoting marks used by the tests as optional should be okay.
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type SlateText = SlateMarks & {
  text: string;
  data: object;
};

export type SlateElement = {
  type: string;
  data: object;
  isVoid: boolean;
  children: SlateNode[];
};

export type ContentfulElementNode = Contentful.Block | Contentful.Inline;
export type ContentfulNode = ContentfulElementNode | Contentful.Text;
export type SlateNode = SlateElement | SlateText;
