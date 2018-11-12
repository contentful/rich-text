import { Document, BLOCKS } from '@contentful/rich-text-types';

export default function(heading: string) {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: heading,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'hello world',
            marks: [],
            data: {},
          },
        ],
      },
    ],
  } as Document;
}
