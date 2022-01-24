import { UserInputError } from "apollo-server";
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
            include: {
              _count: {
                select: {
                  likes: true,
                },
              },
            },
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
    t.nonNull.field("post", {
      type: "FetchPostQuery",
      args: {
        id: nonNull(idArg()),
      },

      async resolve(_root, { id }, ctx: Context) {
        try {
          const post = await ctx.db.post.findUnique({
            where: {
              id,
            },
            include:{
              _count:{
                select:{
                  likes:true
                }
              }
            }
          });

          if (!post) {
            throw new UserInputError("Post does not exist");
          }

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
