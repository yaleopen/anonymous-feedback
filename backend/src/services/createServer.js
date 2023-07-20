const { importSchema } = require('graphql-import');
const { ApolloServer, gql } = require('apollo-server-express');
const { DateTimeResolver, DateTimeTypeDefinition } = require('graphql-scalars');
const Query = require('../resolvers/Query');
const Mutation = require('../resolvers/Mutation.js');

// import schema.graphql
const typeDefsFile = importSchema(__dirname.concat('/../schema.graphql'));
const typeDefs = gql(typeDefsFile);

async function createServer() {
  return new ApolloServer({
    typeDefs: [typeDefs, DateTimeTypeDefinition],
    resolvers: {
      DateTime: DateTimeResolver,
      Query,
      Mutation,
    },
    resolverValidationOptions: { requireResolversForResolveType: false },
    context: (req) => ({
      ...req,
      canvas_api_token: process.env.API_CANVAS_TOKEN,
    }),
  });
}

module.exports = createServer;
