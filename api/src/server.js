import { App } from "@tinyhttp/app";
import { cors } from "@tinyhttp/cors";
import { createServer } from "@graphql-yoga/node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import dotenv from "dotenv";

import { databaseConnection } from "./db/index.js";
import { typeDefs, resolvers } from "./graphql/index.js";
import { permissions } from "./guards/index.js";

const startServer = async () => {
  dotenv.config();

  const app = new App();

  await databaseConnection.sync();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const graphQLServer = createServer({
    schema: applyMiddleware(schema, permissions),
    context: ({ request }) => ({ request }),
  });

  app.use(cors());
  app.use("/graphql", graphQLServer.requestListener);

  return app;
};

startServer()
  .then((app) => app.listen(4000))
  .catch((err) => console.error(err));
