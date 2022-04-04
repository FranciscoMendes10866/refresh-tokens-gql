import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return await hash(password);
};

export const verifyPassword = async (hash, password) => {
  return await verify(hash, password);
};

export const signToken = (data, expiresIn) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
