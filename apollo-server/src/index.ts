import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';

import { readFileSync } from 'fs';
import resolvers from './resolvers/main.js';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

const { json } = bodyParser;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schemaFiles = loadFilesSync('./scheme/**/*.graphql');
const typeDefs = mergeTypeDefs(schemaFiles);
// Create a GraphQL schema object.
const app = express();
const httpServer = http.createServer(app);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
await server.start();
app.use(
    '/graphql',
    cors<cors.CorsRequest>(
        {
            origin: '*',
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: ['Content-Type', 'Authorization'],
        },
    ),
    json(),
    expressMiddleware(server),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4001 }, resolve));
console.log(`🚀 Server ready at http://localhost:4001/graphql`);
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// const { url } = await startStandaloneServer(server, {
//     listen: { port: 4001 },
// });

// console.log(`🚀  Server ready at: ${url}`);