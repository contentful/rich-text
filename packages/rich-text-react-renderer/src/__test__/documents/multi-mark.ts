import { Document } from '@contentful/rich-text-types';
export default function() {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'hello world',
            marks: [{ type: 'bold' }, { type: 'italic' }],
            data: {},
          },
        ],
      },
    ],
  } as Document;
}
