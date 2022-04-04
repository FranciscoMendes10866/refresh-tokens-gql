import { GraphQLYogaError } from "@graphql-yoga/node";
import { rule } from "graphql-shield";

import { verifyToken } from "../utils.js";

export const isAuthorized = rule()(async (parent, args, ctx, info) => {
  const { authorization } = ctx.request.headers;

  if (!authorization) {
    return false;
  }

  const isValid = authorization.startsWith("Bearer ");

  if (!isValid) {
    return false;
  }

  const token = authorization.replace("Bearer", "").trim();

  let decodedToken;

  try {
    const tokenData = verifyToken(token);
    decodedToken = tokenData.user;
  } catch (err) {
    throw new GraphQLYogaError("Invalid token");
  }

  return !!decodedToken.id;
});
