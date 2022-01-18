import { AuthenticationError } from "apollo-server";
import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "../../context";

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "CreatePostResponseType",
      args: {
        data: nonNull("CreatePostInputType"),
      },
      async resolve(_root, args, ctx: Context) {
        try {
          if (!ctx.user) {
            throw new AuthenticationError("unauthenticated");
          }
          const newPost = await ctx.db.post.create({
            data: {
              title: args.data.title,
              content: args.data.content,
              audience: args.data.audience,
              feeling: args.data.feeling,
              checkIn: args.data.checkIn,
              gif: args.data.gif,
              images: args.data.images,
              author: {
                connect: {
                  id: ctx.user.id,
                },
              },
              taggedFriends: {
                connect: args.data.taggedFriends.map((id) => ({
                  id,
                })),
              },
              specificAudienceFriends: {
                connect: args.data.specificAudienceFriends.map((id) => ({
                  id,
                })),
              },
            },
          });

          return {
            message: "Post created successfully",
            status: 201,
            nodes: {
              post: newPost,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
