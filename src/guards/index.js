import { shield } from "graphql-shield";

import { isAuthorized } from "./authorization.js";

export const permissions = shield(
  {
    Query: {
      posts: isAuthorized,
    },
    Mutation: {
      logout: isAuthorized,
    },
  },
  {
    allowExternalErrors: true,
  }
);
