import { inputObjectType, objectType } from "nexus";

// signup input type
export const SignupInputType = inputObjectType({
  name: "SignupInputType",
  definition(t) {
    t.nonNull.string("firstName");
    t.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

// signup response nodes type
export const SignupResponseNodesType = objectType({
  name: "SignupResponseNodesType",
  definition(t) {
    t.field("user", {
      type: "User",
    });
  },
});

// signup response type
export const SignupResponseType = objectType({
  name: "SignupResponseType",
  definition(t) {
    t.nonNull.string("message");
    t.nonNull.int("status");
    t.nonNull.field("nodes", {
      type: "SignupResponseNodesType",
    });
  },
});

// login input type

export const LoginInputType = inputObjectType({
  name: "LoginInputType",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

// login response nodes type

export const LoginResponseNodesType = objectType({
  name: "LoginResponseNodesType",
  definition(t) {
    t.nonNull.string("accessToken");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

// login response type
export const LoginResponseType = objectType({
  name: "LoginResponseType",
  definition(t) {
    t.nonNull.string("message");
    t.nonNull.int("status");
    t.nonNull.field("nodes", {
      type: "LoginResponseNodesType",
    });
  },
});

// me response nodes type

export const MeResponseNodesType = objectType({
  name: "MeResponseNodesType",
  definition(t) {
    t.nonNull.field("user", {
      type: "User",
    });
  },
});
// me response type

export const MeResponseType = objectType({
  name: "MeResponseType",
  definition(t) {
    t.nonNull.string("message"),
      t.nonNull.int("status"),
      t.nonNull.field("nodes", {
        type: "MeResponseNodesType",
      });
  },
});
