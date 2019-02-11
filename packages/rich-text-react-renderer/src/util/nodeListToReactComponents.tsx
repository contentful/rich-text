import React, { ReactNode } from 'react';
import { helpers, Mark } from '@contentful/rich-text-types';
import { CommonNode, Options } from '..';
import { appendKeyToValidElement } from './appendKeyToValidElement';

export function nodeListToReactComponents(nodes: CommonNode[], options: Options): ReactNode {
  return nodes.map(
    (node: CommonNode, index: number): ReactNode => {
      return appendKeyToValidElement(nodeToReactComponent(node, options), index);
    },
  );
}

export function nodeToReactComponent(node: CommonNode, options: Options): ReactNode {
  const { renderNode, renderMark } = options;
  if (helpers.isText(node)) {
    return node.marks.reduce((value: ReactNode, mark: Mark): ReactNode => {
      if (!renderMark[mark.type]) {
        return value;
      }
      return renderMark[mark.type](value);
    }, node.value);
  } else {
    const children: ReactNode = nodeListToReactComponents(node.content, options);
    if (!node.nodeType || !renderNode[node.nodeType]) {
      return <>{children}</>;
    }
    return renderNode[node.nodeType](node, children);
  }
}
