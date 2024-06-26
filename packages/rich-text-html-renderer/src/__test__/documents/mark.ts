import { Document } from '@contentful/rich-text-types';

export default function (mark: string) {
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
            marks: [{ type: mark }],
            data: {},
          },
        ],
      },
    ],
  } as Document;
}
