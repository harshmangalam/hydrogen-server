import { extendType, inputObjectType, nonNull, objectType } from "nexus";
import { Context } from "../context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";

export const SignupInputType = inputObjectType({
  name: "SignupInputType",
  definition(t) {
    t.nonNull.string("firstName");
    t.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});
export const SignupResponse = objectType({
  name: "SignupResponse",
  definition(t) {
    t.nonNull.string("message");
    t.nonNull.int("status");
    t.field("node", {
      type: "User",
    });
  },
});
export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "SignupResponse",
      args: {
        data: nonNull(SignupInputType),
      },

      async resolve(_root, args, ctx: Context) {
        try {
          const user = await ctx.db.user.findUnique({
            where: {
              email: args.data.email,
            },
            select: {
              email: true,
            },
          });

          if (user) {
            throw new UserInputError("Email already exists");
          }

          const hashPassword = await bcrypt.hash(args.data.password, 12);
          const newUser = await ctx.db.user.create({
            data: {
              email: args.data.email,
              firstName: args.data.firstName,
              lastName: args.data.lastName,
              password: hashPassword,
            },
          });

          return {
            message: `Account created for ${newUser.firstName}`,
            status: 201,
            node: newUser,
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
