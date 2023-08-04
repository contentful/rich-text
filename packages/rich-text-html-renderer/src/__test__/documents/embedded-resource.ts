import { Document, BLOCKS, ResourceLink } from '@contentful/rich-text-types';

export default function (resourceLink: ResourceLink) {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_RESOURCE,
        content: [],
        data: {
          target: resourceLink,
        },
      },
    ],
  } as Document;
}
