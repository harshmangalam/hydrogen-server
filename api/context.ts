import { db } from "./db";
import { PrismaClient, User } from "@prisma/client";
import { ApolloError, AuthenticationError } from "apollo-server";
import jwt, { TokenExpiredError } from "jsonwebtoken";
export interface Context {
  db: PrismaClient;
  user: User;
}
export const context = async ({ req }) => {
  try {
    const token = req.headers.authorization || "";
    if (token) {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);

      if (!jwtPayload) {
        throw new AuthenticationError("Invalid jwt token");
      }

      const user = await db.user.findUnique({
        where: {
          id: jwtPayload.userId,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new AuthenticationError("Invalid jwt token");
      }
      return {
        db,
        user,
      };
    } else {
      return {
        db,
        user: null,
      };
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError("Token  expired");
    }

    throw new ApolloError("Something went wrong");
  }
};
