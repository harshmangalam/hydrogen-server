import { enumType, extendType, objectType } from "nexus";
import { Context } from "../context";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("firstName");
    t.nonNull.string("email");
    t.string("lastName");
    t.nonNull.field("role", {
      type: UserRole,
    });
    t.string("coverImage");
    t.string("profileImage");
    t.nonNull.boolean("isActive");
    t.nonNull.boolean("isEmailVerified");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      resolve(_root, _args, ctx: Context) {
        return ctx.db.user.findMany();
      },
    });
  },
});

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "USER"],
  description: "Resource access rules",
});
