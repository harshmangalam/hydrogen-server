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
export const SignupResponseEdgesType = objectType({
  name: "SignupResponseEdgesType",
  definition(t) {
    t.field("node", {
      type: "User",
    });
  },
});

// signup response type
export const SignupResponseType = objectType({
  name: "SignupResponseType",
  definition(t) {
    t.nonNull.field("edges", {
      type: "SignupResponseEdgesType",
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

export const LoginResponseEdgesType = objectType({
  name: "LoginResponseEdgesType",
  definition(t) {
    t.nonNull.string("accessToken");
    t.nonNull.field("node", {
      type: "User",
    });
  },
});

// login response type
export const LoginResponseType = objectType({
  name: "LoginResponseType",
  definition(t) {
    t.nonNull.field("edges", {
      type: "LoginResponseEdgesType",
    });
  },
});

// me response nodes type

export const MeResponseEdgesType = objectType({
  name: "MeResponseEdgesType",
  definition(t) {
    t.nonNull.field("node", {
      type: "User",
    });
  },
});
// me response type

export const MeResponseType = objectType({
  name: "MeResponseType",
  definition(t) {
    t.nonNull.field("edges", {
      type: "MeResponseEdgesType",
    });
  },
});
