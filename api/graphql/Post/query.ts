import { extendType, idArg, intArg, nonNull } from "nexus";
import { Context } from "../../context";

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("posts", {
      type: "FetchPostsQuery",
      args: {
        take: intArg(),
        cursor: idArg(),
      },
      async resolve(_root, { cursor, take = 10 }, ctx: Context) {
        try {
          const posts = await ctx.db.post.findMany({
            take: take + 1,
            cursor: cursor
              ? {
                  id: cursor,
                }
              : undefined,
          });

          const hasNextPage = posts.length > take;
          const nodes = hasNextPage ? posts.slice(0, -1) : posts;

          const edges = nodes.map((node) => ({
            node,
            cursor: node.id,
          }));

          return {
            edges,
            pageInfo: {
              endCursor: nodes.length ? nodes[nodes.length - 1].id : null,
              hasNextPage,
            },
          };
        } catch (error) {
          throw error;
        }
      },
    });
  },
});
