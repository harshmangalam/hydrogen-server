import { AuthenticationError, UserInputError } from "apollo-server";
import { extendType, idArg, nonNull } from "nexus";
import { Context } from "../../context";

export const TogglePostLike = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("togglePostLike", {
      type: "Post",
      args: {
        id: nonNull(idArg()),
      },
      async resolve(_root, { id }, ctx: Context) {
        try {
          // check for current user
          if (!ctx.user) {
            throw new AuthenticationError("Unauthenticated", {
              error: "Login to like the post",
            });
          }
          // find post by provided id
          const findPost = await ctx.db.post.findUnique({
            where: {
              id,
            },
            select: {
              id: true,
              likes: {
                where: {
                  id: ctx.user.id,
                },
                select: {
                  id: true,
                },
              },
            },
          });

          // throw error when post not found
          if (!findPost) {
            throw new UserInputError("Not Found", {
              error: "Post does not found",
            });
          }
          // check if user have already like on post

          if (findPost.likes.length) {
            // remove like from post
            await ctx.db.post.update({
              where: {
                id,
              },
              data: {
                likes: {
                  disconnect: {
                    id: ctx.user.id,
                  },
                },
              },
            });
          } else {
            // like post
            await ctx.db.post.update({
              where: {
                id,
              },
              data: {
                likes: {
                  connect: {
                    id: ctx.user.id,
                  },
                },
              },
            });
          }

          // fetch updated likes post

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

          return post;
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
