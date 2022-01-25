import { AuthenticationError, UserInputError } from "apollo-server";
import { extendType, idArg, nonNull, stringArg } from "nexus";
import { Context } from "../../context";

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "CreatePostMutation",
      args: {
        data: nonNull("CreatePostInputType"),
      },
      async resolve(_root, args, ctx: Context) {
        try {
          // check for current user
          if (!ctx.user) {
            throw new AuthenticationError("unauthenticated");
          }
          // create new post
          const newPost = await ctx.db.post.create({
            data: {
              title: args.data.title,
              content: args.data.content,
              audience: args.data.audience,
              feeling: args.data.feeling,
              checkIn: args.data.checkIn,
              gif: args.data.gif,
              images: args.data.images?.length ? args.data.images : undefined,
              author: {
                connect: {
                  id: ctx.user.id,
                },
              },
              taggedFriends: args.data.taggedFriends?.length
                ? {
                    connect: args.data.taggedFriends.map((id) => ({
                      id,
                    })),
                  }
                : undefined,
              specificAudienceFriends: args.data.specificAudienceFriends?.length
                ? {
                    connect: args.data.specificAudienceFriends.map((id) => ({
                      id,
                    })),
                  }
                : undefined,
            },
          });

          return {
            edges: {
              node: newPost,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });

    t.nonNull.field("togglePostLike", {
      type: "PostLikeMutation",
      args: {
        id: nonNull(idArg()),
      },
      async resolve(_root, { id }, ctx: Context) {
        try {
          // check for current user
          if (!ctx.user) {
            throw new AuthenticationError("unauthenticated");
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
            throw new UserInputError("Post does not exist");
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

          return {
            edge: {
              node: post,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
