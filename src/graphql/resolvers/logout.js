import { GraphQLYogaError } from "@graphql-yoga/node";

import { RefreshTokens } from "../../db/models/index.js";

export const logout = async (parent, args, context) => {
  const token = args.refreshToken;

  if (!token) {
    throw new GraphQLYogaError("Refresh Token is required");
  }

  try {
    const foundRefreshToken = await RefreshTokens.findOne({
      where: {
        token,
      },
    });

    if (!foundRefreshToken) {
      throw new GraphQLYogaError("Refresh token not found");
    }

    await foundRefreshToken.destroy();

    return "Logged out successfully";
  } catch (err) {
    throw new GraphQLYogaError(err);
  }
};
