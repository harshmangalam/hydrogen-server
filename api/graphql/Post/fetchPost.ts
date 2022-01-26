import { UserInputError } from "apollo-server";
import { extendType, idArg, nonNull } from "nexus";
import { Context } from "../../context";

export const FetchPost = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("post", {
      type: "Post",
      args: {
        id: nonNull(idArg()),
      },

      async resolve(_root, { id }, ctx: Context) {
        try {
          const post = await ctx.db.post.findUnique({
            where: {
              id,
            },
            include: {
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          });

          if (!post) {
            throw new UserInputError("Not Found", {
              error: "Post does not found",
            });
          }

          return post;
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
