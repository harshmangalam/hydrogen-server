import { UserInputError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { Context } from "../../context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "SignupResponseType",
      args: {
        data: nonNull("SignupInputType"),
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
            nodes: {
              user: newUser,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });

    t.nonNull.field("login", {
      type: "LoginResponseType",
      args: {
        data: nonNull("LoginInputType"),
      },

      async resolve(_root, args, ctx: Context) {
        try {
          const user = await ctx.db.user.findUnique({
            where: {
              email: args.data.email,
            },
          });

          if (!user) {
            throw new UserInputError("Email address is incorrect");
          }

          const matchPassword = await bcrypt.compare(
            args.data.password,
            user.password
          );

          if (!matchPassword) {
            throw new UserInputError("Password is incorrect");
          }

          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            {
                expiresIn:"2days"
            }
          );

          return {
            message: `Login successfully as ${user.firstName}`,
            status: 201,
            nodes: {
              user,
              accessToken,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
