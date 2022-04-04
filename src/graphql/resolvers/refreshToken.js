import { GraphQLYogaError } from "@graphql-yoga/node";

import { RefreshTokens } from "../../db/models/index.js";
import { verifyToken, signToken } from "../../utils.js";

export const refreshToken = async (parent, args, context) => {
  const token = args.refreshToken;

  if (!token) {
    throw new GraphQLYogaError("Refresh Token is required");
  }

  const foundRefreshToken = await RefreshTokens.findOne({
    where: {
      token,
    },
  });

  let decodedFoundRefreshToken;

  if (!foundRefreshToken) {
    try {
      const tokenData = verifyToken(token);
      decodedFoundRefreshToken = tokenData.user;

      await RefreshTokens.destroy({
        where: {
          userId: decodedFoundRefreshToken.id,
        },
      });
    } catch (err) {
      throw new GraphQLYogaError("Invalid token.");
    }
  }

  let decodedToken;

  try {
    await foundRefreshToken.destroy();
    const tokenData = verifyToken(token);
    decodedToken = tokenData.user;
  } catch (err) {
    throw new GraphQLYogaError(err);
  }

  const accessToken = signToken(
    { user: decodedToken },
    process.env.ACCESS_TOKEN_EXP
  );

  const refreshToken = signToken(
    { user: decodedToken },
    process.env.REFRESH_TOKEN_EXP
  );

  await RefreshTokens.create({
    token: refreshToken,
    userId: decodedToken.id,
  });

  return {
    session: {
      accessToken,
      refreshToken,
    },
  };
};
