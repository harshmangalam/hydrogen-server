import { AuthenticationError } from "apollo-server";
import { extendType, nonNull } from "nexus";
import { Context } from "../../context";

export const CreatePost = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        data: nonNull("CreatePostInputType"),
      },
      async resolve(_root, args, ctx: Context) {
        try {
          // check for current user
          if (!ctx.user) {
            throw new AuthenticationError("Unauthenticated", {
              error: "Login to create new post",
            });
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

          return newPost;
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
