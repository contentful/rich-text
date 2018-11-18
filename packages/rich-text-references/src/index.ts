import { Document, Node, Block, Link, NodeData } from '@contentful/rich-text-types';

export type EntityType = 'Entry' | 'Asset';
export type EntityReference = SysObject['sys'];
export type SysObject = Link<EntityType>;

export function getRichTextReferences(
  document: Document,
  entityType: EntityType,
): EntityReference[] {
  const references: EntityReference[] = [];

  for (const node of document.content) {
    addReferencesFromRichTextNode(references, node, entityType);
  }

  return references;
}

function addReferencesFromRichTextNode(
  references: EntityReference[],
  node: Node,
  entityType: EntityType,
): EntityReference[] {
  const toCrawl: Node[] = [node];

  while (toCrawl.length > 0) {
    const { data, content } = toCrawl.pop() as Block;

    if (isLinkObject(data)) {
      const ref = data.target;
      const isMatchingEntityType = ref.sys.linkType === entityType;

      if (isMatchingEntityType) {
        references.push(ref.sys);
      }
    } else if (Array.isArray(content)) {
      for (const childNode of content) {
        toCrawl.push(childNode);
      }
    }
  }

  return references;
}

function isLinkObject(data: NodeData): Boolean {
  const sys = data && (data.target as SysObject) && (data.target.sys as EntityReference);

  return (
    sys &&
    typeof sys.id === 'string' &&
    sys.type === 'Link' &&
    (sys.linkType === 'Entry' || sys.linkType === 'Asset')
  );
}
