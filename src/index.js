import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import cors from "cors";
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan'
import typeDefs from './schema.js';
import resolvers from './resolvers.js';

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const isDevelopment = NODE_ENV === 'development'
    
    if (isDevelopment) {
        app.use(morgan('dev'))
    }

    app.use(cors());
    app.use(
        helmet({
          crossOriginEmbedderPolicy: !isDevelopment,
          contentSecurityPolicy: !isDevelopment,
        }),
      )

    app.get('/', (req, res) => {
        res.status(200).json({
            version: "1.0.0",
            message: 'Apollo Express Server'
        });
    });

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

await startApolloServer(typeDefs, resolvers);