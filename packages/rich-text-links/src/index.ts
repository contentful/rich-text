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
 *  Extracts entity links from a Rich Text document.
 */
export function getRichTextEntityLinks(
  /**
   *  An instance of a Rich Text Document.
   */
  document: Document,
  /**
   *  Node type. Only the entity links with given node type will be extracted.
   */
  type?: string,
): EntityLinks {
  const entityLinks: EntityLinkMaps = {
    Entry: new Map(),
    Asset: new Map(),
  };

  const content = (document && document.content) || ([] as Node[]);
  for (const node of content) {
    addLinksFromRichTextNode(node, entityLinks, type);
  }

  return {
    Entry: iteratorToArray(entityLinks.Entry.values()),
    Asset: iteratorToArray(entityLinks.Asset.values()),
  };
}

function addLinksFromRichTextNode(node: Node, links: EntityLinkMaps, type?: string): void {
  const toCrawl: Node[] = [node];

  while (toCrawl.length > 0) {
    const { data, content, nodeType } = toCrawl.pop() as Block;
    const hasRequestedNodeType = !type || nodeType === type;

    if (hasRequestedNodeType && isLinkObject(data)) {
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

/**
 * Used to convert the EntityLink iterators stored by the EntityLinkMap values
 * into a client-friendly array form.
 *
 * Alternately we could do:
 * 1) Array.from(EntityLinkMap)
 * 2) [...EntityLinkMap]
 *
 * #1, although idiomatic, is about half as slow as #2.
 *
 * #2, while faster than #1, requires transpilation of the iterator protocol[1],
 * which in turn is still only about half as fast as the approach below.
 *
 * [1] See https://blog.mariusschulz.com/2017/06/30/typescript-2-3-downlevel-iteration-for-es3-es5.
 */
function iteratorToArray<T>(iterator: IterableIterator<T>): T[] {
  const result = [];

  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    result.push(value);
  }

  return result;
}
