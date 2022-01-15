import { extendType, nonNull, objectType, stringArg } from "nexus";
export const Post = objectType({
  name: "Post",
  definition(t) {
    t.id("id");
    t.string("title");
    t.string("body");
    t.boolean("published");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_root, _args, ctx) {
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
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const data = {
          title: args.title,
          body: args.body,
        };
        return ctx.db.post.create({ data });
      },
    });
  },
});
