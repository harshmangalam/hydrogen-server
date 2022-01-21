import { enumType, extendType, objectType } from "nexus";
import { Context } from "../../context";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("firstName");
    t.nonNull.string("email");
    t.string("lastName");
    t.field("gender", {
      type: "UserGender",
    });
    t.nonNull.field("role", {
      type: UserRole,
    });
    t.string("coverImage");
    t.string("profileImage");
    t.nonNull.boolean("isActive");
    t.nonNull.boolean("isEmailVerified");
    t.nonNull.list.nonNull.field("posts", {
      type: "Post",
      async resolve(root, _args, ctx: Context) {
        const posts = await ctx.db.post.findMany({
          where: {
            authorId: root.id,
          },
        });

        return posts;
      },
    });
    t.nonNull.list.nonNull.field("specificAudienceInPosts", {
      type: "User",
      async resolve(root, _args, ctx: Context) {
        const posts = await ctx.db.post.findMany({
          where: {
            authorId: root.id,
          },
        });

        return posts;
      },
    });
    t.nonNull.list.nonNull.field("taggedInPosts", {
      type: "Post",
      async resolve(root, _args, ctx: Context) {
        const posts = await ctx.db.post.findMany({
          where: {
            authorId: root.id,
          },
        });

        return posts;
      },
    });
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      async resolve(_, __, ctx: Context) {
        const users = await ctx.db.user.findMany();
        return users;
      },
    });
  },
});

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "USER"],
  description: "Resource access rules",
});

export const UserGender = enumType({
  name: "UserGender",
  members: ["MALE", "FEMALE", "OTHER"],
  description: "user gender",
});
