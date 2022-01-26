import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { Context } from "../../context";
import bcrypt from "bcrypt";

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "Boolean",
      args: {
        data: nonNull("SignupInput"),
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
            throw new UserInputError("Already Exists", {
              email: `User with email ${args.data.email} already exists`,
            });
          }

          const hashPassword = await bcrypt.hash(args.data.password, 12);
          await ctx.db.user.create({
            data: {
              email: args.data.email,
              firstName: args.data.firstName,
              lastName: args.data.lastName,
              password: hashPassword,
              gender: args.data.gender,
            },
          });

          return true;
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
