import 'dotenv/config'
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import cors from "cors";
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan'

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    },
}
await startApolloServer(typeDefs, resolvers);
async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    
    if (NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    app.use(cors());
    app.use(helmet());

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}