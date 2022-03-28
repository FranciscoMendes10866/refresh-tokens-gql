import { GraphQLYogaError } from '@graphql-yoga/node'

import { User } from "../../db/models/index.js";
import { hashPassword } from "../../utils.js";

export const register = async (parent, args, context) => {
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

    if (foundUser) {
      throw new GraphQLYogaError("Username already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    throw new GraphQLYogaError(err);
  }
};
