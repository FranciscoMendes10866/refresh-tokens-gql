import { GraphQLYogaError } from "@graphql-yoga/node";

import { User, RefreshTokens } from "../../db/models/index.js";
import { verifyPassword, signToken } from "../../utils.js";

export const login = async (parent, args, context) => {
  const { username, password } = args.input;

  if (!username || !password) {
    throw new GraphQLYogaError("Username and password are required");
  }

  try {
    const foundUser = await User.findOne({
      where: {
        username,
      },
    });

    if (!foundUser) {
      throw new GraphQLYogaError("User not found");
    }

    const isPasswordValid = await verifyPassword(foundUser.password, password);

    if (!isPasswordValid) {
      throw new GraphQLYogaError("Invalid password");
    }

    const accessToken = signToken(
      { user: foundUser },
      process.env.ACCESS_TOKEN_EXP
    );
    const refreshToken = signToken(
      { user: foundUser },
      process.env.REFRESH_TOKEN_EXP
    );

    await RefreshTokens.create({
      token: refreshToken,
      userId: foundUser.id,
    });

    return {
      session: {
        accessToken,
        refreshToken,
      },
      user: foundUser,
    };
  } catch (err) {
    throw new GraphQLYogaError(err);
  }
};
