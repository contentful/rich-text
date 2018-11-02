import { Document } from '@contentful/rich-text-types';

export default function inlineEntity(entry: Object, inlineType: string) {
  return {
    content: [
      {
        data: {},
        content: [
          {
            marks: [],
            value: '',
            nodeType: 'text',
            data: {},
          },
          {
            data: entry,
            content: [
              {
                marks: [],
                value: '',
                nodeType: 'text',
                data: {},
              },
            ],
            nodeType: inlineType,
          },
          {
            marks: [],
            value: '',
            nodeType: 'text',
            data: {},
          },
        ],
        nodeType: 'paragraph',
      },
    ],
    data: {},
    nodeType: 'document',
  } as Document;
}
