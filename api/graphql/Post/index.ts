import { enumType, extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
export const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.string("content");
    t.nonNull.field("audience", {
      type: PostAudienceEnum,
    });
    t.nonNull.list.string("media");
    t.string("feeling");
    t.string("checkIn");
    t.string("gif");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_root, _args, ctx: Context) {
        return ctx.db.post.findMany();
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        audience: nonNull(PostAudienceEnum),
        feeling: stringArg(),
        checkIn: stringArg(),
        gif: stringArg(),
      },
      resolve(_root, args, ctx: Context) {
        return ctx.db.post.create({
          data: {
            title: args.title,
            content: args.content,
            audience: args.audience,
            feeling: args.feeling,
            checkIn: args.checkIn,
            gif: args.gif,
            author: {
              connect: {
                id: ctx.currentUser.id,
              },
            },
          },
        });
      },
    });
  },
});

export const PostAudienceEnum = enumType({
  name: "PostAudienceEnum",
  members: ["PUBLIC", "FRIENDS", "ONLY_ME", "SPECIFIC"],
  description: "Who can see your post",
});
