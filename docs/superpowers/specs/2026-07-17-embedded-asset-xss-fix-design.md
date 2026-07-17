# Fix stored XSS in default embedded asset renderer

Ticket: TOL-4304

## Problem

`defaultBlockAsset` in `packages/rich-text-html-renderer/src/index.ts` builds an
`<img>` tag by interpolating `imageUrl` and `imgDescription` directly into HTML
attribute values:

```ts
return `<img src="${imageUrl}" alt="${escape(imgDescription)}" loading="lazy" />`;
```

`escape` is not imported in this file, so it resolves to the deprecated global
`escape()` (a URL-style percent-encoder). It does not escape `"`, `&`, `<`, or
`>`, so a malicious asset `description` can break out of the `alt` attribute
and inject markup — a stored XSS vector, since consumers typically render this
HTML string via `dangerouslySetInnerHTML`-style APIs.

`imageUrl` has the same unescaped-interpolation shape on the same line and is
an equally viable injection point (a malicious/crafted asset `file.url`),
even though the ticket's acceptance criteria only names `alt`.

## Fix

Escape both interpolated values with the file's existing `escapeHtml` helper
(`packages/rich-text-html-renderer/src/escapeHtml.ts`), which is already
imported and already used elsewhere in this file for the same purpose
(`defaultInline`, `defaultInlineResource`). It escapes `"`, `&`, `'`, `<`, `>`
via a full entity map — the correct escaper for HTML attribute values, unlike
the local `attributeValue` helper which only escapes `"` (fine for its
current use on a `href` wrapped in its own quotes, but not a general-purpose
attribute escaper).

```ts
const defaultBlockAsset = (node: Block) => {
  const fileUrl = node.data?.target?.fields?.file?.url ?? '';
  const imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  const imgDescription = node.data?.target?.fields?.description ?? '';

  return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imgDescription)}" loading="lazy" />`;
};
```

`&` in a URL's query string (e.g. `?a=1&b=2`) is expected to be escaped to
`&amp;` — HTML parsers entity-decode attribute values before use, so the
literal URL round-trips correctly. Skipping the escape would be the actual
bug: an unescaped `&` followed by characters that happen to match a named
entity (e.g. `&sect=1` looking like `&sect;`) risks silent mis-decoding by
the parser.

No other approach was considered — `escapeHtml` is the established,
already-used pattern in this file for this exact purpose.

## Testing

There is currently no test coverage for `BLOCKS.EMBEDDED_ASSET` rendering.
Add a new test block in `packages/rich-text-html-renderer/src/__test__/index.test.ts`
covering:

1. **Normal case** — a typical description and file URL render into a
   well-formed `<img>` tag (no regression for the common path).
2. **Query-param URL case** — a file URL containing `&`-joined query params
   renders with `&` escaped to `&amp;` in the `src` attribute.
3. **XSS case** — a description and/or URL containing `"`, `<`, `>`, `&`
   is fully entity-escaped in the rendered output, proving the fix.

## Scope

Limited to `defaultBlockAsset` in
`packages/rich-text-html-renderer/src/index.ts`. No changes to other
renderers, types, or packages.
