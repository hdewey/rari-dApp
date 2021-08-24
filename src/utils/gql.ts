// GQL-request
import { GraphQLClient } from "graphql-request";

const FUSE_SUBGRAPH_GQL_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/zacel/fusedemo";

// const FUSE_SUBGRAPH_GQL_ENDPOINT =
//   "https://api.thegraph.com/subgraphs/id/QmZUk988UJSQQtYwTmZobV26FqHZQJscGZMjRR35RnNzMw";
  

export const makeGqlRequest = async (query: any, vars: any = {}) => {
  try {
    const client = gqlClient();
    return await client.request(query, { ...vars });
  } catch (err) {
    console.error(err);
  }
};

export const gqlClient = () => new GraphQLClient(FUSE_SUBGRAPH_GQL_ENDPOINT);
