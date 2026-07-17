# Embedded Asset XSS Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix stored XSS in the default `BLOCKS.EMBEDDED_ASSET` HTML renderer by replacing the unescaped `escape()`/raw interpolation in `defaultBlockAsset` with the file's existing `escapeHtml()` helper for both the `alt` and `src` attributes.

**Architecture:** Single-file, one-line fix in `packages/rich-text-html-renderer/src/index.ts`, following TDD: add failing tests that capture current buggy behavior against the desired escaped output, then apply the fix, then verify green.

**Tech Stack:** TypeScript, Jest (`@swc/jest` transform), existing `escapeHtml` helper (`packages/rich-text-html-renderer/src/escapeHtml.ts`).

## Global Constraints

- Ticket: TOL-4304. Branch: `fix/TOL-4304` (already checked out).
- Scope strictly limited to `defaultBlockAsset` in `packages/rich-text-html-renderer/src/index.ts`. No other files/packages touched except the test file.
- No new imports needed — `escapeHtml` is already imported at the top of `index.ts` (line 13).
- Follow existing test patterns in `packages/rich-text-html-renderer/src/__test__/index.test.ts` (inline `Document` literals, `cloneDeep` not needed here since we're constructing fresh documents per test).

---

### Task 1: Add failing tests for embedded asset rendering (normal, query-param URL, and XSS cases)

**Files:**

- Modify: `packages/rich-text-html-renderer/src/__test__/index.test.ts`

**Interfaces:**

- Consumes: `documentToHtmlString` from `../index` (already imported at top of test file, line 4), `BLOCKS` from `@contentful/rich-text-types` (already imported, line 1), `Document` type (already imported, line 1).
- Produces: three new test cases under `describe('documentToHtmlString', ...)`, no new exports.

- [ ] **Step 1: Write the three failing tests**

Insert the following new `it(...)` blocks immediately after the existing `renders asset hyperlink` test (after line 315, i.e. right after its closing `});`) in `packages/rich-text-html-renderer/src/__test__/index.test.ts`:

```ts
it('renders embedded asset image with escaped url and description', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        content: [],
        data: {
          target: {
            fields: {
              file: { url: '//images.ctfassets.net/space/asset.jpg' },
              description: 'A mountain at sunset',
            },
          },
        },
      } as unknown as Block,
    ],
  };
  const expected =
    '<img src="https://images.ctfassets.net/space/asset.jpg" alt="A mountain at sunset" loading="lazy" />';

  expect(documentToHtmlString(document)).toEqual(expected);
});

it('renders embedded asset image url with escaped query param ampersands', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        content: [],
        data: {
          target: {
            fields: {
              file: { url: '//images.ctfassets.net/space/asset.jpg?a=1&b=2' },
              description: 'A mountain at sunset',
            },
          },
        },
      } as unknown as Block,
    ],
  };
  const expected =
    '<img src="https://images.ctfassets.net/space/asset.jpg?a=1&amp;b=2" alt="A mountain at sunset" loading="lazy" />';

  expect(documentToHtmlString(document)).toEqual(expected);
});

it('renders embedded asset image without allowing html injection via url or description', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        content: [],
        data: {
          target: {
            fields: {
              file: { url: '"><script>alert(1)</script>' },
              description: '"><script>alert(2)</script>',
            },
          },
        },
      } as unknown as Block,
    ],
  };
  const expected =
    '<img src="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;" alt="&quot;&gt;&lt;script&gt;alert(2)&lt;/script&gt;" loading="lazy" />';

  expect(documentToHtmlString(document)).toEqual(expected);
});
```

Note: `Block` must be available — it already is, imported at the top of the file (`import { Block, BLOCKS, Document, INLINES, MARKS, ResourceLink } from '@contentful/rich-text-types';`, line 1).

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
cd packages/rich-text-html-renderer && npx jest index.test.ts -t "embedded asset"
```

Expected: all three new tests FAIL. The first two fail because current code calls `escape(imgDescription)` where `escape` is undefined in this module scope (`ReferenceError: escape is not defined`) — wait, actually `escape` resolves to the global `globalThis.escape`, so it will NOT throw; instead the output `alt` will differ from expected because `escape()` percent-encodes rather than HTML-entity-encodes, and `src` is not escaped at all (so query-param test fails on `&` not being escaped, and XSS test fails because raw `<script>` tags appear unescaped in output). Confirm failures show a value mismatch (`toEqual` diff), not a thrown error.

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/rich-text-html-renderer/src/__test__/index.test.ts
git commit -m "test: add failing tests for embedded asset XSS in html renderer"
```

---

### Task 2: Fix `defaultBlockAsset` to escape both `alt` and `src` attribute values

**Files:**

- Modify: `packages/rich-text-html-renderer/src/index.ts:60-66`

**Interfaces:**

- Consumes: `escapeHtml` from `./escapeHtml` (already imported at line 13, no change needed).
- Produces: no interface change — `defaultBlockAsset` keeps its existing signature `(node: Block) => string`.

- [ ] **Step 1: Apply the fix**

In `packages/rich-text-html-renderer/src/index.ts`, the current `defaultBlockAsset` function (lines 60-66) is:

```ts
const defaultBlockAsset = (node: Block) => {
  const fileUrl = node.data?.target?.fields?.file?.url ?? '';
  const imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  const imgDescription = node.data?.target?.fields?.description ?? '';

  return `<img src="${imageUrl}" alt="${escape(imgDescription)}" loading="lazy" />`;
};
```

Replace only the `return` line so the function becomes:

```ts
const defaultBlockAsset = (node: Block) => {
  const fileUrl = node.data?.target?.fields?.file?.url ?? '';
  const imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  const imgDescription = node.data?.target?.fields?.description ?? '';

  return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imgDescription)}" loading="lazy" />`;
};
```

- [ ] **Step 2: Run the tests to verify they pass**

Run:

```bash
cd packages/rich-text-html-renderer && npx jest index.test.ts -t "embedded asset"
```

Expected: all three tests PASS, plus the pre-existing `renders asset hyperlink` test still PASSES (unaffected — different code path).

- [ ] **Step 3: Run the full package test suite**

Run:

```bash
cd packages/rich-text-html-renderer && npm test
```

Expected: all tests in the package PASS (no regressions).

- [ ] **Step 4: Commit the fix**

```bash
git add packages/rich-text-html-renderer/src/index.ts
git commit -m "fix(rich-text-html-renderer): escape embedded asset alt and src attributes [TOL-4304]"
```

---

### Task 3: Full verification pass

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no new lint errors in `packages/rich-text-html-renderer`.

- [ ] **Step 2: Run the full monorepo test suite**

```bash
npm run test
```

Expected: all packages PASS (confirms no downstream package depends on the old `defaultBlockAsset` output shape in a way that breaks).

- [ ] **Step 3: Build the package**

```bash
cd packages/rich-text-html-renderer && npm run build
```

Expected: build succeeds with no TypeScript errors.
