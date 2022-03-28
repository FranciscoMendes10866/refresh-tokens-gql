import { register } from "./register.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { refreshToken } from "./refreshToken.js";
import { posts } from "./posts.js";

export const resolvers = {
  Query: {
    posts,
  },
  Mutation: {
    register,
    login,
    logout,
    refreshToken,
  },
};
