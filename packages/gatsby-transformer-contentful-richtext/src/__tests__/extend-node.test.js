const { graphql, GraphQLObjectType, GraphQLList, GraphQLSchema } = require(`gatsby/graphql`);
const { inferObjectStructureFromNodes } = require(`gatsby/dist/schema/infer-graphql-type`);
const { onCreateNode } = require(`../gatsby-node`);
const extendNodeType = require(`../extend-node-type`);

async function queryResult(nodes, fragment, { types = [] } = {}, additionalParameters) {
  const inferredFields = inferObjectStructureFromNodes({
    nodes,
    types: [...types],
  });

  const extendNodeTypeFields = await extendNodeType(
    {
      type: { name: `ContentfulRichText` },
      cache: {
        get: () => null,
        set: () => null,
      },
      getNodes: () => [],
      ...additionalParameters,
    },
    {
      renderOptions: null,
    },
  );

  const richTextFields = {
    ...inferredFields,
    ...extendNodeTypeFields,
  };
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: `RootQueryType`,
      fields: () => {
        return {
          listNode: {
            name: `LISTNODE`,
            type: new GraphQLList(
              new GraphQLObjectType({
                name: `ContentfulRichText`,
                fields: richTextFields,
              }),
            ),
            resolve() {
              return nodes;
            },
          },
        };
      },
    }),
  });

  const result = await graphql(
    schema,
    `query {
      listNode {
        ${fragment}
      }
    }`,
  );
  return result;
}

const bootstrapTest = (label, content, query, test, additionalParameters = {}) => {
  const node = {
    id: `whatever`,
    children: [],
    internal: {
      contentDigest: `whatever`,
      mediaType: `text/richtext`,
    },
  };
  // Make some fake functions its expecting.
  const loadNodeContent = node => Promise.resolve(node.content);

  it(label, async done => {
    node.content = content;
    const createNode = richTextNode => {
      queryResult(
        [richTextNode],
        query,
        {
          types: [{ name: `LISTNODE` }],
        },
        additionalParameters,
      ).then(result => {
        try {
          test(result.data.listNode[0]);
          done();
        } catch (err) {
          done.fail(err);
        }
      });
    };
    const createParentChildLink = jest.fn();
    const actions = { createNode, createParentChildLink };
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`uuid-from-gatsby`);
    await onCreateNode(
      {
        node,
        loadNodeContent,
        actions,
        createNodeId,
      },
      { ...additionalParameters },
    );
  });
};
describe(`extend-node-type`, () => {
  const createContent = (text = 'Hello world!') => ({
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  });

  describe(`HTML is generated correctly`, () => {
    bootstrapTest(`correctly loads html`, JSON.stringify(createContent()), `html`, node => {
      expect(node.html).toEqual('<p>Hello world!</p>');
    });
  });

  describe(`timeToRead`, () => {
    bootstrapTest(
      `correctly calculate timeToRead for short text`,
      JSON.stringify(createContent()),
      `timeToRead`,
      node => {
        expect(node.timeToRead).toEqual(1);
      },
    );

    bootstrapTest(
      `correctly calculate timeToRead for long text`,
      JSON.stringify(createContent('one thousand words text '.repeat(250))),
      `timeToRead`,
      node => {
        expect(node.timeToRead).toEqual(5);
      },
    );
  });
});
