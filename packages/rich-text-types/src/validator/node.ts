import type { Path } from './path';
import { ObjectAssertion } from './assert';
import { ValidationError } from '.';
import {
  AssetHyperlink,
  AssetLinkBlock,
  EntryHyperlink,
  EntryLinkBlock,
  Hyperlink,
  ResourceLinkBlock,
  ResourceLinkInline,
} from '../nodeTypes';
import { Block, Document, Inline } from '../types';

export type Node = Document | Block | Inline;

export type GetContentRule<T extends Node> =
  | string[]
  | ((
      node: T,
      path: Path,
    ) => {
      nodeTypes: string[];
      min?: number;
    });

export type ValidateData<T extends Node> = (data: T['data'], path: Path) => ValidationError[];

export const VOID_CONTENT: GetContentRule<Node> = [];

export class NodeAssertion<T extends Node = Node> {
  constructor(
    private contentRule: GetContentRule<T>,
    private validateData?: ValidateData<T>,
  ) {}

  assert(node: T, path: Path): ValidationError[] {
    const $ = new ObjectAssertion(node, path);

    if (!$.object()) {
      return $.errors;
    }

    $.noAdditionalProperties(['nodeType', 'data', 'content']);

    const { nodeTypes, min = 0 } = Array.isArray(this.contentRule)
      ? {
          nodeTypes: this.contentRule,
        }
      : this.contentRule(node, path);

    if (nodeTypes.length === 0 && min > 0) {
      throw new Error(
        `Invalid content rule. Cannot have enforce a 'min' of ${min} with no nodeTypes`,
      );
    }

    $.minLength('content', min);

    // Is void
    if (nodeTypes.length === 0) {
      $.empty('content');
    }

    // Ensure content nodes have valid nodeTypes without validating the full
    // shape which is something that's only done later if the current node is
    // valid.
    else {
      $.each('content', (item, path) => {
        const item$ = new ObjectAssertion(item, path);

        if (!item$.object()) {
          return item$.errors;
        }

        item$.enum('nodeType', nodeTypes);

        return item$.errors;
      });
    }

    if ($.object('data')) {
      const dataErrors = this.validateData?.(node.data, path.of('data')) ?? [];
      $.catch(...dataErrors);
    }

    return $.errors;
  }
}

export class EntityLinkAssertion<
  T extends
    | EntryLinkBlock
    | EntryHyperlink
    | AssetLinkBlock
    | AssetHyperlink
    | ResourceLinkBlock
    | ResourceLinkInline,
> extends NodeAssertion<T> {
  private type: 'ResourceLink' | 'Link';

  constructor(
    private linkType: 'Entry' | 'Asset' | 'Contentful:Entry',
    contentNodeTypes: GetContentRule<T>,
  ) {
    super(contentNodeTypes, (data, path) => this.assertLink(data, path));
    this.type = this.linkType.startsWith('Contentful:') ? 'ResourceLink' : 'Link';
  }

  private assertLink = (data: T['data'], path: Path): ValidationError[] => {
    const $ = new ObjectAssertion(data, path);

    if ($.object('target')) {
      const sys$ = new ObjectAssertion(data.target.sys, path.of('target').of('sys'));

      if (sys$.object()) {
        sys$.enum('type', [this.type]);
        sys$.enum('linkType', [this.linkType]);

        if (this.type === 'Link') {
          sys$.string('id');
          sys$.noAdditionalProperties(['type', 'linkType', 'id']);
        } else if (this.type === 'ResourceLink') {
          sys$.string('urn');
          sys$.noAdditionalProperties(['type', 'linkType', 'urn']);
        }
      }

      $.catch(...sys$.errors);
    }

    $.noAdditionalProperties(['target']);

    return $.errors;
  };
}

export class HyperLinkAssertion<T extends Hyperlink> extends NodeAssertion<T> {
  constructor() {
    super(['text'], (data, path) => this.assertLink(data, path));
  }

  private assertLink = (data: T['data'], path: Path): ValidationError[] => {
    const $ = new ObjectAssertion(data, path);

    $.string('uri');
    $.noAdditionalProperties(['uri']);

    return $.errors;
  };
}

export const assert = <T extends Node>(
  contentRule: GetContentRule<T>,
  validateData?: ValidateData<T>,
): NodeAssertion<T> => {
  return new NodeAssertion(contentRule, validateData);
};

export const assertLink = <
  T extends
    | EntryLinkBlock
    | EntryHyperlink
    | AssetLinkBlock
    | AssetHyperlink
    | ResourceLinkBlock
    | ResourceLinkInline,
>(
  linkType: 'Entry' | 'Asset' | 'Contentful:Entry',
  contentRule: GetContentRule<T>,
): EntityLinkAssertion<T> => {
  return new EntityLinkAssertion(linkType, contentRule);
};
