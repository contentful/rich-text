import React, { ReactNode } from 'react';

import { helpers, Mark } from '@contentful/rich-text-types';

import { CommonNode, Options } from '..';

import { appendKeyToValidElement } from './appendKeyToValidElement';

export function nodeListToReactComponents(nodes: CommonNode[], options: Options): ReactNode {
  return nodes.map((node: CommonNode, index: number): ReactNode => {
    return appendKeyToValidElement(nodeToReactComponent(node, options), index);
  });
}

export function nodeToReactComponent(node: CommonNode, options: Options): ReactNode {
  const { renderNode, renderMark, renderText, preserveWhitespace } = options;

  if (helpers.isText(node)) {
    let nodeValue: ReactNode = renderText ? renderText(node.value) : node.value;

    // Preserving whitespace is only supported with the default transformations.
    if (preserveWhitespace && !renderText) {
      // Preserve multiple spaces.
      nodeValue = (nodeValue as string).replace(/ {2,}/g, (match) => '\u00A0'.repeat(match.length));

      // Preserve line breaks.
      const lines = (nodeValue as string).split('\n');
      const jsxLines: (string | JSX.Element)[] = [];

      lines.forEach((line, index) => {
        jsxLines.push(line);
        if (index !== lines.length - 1) {
          jsxLines.push(<br />);
        }
      });
      nodeValue = jsxLines;
    }

    return node.marks.reduce((value: ReactNode, mark: Mark): ReactNode => {
      if (!renderMark[mark.type]) {
        return value;
      }
      return renderMark[mark.type](value);
    }, nodeValue);
  } else {
    const children: ReactNode = nodeListToReactComponents(node.content, options);
    if (!node.nodeType || !renderNode[node.nodeType]) {
      return <>{children}</>;
    }
    return renderNode[node.nodeType](node, children);
  }
}
