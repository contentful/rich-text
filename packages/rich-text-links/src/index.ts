import { Document, Node, Block, Link, NodeData } from '@contentful/rich-text-types';

export type EntityLinks = { [type in EntityType]: EntityLink[] };
export type EntityLinkMaps = { [type in EntityType]: Map<string, EntityLink> };
export type EntityType = 'Entry' | 'Asset';
export type EntityLink = SysObject['sys'];
export type SysObject = Link<EntityType>;
export type EntityLinkNodeData = {
  target: SysObject;
};

/**
 * Given a rich text document, returns all entity links.
 */
export function getRichTextEntityLinks(document: Document): EntityLinks {
  const entityLinks: EntityLinkMaps = {
    Entry: new Map(),
    Asset: new Map(),
  };

  const content = (document && document.content) || ([] as Node[]);
  for (const node of content) {
    addLinksFromRichTextNode(node, entityLinks);
  }

  return {
    Entry: Array.from(entityLinks.Entry.values()),
    Asset: Array.from(entityLinks.Asset.values()),
  };
}

function addLinksFromRichTextNode(node: Node, links: EntityLinkMaps): void {
  const toCrawl: Node[] = [node];

  while (toCrawl.length > 0) {
    const { data, content } = toCrawl.pop() as Block;

    if (isLinkObject(data)) {
      links[data.target.sys.linkType].set(data.target.sys.id, data.target.sys);
    } else if (Array.isArray(content)) {
      for (const childNode of content) {
        toCrawl.push(childNode);
      }
    }
  }
}

function isLinkObject(data: NodeData): data is EntityLinkNodeData {
  const sys = data && (data.target as SysObject) && (data.target.sys as EntityLink);
  if (!sys) {
    return false;
  }

  const isValidLinkObject = typeof sys.id === 'string' && sys.type === 'Link';
  if (!isValidLinkObject) {
    return false;
  }

  const isEntityLink = sys.linkType === 'Entry' || sys.linkType === 'Asset';

  return isEntityLink;
}
