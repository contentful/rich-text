import { Document } from '@contentful/rich-text-types';

export default function(heading: string) {
  return {
    nodeType: 'document',
    nodeClass: 'block',
    data: {},
    content: [
      {
        nodeType: heading,
        nodeClass: 'block',
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
