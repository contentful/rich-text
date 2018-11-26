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
 * Given a rich text document and an (optional) entity type, returns all unique
 * matching entity links.
 *
 * If there is no linkType provided, returns all unique entity links.
 */
export function getRichTextEntityLinks(document: Document, linkType?: EntityType): EntityLink[] {
  const links: EntityLink[] = [];
  const linkCache: LinkCache = new Cache();

  for (const node of document.content) {
    addLinksFromRichTextNode(links, node, linkCache, linkType);
  }

  return links;
}

function addLinksFromRichTextNode(
  links: EntityLink[],
  node: Node,
  linkCache: LinkCache,
  linkType?: EntityType,
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

function isMatchingLinkObject(data: NodeData, linkType?: EntityType): Boolean {
  const sys = data && (data.target as SysObject) && (data.target.sys as EntityLink);
  const isLinkObject = sys && typeof sys.id === 'string' && sys.type === 'Link';
  if (!isLinkObject) {
    return false;
  }
  if (linkType) {
    return sys.linkType === linkType;
  }
  return sys.linkType === 'Entry' || sys.linkType === 'Asset';
}
