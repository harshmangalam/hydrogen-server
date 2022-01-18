import { Context } from "../../context";
import { extendType } from "nexus";
import { AuthenticationError } from "apollo-server";

export const AuthQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("me", {
      type: "MeResponseType",
      async resolve(_, __, ctx: Context) {
        try {
          if (!ctx.user) {
            throw new AuthenticationError("Unauthenticated");
          }

          const user = await ctx.db.user.findUnique({
            where: {
              id: ctx.user.id,
            },
          });

          return {
            message: "Fetch current user",
            status: 200,
            nodes: {
              user,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
