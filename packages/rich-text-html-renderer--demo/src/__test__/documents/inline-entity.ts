import { Document } from '@contentful/rich-text-types--demo';

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
          },
          {
            data: entry,
            content: [
              {
                marks: [],
                value: '',
                nodeType: 'text',
              },
            ],
            nodeType: inlineType,
          },
          {
            marks: [],
            value: '',
            nodeType: 'text',
          },
        ],
        nodeType: 'paragraph',
      },
    ],
    nodeType: 'document',
  } as Document;
}
