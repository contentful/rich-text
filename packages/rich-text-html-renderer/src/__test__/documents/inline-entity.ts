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
            nodeClass: 'inline',
          },
          {
            marks: [],
            value: '',
            nodeType: 'text',
            data: {},
          },
        ],
        nodeType: 'paragraph',
        nodeClass: 'block',
      },
    ],
    data: {},
    nodeType: 'document',
    nodeClass: 'block',
  } as Document;
}
