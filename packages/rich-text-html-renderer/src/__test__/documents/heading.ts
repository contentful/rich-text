import { Document } from '@contentful/rich-text-types';

export default function(heading: string) {
  return {
    nodeType: 'document',
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
