import { inputObjectType, objectType } from "nexus";

// start signup input type
export const SignupInput = inputObjectType({
  name: "SignupInput",
  definition(t) {
    t.nonNull.string("firstName");
    t.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.field("gender", {
      type: "UserGender",
    });
  },
});

// end signup input type

// start login input type

export const LoginInput = inputObjectType({
  name: "LoginInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

// end login input type

// start login response type
export const LoginResponse = objectType({
  name: "LoginResponse",
  definition(t) {
    t.nonNull.string("accessToken");
  },
});

// end login response type
