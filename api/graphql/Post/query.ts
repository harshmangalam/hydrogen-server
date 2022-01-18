import { extendType } from "nexus";
import { Context } from "../../context";


export const PostQuery = extendType({
    type: "Query",
    definition(t) {
      t.nonNull.list.field("posts", {
        type: "Post",
        async resolve(_root, _args, ctx: Context) {
          try {
            const posts =  await ctx.db.post.findMany();
            return posts
          } catch (error) {
            throw error
          }
        },
      });
    },
  });
  