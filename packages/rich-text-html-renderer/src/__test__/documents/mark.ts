import { Document } from '@contentful/rich-text-types';
export default function(mark: String) {
  return {
    nodeType: 'document',
    content: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: 'hello world',
            marks: [{ type: mark }],
          },
        ],
      },
    ],
  } as Document;
}
