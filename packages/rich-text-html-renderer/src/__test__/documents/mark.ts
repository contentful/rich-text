import { Document } from '@contentful/rich-text-types';
export default function(mark: String) {
  return {
    nodeType: 'document',
    nodeClass: 'block',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        nodeClass: 'block',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'hello world',
            marks: [{ type: mark }],
            data: {},
          },
        ],
      },
    ],
  } as Document;
}
