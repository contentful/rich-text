import { Document } from '@contentful/rich-text-types';
export default function(heading: string) {
  return {
    nodeType: 'document',
    content: [
      {
        nodeType: heading,
        content: [
          {
            nodeType: 'text',
            value: 'hello world',
            marks: [],
          },
        ],
      },
    ],
  } as Document;
}
