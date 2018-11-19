import { Document, Node, Block, Link, NodeData } from '@contentful/rich-text-types';

export type EntityType = 'Entry' | 'Asset';
export type EntityLink = SysObject['sys'];
export type SysObject = Link<EntityType>;

type LinkCache = Cache;

/**
 * Implements a subset of the Set API:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
class Cache {
  cache: Record<string, true>;

  constructor() {
    this.cache = {};
  }

  add(id: string): void {
    this.cache[id] = true;
  }

  has(id: string): Boolean {
    return this.cache[id] || false;
  }
}

/**
 * Given a rich text document and an entity type, returns all unique matching
 * entity links.
 */
export function getRichTextEntityLinks(document: Document, linkType: EntityType): EntityLink[] {
  const links: EntityLink[] = [];
  const linkCache: LinkCache = new Cache();

  for (const node of document.content) {
    addLinksFromRichTextNode(links, node, linkType, linkCache);
  }

  return links;
}

function addLinksFromRichTextNode(
  links: EntityLink[],
  node: Node,
  linkType: EntityType,
  linkCache: LinkCache,
): EntityLink[] {
  const toCrawl: Node[] = [node];

  while (toCrawl.length > 0) {
    const { data, content } = toCrawl.pop() as Block;

    if (isMatchingLinkObject(data, linkType) && !linkCache.has(data.target.sys.id)) {
      links.push(data.target.sys);
      linkCache.add(data.target.sys.id);
    } else if (Array.isArray(content)) {
      for (const childNode of content) {
        toCrawl.push(childNode);
      }
    }
  }

  return links;
}

function isMatchingLinkObject(data: NodeData, linkType: EntityType): Boolean {
  const sys = data && (data.target as SysObject) && (data.target.sys as EntityLink);

  return sys && typeof sys.id === 'string' && sys.type === 'Link' && sys.linkType === linkType;
}
