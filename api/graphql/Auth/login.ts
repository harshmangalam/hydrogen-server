import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "LoginResponse",
      args: {
        data: nonNull("LoginInput"),
      },

      async resolve(_root, args, ctx: Context) {
        try {
          const user = await ctx.db.user.findUnique({
            where: {
              email: args.data.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
            },
          });

          if (!user) {
            throw new UserInputError("Incorrect credentials", {
              email: "Incorrect email address",
            });
          }

          const matchPassword = await bcrypt.compare(
            args.data.password,
            user.password
          );

          if (!matchPassword) {
            throw new UserInputError("Incorrect credentials", {
              password: "Incorrect password ",
            });
          }

          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "2days",
            }
          );

          return {
            accessToken,
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
